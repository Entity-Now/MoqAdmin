FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# Copy package.json and your lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm i

# Copy the entire project
COPY . ./

# 构建应用（确保构建命令正确，与 package.json 中的 "scripts.build" 一致）
RUN pnpm run build:only

# 运行阶段
FROM node:22-alpine

WORKDIR /app

# 复制构建产物
COPY --from=build /app/dist ./
COPY --from=build /app/scripts/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh  # 关键：赋予执行权限

# 复制资源到共享卷，并保持容器运行
CMD ["sh", "./entrypoint.sh", "tail -f /dev/null"]
