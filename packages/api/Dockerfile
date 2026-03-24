FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY packages/api/package.json ./packages/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json ./packages/shared/
COPY packages/worker/package.json ./packages/worker/
COPY apps/web/package.json ./apps/web/
COPY apps/dashboard/package.json ./apps/dashboard/
COPY apps/admin/package.json ./apps/admin/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app ./
COPY . .
RUN pnpm --filter @veridi/database generate
RUN pnpm --filter @veridi/shared build
RUN pnpm --filter @veridi/api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/packages/api/dist ./dist
COPY --from=builder /app/packages/api/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database ./packages/database
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
EXPOSE 3000
CMD ["node", "dist/main.js"]
