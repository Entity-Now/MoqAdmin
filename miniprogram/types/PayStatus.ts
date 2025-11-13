
import { Wallet, Transit, NoReceive, ToPay, Right, ShareF } from '@nutui/icons-react-taro';

export enum Pay{
  PAID_NO = 0,    // 未支付
  PAID_OK = 1,    // 已支付
  PAID_CANCEL = 2, // 已取消
}

export const PayStatusConfig = {
  [Pay.PAID_NO]: { text: '未支付', color: 'text-orange-600' },
  [Pay.PAID_OK]: { text: '已支付', color: 'text-blue-600' },
  [Pay.PAID_CANCEL]: { text: '已取消', color: 'text-red-600' },
}

// 订单状态枚举
export enum OrderStatus {
  WAITING = 0,    // 待付款
  PAID = 1,       // 已付款
  DELIVERED = 2,  // 已发货
  REFUNDED = 3,   // 已退款
  COMPLETED = 4,  // 已完成
}

// Tab 配置
export const ORDER_TABS: { title: string; value: any }[] = [
  { title: '全部', value: null },
  { title: '待付款', value: OrderStatus.WAITING },
  { title: '已付款', value: OrderStatus.PAID },
  { title: '已发货', value: OrderStatus.DELIVERED },
];

// 状态标签配置
export const STATUS_CONFIG = {
  [OrderStatus.WAITING]: { text: '待付款', color: 'text-orange-600' },
  [OrderStatus.PAID]: { text: '已付款', color: 'text-blue-600' },
  [OrderStatus.DELIVERED]: { text: '已发货', color: 'text-green-600' },
  [OrderStatus.REFUNDED]: { text: '已退款', color: 'text-red-600' },
  [OrderStatus.COMPLETED]: { text: '已完成', color: 'text-gray-600' },
};


// 订单类型配置
export const ORDER_TYPES = [
  {
    key: 'toPay',
    icon: ToPay,
    label: '待付款',
    path: '/pages/order/index?status=0',
  },
  {
    key: 'paid',
    icon: Wallet,
    label: '已付款',
    path: '/pages/order/index?status=1',
  },
  {
    key: 'shipping',
    icon: Transit,
    label: '已发货',
    path: '/pages/order/index?status=2',
  },
  {
    key: 'refund',
    icon: NoReceive,
    label: '退款/售后',
    path: '/pages/order/index?status=3',
  },
] as const;
