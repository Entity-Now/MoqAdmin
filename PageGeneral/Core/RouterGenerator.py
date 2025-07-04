from .CodeGenerator import CodeGenerator
from .MTable import Table, Property


class RouterGenerator(CodeGenerator):

    ROUTER_TEMPLATE = '''
from fastapi import APIRouter, Depends
from hypertext import R, response_json
from apps.admin.schemas.{category} import {model_name}_schema as schema
from apps.admin.service.{category}.{model_name}_service import {service_name} as service    

router = APIRouter(prefix="/{prefix}", tags=["{tag}"])


@router.get("/lists", summary="{tag}列表", response_model=R[schema.{model_name}Detail])
@response_json
async def lists(params: schema.{model_name}SearchIn = Depends()):
    return await service.lists(params)


@router.get("/selects", summary="{tag}Items", response_model=R)
@response_json
async def selects():
    return await service.selected()


@router.post("/add", summary="{tag}新增", response_model=R)
@response_json
async def add(params: schema.{model_name}Create):
    await service.add(params)


@router.post("/edit", summary="{tag}编辑", response_model=R)
@response_json
async def edit(params: schema.{model_name}Update):
    await service.edit(params)


@router.post("/delete", summary="{tag}删除", response_model=R)
@response_json
async def delete(params: schema.{model_name}Delete):
    await service.delete(params.id)
'''

    def generate(self, table: Table) -> str:
        # prefix通常是tableName原样或者改成下划线小写
        prefix = table.tableName.lower()
        # tag一般是表注释或者表名的中文描述，这里用tableName驼峰转空格（你可以改成中文）
        tag = table.tableName.replace('_', ' ').title()

        model_name = table.tableName.lower()
        service_name = f"{model_name}Service"
        category = table.category
        return self.ROUTER_TEMPLATE.format(
            prefix=prefix,
            tag=tag,
            model_name=model_name,
            service_name=service_name,
            category=category
        )

    def get_filename(self, table: Table) -> str:
        return f"{table.tableName.lower()}_router.py"
    
    def get_output_dir(self, table: Table) -> str:
        """返回生成代码的输出目录"""
        return f'../server/apps/admin/routers'