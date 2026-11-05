FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.3.4 --activate

COPY ./frontend/package.json ./frontend/pnpm-lock.yaml ./frontend/pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY ./frontend/index.html ./frontend/tsconfig.json ./frontend/vite.config.ts ./
COPY ./frontend/src ./src

ARG VITE_API_URL=http://localhost:3002/api
ENV VITE_API_URL=${VITE_API_URL}

RUN pnpm build

FROM node:24-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable && corepack prepare pnpm@12.3.4 --activate

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "5173"]
