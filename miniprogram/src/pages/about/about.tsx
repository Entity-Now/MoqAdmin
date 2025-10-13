import React from 'react'
import { View, Text } from '@tarojs/components'
import { ConfigProvider } from '@nutui/nutui-react-taro'
import zhCN from '@nutui/nutui-react-taro/dist/locales/zh-CN'
import './about.scss'

function About() {
  // 页面数据
  const aboutData = {
    title: '关于我们',
    description: 'MoqAdmin 是一款功能强大的商城管理系统',
    version: 'v1.0.0',
    items: [
      {
        title: '关于我们',
        icon: 'user'
      },
      {
        title: '服务协议',
        icon: 'file-text'
      },
      {
        title: '隐私政策',
        icon: 'lock'
      },
      {
        title: '联系我们',
        icon: 'phone'
      },
      {
        title: '检查更新',
        icon: 'refresh-cw'
      }
    ],
    copyright: '© 2024 MoqAdmin. All rights reserved.'
  }

  // 处理列表项点击
  const handleItemClick = (title: string) => {
    console.log(`点击了: ${title}`)
    // 这里可以根据不同的标题实现不同的跳转或操作
  }

  return (
    <ConfigProvider locale={zhCN}>
      <View className="about-container">
        {/* 头部信息 */}
        <View className="about-header">
          <View className="about-logo">
            <View className="logo-icon"></View>
          </View>
          <Text className="about-title">{aboutData.title}</Text>
          <Text className="about-description">{aboutData.description}</Text>
          <Text className="about-version">{aboutData.version}</Text>
        </View>

        {/* 分割线 */}
        <View className="about-divider"></View>

        {/* 功能列表 */}
        <View className="about-list">
          {aboutData.items.map((item, index) => (
            <View 
              key={index} 
              className="about-list-item"
              onClick={() => handleItemClick(item.title)}
            >
              <View className="about-list-item-left">
                <View className={`about-list-icon icon-${item.icon}`}></View>
                <Text className="about-list-text">{item.title}</Text>
              </View>
              <View className="about-list-arrow"></View>
            </View>
          ))}
        </View>

        {/* 分割线 */}
        <View className="about-divider"></View>

        {/* 底部版权信息 */}
        <View className="about-footer">
          <Text className="about-copyright">{aboutData.copyright}</Text>
        </View>
      </View>
    </ConfigProvider>
  )
}

export default About
