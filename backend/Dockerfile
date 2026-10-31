FROM node:24-alpine AS builder
WORKDIR /app

# Habilitar pnpm
RUN corepack enable && corepack prepare pnpm@12.3.4 --activate

# Copiar archivos de dependencias
COPY ./backend/package.json ./backend/pnpm-lock.yaml ./backend/pnpm-workspace.yaml ./
# COPY ./package.json ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente y configuración de TypeScript
COPY ./backend/tsconfig.json ./
COPY ./backend/src ./src

# Compilar indicando el filtro del workspace
RUN pnpm build

# Etapa de producción
FROM node:24-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Habilitar pnpm
RUN corepack enable && corepack prepare pnpm@12.3.4 --activate

# Copiar archivos de dependencias
COPY ./backend/package.json ./backend/pnpm-lock.yaml ./backend/pnpm-workspace.yaml ./
# COPY ./package.json ./

# Instalar únicamente dependencias de producción
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Copiar código compilado
COPY --from=builder /app/dist ./dist

# Puerto utilizado por la aplicación
EXPOSE 3000

# Ejecutar aplicación
CMD ["pnpm", "start"]
