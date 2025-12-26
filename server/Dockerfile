# 基础镜像
FROM python:3.10-slim
# 设置工作目录
WORKDIR /app


# 复制项目文件
COPY . .

# 升级 pip，避免老版本问题
RUN pip install --upgrade pip

# 安装 PyTorch CPU 版（自动得到 2.9.1 + 0.24.1）
RUN pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirement.txt

# 暴露端口
EXPOSE 8100

# 启动应用
CMD ["python", "manager.py"]

