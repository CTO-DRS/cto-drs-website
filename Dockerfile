# ═══════════════════════════════════════════════════════════
# CTO-DRS Website — Production Dockerfile (Spaceship Hyperlift)
# Multi-stage build: bun install → next build (standalone) →
# node:22-slim runtime with Prisma SQLite auto-init
# ═══════════════════════════════════════════════════════════

# ── Stage 1: dependencies ──
FROM oven/bun:1.2 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ── Stage 2: build ──
FROM oven/bun:1.2 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# قاعدة بيانات مؤقتة وقت البناء (تُستبدل بمجلد db في التشغيل)
ENV DATABASE_URL=file:/app/db/custom.db
RUN mkdir -p db && touch db/custom.db \
  && bunx prisma generate \
  && bunx prisma db push --skip-generate --accept-data-loss \
  && bun run build

# ── Stage 3: runtime ──
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    DATABASE_URL=file:/app/db/custom.db

# خادم standalone + الملفات الثابتة
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Prisma CLI + Client + Engines (glibc متوافق مع slim)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# تهيئة قاعدة البيانات + إنشاء حساب المدير عند أول تشغيل
COPY --from=builder /app/scripts/init-db.js ./scripts/init-db.js

RUN mkdir -p /app/db

EXPOSE 3000

CMD ["sh", "-c", "node scripts/init-db.js && node server.js"]
