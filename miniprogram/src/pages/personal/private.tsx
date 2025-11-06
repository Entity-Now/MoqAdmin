// pages/privacy-collect/index.tsx
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Cell, CellGroup } from '@nutui/nutui-react-taro';
import TopBar from '../../components/TopBar';
import './index.scss';

const PrivacyCollect = () => {
  const collectItems = [
    {
      title: '1. 手机号',
      desc: '用于账号登录、身份验证、订单通知（如物流状态、发货提醒）、安全风控。',
      required: true,
    },
    {
      title: '2. 用户头像',
      desc: '用于个人资料展示，提升社交识别度与个性化体验。',
      required: false,
    },
    {
      title: '3. 剪切板内容（仅当您复制地址时）',
      desc: '当检测到您复制了可能为收货地址的文本时，会提示是否读取剪切板内容，用于自动填充地址表单，提升填写效率。',
      required: false,
    },
    {
      title: '4. 收货地址',
      desc: '用于商品邮寄配送，确保您购买的商品准确送达。包含：收件人姓名、联系电话、详细地址（省/市/区/街道/门牌号）。',
      required: true,
    },
    {
      title: '5. 位置信息（可选）',
      desc: '用于推荐附近门店、优化配送路径、提供基于位置的优惠活动。',
      required: false,
    },
    {
      title: '6. 推送通知权限',
      desc: '用于发送订单状态更新（如支付成功、已发货）、促销活动、优惠券提醒等消息。',
      required: false,
    },
    {
      title: '7. 相机与相册权限',
      desc: '用于上传头像、拍摄收货地址证明、扫码登录或支付。',
      required: false,
    },
  ];

  return (
    <View className="privacy-collect-page min-h-screen bg-white">
      <TopBar title='信息收集清单' showBack>

      </TopBar>

      <ScrollView scrollY className="px-4 pt-4 pb-8">
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <Text className="text-sm text-blue-800">
            我们严格遵循「最小必要」原则，仅收集提供服务所必需的信息。您可随时在「设置」中管理权限。
          </Text>
        </View>

        <CellGroup>
          {collectItems.map((item, index) => (
            <Cell
              key={index}
              className="py-3"
              title={
                <View>
                  <View className="flex items-center space-x-2">
                    <Text className="font-medium text-gray-900">{item.title}</Text>
                    {item.required && (
                      <View className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                        必要
                      </View>
                    )}
                  </View>
                  <Text className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {item.desc}
                  </Text>
                </View>
              }
            />
          ))}
        </CellGroup>

        <View className="mt-6 p-4 bg-gray-50 rounded-lg">
          <Text className="text-xs text-gray-500 leading-relaxed">
            <Text className="font-medium">隐私承诺：</Text>
            所有信息仅用于提供明确服务，不用于广告精准推送，不对外出售。符合《个人信息保护法》及相关法规要求。
          </Text>
        </View>

        <View className="mt-4 text-center">
          <Text className="text-xs text-gray-400">
            更新时间：2025年11月6日
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyCollect;