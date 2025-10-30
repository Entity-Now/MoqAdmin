import React, { useEffect } from 'react'
import { useDidShow, useDidHide } from '@tarojs/taro'
import { View } from '@tarojs/components'
// 全局样式
if (process.env.TARO_ENV != 'h5') {
  import('@tarojs/taro/html5.css')
}
import './app.scss'
// NutUI 
import '@nutui/nutui-biz/dist/style.css' 
import '@nutui/nutui-react-taro/dist/style.css'

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {})

  // 对应 onShow
  useDidShow(() => {})

  // 对应 onHide
  useDidHide(() => {})

  return props.children
}

export default App
