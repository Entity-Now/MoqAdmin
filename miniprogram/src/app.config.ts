export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/category/index",
    "pages/shoppingCart/index",
    "pages/about/index",
    "pages/search/index",
    "pages/product/index",
    "pages/login/index",
    "pages/order/index",
    "pages/personal/index",
    "pages/personal/private",
    "pages/payment/index",
    "pages/order/detail",
    "pages/personal/address",
  ],

  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#666",
    selectedColor: "#6366f1",
    backgroundColor: "#ffffff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "./images/home.png",
        selectedIconPath: "./images/home-s.png",
      },
      {
        pagePath: "pages/category/index",
        text: "分类",
        iconPath: "./images/categories.png",
        selectedIconPath: "./images/categories-s.png",
      },
      {
        pagePath: "pages/shoppingCart/index",
        text: "购物车",
        iconPath: "./images/shoppingCart.png",
        selectedIconPath: "./images/shoppingCart-s.png",
      },
      {
        pagePath: "pages/about/index",
        text: "关于",
        iconPath: "./images/mine.png",
        selectedIconPath: "./images/mine-s.png",
      },
    ],
  },
});
