如果第一次启用，需要执行以下命令

```
docker buildx create --use
```

打包为镜像
macos = arm64
other = amd64

```
# amd64 架构
export http_proxy=http://127.0.0.1:7897
export https_proxy=http://127.0.0.1:7897


docker buildx bake \
  --file docker-compose.yml \
  --set "*.platform=linux/amd64" \
  --load


# arm64 架构
export http_proxy=http://127.0.0.1:7897
export https_proxy=http://127.0.0.1:7897


docker buildx bake \
  --file docker-compose.yml \
  --set "*.platform=linux/arm64" \
  --load


```

打包为 tar

```
docker save -o moqadmin.tar moqadmin-nuxt moqadmin-server moqadmin-admin
```

服务器加载

```
docker load -i moqadmin.tar
```

服务器运行

1. 需要复制.env 文件
2. 需要复制 nginx 文件夹

```
docker compose up -d
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml up -d --build

```

删除所有容器

```
docker compose down
```

进入容器

```
docker exec -it nginx ls /usr/share/nginx/html/admin


```

列出 volume

```
docker volume ls
```

删除 volume

```
docker volume rm <volume_name>
```

查看 volume 占用空间

```
docker system df
df -h # 查看系统空间使用情况
```

清理无效 images

```
docker image prune -a
```
