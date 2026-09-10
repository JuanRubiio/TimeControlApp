FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-bookworm-slim AS build
WORKDIR /app
ARG BUILD_ENVIRONMENT_ID=00000000-0000-4000-8000-000000000001
# Sólo habilita la evaluación estática de rutas durante `next build`; runtime exige su propia configuración.
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build ENVIRONMENT_ID=${BUILD_ENVIRONMENT_ID}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/migrations ./migrations
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/src ./src
COPY --from=build /app/tests ./tests
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/vitest.config.ts ./vitest.config.ts
COPY --from=build /app/package.json ./package.json
CMD ["sh", "-c", "npm run db:migrate && npm run start"]
