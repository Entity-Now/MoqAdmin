import React from 'react';
import { View, Image, Text } from '@tarojs/components';

// 数据项接口（基于您提供的映射）
interface QuickEnterItem {
  displayName: string;
  imageUrl: string;
}

// 组件 Props 接口
interface QuickEnterProps {
  columns: number; // 列数，默认 4
  data: QuickEnterItem[]; // 数据数组
  className?: string; // 额外类名，用于自定义样式
}

// 快速入口网格组件
const QuickEnter: React.FC<QuickEnterProps> = ({
  columns = 4,
  data = [],
  className = '',
}) => {
  if (!data || data.length === 0) {
    return null; // 空数据不渲染
  }

  return (
    <View className={`quick-enter ${className} rounded-lg p-2 shadow-sm`}>
      <View  className="gap-4" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {data.map((item, index) => (
          <View key={index}>
            <View className="quick-item flex flex-col items-center justify-center p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
              {/* 图片：固定高度，圆角，aspectFill 模式 */}
              <Image
                src={item.imageUrl}
                mode="aspectFill"
                className="w-full h-16 rounded-lg mb-2 object-cover"
                lazyLoad
                // 可选：图片加载失败占位符
                onError={(e) => {
                  (e.currentTarget as any).src = 'https://placeholder.com/64x64?text=Icon'; // 替换为您的占位图
                }}
              />
              {/* 文本：居中、单行省略、字体调整 */}
              <Text className="text-xs text-center text-gray-700 font-medium line-clamp-1 px-1">
                {item.displayName}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default QuickEnter