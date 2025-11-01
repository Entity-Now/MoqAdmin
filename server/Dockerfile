# 基础镜像
FROM python:3.10-slim
# 设置工作目录
WORKDIR /app


# 复制项目文件
COPY . .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirement.txt

# 暴露端口
EXPOSE 8100

# 启动应用
CMD ["python", "manager.py"]

