import { GoodsItemData } from "./types";

/**
 * 获取商品图片 URL
 */
export const getImageUrl = (item: GoodsItemData): string => {
  const url = item.imgUrl || item.main_image || item.image;
  if (Array.isArray(url)) return url[0] || "";
  return typeof url === "string" ? url : "";
};

/**
 * 格式化价格
 */
export const formatPrice = (price: number | string): string => {
  const p = typeof price === "string" ? parseFloat(price) : price;
  return isNaN(p) ? "0.00" : p.toFixed(2);
};
