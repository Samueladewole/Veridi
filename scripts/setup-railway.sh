#!/bin/bash
set -e
echo "Setting up Veridi on Railway..."

# Requires Railway CLI installed: npm install -g @railway/cli
railway login
railway init --name veridi

# Provision plugins
echo "Provisioning PostgreSQL..."
railway add --plugin postgresql

echo "Provisioning Redis..."
railway add --plugin redis

# Set required secrets
echo "Setting JWT secrets..."
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway variables set JWT_REFRESH_SECRET=$(openssl rand -hex 32)

echo ""
echo "Railway setup complete!"
echo ""
echo "Next steps:"
echo "1. Set remaining env vars in Railway dashboard:"
echo "   PAYSTACK_SECRET_KEY, CLOUDFLARE_R2_*, TERMII_API_KEY"
echo ""
echo "2. Create Railway services in dashboard:"
echo "   veridi-api    -> packages/api (Dockerfile)"
echo "   veridi-worker -> packages/worker (Dockerfile)"
echo "   veridi-web    -> apps/web"
echo "   veridi-dashboard -> apps/dashboard"
echo "   veridi-admin  -> apps/admin"
echo ""
echo "3. Deploy: railway up"
echo ""
echo "4. Run first migration:"
echo "   railway run --service veridi-api npx prisma migrate deploy"
echo ""
echo "5. Verify: curl https://veridi-api.up.railway.app/health"
