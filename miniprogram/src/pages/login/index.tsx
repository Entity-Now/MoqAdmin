import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Button, Input, Cell, CellGroup, Radio } from '@nutui/nutui-react-taro';
import Taro from '@tarojs/taro';
import useUserStore from '../../store/useUser'
import './index.scss'; // 假设 Tailwind CSS 已通过 PostCSS 配置在 Taro 项目中

const Login = () => {
  const router = Taro.getCurrentInstance().router;  
  const redirect = router?.params?.redirect;

  const userStore = useUserStore();
  const [activeTab, setActiveTab] = useState<any>('wechat'); // 'account', 'phone', 'wechat'

  const [countdown, setCountdown] = useState(0);
  
  const redirectTo = () => {
    if(!redirect){
      Taro.navigateBack({ delta: 2 })
      return;
    }
    const url = decodeURIComponent(redirect);
    Taro.navigateTo({ url: url }).catch(()=>{
      Taro.switchTab({
        url: url,
      }).catch(()=>{
        Taro.switchTab({
          url: '/pages/index/index',
        });
      });
    });
  }
  const handleInputChange = (key, value) => {
    userStore.setLoginInfo(key, value);
  };

  const handleSendCode = () => {
    if (!userStore.loginInfo.phoneEmail) {  
      Taro.showToast({ title: '请输入手机号或邮箱', icon: 'none' });
      return;
    }
    // 模拟发送验证码逻辑
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogin = () => {
    // 模拟登录逻辑，根据 activeTab 处理
    if (activeTab === 'account') {
      if (!userStore.loginInfo.phoneEmail || !userStore.loginInfo.password) {
        Taro.showToast({ title: '请输入完整信息', icon: 'none' });
        return;
      }
      // TODO: 账户密码登录 API 调用
      userStore.accountLogin(userStore.loginInfo.phoneEmail, userStore.loginInfo.password).then(res => {
        if (res) {
          Taro.showToast({ title: '账户登录成功', icon: 'success' });
          // 跳转用户页面
          redirectTo();
        } else {
          Taro.showToast({ title: '账户登录失败', icon: 'none' });
        }
      })
    } else if (activeTab === 'phone') {
      if (!userStore.loginInfo.phoneEmail || !userStore.loginInfo.code) {
        Taro.showToast({ title: '请输入完整信息', icon: 'none' });
        return;
      }
      // TODO: 验证码登录 API 调用
      userStore.mobileLogin(userStore.loginInfo.phoneEmail, userStore.loginInfo.code).then(res => {
        if (res) {
          Taro.showToast({ title: '验证码登录成功', icon: 'success' });
          // 跳转用户页面
          redirectTo();
        } else {
          Taro.showToast({ title: '验证码登录失败', icon: 'none' });
        }
      })
    } else if (activeTab === 'wechat') {
      // TODO: 微信登录 API 调用
      // userStore.wechatLogin().then(res => {
      //   if (res) {
      //     Taro.showToast({ title: '微信登录成功', icon: 'success' });
      //   } else {
      //     Taro.showToast({ title: '微信登录失败', icon: 'none' });
      //   }
      // })
    }
  };

  const handleWechatLogin = () => {
    // 微信小程序一键登录
    Taro.login({
      success: res => {
        // TODO: 发送 code 到后端换取 openid 等
        console.log('微信登录 code:', res.code);
      }
    });
  };

  return (
    <View className="min-h-screen flex items-start justify-center px-4 py-8 bg-gradient-to-br from-sakura-100 via-lavender-100 to-mint-100">
      {/* 背景渐变容器 */}
      <View className="w-full max-w-md">
        {/* Logo 或标题 */}
        <View className="text-center mb-8">
          <Text className="text-4xl font-bold text-sakura-600 mb-2">莫欺客</Text>
          <Text className="text-cloud-600 text-sm">欢迎登录</Text>
        </View>

        {/* 登录方式切换 */}
        <Cell>
          <Radio.Group defaultValue="wechat" direction="horizontal"
            onChange={setActiveTab}>
            <Radio shape="button" value="wechat">
              微信登录
            </Radio>
            <Radio shape="button" value="account">
              账户密码
            </Radio>
            <Radio shape="button" value="phone">
              手机号/邮箱
            </Radio>
          </Radio.Group>
        </Cell>


        {/* 登录表单 */}
        <View className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl space-y-4">
          {activeTab === 'account' && (
            <View className="space-y-4">
              <CellGroup>
                <Cell>
                  <Input
                    className='!bg-gray-100'
                    placeholder="手机号或邮箱"
                    value={userStore.loginInfo.phoneEmail}
                    onChange={(e) => handleInputChange('phoneEmail', e)}
                  />
                </Cell>
                <Cell>
                  <Input
                    className='!bg-gray-100'
                    type="password"
                    placeholder="密码"
                    value={userStore.loginInfo.password}
                    onChange={(e) => handleInputChange('password', e)}
                  />
                </Cell>
              </CellGroup>
              <Button
                type="primary"
                block
                className="bg-sakura-500 hover:bg-sakura-600 text-white py-3 rounded-xl font-semibold"
                onClick={handleLogin}
              >
                登录
              </Button>
            </View>
          )}

          {activeTab === 'phone' && (
            <View className="space-y-4">
              <CellGroup>
                <Cell>
                  <Input
                    className='!bg-gray-100'
                    placeholder="手机号或邮箱"
                    value={userStore.loginInfo.phoneEmail}
                    onChange={(e) => handleInputChange('phoneEmail', e)}
                  />
                </Cell>
                <Cell>
                  <View className='w-full flex flex-row items-center'>
                    <Input
                      className="!bg-gray-100"
                      placeholder="验证码"
                      value={userStore.loginInfo.code}
                      onChange={(e) => handleInputChange('code', e)}
                    />
                    <Button
                      size="small"
                      className={`px-4 py-2 rounded-lg font-semibold ${countdown > 0
                          ? 'bg-cloud-300 text-cloud-500 cursor-not-allowed'
                          : 'bg-mint-500 text-white hover:bg-mint-600'
                        }`}
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `${countdown}s` : '获取验证码'}
                    </Button>
                  </View>
                </Cell>
              </CellGroup>
              <Button
                type="primary"
                block
                className="bg-sakura-500 hover:bg-sakura-600 text-white py-3 rounded-xl font-semibold"
                onClick={handleLogin}
              >
                登录
              </Button>
            </View>
          )}

          {activeTab === 'wechat' && (
            <View className="text-center space-y-4">
              <Text className="text-cloud-600 text-sm mb-4">微信一键登录</Text>
              <Button
                type="primary"
                block
                className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
                onClick={handleWechatLogin}
              >
                <Text>一键微信登录</Text>
              </Button>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Login;