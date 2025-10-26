// 商品分类接口
export interface CommodityCategory {
  id: number;
  name: string;
  parent_id: number | null;
  children: CommodityCategory[];
}

// 商品列表项接口
export interface CommodityListsResponse {
  id: number;
  category: string;
  image: string;
  title: string;
  intro: string;
  price: number;
  stock: number;
  sales: number;
  browse: number;
  collect: number;
  is_recommend: number;
  is_topping: number;
  create_time: string;
  update_time: string;
}

// 商品详情接口
export interface CommodityDetailResponse {
  id: number;
  category: string;
  image: string;
  title: string;
  intro: string;
  content: string;
  price: number;
  fee: number | null;
  stock: number;
  sales: number;
  deliveryType: number;
  browse: number;
  collect: number;
  is_collect: number;
  is_recommend: number;
  is_topping: number;
  config: Record<string, any> | null;
  sku: Record<string, any> | null;
  create_time: string;
  update_time: string;
}

// 商品页面数据接口
export interface CommodityPagesResponse {
  adv: _AppHomingAdv[];
  topping: CommodityListsResponse[];
  ranking: CommodityListsResponse[];
}

// 轮播广告接口
export interface _AppHomingAdv {
  title: string;
  image: string;
  target: string;
  url: string;
}