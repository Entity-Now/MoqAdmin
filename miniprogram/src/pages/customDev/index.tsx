import { View, Text, Button } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import TopBar from '../../components/TopBar';
import './index.scss';

// 服务领域数据
const serviceAreas = [
    {
        id: 1,
        icon: '🏭',
        title: '工业领域软件开发',
        subtitle: '专业定制·高效管理',
        description: '为制造业企业提供专业的软件解决方案',
        features: ['MES 制造执行系统', '金蝶 ERP 集成', 'ERP 企业资源规划', 'WMS 仓储管理'],
        bgClass: 'bg-gradient-to-br from-blue-50 to-indigo-100',
        iconBgClass: 'bg-gradient-to-br from-blue-400 to-indigo-500',
        borderClass: 'border-blue-200',
    },
    {
        id: 2,
        icon: '🌐',
        title: 'WEB 应用开发',
        subtitle: '现代化·响应式',
        description: '打造美观高效的现代化 Web 应用',
        features: ['企业官网定制', '管理后台系统', '电商平台开发', '移动端适配'],
        bgClass: 'bg-gradient-to-br from-green-50 to-emerald-100',
        iconBgClass: 'bg-gradient-to-br from-green-400 to-emerald-500',
        borderClass: 'border-green-200',
    },
    {
        id: 3,
        icon: '💻',
        title: '桌面程序开发',
        subtitle: '跨平台·高性能',
        description: '开发稳定可靠的桌面应用程序',
        features: ['Windows 应用', 'macOS 应用', 'Linux 应用', '跨平台方案'],
        bgClass: 'bg-gradient-to-br from-purple-50 to-pink-100',
        iconBgClass: 'bg-gradient-to-br from-purple-400 to-pink-500',
        borderClass: 'border-purple-200',
    },
    {
        id: 4,
        icon: '📱',
        title: '小程序开发',
        subtitle: '轻量级·易推广',
        description: '微信、支付宝等多平台小程序开发',
        features: ['微信小程序', '支付宝小程序', '抖音小程序', '多端统一开发'],
        bgClass: 'bg-gradient-to-br from-orange-50 to-amber-100',
        iconBgClass: 'bg-gradient-to-br from-orange-400 to-amber-500',
        borderClass: 'border-orange-200',
    },
    {
        id: 5,
        icon: '⚡',
        title: '自动化脚本开发',
        subtitle: '智能化·省时省力',
        description: '提升工作效率的自动化解决方案',
        features: ['抢票软件', '数据采集', '批量处理', '定时任务'],
        bgClass: 'bg-gradient-to-br from-sakura-50 to-lavender-100',
        iconBgClass: 'bg-gradient-to-br from-sakura-400 to-lavender-500',
        borderClass: 'border-sakura-200',
    },
];

// 优势特点
const advantages = [
    {
        icon: '💰',
        title: '价格合理',
        desc: '性价比高，按需定制',
    },
    {
        icon: '⚡',
        title: '快速交付',
        desc: '高效开发，准时交付',
    },
    {
        icon: '🛠️',
        title: '技术专业',
        desc: '经验丰富，技术过硬',
    },
    {
        icon: '🔒',
        title: '安全可靠',
        desc: '数据安全，稳定运行',
    },
];

function CustomDev() {
    useLoad(() => {
        console.log('CustomDev page loaded');
    });

    const handleContactService = () => {
        Taro.showToast({
            title: '请点击右下角客服按钮',
            icon: 'none',
            duration: 2000,
        });
    };

    const handleServiceClick = (service: typeof serviceAreas[0]) => {
        Taro.showModal({
            title: service.title,
            content: `${service.description}\n\n主要服务:\n${service.features.join('\n')}`,
            showCancel: true,
            cancelText: '关闭',
            confirmText: '咨询客服',
            success: (res) => {
                if (res.confirm) {
                    handleContactService();
                }
            },
        });
    };

    return (
        <View className="custom-dev-container min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* 顶部导航 */}
            <TopBar title="软件定制开发" showBack />

            {/* Hero 区域 */}
            <View className="hero-section px-4 pt-4 pb-6">
                <View className="bg-gradient-to-br from-sakura-400 via-lavender-400 to-mint-400 rounded-card-lg p-6 shadow-card-lg">
                    <View className="text-center">
                        <Text className="text-2xl font-bold text-white mb-2 block">
                            专业软件定制开发服务
                        </Text>
                        <Text className="text-sm text-white/90 block mb-4">
                            为您提供一站式软件解决方案
                        </Text>
                        <View className="flex flex-row justify-center items-center gap-2 flex-wrap">
                            <View className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <Text className="text-xs text-white font-medium">10+ 年经验</Text>
                            </View>
                            <View className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <Text className="text-xs text-white font-medium">100+ 项目</Text>
                            </View>
                            <View className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <Text className="text-xs text-white font-medium">98% 满意度</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* 服务领域 */}
            <View className="services-section px-4 pb-4">
                <View className="section-header mb-3">
                    <View className="flex items-center mb-1">
                        <View className="w-1 h-5 bg-sakura-500 rounded-full mr-2" />
                        <Text className="text-lg font-bold text-gray-800">服务领域</Text>
                    </View>
                    <Text className="text-xs text-gray-500 ml-4">涵盖多个领域·满足不同需求</Text>
                </View>

                <View className="space-y-3">
                    {serviceAreas.map((service) => (
                        <View
                            key={service.id}
                            className={`service-card ${service.bgClass} ${service.borderClass} border rounded-card-lg p-4 shadow-card transition-all duration-card active:scale-98`}
                            onClick={() => handleServiceClick(service)}
                        >
                            <View className="flex flex-row items-start">
                                {/* 图标 */}
                                <View className={`${service.iconBgClass} w-14 h-14 rounded-card flex items-center justify-center shadow-md flex-shrink-0`}>
                                    <Text className="text-3xl">{service.icon}</Text>
                                </View>

                                {/* 内容 */}
                                <View className="flex-1 ml-3">
                                    <View className="mb-1">
                                        <Text className="text-base font-bold text-gray-800 block mb-0.5">
                                            {service.title}
                                        </Text>
                                        <Text className="text-xs text-gray-600 block">
                                            {service.subtitle}
                                        </Text>
                                    </View>
                                    <Text className="text-sm text-gray-700 mb-2 block">
                                        {service.description}
                                    </Text>

                                    {/* 特性标签 */}
                                    <View className="flex flex-row flex-wrap gap-1.5">
                                        {service.features.map((feature, index) => (
                                            <View
                                                key={index}
                                                className="bg-white/60 backdrop-blur-sm px-2 py-1 rounded-tag border border-white/80"
                                            >
                                                <Text className="text-tag text-gray-700 font-medium">
                                                    {feature}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>

                                {/* 箭头 */}
                                <View className="ml-2 mt-1">
                                    <Text className="text-gray-400 text-lg">›</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* 优势特点 */}
            <View className="advantages-section px-4 pb-4">
                <View className="section-header mb-3">
                    <View className="flex items-center mb-1">
                        <View className="w-1 h-5 bg-mint-500 rounded-full mr-2" />
                        <Text className="text-lg font-bold text-gray-800">我们的优势</Text>
                    </View>
                    <Text className="text-xs text-gray-500 ml-4">专业团队·值得信赖</Text>
                </View>

                <View className="grid grid-cols-2 gap-3">
                    {advantages.map((advantage, index) => (
                        <View
                            key={index}
                            className="bg-white rounded-card-lg p-4 shadow-card border border-gray-100"
                        >
                            <View className="text-center">
                                <Text className="text-3xl mb-2 block">{advantage.icon}</Text>
                                <Text className="text-sm font-bold text-gray-800 mb-1 block">
                                    {advantage.title}
                                </Text>
                                <Text className="text-xs text-gray-600 block">
                                    {advantage.desc}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* 开发流程 */}
            <View className="process-section px-4 pb-4">
                <View className="section-header mb-3">
                    <View className="flex items-center mb-1">
                        <View className="w-1 h-5 bg-lavender-500 rounded-full mr-2" />
                        <Text className="text-lg font-bold text-gray-800">开发流程</Text>
                    </View>
                    <Text className="text-xs text-gray-500 ml-4">规范流程·品质保证</Text>
                </View>

                <View className="bg-white rounded-card-lg p-4 shadow-card border border-gray-100">
                    <View className="space-y-3">
                        {[
                            { step: '01', title: '需求沟通', desc: '详细了解您的需求' },
                            { step: '02', title: '方案设计', desc: '制定技术实施方案' },
                            { step: '03', title: '开发实施', desc: '按计划进行开发' },
                            { step: '04', title: '测试交付', desc: '严格测试后交付' },
                            { step: '05', title: '售后支持', desc: '持续技术支持' },
                        ].map((item, index) => (
                            <View key={index} className="flex flex-row items-center">
                                <View className="w-10 h-10 bg-gradient-to-br from-sakura-400 to-lavender-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Text className="text-xs font-bold text-white">{item.step}</Text>
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="text-sm font-bold text-gray-800 block mb-0.5">
                                        {item.title}
                                    </Text>
                                    <Text className="text-xs text-gray-600 block">{item.desc}</Text>
                                </View>
                                {index < 4 && (
                                    <View className="absolute left-5 mt-10 w-0.5 h-3 bg-gray-200" />
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* 底部联系区域 */}
            <View className="contact-section px-4 pb-6">
                <View className="bg-gradient-to-br from-mint-50 to-mint-100 rounded-card-lg p-6 shadow-card border border-mint-200">
                    <View className="text-center">
                        <Text className="text-lg font-bold text-gray-800 mb-2 block">
                            开始您的项目
                        </Text>
                        <Text className="text-sm text-gray-600 mb-4 block">
                            立即联系我们，获取专业的技术咨询和报价
                        </Text>
                        <Button
                            className="!bg-gradient-to-r !from-sakura-400 !to-lavender-400 !text-white !font-bold !py-3 !px-8 !rounded-full !shadow-md active:!shadow-sm transition-all !border-0"
                            open-type="contact"
                        >
                            <Text className="text-white font-bold">联系客服咨询</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default CustomDev;
