// TopBar.tsx
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo } from 'react'
import { Search, ArrowLeft } from '@nutui/icons-react-taro'

interface TopBarProps {
  /** 页面标题（纯文字） */
  title?: string
  /** 是否显示搜索入口 */
  showSearch?: boolean
  /** 是否显示返回按钮（默认不显示） */
  showBack?: boolean
  /** 自定义中间内容（优先级最高） */
  children?: React.ReactNode
  /** 自定义图标 */
  icon?: React.ReactNode
  /** 自定义类名 */
  className?: string
}

/** 计算胶囊安全高度（移动端）与 PC 端固定高度 */
function useHeaderHeight() {
  return useMemo(() => {
    const windowInfo = Taro.getWindowInfo?.() ?? { statusBarHeight: 0 }
    /** 胶囊按钮位置信息 */
    const menu = Taro.getMenuButtonBoundingClientRect?.() ?? { left: 0, top: 0, height: 32 }
    const device = Taro.getDeviceInfo?.() ?? { platform: '' }
    const isPC = ['mac', 'windows'].includes(device.platform)
    const top = isPC ? 25 : menu.top
    const right = Math.max(windowInfo.screenWidth - menu.left - menu.width, 0)
    const height = (Math.max(menu.height || 0, 50)) + (windowInfo?.statusBarHeight || 0);
    
    return { top, height, total: top + height, right }
  }, [])
}

export default function TopBar({
  title,
  showSearch = false,
  showBack = false,
  children,
  icon = null,
  className = '',
}: TopBarProps) {
  const { top, height, right } = useHeaderHeight()

  const goSearch = () => Taro.navigateTo({ url: '/pages/search/index' })
  const goBack = () => Taro.navigateBack({ delta: 1 })

  return (
    <View
      className={`
        sticky top-0 z-50 bg-cotton-candy shadow-md
        flex items-center justify-between
        px-4
        ${className}
      `.trim()}
      style={{ paddingTop: `${top}px`, height: `${height}px` }}
    >
      {/* 左侧：返回 / 搜索（互斥） */}
      <View className="flex-shrink-0">
        {showBack ? (
          <View
            className="flex h-9 w-9 items-center justify-center rounded-full"
            onClick={goBack}
          >
            <ArrowLeft size={20} color='white'/>
          </View>
        ) : showSearch ? (
          <View
            className="flex h-9 items-center gap-2 rounded-full  px-3 text-sm !text-white active:bg-white/80"
            onClick={goSearch}
          >
            <Search size={18} color='white'/>
            <span className="hidden sm:inline">搜索</span>
          </View>
        ) : null}
      </View>

      {/* 中间：标题 / 自定义内容 */}
      <View className="flex-1 overflow-hidden px-2 text-center">
        {children ? (
          children
        ) : title ? (
          <View className="truncate text-md text-white">{title}</View>
        ) : null}
      </View>

      {/* 右侧占位（保持对称） */}
      <View className={`mr-[${right}px]`}>
        {icon ? (
          icon
        ) : null}
      </View>
    </View>
  )
}