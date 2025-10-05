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
from typing import Dict


class BannerEnum:
    HOME = 10  # 首页轮播
    SIDE = 20  # 侧边广告
    BANNER = 30 # banner广告
    MINI = 40 # 小程序广告
    MINI_ENTER = 50 # 小程序快速入口



    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.HOME: "首页轮播",
            cls.SIDE: "侧边广告",
            cls.BANNER: "banner广告",
            cls.MINI: "小程序广告",
            cls.MINI_ENTER: "小程序快速入口",
        }
        return _desc.get(code, "")

    @classmethod
    def get_positions(cls) -> Dict[int, str]:
        return {
            cls.HOME: "首页轮播",
            cls.SIDE: "侧边广告",
            cls.BANNER: "banner广告",
            cls.MINI: "小程序广告",
            cls.MINI_ENTER: "小程序快速入口",
        }

class FeatureEnum:
    Feature = 10 # 特性
    Question = 20 # 常见问题    
    
    @classmethod
    def get_msg_by_code(cls, code: int) -> str:
        _desc = {
            cls.Feature: "特性",
            cls.Question: "常见问题"
        }
        return _desc.get(code, "")
    
    @classmethod
    def get_positions(cls) -> Dict[int, str]:
        return {
            cls.Feature: "特性",
            cls.Question: "常见问题"
        }