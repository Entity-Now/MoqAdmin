export interface PagingResult<T> {
  current_page: number; // 当前页码
  last_page: number; // 最后页码
  per_page: number; // 每页数据
  total: number; // 数据总量
  extend: T[]; // 扩展信息
  lists: T[]; // 分页数据
}   
