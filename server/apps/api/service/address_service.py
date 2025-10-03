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
import time
from tortoise import Tortoise
from pydantic import TypeAdapter
from exception import AppException
from hypertext import PagingResult
from apps.api.schemas import address_schema as schema
from common.models.Address import Address
from common.utils.times import TimeUtil


class AddressService:
    """ 地址服务类 """

    @classmethod
    async def lists(cls, user_id: int) -> list[schema.AddressListVo]:
        """
        获取用户地址列表。

        Args:
            user_id (int): 用户ID。

        Returns:
            list[schema.AddressListVo]: 地址列表。

        Author:
            zero
        """
        addresses = await Address.filter(user_id=user_id, is_delete=0).order_by("-is_default", "-update_time")
        
        result = []
        for item in addresses:
            d = item.__dict__
            d["full_address"] = f"{item.province}{item.city}{item.district}{item.address}"
            result.append(TypeAdapter(schema.AddressListVo).validate_python(d))
        
        return result

    @classmethod
    async def detail(cls, user_id: int, id_: int) -> schema.AddressDetailVo:
        """
        获取地址详情。

        Args:
            user_id (int): 用户ID。
            id_ (int): 地址ID。

        Returns:
            schema.AddressDetailVo: 地址详情。

        Author:
            zero
        """
        address = await Address.filter(id=id_, user_id=user_id, is_delete=0).first()
        if not address:
            raise AppException("地址不存在")
        
        d = address.__dict__
        d["full_address"] = f"{address.province}{address.city}{address.district}{address.address}"
        return TypeAdapter(schema.AddressDetailVo).validate_python(d)

    @classmethod
    async def add(cls, user_id: int, params: schema.AddressAddIn) -> int:
        """
        添加新地址。

        Args:
            user_id (int): 用户ID。
            params (schema.AddressAddIn): 添加地址参数。

        Returns:
            int: 新增地址ID。

        Author:
            zero
        """
        now = int(time.time())
        
        # 如果设置为默认地址，先取消其他地址的默认状态
        if params.is_default == 1:
            await Address.filter(user_id=user_id, is_delete=0).update(is_default=0)
        
        address = await Address.create(
            user_id=user_id,
            name=params.name,
            phone=params.phone,
            province=params.province,
            city=params.city,
            district=params.district,
            address=params.address,
            is_default=params.is_default,
            create_time=now,
            update_time=now
        )
        
        return address.id

    @classmethod
    async def edit(cls, user_id: int, params: schema.AddressEditIn):
        """
        编辑地址。

        Args:
            user_id (int): 用户ID。
            params (schema.AddressEditIn): 编辑地址参数。

        Author:
            zero
        """
        address = await Address.filter(id=params.id, user_id=user_id, is_delete=0).first()
        if not address:
            raise AppException("地址不存在")
        
        now = int(time.time())
        
        # 如果设置为默认地址，先取消其他地址的默认状态
        if params.is_default == 1:
            await Address.filter(user_id=user_id, is_delete=0).update(is_default=0)
        
        await Address.filter(id=params.id).update(
            name=params.name,
            phone=params.phone,
            province=params.province,
            city=params.city,
            district=params.district,
            address=params.address,
            is_default=params.is_default,
            update_time=now
        )

    @classmethod
    async def delete(cls, user_id: int, id_: int):
        """
        删除地址。

        Args:
            user_id (int): 用户ID。
            id_ (int): 地址ID。

        Author:
            zero
        """
        address = await Address.filter(id=id_, user_id=user_id, is_delete=0).first()
        if not address:
            raise AppException("地址不存在")
        
        now = int(time.time())
        await Address.filter(id=id_).update(
            is_delete=1,
            delete_time=now
        )

    @classmethod
    async def set_default(cls, user_id: int, id_: int):
        """
        设置默认地址。

        Args:
            user_id (int): 用户ID。
            id_ (int): 地址ID。

        Author:
            zero
        """
        address = await Address.filter(id=id_, user_id=user_id, is_delete=0).first()
        if not address:
            raise AppException("地址不存在")
        
        now = int(time.time())
        
        # 取消其他地址的默认状态
        await Address.filter(user_id=user_id, is_delete=0).update(is_default=0)
        
        # 设置当前地址为默认
        await Address.filter(id=id_).update(
            is_default=1,
            update_time=now
        )
    
    @classmethod
    async def current(cls, user_id: int) -> schema.AddressDetailVo:
        """
        获取用户当前地址（默认地址）。

        Args:
            user_id (int): 用户ID。

        Returns:
            schema.AddressDetailVo: 地址详情。

        Author:
            zero
        """
        # 优先获取默认地址
        address = await Address.filter(user_id=user_id, is_default=1, is_delete=0).first()
        
        # 如果没有默认地址，则获取第一个地址
        if not address:
            address = await Address.filter(user_id=user_id, is_delete=0).order_by("-update_time").first()
        
        if not address:
            raise AppException("暂无收货地址")
        
        d = address.__dict__
        d["full_address"] = f"{address.province}{address.city}{address.district}{address.address}"
        return TypeAdapter(schema.AddressDetailVo).validate_python(d)