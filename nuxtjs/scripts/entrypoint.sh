#!/bin/sh

# 定义路径
SHARED_DIR="/app/public"       # 共享卷挂载点
STAGING_DIR="/app/_wait/public" # 暂存的 public 目录
MANIFEST="/app/file-manifest.txt"

# 确保共享卷和暂存目录存在
mkdir -p "$SHARED_DIR"
if [ ! -d "$STAGING_DIR" ]; then
  echo "错误：暂存目录 $STAGING_DIR 不存在"
  exit 1
fi

# 清空共享卷中的历史文件
echo "清空共享卷中的历史文件..."
rm -rf "$SHARED_DIR"/*

# 将暂存的当前版本 public 文件复制到共享卷
echo "复制当前版本文件到共享卷..."
cp -r "$STAGING_DIR"/* "$SHARED_DIR/"

# 删除暂存目录
# echo "删除暂存目录..."
# rm -rf "$STAGING_DIR"

# 执行启动命令
echo "部署完成，启动服务..."
exec "$@"