from .CodeGenerator import CodeGenerator
from .MTable import Table

class ApiGenerator(CodeGenerator):
    TEMPLATE = '''
import request from '@/utils/request'

const {api_name}Api = {{
    /**
     * {comment}列表
     */
    lists(params: any): Promise<any> {{
        return request.get({{
            url: '/{route_prefix}/{route_name}/lists',
            params
        }})
    }},

    /**
     * {comment}详情
     */
    detail(id: number): Promise<any> {{
        return request.get({{
            url: '/{route_prefix}/{route_name}/detail',
            params: {{ id }}
        }})
    }},

    /**
     * {comment}新增
     */
    add(params: any): Promise<any> {{
        return request.post({{
            url: '/{route_prefix}/{route_name}/add',
            params
        }})
    }},

    /**
     * {comment}编辑
     */
    edit(params: any): Promise<any> {{
        return request.post({{
            url: '/{route_prefix}/{route_name}/edit',
            params
        }})
    }},

    /**
     * {comment}删除
     */
    delete(id: number): Promise<any> {{
        return request.post({{
            url: '/{route_prefix}/{route_name}/delete',
            params: {{ id }}
        }})
    }}
}}

export default {api_name}Api
'''

    def generate(self, table: Table) -> str:
        # 路由与变量命名处理
        table_name = table.tableName.lower()
        route_name = table_name
        route_prefix = table.apiPrefix or 'content'
        api_name = ''.join(word.capitalize() for word in table_name.split('_'))
        api_name = api_name[0].lower() + api_name[1:]

        comment = table.comment or table.tableName.replace('_', ' ').title()

        return self.TEMPLATE.format(
            api_name=api_name,
            route_prefix=route_prefix,
            route_name=route_name,
            comment=comment,
        )

    def get_filename(self, table: Table) -> str:
        return f'{table.tableName.lower()}.ts'
