# 商品链接抓取接口使用说明

## 接口概述

`goods_links` 接口用于从已保存的分类链接中批量抓取商品链接，支持自动分页。

## 工作流程

```
1. 读取 category_links.json
   ↓
2. 遍历每个分类链接
   ↓
3. 访问分类页面，提取总页数
   ↓
4. 遍历所有分页
   ↓
5. 提取每页的商品链接
   ↓
6. 保存到 goods_links.json
```

## API 端点

### 1. 抓取商品链接

**接口地址**: `POST /api/grab/goods_links`

**功能说明**:

-   从已保存的分类链接文件中读取数据
-   循环访问每个分类的所有页面
-   自动识别总页数并遍历
-   提取所有商品链接并保存

**前置条件**:
必须先调用 `POST /api/grab/category_links` 抓取分类链接

**请求参数**: 无

**响应示例**:

```json
{
	"code": 200,
	"msg": "success",
	"data": {
		"total": 150,
		"data": [
			{
				"link": "/albums/123456789",
				"name": "商品标题1"
			},
			{
				"link": "/albums/987654321",
				"name": "商品标题2"
			}
		],
		"file_path": "./data/goods_links.json"
	}
}
```

### 2. 获取已保存的商品链接

**接口地址**: `GET /api/grab/goods_links`

**功能说明**: 读取之前抓取并保存的商品链接数据

**请求参数**: 无

**响应示例**: 同上

## 抓取规则详解

### 1. 链接构造

```
完整URL = 基础域名 + 分类链接 + 页码参数

示例:
https://youki0131.x.yupoo.com/albums/category1?page=1
https://youki0131.x.yupoo.com/albums/category1?page=2
```

### 2. 总页数提取

在每个分类的第一页中查找：

```html
<form class="pagination__jumpwrap">
	<span>共5页</span>
	<!-- 提取数字 5 -->
</form>
```

使用正则表达式 `共(\d+)页` 提取页数。

### 3. 商品数据提取

在每个页面中查找：

```html
<div class="categories__children">
	<a
		href="/albums/123456"
		title="商品标题"
		>...</a
	>
	<!-- 提取第一个a标签 -->
</div>
```

提取字段：

-   `href` 属性 → 保存为 `link`
-   `title` 属性 → 保存为 `name`

## 使用示例

### 完整流程示例

```bash
# 步骤1: 抓取分类链接
curl -X POST "http://localhost:8000/api/grab/category_links" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youki0131.x.yupoo.com/categories"}'

# 步骤2: 抓取商品链接（基于步骤1的结果）
curl -X POST "http://localhost:8000/api/grab/goods_links"

# 步骤3: 获取已保存的商品链接
curl -X GET "http://localhost:8000/api/grab/goods_links"
```

### Python 示例

```python
import requests

base_url = "http://localhost:8000/api"

# 1. 抓取分类链接
response = requests.post(f"{base_url}/grab/category_links",
                        json={"url": "https://youki0131.x.yupoo.com/categories"})
category_result = response.json()
print(f"抓取到 {category_result['data']['total']} 个分类")

# 2. 抓取商品链接
response = requests.post(f"{base_url}/grab/goods_links")
goods_result = response.json()
print(f"抓取到 {goods_result['data']['total']} 个商品")

# 3. 查看商品数据
for item in goods_result['data']['data'][:5]:  # 显示前5个
    print(f"商品: {item['name']}, 链接: {item['link']}")
```

### JavaScript 示例

```javascript
const baseUrl = "http://localhost:8000/api";

// 完整抓取流程
async function grabAllData() {
	try {
		// 1. 抓取分类链接
		const categoryRes = await fetch(`${baseUrl}/grab/category_links`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				url: "https://youki0131.x.yupoo.com/categories",
			}),
		});
		const categoryData = await categoryRes.json();
		console.log(`抓取到 ${categoryData.data.total} 个分类`);

		// 2. 抓取商品链接
		const goodsRes = await fetch(`${baseUrl}/grab/goods_links`, {
			method: "POST",
		});
		const goodsData = await goodsRes.json();
		console.log(`抓取到 ${goodsData.data.total} 个商品`);

		return goodsData.data.data;
	} catch (error) {
		console.error("抓取失败:", error);
	}
}

grabAllData();
```

## 数据文件

### category_links.json (输入)

```json
[
	{
		"link": "/albums/category1",
		"name": "分类1"
	},
	{
		"link": "/albums/category2",
		"name": "分类2"
	}
]
```

### goods_links.json (输出)

```json
[
	{
		"link": "/albums/123456789",
		"name": "商品标题1"
	},
	{
		"link": "/albums/987654321",
		"name": "商品标题2"
	}
]
```

## 错误处理

### 常见错误

| 错误信息             | 原因                         | 解决方案                             |
| -------------------- | ---------------------------- | ------------------------------------ |
| 分类链接文件不存在   | 未执行分类链接抓取           | 先调用 POST /api/grab/category_links |
| 分类链接数据为空     | category_links.json 为空数组 | 重新抓取分类链接                     |
| 分类链接文件格式错误 | JSON 文件损坏                | 删除文件后重新抓取                   |
| 网络请求失败         | 网络问题或目标网站不可访问   | 检查网络连接                         |

### 容错机制

1. **单页失败不影响整体**: 如果某一页抓取失败，会跳过该页继续抓取其他页面
2. **单分类失败不影响整体**: 如果某个分类抓取失败，会跳过该分类继续抓取其他分类
3. **错误日志**: 失败的页面和分类会在控制台输出错误信息

## 性能优化建议

### 1. 添加请求延迟

为避免对目标网站造成压力，建议在代码中添加延迟：

```python
import time

# 在循环中添加延迟
for page in range(1, total_pages + 1):
    # ... 抓取逻辑 ...
    time.sleep(1)  # 每页间隔1秒
```

### 2. 使用异步请求

可以使用 `aiohttp` 进行异步请求以提高效率：

```python
import aiohttp
import asyncio

async def fetch_page(session, url):
    async with session.get(url) as response:
        return await response.text()
```

### 3. 添加进度显示

对于大量数据的抓取，建议添加进度显示：

```python
from tqdm import tqdm

for category in tqdm(categories, desc="抓取进度"):
    # ... 抓取逻辑 ...
```

## 注意事项

1. ⚠️ **合规性**: 确保抓取行为符合目标网站的使用条款
2. ⚠️ **频率控制**: 避免频繁请求对目标网站造成负担
3. ⚠️ **数据更新**: 每次抓取会覆盖之前的 goods_links.json 文件
4. ⚠️ **网络稳定**: 抓取过程可能较长，确保网络稳定
5. ⚠️ **超时设置**: 当前超时时间为 30 秒，可根据需要调整

## 扩展功能建议

1. **增量更新**: 只抓取新增或更新的商品
2. **数据去重**: 避免重复的商品链接
3. **定时任务**: 使用 APScheduler 定期自动抓取
4. **数据库存储**: 将数据存储到数据库而非 JSON 文件
5. **详情抓取**: 进一步抓取每个商品的详细信息
6. **图片下载**: 下载商品图片到本地
7. **数据分析**: 对抓取的数据进行统计分析

## 监控与日志

抓取过程中的错误会输出到控制台：

```
抓取页面失败 https://youki0131.x.yupoo.com/albums/xxx?page=2: Connection timeout
抓取分类失败 /albums/category1: HTTP 404
```

建议将这些日志保存到文件以便后续分析。
