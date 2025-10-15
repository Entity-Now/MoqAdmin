/** ------ [分类] ------ */
export interface Categories {
  id: number;
  name: string;
}

/** ------ [文章列表] ------ */
export interface ArticleListsResponse {
  id: number;
  category: string;
  image: string;
  title: string;
  intro: string;
  browse: number;
  create_time: string;
  update_time: string;
}

/** ------[文章详情] ------ */
export interface ArticleDetailResponse {
  id: number;
  category: string;
  image: string;
  title: string;
  intro: string;
  content: string;
  browse: number;
  is_collect: number;
  create_time: string;
  update_time: string;
  prev: _ArticleDetailNext;
  next: _ArticleDetailNext;
}

export interface _ArticleDetailNext {
  id: number;
  title: string;
}

/** ------ [文章页面] ------ */
export interface ArticlePagesResponse {
  adv: _ArticlePagesAdv[];
  topping: ArticleListsResponse[];
  ranking: ArticleListsResponse[];
}

export interface _ArticlePagesAdv {
  title: string;
  image: string;
  target: string;
  url: string;
}

/** ------ [轮播海报] ------ */
export interface _AppHomingAdv {
  id: number;
  title: string;
  image: string;
  target: string;
  url: string;
}