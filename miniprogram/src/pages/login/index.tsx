import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { Button, Input, Cell, CellGroup, Radio } from '@nutui/nutui-react-taro';
import Taro from '@tarojs/taro';
import useUserStore from '../../store/useUser'
import './index.scss'; // 假设 Tailwind CSS 已通过 PostCSS 配置在 Taro 项目中

const Login = () => {
  const router = Taro.getCurrentInstance().router;
  const redirect = router?.params?.redirect;

  const userStore = useUserStore();
  const [activeTab, setActiveTab] = useState<any>('wechat'); // 'account', 'phone', 'wechat'

  // QR code scan login states
  const [isScanLogin, setIsScanLogin] = useState(false);
  const [scanEvent, setScanEvent] = useState<string>('');
  const [scanLoading, setScanLoading] = useState(false);

  const [countdown, setCountdown] = useState(0);

  // Parse QR code query parameters on mount
  useEffect(() => {
    const checkScanLogin = async () => {
      // Check all possible query parameter keys
      const params = router?.params || {};

      // Look for encoded query parameter (could be any key from the QR code)
      // The format from backend is: urlencode(event + ":" + code)
      // This creates a query like: ?login%3Aabcd1234 or a named param

      let scanQuery = '';

      // Check for common parameter names or find the first parameter that contains ":"
      for (const [key, value] of Object.entries(params)) {
        if (key !== 'redirect' && value) {
          // Try to decode and check if it contains ":"
          try {
            const decoded = decodeURIComponent(value as string);
            if (decoded.includes(':')) {
              scanQuery = decoded;
              break;
            }
          } catch (e) {
            // If decode fails, try the raw value
            if ((value as string).includes(':')) {
              scanQuery = value as string;
              break;
            }
          }
        }
      }

      // If no named parameter found, check if there's a query string directly
      if (!scanQuery && Object.keys(params).length > 0) {
        // Sometimes the entire query might be a single unnamed parameter
        const firstKey = Object.keys(params).find(k => k !== 'redirect');
        if (firstKey && firstKey.includes(':')) {
          scanQuery = decodeURIComponent(firstKey);
        }
      }

      if (scanQuery) {
        // Parse event:code format
        const [event, code] = scanQuery.split(':');

        if (event && code) {
          setIsScanLogin(true);
          setScanEvent(event);
          setScanLoading(true);

          try {
            // Handle different scan events
            if (event === 'login') {
              // Perform scan login
              const success = await userStore.scanLogin(code);

              if (success) {
                Taro.showToast({ title: '扫码登录成功', icon: 'success' });
                setTimeout(() => {
                  redirectTo();
                }, 1500);
              } else {
                Taro.showToast({ title: '扫码登录失败', icon: 'none' });
                setScanLoading(false);
                setIsScanLogin(false);
              }
            } else if (event === 'bind') {
              // Handle bind logic (if needed in the future)
              Taro.showToast({ title: '绑定功能暂未实现', icon: 'none' });
              setScanLoading(false);
              setIsScanLogin(false);
            } else {
              // Unknown event
              Taro.showToast({ title: '未知的扫码事件', icon: 'none' });
              setScanLoading(false);
              setIsScanLogin(false);
            }
          } catch (error) {
            console.error('Scan login error:', error);
            Taro.showToast({ title: '扫码登录失败', icon: 'none' });
            setScanLoading(false);
            setIsScanLogin(false);
          }
        }
      }
    };

    checkScanLogin();
  }, []);

  const redirectTo = () => {
    if (!redirect) {
      Taro.navigateBack({ delta: 1 })
      return;
    }
    const url = decodeURIComponent(redirect);
    Taro.navigateTo({ url: url }).catch(() => {
      Taro.switchTab({
        url: url,
      }).catch(() => {
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
      success: () => {
        // TODO: 发送 code 到后端换取 openid 等
        userStore.miniLogin().then(res => {
          if (res) {
            Taro.showToast({ title: '微信登录成功', icon: 'success' });
            // 跳转用户页面
            redirectTo();
          } else {
            Taro.showToast({ title: '微信登录失败', icon: 'none' });
          }
        })
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
          <Text className="text-cloud-600 text-sm">
            {isScanLogin ? '扫码登录' : '欢迎登录'}
          </Text>
        </View>

        {/* Show scan login status or normal login form */}
        {isScanLogin && scanLoading ? (
          // Scan login loading state
          <View className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl text-center">
            <View className="mb-4">
              <Text className="text-lg font-semibold text-sakura-600">
                {scanEvent === 'login' ? '正在登录...' : '正在处理...'}
              </Text>
            </View>
            <View className="flex justify-center items-center py-8">
              <Text className="text-cloud-500">请稍候</Text>
            </View>
          </View>
        ) : (
          <>
            {/* 登录方式切换 */}
            <Cell>
              <Radio.Group defaultValue="wechat" direction="horizontal"
                onChange={setActiveTab}>
                <Radio shape="button" value="wechat">
                  微信登录
                </Radio>
                <Radio disabled shape="button" value="account">
                  账户密码
                </Radio>
                <Radio disabled shape="button" value="phone">
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

            {/* 取消登录按钮 */}
            {!scanLoading && (
              <View className="mt-4 text-center">
                <Button
                  fill="none"
                  className="text-cloud-500 text-sm"
                  onClick={() => {
                    // 尝试返回上一页，如果没有历史记录则跳转到首页
                    const pages = Taro.getCurrentPages();
                    if (pages.length > 1) {
                      Taro.navigateBack({ delta: 1 });
                    } else {
                      Taro.switchTab({ url: '/pages/index/index' });
                    }
                  }}
                >
                  取消登录
                </Button>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default Login;