// Cloudflare Worker: deployed to api.veridi.africa
// Handles: API key validation, rate limiting, routing to Railway

const RAILWAY_API_URL = 'https://veridi-api.up.railway.app';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Health check bypasses auth
    if (url.pathname === '/health') {
      return fetch(`${RAILWAY_API_URL}/health`);
    }

    // Extract and validate API key
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing or invalid Authorization header',
        code: 'AUTH_MISSING'
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const apiKey = authHeader.replace('Bearer ', '');

    // Look up key in KV store (synced from PostgreSQL)
    const keyData = await env.VERIDI_KEYS.get(apiKey, 'json');
    if (!keyData || keyData.revoked) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid or revoked API key',
        code: 'AUTH_INVALID'
      }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // IP allowlist check
    const clientIp = request.headers.get('CF-Connecting-IP');
    if (keyData.ipAllowlist?.length > 0 && !keyData.ipAllowlist.includes(clientIp)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'IP not in allowlist',
        code: 'AUTH_IP_BLOCKED'
      }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // Rate limiting via KV counter
    const rateLimitKey = `ratelimit:${apiKey}:${Math.floor(Date.now() / 60000)}`;
    const currentCount = parseInt(await env.VERIDI_RATE.get(rateLimitKey) || '0');
    const limit = keyData.tier === 'FREE' ? 100 : 1000;

    if (currentCount >= limit) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        retry_after: 60
      }), { status: 429, headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': '0'
      }});
    }

    // Increment counter (async, don't block request)
    ctx.waitUntil(
      env.VERIDI_RATE.put(rateLimitKey, (currentCount + 1).toString(), { expirationTtl: 120 })
    );

    // Forward to Railway with enriched headers
    const enrichedRequest = new Request(`${RAILWAY_API_URL}${url.pathname}${url.search}`, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers),
        'X-Veridi-Client-Id': keyData.clientId,
        'X-Veridi-Key-Id': keyData.keyId,
        'X-Veridi-Tier': keyData.tier,
        'X-Forwarded-For': clientIp,
        'X-Request-ID': crypto.randomUUID(),
      },
      body: request.body
    });

    return fetch(enrichedRequest);
  }
};
