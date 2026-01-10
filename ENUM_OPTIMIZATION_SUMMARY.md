# 枚举类型优化总结

## 优化内容

### 1. 后端枚举优化 (Python)

#### 1.1 `/server/common/enums/market.py`

-   ✅ 所有枚举类改为继承 `IntEnum`，提供更好的类型安全
-   ✅ 添加 `PayWayEnum.NONE = 0` 用于未选择支付方式的订单
-   ✅ 添加 `PayWayEnum.BALANCE = 1` 余额支付选项
-   ✅ 新增 `AfterSalesStatusEnum` 售后状态枚举
-   ✅ 新增 `WorkOrderTypeEnum` 工单类型枚举
-   ✅ 新增 `WorkOrderStatusEnum` 工单状态枚举
-   ✅ 新增 `RefundTypeEnum` 退款类型枚举

#### 1.2 `/server/common/models/market.py`

-   ✅ `MainOrderModel` 使用 `IntEnumField` 替代 `IntField/SmallIntField`:

    -   `terminal`: `TerminalEnum`
    -   `pay_way`: `PayWayEnum` (默认值改为 `NONE`)
    -   `pay_status`: `PayStatusEnum`
    -   `order_type`: `OrderTypeEnum`
    -   `notify_status`: `NotifyStatusEnum`

-   ✅ `SubOrderModel` 使用 `IntEnumField`:

    -   `delivery_type`: `DeliveryTypeEnum`
    -   `delivery_status`: `DeliveryStatusEnum`
    -   `status`: `AfterSalesStatusEnum`

-   ✅ `WorkOrderModel` 使用 `IntEnumField`:
    -   `type`: `WorkOrderTypeEnum`
    -   `status`: `WorkOrderStatusEnum`
    -   `return_type`: `RefundTypeEnum`

#### 1.3 `/server/common/models/commodity.py`

-   ✅ `Commodity.deliveryType` 使用 `IntEnumField(DeliveryTypeEnum)`
-   ✅ 默认值改为 `DeliveryTypeEnum.LOGISTICS`

#### 1.4 服务层更新

-   ✅ `/server/apps/api/service/order_service.py`: 使用 `PayStatusEnum`, `PayWayEnum`
-   ✅ `/server/apps/api/service/payment_service.py`: 使用 `PayStatusEnum`, `PayWayEnum`
-   ✅ `/server/apps/api/service/payNotify_service.py`: 使用 `PayStatusEnum`, `PayWayEnum`
-   ✅ `/server/apps/admin/service/finance/order_service.py`: 使用 `PayStatusEnum`, `PayWayEnum`

### 2. 前端枚举优化

#### 2.1 小程序 `/miniprogram/types/PayStatus.ts`

-   ✅ 添加 `PayWayEnum.NONE = 0` 和 `PayWayEnum.BALANCE = 1`
-   ✅ 所有枚举与后端保持一致
-   ✅ 清理未使用的图标导入

#### 2.2 小程序订单页面优化

-   ✅ `/miniprogram/src/pages/order/index.tsx`:

    -   显示付款状态和发货状态双徽章
    -   根据枚举值显示对应的颜色和文本

-   ✅ `/miniprogram/src/pages/order/detail.tsx`:
    -   订单详情页显示付款状态和发货状态
    -   使用徽章样式优化视觉效果

#### 2.3 Admin 后台 (Vue)

**已检查，枚举值与后端匹配：**

-   ✅ `/admin/src/views/shopping/commodity/index.vue`:

    -   发货方式显示: 0=无需发货, 1=自动发卡, 2=人工发货, 3=物流发货 ✓

-   ✅ `/admin/src/views/shopping/commodity/editor.vue`:

    -   发货方式选项: 0=无需发货, 1=自动发卡, 2=人工发货, 3=物流发货 ✓

-   ✅ `/admin/src/views/finance/order.vue`:
    -   订单类型: 1=充值, 2=商品, 3=会员 ✓
    -   支付状态: 0=未支付, 1=已支付, 2=已取消 ✓ (注意: 后端是 2=已退款)
    -   发货方式: 0=无需发货, 1=自动发卡, 2=人工发货, 3=物流发货 ✓
    -   发货状态: 0=待发货, 1=已发货, 2=已退货 ✓
    -   售后状态: 0=无, 1=申请售后, 2=同意退货, 3=退货成功, 4=拒绝退货 ✓

### 3. 需要注意的差异

#### ⚠️ 支付状态差异

-   **后端**: `PayStatusEnum.REFUNDED = 2` (已退款)
-   **Admin 前端**: `2: "已取消"`

**建议**: 将 Admin 前端的支付状态 2 改为"已退款"以保持一致性

## 枚举值对照表

### PayWayEnum (支付方式)

| 值  | 后端     | 小程序   | Admin  |
| --- | -------- | -------- | ------ |
| 0   | 未选择   | 未选择   | -      |
| 1   | 余额支付 | 余额支付 | -      |
| 2   | 微信     | 微信     | 微信   |
| 3   | 支付宝   | 支付宝   | 支付宝 |

### PayStatusEnum (支付状态)

| 值  | 后端   | 小程序 | Admin         |
| --- | ------ | ------ | ------------- |
| 0   | 待支付 | 待支付 | 未支付        |
| 1   | 已支付 | 已支付 | 已支付        |
| 2   | 已退款 | 已退款 | **已取消** ⚠️ |

### OrderTypeEnum (订单类型)

| 值  | 后端   | Admin    |
| --- | ------ | -------- |
| 1   | 充值   | 充值订单 |
| 2   | 商品   | 商品订单 |
| 3   | 开会员 | 购买会员 |

### DeliveryTypeEnum (发货方式)

| 值  | 后端     | 小程序   | Admin    |
| --- | -------- | -------- | -------- |
| 0   | 无需发货 | 无需发货 | 无需发货 |
| 1   | 自动发卡 | 自动发卡 | 自动发卡 |
| 2   | 人工发货 | 人工发卡 | 人工发货 |
| 3   | 物流发货 | 物流发货 | 物流发货 |

### DeliveryStatusEnum (发货状态)

| 值  | 后端   | 小程序 | Admin  |
| --- | ------ | ------ | ------ |
| 0   | 待发货 | 待发货 | 待发货 |
| 1   | 已发货 | 已发货 | 已发货 |
| 2   | 已退货 | 已退货 | 已退货 |

### AfterSalesStatusEnum (售后状态)

| 值  | 后端     | Admin    |
| --- | -------- | -------- |
| 0   | 无       | 无       |
| 1   | 申请售后 | 申请售后 |
| 2   | 同意退货 | 同意退货 |
| 3   | 退货成功 | 退货成功 |
| 4   | 拒绝退货 | 拒绝退货 |

## 优化效果

1. **类型安全**: 使用 `IntEnumField` 确保数据库值与枚举值一致
2. **可维护性**: 集中管理枚举定义，避免硬编码
3. **一致性**: 前后端枚举值保持同步
4. **可读性**: 代码中使用枚举名称而非魔法数字

## 后续建议

1. 修复 Admin 前端支付状态 2 的文本为"已退款"
2. 考虑创建统一的枚举配置文件供前端使用
3. 添加枚举值变更的数据库迁移脚本
