export default defineAppConfig({
  pages: [
  'pages/index/index', "pages/category/category", "pages/shoppingCart/shoppingCart", "pages/about/about"],

  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#6366f1',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: './images/home.png',
        selectedIconPath: './images/home-s.png'
      },
      {
        pagePath: 'pages/category/category',
        text: '分类',
        iconPath: './images/categories.png',
        selectedIconPath: './images/categories-s.png'
      },
      {
        pagePath: 'pages/shoppingCart/shoppingCart',
        text: '购物车',
        iconPath: './images/shoppingCart.png',
        selectedIconPath: './images/shoppingCart-s.png'
      },
      {
        pagePath: 'pages/about/about',
        text: '关于',
        iconPath: './images/mine.png',
        selectedIconPath: './images/mine-s.png'
      }
    ]
  }
});