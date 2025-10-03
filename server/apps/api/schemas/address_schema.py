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
from fastapi import Query
from pydantic import BaseModel, Field


class AddressAddIn(BaseModel):
    """ 添加地址参数 """
    name: str = Field(min_length=1, max_length=20, description="收货人姓名")
    phone: str = Field(min_length=11, max_length=11, pattern=r"^1[3-9]\d{9}$", description="收货人手机号")
    province: str = Field(min_length=1, max_length=20, description="省份")
    city: str = Field(min_length=1, max_length=20, description="城市")
    district: str = Field(min_length=1, max_length=20, description="区县")
    address: str = Field(min_length=1, max_length=200, description="详细地址")
    is_default: int = Field(ge=0, le=1, default=0, description="是否默认地址")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "张三",
                "phone": "13800138000",
                "province": "广东省",
                "city": "深圳市",
                "district": "南山区",
                "address": "科技园南区",
                "is_default": 0
            }
        }

    @classmethod
    def messages(cls):
        return {
            "name.min_length": "请填写收货人姓名",
            "name.max_length": "收货人姓名不能超过20个字符",
            "phone.min_length": "请填写正确的手机号",
            "phone.max_length": "请填写正确的手机号",
            "phone.pattern": "手机号格式不正确",
            "province.min_length": "请选择省份",
            "province.max_length": "省份名称不能超过20个字符",
            "city.min_length": "请选择城市",
            "city.max_length": "城市名称不能超过20个字符",
            "district.min_length": "请选择区县",
            "district.max_length": "区县名称不能超过20个字符",
            "address.min_length": "请填写详细地址",
            "address.max_length": "详细地址不能超过200个字符",
            "is_default.ge": "是否默认地址参数错误",
            "is_default.le": "是否默认地址参数错误"
        }


class AddressEditIn(BaseModel):
    """ 编辑地址参数 """
    id: int = Field(gt=0, description="地址ID")
    name: str = Field(min_length=1, max_length=20, description="收货人姓名")
    phone: str = Field(min_length=11, max_length=11, pattern=r"^1[3-9]\d{9}$", description="收货人手机号")
    province: str = Field(min_length=1, max_length=20, description="省份")
    city: str = Field(min_length=1, max_length=20, description="城市")
    district: str = Field(min_length=1, max_length=20, description="区县")
    address: str = Field(min_length=1, max_length=200, description="详细地址")
    is_default: int = Field(ge=0, le=1, default=0, description="是否默认地址")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "李四",
                "phone": "13800138001",
                "province": "广东省",
                "city": "广州市",
                "district": "天河区",
                "address": "天河路385号",
                "is_default": 1
            }
        }

    @classmethod
    def messages(cls):
        return {
            "id.gt": "地址ID必须大于0",
            **AddressAddIn.messages()
        }


class AddressDelIn(BaseModel):
    """ 删除地址参数 """
    id: int = Field(gt=0, description="地址ID")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1
            }
        }

    @classmethod
    def messages(cls):
        return {
            "id.gt": "地址ID必须大于0"
        }


class AddressDetailIn(BaseModel):
    """ 地址详情参数 """
    id: int = Field(gt=0, description="地址ID")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1
            }
        }

    @classmethod
    def messages(cls):
        return {
            "id.gt": "地址ID必须大于0"
        }


class AddressSetDefaultIn(BaseModel):
    """ 设置默认地址参数 """
    id: int = Field(gt=0, description="地址ID")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1
            }
        }

    @classmethod
    def messages(cls):
        return {
            "id.gt": "地址ID必须大于0"
        }


class AddressListVo(BaseModel):
    """ 地址列表Vo """
    id: int
    name: str
    phone: str
    province: str
    city: str
    district: str
    address: str
    full_address: str
    is_default: int


class AddressDetailVo(BaseModel):
    """ 地址详情Vo """
    id: int
    name: str
    phone: str
    province: str
    city: str
    district: str
    address: str
    full_address: str
    is_default: int