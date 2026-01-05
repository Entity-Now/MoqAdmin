import React from 'react';
import { View, Text } from '@tarojs/components';
import { Checkbox, Button } from '@taroify/core';

// SettleBar Props 接口
interface SettleBarProps {
  total: string; // 总价字符串，如 '99.00'
  settleCount: number; // 选中数量
  settleButtonText?: string; // 结算按钮文本，默认 '结算'
  disabled?: boolean; // 按钮禁用
  onClickButton: () => void; // 结算点击
  isCheckedAll: boolean; // 全选状态
  onSelectAll: (checked: boolean) => void; // 全选切换
  className?: string; // 额外类名
}

const SettleBar: React.FC<SettleBarProps> = ({
  total,
  settleCount,
  settleButtonText = '结算',
  disabled = false,
  onClickButton,
  isCheckedAll,
  onSelectAll,
  className = '',
}) => {
  return (
    <View className={`settle-bar fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between z-10 ${className}`}>
      {/* 全选部分 */}
      <View className="flex items-center space-x-2">
        <Checkbox
          checked={isCheckedAll}
          onChange={onSelectAll}
          className="text-sm"
        />
        <Text className="text-sm text-gray-600">
          全选 ({settleCount} 件)
        </Text>
      </View>

      {/* 总价 */}
      <View className="flex items-center space-x-1">
        <Text className="text-sm text-gray-600">合计:</Text>
        <View className="text-red-500 font-bold text-base">
          <Text className="text-xs">¥</Text>
          <Text>{parseFloat(total).toFixed(2)}</Text>
        </View>
      </View>

      {/* 结算按钮 */}
      <Button
        color="primary"
        size="medium"
        disabled={disabled || settleCount === 0}
        onClick={onClickButton}
        className="min-w-[80px] h-10 rounded-lg"
      >
        {settleButtonText}
      </Button>
    </View>
  );
};

export default SettleBar;
