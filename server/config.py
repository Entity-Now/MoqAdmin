# +----------------------------------------------------------------------
# | WaitAdmin(fastapi)快速开发后台管理系统
# +----------------------------------------------------------------------
# | 欢迎阅读学习程序代码,建议反馈是我们前进的动力
# | 程序完全开源可支持商用,允许去除界面版权信息
# | gitee:   https://gitee.com/wafts/waitadmin-python
# | github:  https://github.com/topwait/waitadmin-python
# | 官方网站: https://www.waitadmin.cn
# | WaitAdmin团队版权所有并拥有最终解释权
# +----------------------------------------------------------------------
# | Author: WaitAdmin Team <2474369941@qq.com>
# +----------------------------------------------------------------------
import os
from functools import lru_cache
from dotenv import load_dotenv, find_dotenv
from pydantic_settings import BaseSettings
from typing import List, Dict

__all__ = ["get_settings"]

# ======================================================
# 🧭 在类定义之前加载 .env 文件
# ======================================================
if os.getenv("DOCKER_ENV") == "true":
    load_dotenv(find_dotenv(), override=False)   # 容器：不覆盖 Compose 环境变量
else:
    load_dotenv(find_dotenv(), override=True)    # 本地：允许 .env 覆盖系统变量

print("DEBUG: DOCKER_ENV =", os.getenv("DOCKER_ENV"))
print("DEBUG: MYSQL_HOST =", os.getenv("MYSQL_HOST"))
print("DEBUG: REDIS_HOST =", os.getenv("REDIS_HOST"))


class GlobalSetting(BaseSettings):
    # 演示环境
    ENV_DEMO: bool = os.getenv("ENV_DEMO", False)

    # 调试模式
    APP_DEBUG: bool = os.getenv("APP_DEBUG", False)

    # 应用名称
    APPS_NAME: str = "apps"

    # 项目信息
    VERSION: str = "1.1.1"
    PROJECT_NAME: str = "MoqAdmin(内容管理+卡密售卖系统)"
    DESCRIPTION: str = "Fastapi + Vue3 + NuxtJs + TypeScript"

    # 服务配置
    SERVER_HOST: str = os.getenv("SERVER_HOST", "0.0.0.0")
    SERVER_PORT: int = int(os.getenv("SERVER_PORT", 8100))
    SERVER_WORKERS: int = int(os.getenv("SERVER_WORKERS", 4))
    SERVER_RELOAD: bool = True if os.getenv("SERVER_RELOAD", "False") == "True" else False

    # 跨域请求
    CORS_ORIGINS: List[str] = ["*"]
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True

    # 路由配置
    ROUTER_ALIAS: Dict[str, str] = {"admin": "spi", "api": "api"}
    ROUTER_REMARK: Dict[str, str] = {"admin": "后台接口", "api": "前台接口"}
    ROUTER_STYLES: str = "line"

    # 静态资源目录
    STATIC_DIR: List[tuple] = [
        ("/static", "public/static", "static"),
        ("/storage", "public/storage", "storage")
    ]

    # 数据库配置
    DATABASES: Dict[str, object] = {
        "connections": {
            "mysql": {
                "engine": "tortoise.backends.mysql",
                "prefix": os.getenv("MYSQL_PREFIX", "Moq_"),
                "credentials": {
                    # 服务器地
                    "host": os.getenv("MYSQL_HOST", "127.0.0.1"),
                    # 服务器端口
                    "port": int(os.getenv("MYSQL_PORT", 3306)),
                    # 数据库用户
                    "user": os.getenv("MYSQL_USERNAME", "root"),
                    # 数据库密码
                    "password": os.getenv("MYSQL_PASSWORD", "root"),
                    # 数据库名称
                    "database": os.getenv("MYSQL_DATABASE", "AdminCustom"),
                    # 最少连接数
                    "minsize": int(os.getenv("MYSQL_MINSIZE", 1)),
                    # 最大连接数
                    "maxsize": int(os.getenv("MYSQL_MAXSIZE", 100)),
                    # 数据库编码
                    "charset": os.getenv("MYSQL_CHARSET", "utf8mb4"),
                    # 打印SQL
                    "echo": True if os.getenv("MYSQL_ECHO", "False") == "True" else False
                }
            }
        },
        "apps": {
            # 配置MySQL
            "mysql": {"models": "common.models", "default_connection": "mysql"}
        },
        # 是否使用时区支持
        "use_tz": False,
        # 默认使用的时区
        "timezone": "Asia/Shanghai"
    }

    # 缓存配置
    REDIS: Dict[str, object] = {
        # 主机
        "host": os.getenv("REDIS_HOST", "127.0.0.1"),
        # 端口
        "port": int(os.getenv("REDIS_PORT", 6379)),
        # 用户
        "username": os.getenv("REDIS_USERNAME", ""),
        # 密码
        "password": os.getenv("REDIS_PASSWORD", ""),
        # 编码
        "encoding": os.getenv("REDIS_ENCODING", "utf-8"),
        # 前缀
        "prefix": os.getenv("REDIS_PREFIX", "moq:"),
        # 数据库
        "db": int(os.getenv("REDIS_DB", 0)),
        # 连接池的最大连接数
        "max_connections": int(os.getenv("REDIS_MAX_CONNECTIONS", 800)),
        # 将响应解码为字符串
        "decode_responses": bool(os.getenv("REDIS_DECODE_RESPONSES", True))
    }

    # 日志配置
    LOGGER: Dict[str, object] = {
        # 日志保存目录
        "path": "runtime/log",
        # 日志压缩大小
        "gzip_size": 1024 * 1024,
        # 日志输出到文件
        "enable_file": True,
        # 日志输出到屏幕
        "enable_sole": True,
        # 文件日志级别
        "level_file": "debug",
        # 屏幕日志级别
        "level_sole": "info",
        # 格式化文件日志
        "format_file": "[%(asctime)s][%(levelname)s] [%(filename)s:%(lineno)d]%(pathname)s - %(message)s",
        # 格式化屏幕日志
        "format_sole": "[%(levelname)s]: [%(filename)s:%(lineno)d] [%(thread)d] - %(message)s",
        # 格式化日志日期
        "format_date": "%Y-%m-%d %H:%M:%S %p",
        # 设置依赖的级别
        "rely_levels": {"error": ["asyncio", "tortoise", "apscheduler"]}
    }

    # 上传配置
    UPLOAD: Dict[str, object] = {
        # 磁盘路径
        "root": "public",
        # 对外路径
        "path": "storage",
        # 上传限制
        "limits": {
            "image": {
                "size": 1024*1024*10,
                "ext": ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "ico"]
            },
            "video": {
                "size": 1024*1024*30,
                "ext": ["wmv", "avi", "mpg", "mpeg", "3gp", "mov", "mp4", "m4v", "flv", "rmvb", "mkv"]
            },
            "audio": {
                "size": 1024*1024*30,
                "ext": ["mp3", "wav", "aac", "ogg", "flac", "m4a", "amr", "wma", "mid", "midi", "ape", "ac3"]
            },
            "packs": {
                "size": 1024*1024*30,
                "ext": ["zip", "rar", "7z", "tar", "gz", "bz2", "tgz", "tar.gz", "tbz2", "tar.bz2", "iso"]
            },
            "docs": {
                "size": 1024*1024*30,
                "ext": ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "txt", "html", "htm", "csv", "md", "pem"]
            }
        }
    }


@lru_cache()
def get_settings() -> GlobalSetting:
    return GlobalSetting()
