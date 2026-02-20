FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/chessbro-backend/package.json apps/chessbro-backend/
RUN pnpm install --frozen-lockfile --filter chessbro-backend

COPY apps/chessbro-backend/ apps/chessbro-backend/
RUN pnpm --filter chessbro-backend run build

FROM node:22-alpine

WORKDIR /app

RUN corepack enable pnpm

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/chessbro-backend/package.json apps/chessbro-backend/
RUN pnpm install --frozen-lockfile --filter chessbro-backend --prod

COPY --from=build /app/apps/chessbro-backend/dist apps/chessbro-backend/dist
COPY apps/chessbro-backend/drizzle apps/chessbro-backend/drizzle

CMD ["node", "apps/chessbro-backend/dist/src/main.js"]
