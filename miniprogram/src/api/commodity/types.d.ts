/**
 * 商品相关类型定义
 */

/**
 * 商品分类类型
 */
export interface CommodityCategory {
  id: number;
  name: string;
  pid: number;
  icon?: string;
  image?: string;
  sort: number;
  level: number;
  isShow: number;
  children?: CommodityCategory[];
}

/**
 * 商品列表项类型
 */
export interface CommodityItem {
  id: number;
  name: string;
  categoryId: number;
  price: string;
  originalPrice: string;
  sales: number;
  mainImage: string;
  images: string[];
  isHot: number;
  isNew: number;
  isRecommend: number;
  status: number;
}

/**
 * 商品列表响应类型
 */
export interface CommodityListsResponse {
  list: CommodityItem[];
  total: number;
  page: number;
  size: number;
}

/**
 * 商品规格类型
 */
export interface CommoditySpec {
  id: number;
  name: string;
  values: string[];
}

/**
 * 商品SKU类型
 */
export interface CommoditySku {
  id: number;
  price: string;
  originalPrice: string;
  stock: number;
  specs: { [key: string]: string };
  specIds: number[];
  specText: string;
}

/**
 * 商品详情类型
 */
export interface CommodityDetailVo {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  price: string;
  originalPrice: string;
  sales: number;
  mainImage: string;
  images: string[];
  description: string;
  isHot: number;
  isNew: number;
  isRecommend: number;
  isCollect: number;
  specs: CommoditySpec[];
  skus: CommoditySku[];
  attributes: { name: string; value: string }[];
  content: string;
}

/**
 * 商品详情响应类型
 */
export interface CommodityDetailResponse {
  commodity: CommodityDetailVo;
}

/**
 * 商品页面数据类型
 */
export interface CommodityPagesResponse {
  banners: Array<{
    id: number;
    title: string;
    image: string;
    link: string;
  }>;
  categories: CommodityCategory[];
  recommends: CommodityItem[];
  news: CommodityItem[];
  hots: CommodityItem[];
}