// pages/privacy-collect/index.tsx
import { View, Text, ScrollView } from '@tarojs/components';
import { Cell } from '@taroify/core';
import TopBar from '../../components/TopBar';
import './index.scss';

const PrivacyCollect = () => {
  return (
    <View className="privacy-collect-page min-h-screen bg-white">
      <TopBar title='用户隐私保护指引' showBack />

      <ScrollView scrollY className="p-2 pb-8">
        {/* 标题 */}
        <View className="mb-4">
          <Text className="text-xl font-bold text-gray-900 block mb-2">
            莫欺客 小程序隐私保护指引
          </Text>
          <Text className="text-sm text-gray-600 leading-relaxed">
            本指引是莫欺客小程序开发者 福州市鼓楼区莫欺客电子商务商行(个体工商户)（以下简称"开发者"）为处理你的个人信息而制定。
          </Text>
        </View>

        {/* 开发者处理的信息 */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 block mb-3">
            开发者处理的信息
          </Text>
          <Text className="text-sm text-gray-600 leading-relaxed mb-4">
            根据法律规定，开发者仅处理实现小程序功能所必要的信息。
          </Text>

          <Cell.Group>
            {/* 微信昵称、头像 */}
            <Cell>
              <View>
                <View className="flex items-center space-x-2 mb-2">
                  <Text className="font-medium text-gray-900">微信昵称、头像</Text>
                  <View className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                    需明示同意
                  </View>
                </View>
                <Text className="text-sm text-gray-600 leading-relaxed">
                  用于小程序内用户身份标识（如个人中心展示、互动评论署名等），帮助你建立个性化使用账户，提升使用体验。
                </Text>
              </View>
            </Cell>

            {/* 地址 */}
            <Cell>
              <View>
                <View className="flex items-center space-x-2 mb-2">
                  <Text className="font-medium text-gray-900">地址</Text>
                  <View className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                    必要
                  </View>
                </View>
                <Text className="text-sm text-gray-600 leading-relaxed">
                  用于实现商品/服务配送（如电商类小程序发货、线下服务上门地址确认）、本地生活服务匹配（如周边商家推荐、同城服务对接），仅在你发起配送或服务需求时使用。
                </Text>
              </View>
            </Cell>

            {/* 手机号 */}
            <Cell>
              <View>
                <View className="flex items-center space-x-2 mb-2">
                  <Text className="font-medium text-gray-900">手机号</Text>
                  <View className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                    需明示同意
                  </View>
                </View>
                <Text className="text-sm text-gray-600 leading-relaxed">
                  用于用户账户注册登录验证（如短信验证码登录）、重要服务通知（如订单状态变更、服务预约提醒）、紧急事务联系（如售后问题沟通、安全验证确认），不用于未经授权的营销推广。
                </Text>
              </View>
            </Cell>

            {/* 订单信息 */}
            <Cell>
              <View>
                <View className="flex items-center space-x-2 mb-2">
                  <Text className="font-medium text-gray-900">订单信息</Text>
                  <View className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                    必要
                  </View>
                </View>
                <Text className="text-sm text-gray-600 leading-relaxed">
                  用于订单履约管理（如商品发货跟踪、服务安排确认）、交易记录留存（供你查询历史订单）、售后问题处理（如退款申请审核、订单纠纷解决），以及符合法律法规要求的交易数据存档。
                </Text>
              </View>
            </Cell>

            {/* 邮箱 */}
            <Cell>
              <View>
                <View className="flex items-center space-x-2 mb-2">
                  <Text className="font-medium text-gray-900">邮箱</Text>
                  <View className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                    可选
                  </View>
                </View>
                <Text className="text-sm text-gray-600 leading-relaxed">
                  用于账户安全验证（如密码重置通知、异常登录提醒）、服务信息推送（如订阅内容送达、活动通知）、电子凭证发送（如订单发票、服务协议文档），你可在账户设置中自主关闭非必要邮件推送。
                </Text>
              </View>
            </Cell>

            {/* 发票信息 */}
            <Cell>
              <View>
                <View className="flex items-center space-x-2 mb-2">
                  <Text className="font-medium text-gray-900">发票信息</Text>
                  <View className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                    可选
                  </View>
                </View>
                <Text className="text-sm text-gray-600 leading-relaxed">
                  仅用于为你开具符合国家税务规定的正规发票（如订单消费发票、服务费用发票），确保发票信息准确无误，满足你的报销或记账需求。
                </Text>
              </View>
            </Cell>

            {/* 位置信息 */}
            <Cell>
              <View>
                <View className="flex items-center space-x-2 mb-2">
                  <Text className="font-medium text-gray-900">位置信息</Text>
                  <View className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                    可选
                  </View>
                </View>
                <Text className="text-sm text-gray-600 leading-relaxed">
                  用于本地服务匹配（如周边商家推荐、同城活动筛选、附近用户互动）、地理位置相关功能实现（如地图导航引导、区域限制服务验证），你可在小程序使用过程中随时关闭位置授权。
                </Text>
              </View>
            </Cell>
          </Cell.Group>
        </View>

        {/* 未成年人保护 */}
        <View className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Text className="text-base font-semibold text-gray-900 block mb-2">
            未成年人保护
          </Text>
          <Text className="text-sm text-gray-700 leading-relaxed">
            根据相关法律法规的规定，若你是14周岁以下的未成年人，你需要和你的监护人共同仔细阅读本指引，并在征得监护人明示同意后继续使用小程序服务。开发者将根据相关法律法规的规定及本指引内容，处理经监护人同意而收集的未成年人用户信息，并通过【本指引你的权益部分】披露的内容保障未成年人在个人信息处理活动中的各项权利。
          </Text>
        </View>

        {/* 你的权益 */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 block mb-3">
            你的权益
          </Text>
          <Text className="text-sm text-gray-600 leading-relaxed mb-3">
            关于你的个人信息，你可以通过以下方式与开发者联系，行使查阅、复制、更正、删除等法定权利。
          </Text>
          <Text className="text-sm text-gray-600 leading-relaxed mb-3">
            若你在小程序中注册了账号，你可以通过以下方式与开发者联系，申请注销你在小程序中使用的账号。在受理你的申请后，开发者承诺在十五个工作日内完成核查和处理，并按照法律法规要求处理你的相关信息。
          </Text>
          <View className="p-3 bg-blue-50 rounded-lg">
            <Text className="text-sm text-blue-800 font-medium">
              联系邮箱：moqike@moqistar.com
            </Text>
          </View>
        </View>

        {/* 信息存储 */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 block mb-3">
            开发者对信息的存储
          </Text>
          <Text className="text-sm text-gray-600 leading-relaxed">
            开发者承诺，除法律法规另有规定外，开发者对你的信息的保存期限应当为实现处理目的所必要的最短时间。
          </Text>
        </View>

        {/* 信息使用规则 */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 block mb-3">
            信息的使用规则
          </Text>
          <Text className="text-sm text-gray-600 leading-relaxed mb-2">
            开发者将会在本指引所明示的用途内使用收集的信息。
          </Text>
          <Text className="text-sm text-gray-600 leading-relaxed">
            如开发者使用你的信息超出本指引目的或合理范围，开发者必须在变更使用目的或范围前，再次以弹窗提示方式告知并征得你的明示同意。
          </Text>
        </View>

        {/* 信息对外提供 */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 block mb-3">
            信息对外提供
          </Text>
          <Text className="text-sm text-gray-600 leading-relaxed mb-2">
            开发者承诺，不会主动共享或转让你的信息至任何第三方，如存在确需共享或转让时，开发者应当直接征得或确认第三方征得你的单独同意。
          </Text>
          <Text className="text-sm text-gray-600 leading-relaxed">
            开发者承诺，不会对外公开披露你的信息，如必须公开披露时，开发者应当向你告知公开披露的目的、披露信息的类型及可能涉及的信息，并征得你的单独同意。
          </Text>
        </View>

        {/* 投诉建议 */}
        <View className="mb-6 p-4 bg-gray-50 rounded-lg">
          <Text className="text-sm text-gray-700 leading-relaxed mb-3">
            你认为开发者未遵守上述约定，或有其他的投诉建议、或未成年人个人信息保护相关问题，可通过以下方式与开发者联系；或者向微信进行投诉。
          </Text>
          <Text className="text-sm text-gray-900 font-medium">
            邮箱：moqike@moqistar.com
          </Text>
        </View>

        {/* 更新日期 */}
        <View className="mt-6 text-center border-t pt-4">
          <Text className="text-xs text-gray-400 block mb-1">
            更新日期：2025-11-22
          </Text>
          <Text className="text-xs text-gray-400">
            生效日期：2025-11-22
          </Text>
        </View>

        {/* 法律声明 */}
        <View className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Text className="text-xs text-blue-800 leading-relaxed">
            本指引符合《中华人民共和国个人信息保护法》及相关法规政策要求。开发者将严格遵守本指引的各项承诺，保护你的个人信息安全。
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyCollect;