FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/unboxed-backend/package.json apps/unboxed-backend/
RUN npm ci --workspace=unboxed-backend

COPY apps/unboxed-backend/ apps/unboxed-backend/
RUN npm run build --workspace=unboxed-backend

FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/unboxed-backend/package.json apps/unboxed-backend/
RUN npm ci --workspace=unboxed-backend --omit=dev

COPY --from=build /app/apps/unboxed-backend/dist apps/unboxed-backend/dist

CMD ["node", "apps/unboxed-backend/dist/src/main.js"]
