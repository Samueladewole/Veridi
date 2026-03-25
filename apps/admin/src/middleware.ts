import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "veridi-admin-secret"
);

const PUBLIC_PATHS = ["/login", "/api/auth"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("admin_access_token")?.value;

  // No access token — try refresh, then redirect
  if (!accessToken) {
    return redirectToLogin(request);
  }

  // Verify JWT
  try {
    await jwtVerify(accessToken, JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Token expired — attempt refresh via API route
    const refreshToken = request.cookies.get("admin_refresh_token")?.value;
    if (!refreshToken) {
      return redirectToLogin(request);
    }

    // Try to refresh by calling our own refresh route
    try {
      const refreshUrl = new URL("/api/auth/refresh", request.url);
      const refreshRes = await fetch(refreshUrl.toString(), {
        method: "POST",
        headers: {
          Cookie: `admin_refresh_token=${refreshToken}`,
        },
      });

      if (refreshRes.ok) {
        // Forward the set-cookie headers from the refresh response
        const response = NextResponse.next();
        const setCookieHeaders = refreshRes.headers.getSetCookie();
        for (const cookie of setCookieHeaders) {
          response.headers.append("Set-Cookie", cookie);
        }
        return response;
      }
    } catch {
      // Refresh failed
    }

    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|.*\\.png$|.*\\.svg$).*)",
  ],
};
