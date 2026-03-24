# Veridi — Identity Verification Platform

## What This Is
Africa's B2B identity verification API infrastructure.
Clients call Veridi's API to verify NIN, BVN, liveness, background checks.
Stack: NestJS API · Next.js dashboards · Railway · Cloudflare · PostgreSQL.

## Monorepo Map
- packages/api      → NestJS 10 REST API (core product — the backend)
- packages/worker   → NestJS + BullMQ async job processor
- packages/ml       → Python FastAPI face match + liveness service
- packages/database → Prisma 5 schema, migrations, seed
- packages/shared   → TypeScript types, API client, enums — imported by all
- apps/web          → Next.js 14 developer portal at veridi.io
- apps/dashboard    → Next.js 14 client dashboard at dashboard.veridi.africa
- apps/admin        → Next.js 14 admin control at admin.veridi.africa

## Key Commands
- Dev all:           pnpm dev
- Dev API only:      pnpm --filter @veridi/api dev
- Dev dashboard:     pnpm --filter @veridi/dashboard dev
- Dev admin:         pnpm --filter @veridi/admin dev
- Build all:         pnpm build
- DB migrate dev:    pnpm --filter @veridi/database migrate:dev
- DB migrate prod:   pnpm --filter @veridi/database migrate:deploy
- DB generate:       pnpm --filter @veridi/database generate
- DB seed:           pnpm --filter @veridi/database seed
- Type check:        pnpm typecheck
- Lint:              pnpm lint
- Tests:             pnpm test

## Code Standards — ALWAYS FOLLOW
- TypeScript strict mode everywhere. Zero `any`. No exceptions.
- ES modules (import/export) only. Never require().
- NestJS: decorators, DI, class-validator DTOs, always.
- React: functional components + hooks only. No class components.
- async/await only. No raw Promise chains.
- Zod for all runtime validation at API entry points.
- Prisma for all DB access. No raw SQL except in migrations.
- Never store raw PII (NIN, BVN). Hash with Argon2id on receipt.
- Every route must have DTO validation. No unvalidated inputs.
- All errors must be caught and handled. No unhandled rejections.

## Architecture Rules
- Cloudflare Worker validates API keys BEFORE requests reach Railway.
- NestJS API is stateless — all state in PostgreSQL or Redis.
- Slow verifications (NIMC, background) use BullMQ async queue.
- Consent token required on every verification endpoint — hard requirement.
- Biometric images never persisted — process and discard immediately.
- Audit log every admin action to AdminLog table — append-only.

## Environment Variables
See .env.example at root. Railway injects DATABASE_URL automatically.
Never commit secrets. Use Railway dashboard for production env vars.
Never log raw NIN, BVN, or API keys — only hashed references.

## Testing
- API: Jest + Supertest integration tests
- Web/Dashboard/Admin: Vitest + React Testing Library
- Every new endpoint needs a test. Run pnpm test before committing.

## Design System
- Fonts: Syne (headings) + JetBrains Mono (code/data) + Instrument Serif (display)
- Colors: --teal #00D4B4 (client surfaces), --amber #F59E0B (admin surface)
- Client dashboard accent: teal. Admin dashboard accent: amber. Never swap.
- Reference the HTML design files in docs/ for exact component appearance.
- shadcn/ui for component primitives on all Next.js surfaces.

## Deploy on Railway + Cloudflare
- All Railway service URLs are private — never exposed directly to internet.
- Cloudflare Workers proxy ALL public traffic to Railway.
- Admin dashboard is behind Cloudflare Zero Trust — not public.
- See railway.toml for service configuration.
