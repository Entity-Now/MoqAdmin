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
from tortoise.contrib.fastapi import register_tortoise

__all__ = ["register_db"]


def __loading_db_configs():
    """ Load Db configuration """
    configs = {}
    try:
        # 导入config模块
        package = importlib.import_module("config")
        # 获取GlobalSetting类
        clz = getattr(package, "GlobalSetting", None)
        # 如果没有GlobalSetting类，返回空字典
        if not clz:
            return configs

        # 实例化GlobalSetting类
        obj = clz().dict()
        # 获取DATABASES配置
        db_config = obj.get("DATABASES", {})

        # 如果有apps配置，遍历apps
        if db_config.get("apps"):
            for k, v in db_config.get("apps").items():
                # 如果v存在，并且有models配置，并且models是字符串类型
                if v and v.get("models") and isinstance(v.get("models"), str):
                    # 加载models文件
                    db_config["apps"][k]["models"] = __loading_model_files(v.get("models"))

        # 返回db_config
        return db_config
    except ModuleNotFoundError:
        # 如果没有找到config模块，返回空字典
        return configs


def __loading_model_files(path: str):
    """ Load Db models """
    # 获取当前文件的绝对路径
    root_path: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + os.sep
    # 获取指定路径的绝对路径
    mode_path: str = root_path + path.replace(".", os.sep)

    all_files = []
    # 遍历指定路径下的所有文件和文件夹
    for root, dirs, filenames in os.walk(mode_path):
        # 过滤掉以"__"开头的文件夹
        dirs[:] = [d for d in dirs if not d.startswith("__")]
        # 获取当前文件夹相对于指定路径的相对路径
        path_parts = os.path.relpath(root, mode_path).split(os.sep)
        # 过滤掉以"__"开头的文件夹
        path_parts = [p for p in path_parts if not p.startswith("__")]
        # 获取当前文件夹的路径
        file_base_path = ".".join(path_parts) if path_parts else ""
        # 遍历当前文件夹下的所有文件
        for filename in filenames:
            # 过滤掉以"__"开头的文件
            if not filename.startswith("__"):
                # 获取文件名（不包含扩展名）
                filename_without_ext = os.path.splitext(filename)[0]
                # 如果当前文件夹路径以"."结尾，则去掉"."
                if file_base_path and file_base_path.endswith("."):
                    file_base_path = file_base_path[:-1]
                # 获取文件的完整路径
                file_path = f"{file_base_path}.{filename_without_ext}" if file_base_path else filename_without_ext
                # 过滤掉以"."开头的文件
                if not (file_path.startswith(".") and file_path != "."):
                    # 将文件的完整路径添加到列表中
                    all_files.append(path + "." + file_path)

    return all_files


def register_db(app: FastAPI):
    """ Connect Databases """
    register_tortoise(
        app,
        config=__loading_db_configs(),
        generate_schemas=True,
        add_exception_handlers=False,
    )
