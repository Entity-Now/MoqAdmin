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
from fastapi import FastAPI

__all__ = ["configure_event"]


async def __dynamic_events(app: FastAPI, event: str):
    """ Dynamic execution events """
    # 获取当前文件所在目录的上一级目录的上一级目录的绝对路径
    root_path: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + os.sep
    # 判断events.py文件是否存在
    if os.path.exists(root_path + "events.py"):
        # 导入events模块
        module = importlib.import_module("events")
        # 获取AppEvents类
        clz = getattr(module, "AppEvents", None)
        # 判断AppEvents类是否存在
        if clz:
            # 获取event对应的方法
            function = getattr(clz, event, None)
            # 判断方法是否存在
            if function:
                # 异步执行方法
                await function(app)


def configure_event(app: FastAPI):
    """ Configure events """
    @app.on_event("startup")
    async def startup():
        await __dynamic_events(app, "startup")

    @app.on_event("shutdown")
    async def shutdown():
        await __dynamic_events(app, "shutdown")
