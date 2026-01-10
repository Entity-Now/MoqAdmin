import { useState, useEffect } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Button, Input, Loading } from '@taroify/core';
import Taro from '@tarojs/taro';
import useUserStore from '../../store/useUser'
import TopBar from '../../components/TopBar';
import './index.scss';

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
      // 优先级：参数名 sense > scene > 第一个包含冒号的参数键名
      const sense = params.sense || params.scene;
      if (sense) {
        scanQuery = decodeURIComponent(sense as string);
      } else {
        const firstKey = Object.keys(params).find(k => k !== 'redirect' && k.includes(':'));
        if (firstKey) {
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
      Taro.navigateBack({ delta: 1 }).catch(() => {
        Taro.switchTab({
          url: '/pages/index/index',
        });
      });
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
    <View className="min-h-screen bg-gradient-to-b from-cotton-candy/20 to-white flex flex-col">
      <TopBar title={isScanLogin ? '扫码登录' : '账户登录'} showBack />

      <View className="flex-1 flex flex-col items-center px-6 pt-12 pb-8">
        {/* Logo Section */}
        <View className="flex flex-col items-center mb-12">
          <View className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center mb-4 transform rotate-12 transition-transform active:rotate-0">
            <Text className="text-3xl font-bold text-sakura-500">莫</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 tracking-wider">莫欺客优选</Text>
          <View className="w-8 h-1 bg-sakura-400 rounded-full mt-2" />
        </View>

        <View className="w-full max-w-md">
          {isScanLogin && scanLoading ? (
            <View className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 text-center">
              <Loading type="spinner" style={{ color: "#FF8FAF" }} size="24" />
              <Text className="text-lg font-medium text-sakura-600 mt-4 block">
                {scanEvent === 'login' ? '正在加速授权...' : '正在为您处理...'}
              </Text>
              <Text className="text-sm text-gray-400 mt-2">请保持当前页面不要离开</Text>
            </View>
          ) : (
            <View className="space-y-6">
              {/* Login Method Tabs */}
              <View className="bg-gray-100/50 p-1 rounded-2xl flex flex-row items-center mb-6">
                <View
                  className={`flex-1 py-2 text-center rounded-xl text-sm font-medium transition-all ${activeTab === 'wechat' ? 'bg-white text-sakura-600 shadow-sm' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('wechat')}
                >
                  微信登录
                </View>
                <View
                  className={`flex-1 py-2 text-center rounded-xl text-sm font-medium transition-all ${activeTab === 'account' ? 'bg-white text-sakura-600 shadow-sm' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('account')}
                >
                  密码登录
                </View>
                <View
                  className={`flex-1 py-2 text-center rounded-xl text-sm font-medium transition-all ${activeTab === 'phone' ? 'bg-white text-sakura-600 shadow-sm' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('phone')}
                >
                  验证码
                </View>
              </View>

              <View className="bg-white rounded-3xl p-6 shadow-xl border border-gray-50">
                {activeTab === 'account' && (
                  <View className="space-y-4">
                    <View className="space-y-4 mb-6">
                      <View className="bg-gray-50 rounded-2xl px-4 py-3 flex flex-row items-center border border-gray-100 transition-all focus-within:border-sakura-300 focus-within:bg-white">
                        <Input
                          className="flex-1 text-sm bg-transparent"
                          placeholder="请输入手机号或邮箱"
                          value={userStore.loginInfo.phoneEmail}
                          onChange={(e) => handleInputChange('phoneEmail', e.detail.value)}
                        />
                      </View>
                      <View className="bg-gray-50 rounded-2xl px-4 py-3 flex flex-row items-center border border-gray-100 transition-all focus-within:border-sakura-300 focus-within:bg-white">
                        <Input
                          className="flex-1 text-sm bg-transparent"
                          password
                          placeholder="请输入您的登录密码"
                          value={userStore.loginInfo.password}
                          onChange={(e) => handleInputChange('password', e.detail.value)}
                        />
                      </View>
                    </View>
                    <Button
                      color="primary"
                      block
                      className="!bg-gradient-to-r !from-sakura-400 !to-sakura-500 !text-white !py-6 !rounded-2xl !font-bold !border-none !shadow-lg !shadow-sakura-200 active:scale-95 transition-transform"
                      onClick={handleLogin}
                    >
                      立即登录
                    </Button>
                  </View>
                )}

                {activeTab === 'phone' && (
                  <View className="space-y-4">
                    <View className="space-y-4 mb-6">
                      <View className="bg-gray-50 rounded-2xl px-4 py-3 flex flex-row items-center border border-gray-100 transition-all focus-within:border-sakura-300 focus-within:bg-white">
                        <Input
                          className="flex-1 text-sm bg-transparent"
                          placeholder="请输入手机号"
                          value={userStore.loginInfo.phoneEmail}
                          onChange={(e) => handleInputChange('phoneEmail', e.detail.value)}
                        />
                      </View>
                      <View className="flex flex-row items-center gap-3">
                        <View className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 flex flex-row items-center border border-gray-100 transition-all focus-within:border-sakura-300 focus-within:bg-white">
                          <Input
                            className="bg-transparent text-sm w-full"
                            placeholder="验证码"
                            value={userStore.loginInfo.code}
                            onChange={(e) => handleInputChange('code', e.detail.value)}
                          />
                        </View>
                        <Button
                          size="small"
                          className={`!px-4 !h-11 !rounded-2xl !text-xs !font-bold !transition-all !border-none shadow-sm ${countdown > 0
                            ? '!bg-gray-200 !text-gray-400'
                            : '!bg-lavender-500 !text-white active:scale-95'
                            }`}
                          onClick={handleSendCode}
                          disabled={countdown > 0}
                        >
                          {countdown > 0 ? `${countdown}s` : '获取验证码'}
                        </Button>
                      </View>
                    </View>
                    <Button
                      color="primary"
                      block
                      className="!bg-gradient-to-r !from-lavender-400 !to-lavender-500 !text-white !py-6 !rounded-2xl !font-bold !border-none !shadow-lg !shadow-lavender-200 active:scale-95 transition-transform"
                      onClick={handleLogin}
                    >
                      安全登录
                    </Button>
                  </View>
                )}

                {activeTab === 'wechat' && (
                  <View className="flex flex-col items-center py-4">
                    <View className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                      <Image
                        src="https://img.icons8.com/color/96/000000/weixing.png"
                        className="w-10 h-10"
                      />
                    </View>
                    <Text className="text-sm text-gray-500 mb-8">使用微信授权快速登录应用</Text>
                    <Button
                      color="primary"
                      block
                      className="!bg-gradient-to-r !from-green-500 !to-emerald-500 !text-white !py-6 !rounded-2xl !font-bold !border-none !shadow-lg !shadow-green-100 active:scale-95 transition-transform"
                      onClick={handleWechatLogin}
                    >
                      微信一键授权登录
                    </Button>
                  </View>
                )}
              </View>

              <View className="flex flex-row items-center justify-center px-4 pt-4">
                <Text className="text-xs text-gray-400">登录即代表您已同意</Text>
                <Text className="text-xs text-sakura-500 font-medium ml-1">用户协议</Text>
                <Text className="text-xs text-gray-400 mx-1">和</Text>
                <Text className="text-xs text-sakura-500 font-medium">隐私政策</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Login;