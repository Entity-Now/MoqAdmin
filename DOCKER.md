打包为镜像
```
export http_proxy=http://127.0.0.1:7897
export https_proxy=http://127.0.0.1:7897

docker compose build
```

打包为tar
```
docker save -o moqadmin.tar moqadmin-nuxt moqadmin-server moqadmin-admin
```

服务器加载
```
docker load -i moqadmin.tar
```

服务器运行
1. 需要复制.env文件
2. 需要复制nginx文件夹

```
docker compose up -d
```

删除所有容器
```
docker compose down
```


