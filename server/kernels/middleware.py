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
import importlib
import typing
from typing import List
from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from kernels.utils import RequestUtil

__all__ = ["configure_middleware"]


def __get_configs():
    """ Get Configuration """
    # 定义一个字典，用于存储配置信息
    configs = {"APPS_NAME": "apps"}
    try:
        # 尝试导入config模块
        package = importlib.import_module("config")
        # 获取GlobalSetting类
        clz = getattr(package, "GlobalSetting", None)
        # 如果没有找到GlobalSetting类，则返回默认配置
        if not clz:
            return configs

        # 创建GlobalSetting类的实例，并将其转换为字典
        obj = clz().dict()
        # 获取配置中的APPS_NAME，如果没有则使用默认值apps
        configs["APPS_NAME"] = obj.get("APPS_NAME", "apps")
        # 返回配置信息
        return configs
    except ModuleNotFoundError:
        # 如果没有找到config模块，则返回默认配置
        return configs


def __get_directories(path) -> List[str]:
    """ Get application modules """
    # 创建一个空列表，用于存储目录
    directories = []
    # 遍历指定路径下的所有文件和目录
    for item in os.listdir(path):
        # 如果文件或目录以"__"或"."开头，则跳过
        if item.startswith("__") or item.startswith("."):
            continue
        # 获取文件或目录的完整路径
        item_path = os.path.join(path, item)
        # 如果是目录，则将其添加到列表中
        if os.path.isdir(item_path):
            directories.append(item)
    # 返回目录列表
    return directories


def configure_middleware(app: FastAPI):
    """ Configure middleware """
    # 获取配置
    config: dict = __get_configs()
    # 获取应用名称
    apps_name: str = config.get("APPS_NAME", "apps")
    # 获取根路径
    root_path: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + os.sep

    # 获取根中间件路径
    root_middleware = root_path + "middleware.py"
    # 如果根中间件路径存在
    if os.path.exists(root_middleware):
        # 导入中间件模块
        module = importlib.import_module("middleware")
        # 获取中间件初始化函数
        function = getattr(module, "init_middlewares", None)
        # 如果初始化函数存在
        if function:
            # 调用初始化函数
            function(app)

    # 获取单个应用中间件路径
    single_apps = root_path + apps_name + "/routers"
    # 如果单个应用中间件路径存在
    if os.path.exists(single_apps):
        # 如果单个应用中间件路径下的middleware.py文件存在
        if os.path.exists(single_apps + "/middleware.py"):
            # 导入中间件模块
            module = ".".join([apps_name, "middleware"])
            # 获取中间件初始化函数
            function = getattr(module, "init_middlewares", None)
            # 如果初始化函数存在
            if function:
                # 调用初始化函数
                function(app)
    else:
        # 获取多个应用目录
        multiple_apps: List[str] = __get_directories(root_path + apps_name)
        # 遍历多个应用目录
        for app_module in multiple_apps:
            # 获取单个应用中间件路径
            pack_a = "/".join([apps_name, app_module, "middleware.py"])
            # 获取单个应用中间件模块
            pack_s = ".".join([apps_name, app_module, "middleware"])
            # 如果单个应用中间件路径存在
            if os.path.exists(root_path + pack_a):
                # 导入中间件模块
                module = importlib.import_module(pack_s)
                # 获取中间件初始化函数
                function = getattr(module, "init_middlewares", None)
                if function:
                    function(app)
                    # 调用初始化函数

    basis_middleware: typing.Type[any] = BasisMiddleware
    # 获取基础中间件
    app.add_middleware(basis_middleware)
    # 添加基础中间件


def to_user_agent(ua: str):
    ua_dict = {
        "wechat": "MicroMessenger",
        "chrome": "Chrome",
        "firefox": "Firefox",
        "safari": "Safari",
        "opera": "Opera",
        "edge": "Edge"
    }

    ua = ua.lower()
    for key, value in ua_dict.items():
        if value in ua:
            return key

    if "msie" in ua or "trident/" in ua:
        return "ie"

    return "other"


class BasisMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        user_agent: str = str(request.headers.get("User-Agent", ""))
        user_token: str = str(request.headers.get("Authorization", "").split(" ")[-1])
        req_module: str = str(request.url.path.strip("/").split("/")[0])
        request.state.module = req_module
        RequestUtil.ua = to_user_agent(user_agent)
        RequestUtil.port = request.url.port
        RequestUtil.host = request.client.host
        RequestUtil.token = user_token
        RequestUtil.module = req_module
        RequestUtil.scheme = request.scope.get("scheme")
        RequestUtil.method = request.method
        RequestUtil.userAgent = user_agent
        RequestUtil.remotePort = request.client.port
        RequestUtil.url = str(request.url)
        RequestUtil.path = str(request.url.path)
        RequestUtil.domain = str(request.base_url).rstrip("/")
        RequestUtil.rootDomain = str(request.base_url.netloc)
        RequestUtil.pathParams = request.path_params
        RequestUtil.queryParams = request.query_params
        RequestUtil.state = request.state
        RequestUtil.headers = request.headers
        RequestUtil.cookies = request.cookies
        return await call_next(request)
