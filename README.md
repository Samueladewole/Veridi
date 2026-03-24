# Veridi

**The Truth Layer for Africa's Digital Economy**

Veridi is a B2B identity verification API infrastructure platform built for Africa. Businesses integrate Veridi's API to verify NIN, BVN, driver's licences, passports, perform face liveness checks, background screening, and compute identity trust scores.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  CLOUDFLARE EDGE                                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Worker (api.veridi.africa)                         │    │
│  │  API key validation · Rate limiting · IP allowlist  │    │
│  └──────────────────────┬──────────────────────────────┘    │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│  RAILWAY (PRIVATE)      │                                   │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │  NestJS API (packages/api)                          │    │
│  │  Verification · Face · Background · Score · Admin   │    │
│  └──────────────┬───────────────────┬──────────────────┘    │
│                 │                   │                        │
│  ┌──────────────▼───┐  ┌───────────▼────────────────┐      │
│  │  PostgreSQL      │  │  Redis (cache + BullMQ)    │      │
│  └──────────────────┘  └────────────────────────────┘      │
│                                                             │
│  ┌──────────────────┐  ┌────────────────────────────┐      │
│  │  Worker (BullMQ) │  │  ML Service (FastAPI)      │      │
│  │  Background jobs │  │  Face match + Liveness     │      │
│  └──────────────────┘  └────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  NEXT.JS SURFACES                                           │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────────┐       │
│  │ veridi.io   │ │ dashboard.   │ │ admin.veridi.  │       │
│  │ Dev Portal  │ │ veridi.africa│ │ africa         │       │
│  └─────────────┘ └──────────────┘ └────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Monorepo Structure

```
veridi/
├── apps/
│   ├── web/              # Next.js 14 — Developer portal (veridi.io)
│   ├── dashboard/        # Next.js 14 — Client dashboard (dashboard.veridi.africa)
│   └── admin/            # Next.js 14 — Admin control (admin.veridi.africa)
├── packages/
│   ├── api/              # NestJS 10 — Core verification API
│   ├── worker/           # NestJS + BullMQ — Async job processor
│   ├── ml/               # Python FastAPI — Face match + liveness (scaffold)
│   ├── database/         # Prisma schema + migrations + seed
│   └── shared/           # Shared TypeScript types, API client, constants
├── cloudflare/           # Cloudflare Worker — Edge API gateway
├── docs/                 # Design HTML files + PRD
├── scripts/              # Deployment scripts
├── CLAUDE.md
├── turbo.json
├── pnpm-workspace.yaml
└── railway.toml
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API | NestJS 10 + TypeScript strict |
| Database | PostgreSQL 15 + Prisma 5 |
| Cache/Queue | Redis 7 + BullMQ |
| Frontend | Next.js 14 (App Router) + Tailwind + shadcn/ui |
| ML | Python FastAPI (face match + liveness) |
| Edge | Cloudflare Workers (API gateway) |
| Deploy | Railway (services) + Cloudflare (CDN/edge) |
| Payments | Paystack |

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15
- Redis 7

### Setup

```bash
# Clone
git clone https://github.com/Samueladewole/Veridi.git
cd veridi

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and secrets

# Generate Prisma client
pnpm --filter @veridi/database generate

# Run migrations
pnpm --filter @veridi/database migrate:dev

# Seed database
pnpm --filter @veridi/database seed

# Start all services
pnpm dev
```

### Individual Services

```bash
pnpm --filter @veridi/api dev        # API on :3000
pnpm --filter @veridi/web dev        # Dev portal on :3001
pnpm --filter @veridi/dashboard dev  # Dashboard on :3002
pnpm --filter @veridi/admin dev      # Admin on :3003
```

## API Endpoints

### Verification (`/v1/verify`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/verify/consent` | Issue consent token |
| POST | `/v1/verify/nin` | Verify National ID Number |
| POST | `/v1/verify/bvn` | Verify Bank Verification Number |
| POST | `/v1/verify/drivers-licence` | Verify driver's licence |
| POST | `/v1/verify/passport` | Verify passport |
| GET | `/v1/verify/:reference_id` | Get verification result |

### Face (`/v1/face`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/face/liveness` | Liveness detection |
| POST | `/v1/face/match` | Face matching |

### Background (`/v1/background`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/background/request` | Request background check |
| GET | `/v1/background/:request_id` | Get check status |

### Score (`/v1/score`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/score/:subject_token` | Get identity trust score |

Full API documentation available at `/api/docs` (Swagger) when running locally.

## Environment Variables

See [`.env.example`](.env.example) for all required variables with descriptions.

Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` / `JWT_REFRESH_SECRET` — Auth tokens
- `REDIS_URL` — Redis connection
- `NIMC_API_KEY` — Leave blank for mock responses in development
- `PAYSTACK_SECRET_KEY` — Payment processing

## Deployment

### Railway + Cloudflare

```bash
# Automated Railway setup
bash scripts/setup-railway.sh

# Deploy all services
railway up

# Run production migration
railway run --service veridi-api npx prisma migrate deploy

# Deploy Cloudflare Worker
cd cloudflare && npx wrangler deploy

# Verify
curl https://api.veridi.africa/health
```

See [`railway.toml`](railway.toml) for service configuration.

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Teal | `#00D4B4` | Client-facing surfaces |
| Amber | `#F59E0B` | Admin surfaces |
| Void | `#05080F` | Page backgrounds |
| Panel | `#0C1220` | Card/panel backgrounds |
| Syne | Google Fonts | Headings |
| JetBrains Mono | Google Fonts | Code + data |

Design source files in [`docs/`](docs/).

## Testing

```bash
pnpm test           # All tests
pnpm test:e2e       # Integration tests
pnpm typecheck      # Type checking
pnpm lint           # Linting
```

## Security

- All PII (NIN, BVN) hashed with Argon2id on receipt — never stored raw
- Consent token required for every verification request
- API keys validated at Cloudflare edge before reaching Railway
- Biometric images processed and discarded — never persisted
- Admin dashboard behind Cloudflare Zero Trust
- All admin actions logged to immutable audit trail

## License

Proprietary. All rights reserved.
