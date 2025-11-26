# 商品抓取接口文档

## 概述

本模块提供了网页爬虫功能,用于抓取指定网页中的分类链接信息。

## 技术栈

-   **爬虫库**: requests==2.31.0、beautifulsoup4==4.12.3
-   **框架**: FastAPI
-   **数据验证**: Pydantic

## 文件结构

```
server/apps/api/
├── service/
│   └── grab_goods.py          # 爬虫服务逻辑
├── schemas/
│   └── grab_goods_schema.py   # 数据模型定义
└── routers/
    └── grab_goods_router.py   # API路由定义
```

## API 接口

### 1. 抓取分类链接

**接口地址**: `POST /api/grab/category_links`

**功能说明**: 从指定网页抓取分类链接并保存到 JSON 文件

**请求参数**:

```json
{
	"url": "https://youki0131.x.yupoo.com/categories"
}
```

| 参数 | 类型   | 必填 | 说明                                                          |
| ---- | ------ | ---- | ------------------------------------------------------------- |
| url  | string | 否   | 目标网页 URL，默认为 https://youki0131.x.yupoo.com/categories |

**响应示例**:

```json
{
	"code": 200,
	"msg": "success",
	"data": {
		"total": 10,
		"data": [
			{
				"link": "/albums/123456",
				"name": "分类名称1"
			},
			{
				"link": "/albums/789012",
				"name": "分类名称2"
			}
		],
		"file_path": "./data/category_links.json"
	}
}
```

**字段说明**:

| 字段        | 类型   | 说明                          |
| ----------- | ------ | ----------------------------- |
| total       | int    | 抓取到的链接总数              |
| data        | array  | 链接数据数组                  |
| data[].link | string | 链接地址 (a 标签的 href 属性) |
| data[].name | string | 链接名称 (a 标签的文本内容)   |
| file_path   | string | 数据保存的文件路径            |

### 2. 获取已保存的分类链接

**接口地址**: `GET /api/grab/category_links`

**功能说明**: 读取之前抓取并保存的分类链接数据

**请求参数**: 无

**响应示例**:

```json
{
	"code": 200,
	"msg": "success",
	"data": {
		"total": 10,
		"data": [
			{
				"link": "/albums/123456",
				"name": "分类名称1"
			}
		],
		"file_path": "./data/category_links.json"
	}
}
```

## 使用示例

### cURL 示例

**抓取分类链接**:

```bash
curl -X POST "http://localhost:8000/api/grab/category_links" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youki0131.x.yupoo.com/categories"}'
```

**获取已保存的链接**:

```bash
curl -X GET "http://localhost:8000/api/grab/category_links"
```

### Python 示例

```python
import requests

# 抓取分类链接
response = requests.post(
    "http://localhost:8000/api/grab/category_links",
    json={"url": "https://youki0131.x.yupoo.com/categories"}
)
result = response.json()
print(f"抓取到 {result['data']['total']} 条链接")

# 获取已保存的链接
response = requests.get("http://localhost:8000/api/grab/category_links")
result = response.json()
print(result['data']['data'])
```

### JavaScript 示例

```javascript
// 抓取分类链接
fetch("http://localhost:8000/api/grab/category_links", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify({
		url: "https://youki0131.x.yupoo.com/categories",
	}),
})
	.then((response) => response.json())
	.then((data) => {
		console.log(`抓取到 ${data.data.total} 条链接`);
		console.log(data.data.data);
	});

// 获取已保存的链接
fetch("http://localhost:8000/api/grab/category_links")
	.then((response) => response.json())
	.then((data) => {
		console.log(data.data.data);
	});
```

## 数据存储

抓取的数据会自动保存到 `./data/category_links.json` 文件中，格式如下:

```json
[
	{
		"link": "/albums/123456",
		"name": "分类名称1"
	},
	{
		"link": "/albums/789012",
		"name": "分类名称2"
	}
]
```

## 错误处理

接口可能返回以下错误:

| 错误信息         | 说明               | 解决方案                    |
| ---------------- | ------------------ | --------------------------- |
| 网络请求失败     | 无法访问目标网页   | 检查网络连接和 URL 是否正确 |
| 未找到目标元素   | 网页结构已变化     | 检查目标网页 HTML 结构      |
| 未找到任何链接   | 目标元素中没有链接 | 确认网页内容是否正确        |
| 数据文件不存在   | 尚未执行过抓取操作 | 先调用 POST 接口进行抓取    |
| 数据文件格式错误 | JSON 文件损坏      | 删除文件后重新抓取          |

## 技术细节

### 抓取逻辑

1. 发送 HTTP GET 请求到目标 URL
2. 使用 BeautifulSoup 解析 HTML
3. 查找 `<div class="showheader__category_new">` 元素
4. 提取该元素下所有 `<a>` 标签
5. 获取每个 a 标签的 `href` 属性和文本内容
6. 过滤空数据
7. 保存为 JSON 格式

### User-Agent

为了避免被网站拦截,请求时使用了标准的浏览器 User-Agent:

```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
```

### 超时设置

HTTP 请求超时时间设置为 30 秒,可根据需要在 `grab_goods.py` 中调整。

## 注意事项

1. **合法性**: 请确保爬取行为符合目标网站的 robots.txt 规则和服务条款
2. **频率控制**: 建议添加请求间隔,避免对目标网站造成压力
3. **数据更新**: 每次抓取会覆盖之前保存的数据
4. **目录权限**: 确保应用有权限在 `./data` 目录创建文件
5. **网页变化**: 如果目标网页结构发生变化,可能需要更新选择器

## 扩展建议

1. **添加更多抓取目标**: 可以在 service 中添加新的方法抓取其他页面
2. **数据库存储**: 将抓取结果存储到数据库而不是 JSON 文件
3. **定时任务**: 使用 APScheduler 定时自动抓取
4. **代理支持**: 添加代理配置以提高稳定性
5. **错误重试**: 实现自动重试机制
6. **数据去重**: 添加数据去重逻辑

## API 文档访问

启动服务后,可以通过以下地址访问 Swagger 文档:

```
http://localhost:8000/docs
```

在文档中可以直接测试接口功能。
