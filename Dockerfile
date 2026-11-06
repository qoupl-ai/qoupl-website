# syntax=docker/dockerfile:1
#
# Multi-stage build for the Next.js standalone output, following
# https://github.com/vercel/next.js/tree/canary/examples/with-docker
# Node 24 is the current LTS; Next.js 16 requires Node >= 20.9.
ARG NODE_VERSION=24.13.0

FROM node:${NODE_VERSION}-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* values are inlined into the client bundle at build time, so the
# build needs the project URL and the anon key. Both are public by design (every
# browser receives them). They arrive as BuildKit secrets, not build arguments,
# so they never appear in image history. The service-role key is NOT used here.
RUN --mount=type=secret,id=supabase_url \
    --mount=type=secret,id=supabase_anon_key \
    NEXT_PUBLIC_SUPABASE_URL="$(cat /run/secrets/supabase_url)" \
    NEXT_PUBLIC_SUPABASE_ANON_KEY="$(cat /run/secrets/supabase_anon_key)" \
    npm run build

FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
# Writable cache directory for the non-root user.
RUN mkdir -p .next/cache && chown node:node .next .next/cache
USER node
EXPOSE 8080
CMD ["node", "server.js"]
