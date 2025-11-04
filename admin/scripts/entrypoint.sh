#!/bin/sh

# 定义共享卷路径和当前版本文件清单
SHARED_DIR="/shared-files/admin"

# 确保共享卷目录存在
mkdir -p "$SHARED_DIR"

# 清空共享卷（此时用户数据已被移走，不会被删除）
echo "清空共享卷中的历史文件..."
rm -rf "$SHARED_DIR"/*


# 复制当前版本的所有文件到共享卷
cp -r /app/* "$SHARED_DIR/"

# 启动服务（如果是纯静态文件，可能不需要这一步，视部署方式而定）
echo "部署完成，启动服务..."
# 执行 CMD 传递的参数（即启动服务的命令）
exec "$@"
