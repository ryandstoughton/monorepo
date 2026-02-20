FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/chessbro-backend/package.json apps/chessbro-backend/
RUN npm ci --workspace=chessbro-backend

COPY apps/chessbro-backend/ apps/chessbro-backend/
RUN npm run build --workspace=chessbro-backend

FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/chessbro-backend/package.json apps/chessbro-backend/
RUN npm ci --workspace=chessbro-backend --omit=dev

COPY --from=build /app/apps/chessbro-backend/dist apps/chessbro-backend/dist
COPY apps/chessbro-backend/drizzle apps/chessbro-backend/drizzle

CMD ["node", "apps/chessbro-backend/dist/src/main.js"]
