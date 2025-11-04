FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# Copy package.json and your lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm i

# Copy the entire project
COPY . ./

# 构建应用
RUN pnpm run build:only-ssr


# Build Stage 2
FROM node:22-alpine
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./
COPY --from=build /app/.output/public ./_wait/public
COPY --from=build /app/scripts/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh  # 关键：赋予执行权限

# Change the port and host
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

# 容器启动时先复制，再启动服务
CMD ["sh", "./entrypoint.sh", "node", "/app/server/index.mjs"]