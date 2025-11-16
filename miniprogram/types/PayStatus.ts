
import { Wallet, Transit, NoReceive, ToPay, Right, ShareF } from '@nutui/icons-react-taro';



// 来源平台枚举
export enum TerminalEnum {
  MNP = 1,      // 小程序
  OA = 2,       // 公众号
  H5 = 3,       // H5
  PC = 4,       // PC
  ANDROID = 5,  // 安卓
  IOS = 6       // 苹果
}

export const TerminalTypeMap: Record<TerminalEnum, string> = {
  [TerminalEnum.MNP]: "小程序",
  [TerminalEnum.OA]: "公众号",
  [TerminalEnum.H5]: "H5",
  [TerminalEnum.PC]: "PC",
  [TerminalEnum.ANDROID]: "安卓",
  [TerminalEnum.IOS]: "苹果"
};

// 支付方式枚举
export enum PayWayEnum {
  WECHAT = 2,   // 微信
  ALIPAY = 3    // 支付宝
}

export const PayWayMap: Record<PayWayEnum, string> = {
  [PayWayEnum.WECHAT]: "微信",
  [PayWayEnum.ALIPAY]: "支付宝"
};

// 支付状态枚举
export enum PayStatusEnum {
  WAITING = 0,  // 待支付
  PAID = 1,     // 已支付
  REFUNDED = 2  // 已退款
}

export const PayStatusMap: Record<PayStatusEnum, string> = {
  [PayStatusEnum.WAITING]: "待支付",
  [PayStatusEnum.PAID]: "已支付",
  [PayStatusEnum.REFUNDED]: "已退款"
};
export const PayStatusStyleMap: Record<PayStatusEnum, { text: string; color: string; }> = {
  [PayStatusEnum.WAITING]: {
    text: "待支付",
    color: "bg-orange-500 text-white"
  },
  [PayStatusEnum.PAID]: {
    text: "已支付",
    color: "bg-green-500 text-white"
  },
  [PayStatusEnum.REFUNDED]: {
    text: "已退款",
    color: "bg-red-500 text-white"
  }
};

// 订单类型枚举
export enum OrderTypeEnum {
  RECHARGE = 1,   // 充值
  SHOPPING = 2,   // 商品
  MEMBERSHIP = 3  // 开会员
}

export const OrderTypeMap: Record<OrderTypeEnum, string> = {
  [OrderTypeEnum.RECHARGE]: "充值",
  [OrderTypeEnum.SHOPPING]: "商品",  // 修正原Python中的PRODUCT拼写错误
  [OrderTypeEnum.MEMBERSHIP]: "开会员"
};

// 发货方式枚举
export enum DeliveryTypeEnum {
  NO_NEED = 0,    // 无需发货
  AUTO_CARD = 1,  // 自动发卡
  MANUAL = 2,     // 人工发货
  LOGISTICS = 3   // 物流发货
}

export const DeliveryTypeMap: Record<DeliveryTypeEnum, string> = {
  [DeliveryTypeEnum.NO_NEED]: "无需发货",
  [DeliveryTypeEnum.AUTO_CARD]: "自动发卡",
  [DeliveryTypeEnum.MANUAL]: "人工发卡",
  [DeliveryTypeEnum.LOGISTICS]: "物流发货"
};

// 发货状态枚举（修复原Python中的不一致）
export enum DeliveryStatusEnum {
  WAITING = 0,    // 待发货
  DELIVERED = 1,  // 已发货
  REFUNDED = 2    // 已退款（补充原Python中缺失的枚举值）
}

export const DeliveryStatusMap: Record<DeliveryStatusEnum, string> = {
  [DeliveryStatusEnum.WAITING]: "待付款",
  [DeliveryStatusEnum.DELIVERED]: "已发货",
  [DeliveryStatusEnum.REFUNDED]: "已退货"
};

// 通知状态枚举
export enum NotifyStatusEnum {
  WAITING = 0,  // 未通知
  SUCCESS = 1,  // 成功
  FAILED = 2    // 失败
}

export const NotifyStatusMap: Record<NotifyStatusEnum, string> = {
  [NotifyStatusEnum.WAITING]: "未通知",
  [NotifyStatusEnum.SUCCESS]: "成功",
  [NotifyStatusEnum.FAILED]: "失败"
};

// 通用获取描述的函数（可选）
export function getEnumMsg<T extends number>(enumMap: Record<T, string>, code: T | number): string {
  return enumMap[code as T] || "";
}

// 订单类型配置
export const ORDER_TYPES = [
  {
    key: 'toPay',
    icon: ToPay,
    label: '待付款',
    path: `/pages/order/index?status=${PayStatusEnum.WAITING}&type=payStatus`,
  },
  {
    key: 'paid',
    icon: Wallet,
    label: '已付款',
    path: `/pages/order/index?status=${PayStatusEnum.PAID}&type=payStatus`,
  },
  {
    key: 'shipping',
    icon: Transit,
    label: '已发货',
    path: `/pages/order/index?status=${DeliveryStatusEnum.DELIVERED}&type=deliveryStatus`,
  },
  {
    key: 'refund',
    icon: NoReceive,
    label: '退款/售后',
    path: `/pages/order/index?status=${DeliveryStatusEnum.REFUNDED}&type=deliveryStatus`,
  },
] as const;


// Tab 配置
export const ORDER_TABS: { title: string; type: string, value: any }[] = [
  { title: '全部', type: 'payStatus', value: null },
  { title: '待付款', type: 'payStatus', value: PayStatusEnum.WAITING },
  { title: '已付款', type: 'payStatus', value: PayStatusEnum.PAID },
  { title: '已发货', type: 'deliveryStatus', value: DeliveryStatusEnum.DELIVERED },
  { title: '已退货', type: 'deliveryStatus', value: DeliveryStatusEnum.REFUNDED },
];