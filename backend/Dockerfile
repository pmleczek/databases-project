# Build frontend
FROM node:25-alpine3.23 AS build-frontend
WORKDIR /frontend

COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN npm install -g pnpm@11.5.0
RUN pnpm install --frozen-lockfile

COPY frontend .

RUN pnpm build

# Deploy frontend + backend
FROM oven/bun:alpine AS deployment
WORKDIR /app

COPY backend/package.json backend/bun.lock* ./
RUN bun install --frozen-lockfile 2>/dev/null || bun install

COPY backend/prisma/ ./prisma/
COPY backend/prisma.config.ts ./
RUN bunx prisma generate

COPY backend/src/ ./src/

COPY --from=build-frontend /frontend/dist ./public

EXPOSE 3000

CMD sh -c "bunx prisma db push && bunx prisma db seed && bun src/index.ts"
