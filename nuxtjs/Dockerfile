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

# 复制资源到共享卷
CMD cp -r /app/public/* /shared-files/nuxtjs/

# Change the port and host
ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "/app/server/index.mjs"]