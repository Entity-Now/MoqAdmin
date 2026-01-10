/**
 * 商品数据通用接口
 */
export interface GoodsItemData {
  id?: string | number;
  name?: string;
  title?: string;
  imgUrl?: string;
  main_image?: string;
  image?: string[] | string;
  price: number;
  tag?: string;
  label?: string;
  sku?: Record<string, any> | null;
  quantity?: number;
  stock?: number;
  is_selected?: number;
  commodity_id?: number;
}

/**
 * 组件 Props 接口
 */
export interface GoodsItemProps {
  item: GoodsItemData;
  type?: "topping" | "ranking" | "cart" | "order" | "recommend";
  index?: number;
  isLast?: boolean;
  selected?: boolean;
  onClick?: (item: GoodsItemData) => void;
  onSelect?: (id: string | number, checked: boolean) => void;
  onQuantityChange?: (item: GoodsItemData, quantity: number) => void;
  onLongPress?: (id: string | number) => void;
  onShowMore?: (id: string | number) => void;
  updating?: Record<string | number, boolean>;
  disabledQuantity?: boolean;
}

/**
 * 商品列表组件 Props 接口
 */
export interface GoodsListProps {
  type: "topping" | "ranking" | "cart" | "order" | "recommend";
  data: GoodsItemData[];
  onItemClick?: (item: GoodsItemData) => void;
  onItemSelect?: (id: string | number, checked: boolean) => void;
  onQuantityChange?: (item: GoodsItemData, quantity: number) => void;
  onLongPress?: (id: string | number) => void;
  onShowMore?: (id: string | number) => void;
  updating?: Record<string | number, boolean>;
  disabledQuantity?: boolean;
  // 额外：section 标题 props
  title?: string;
  subtitle?: string;
  titleIcon?: string;
  bgClass?: string;
  headerClass?: string;
  listClass?: string;
}
