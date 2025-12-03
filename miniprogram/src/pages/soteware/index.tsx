import { View, Text, Button } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import { SearchBar, Empty } from '@nutui/nutui-react-taro';
import TopBar from '../../components/TopBar';
import './index.scss';

// 软件分类
const categories = [
    { id: 'all', name: '全部', icon: '📦' },
    { id: 'productivity', name: '办公效率', icon: '💼' },
    { id: 'development', name: '开发工具', icon: '⚙️' },
    { id: 'design', name: '设计软件', icon: '🎨' },
    { id: 'utility', name: '系统工具', icon: '🔧' },
    { id: 'other', name: '其他', icon: '📁' },
];

// 软件数据接口（待接入后端）
interface Software {
    id: string;
    name: string;
    icon: string;
    description: string;
    category: string;
    version: string;
    size: string;
    platform: string[];
    downloadCount: number;
    rating: number;
    tags: string[];
}

function SoftwarePage() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [softwareList] = useState<Software[]>([]);

    useLoad(() => {
        console.log('Software page loaded');
        // TODO: 接入后端接口加载软件列表
        // loadSoftwareList();
    });

    const handleSearch = (value: string) => {
        setSearchKeyword(value);
        // TODO: 实现搜索功能
        console.log('Search:', value);
    };

    const handleCategoryChange = (categoryId: string) => {
        setActiveCategory(categoryId);
        // TODO: 根据分类筛选软件
        console.log('Category changed:', categoryId);
    };

    const handleDownload = (softwareName: string) => {
        Taro.showModal({
            title: '下载提示',
            content: `确定要下载 ${softwareName} 吗？`,
            success: (res) => {
                if (res.confirm) {
                    // TODO: 实现下载功能
                    Taro.showToast({
                        title: '开始下载',
                        icon: 'success',
                    });
                }
            },
        });
    };

    const handleSoftwareDetail = (softwareName: string) => {
        // TODO: 跳转到软件详情页
        Taro.showToast({
            title: `${softwareName} 详情页开发中`,
            icon: 'none',
        });
    };

    // 渲染软件卡片
    const renderSoftwareCard = (software: Software) => (
        <View
            key={software.id}
            className="software-card bg-white rounded-card-lg p-4 mb-3 shadow-card border border-gray-100 transition-all duration-card active:scale-98"
            onClick={() => handleSoftwareDetail(software.name)}
        >
            <View className="flex flex-row items-start">
                {/* 软件图标 */}
                <View className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-card flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Text className="text-3xl">{software.icon}</Text>
                </View>

                {/* 软件信息 */}
                <View className="flex-1 ml-3">
                    <View className="flex flex-row items-center justify-between mb-1">
                        <Text className="text-base font-bold text-gray-800">{software.name}</Text>
                        <View className="flex flex-row items-center">
                            <Text className="text-xs text-yellow-500 mr-0.5">⭐</Text>
                            <Text className="text-xs text-gray-600">{software.rating}</Text>
                        </View>
                    </View>

                    <Text className="text-sm text-gray-600 mb-2 line-clamp-2 block">
                        {software.description}
                    </Text>

                    {/* 标签 */}
                    <View className="flex flex-row flex-wrap gap-1.5 mb-2">
                        {software.tags.map((tag, index) => (
                            <View
                                key={index}
                                className="bg-mint-100 text-mint-600 px-2 py-0.5 rounded-tag"
                            >
                                <Text className="text-tag font-medium">{tag}</Text>
                            </View>
                        ))}
                    </View>

                    {/* 底部信息 */}
                    <View className="flex flex-row items-center justify-between">
                        <View className="flex flex-row items-center gap-3">
                            <Text className="text-xs text-gray-500">v{software.version}</Text>
                            <Text className="text-xs text-gray-500">{software.size}</Text>
                            <Text className="text-xs text-gray-500">
                                {software.downloadCount >= 10000
                                    ? `${(software.downloadCount / 10000).toFixed(1)}万次`
                                    : `${software.downloadCount}次`}
                            </Text>
                        </View>
                        <Button
                            className="!bg-gradient-to-r !from-sakura-400 !to-lavender-400 !text-white !text-xs !font-bold !py-1 !px-4 !rounded-full !shadow-sm active:!shadow-none !border-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(software.name);
                            }}
                        >
                            下载
                        </Button>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View className="software-container min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* 顶部导航 */}
            <TopBar title="免费软件下载" showBack>
                <SearchBar
                    placeholder="搜索软件名称"
                    value={searchKeyword}
                    onChange={handleSearch}
                    onSearch={handleSearch}
                    shape="round"
                    clearable
                    className="search-input-custom !bg-transparent !rounded-full !shadow-sm"
                />
            </TopBar>

            {/* Banner 区域 */}
            <View className="banner-section px-4 pt-4 pb-3">
                <View className="bg-gradient-to-br from-mint-400 via-blue-400 to-purple-400 rounded-card-lg p-5 shadow-card-lg">
                    <View className="text-center">
                        <Text className="text-xl font-bold text-white mb-1 block">
                            🎁 免费软件资源库
                        </Text>
                        <Text className="text-sm text-white/90 block mb-3">
                            精选优质开源软件，完全免费下载使用
                        </Text>
                        <View className="flex flex-row justify-center gap-2">
                            <View className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                <Text className="text-xs text-white font-medium">安全无毒</Text>
                            </View>
                            <View className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                <Text className="text-xs text-white font-medium">持续更新</Text>
                            </View>
                            <View className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                <Text className="text-xs text-white font-medium">开源免费</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* 分类标签 */}
            <View className="category-section px-4 pb-3">
                <View className="flex flex-row overflow-x-auto gap-2 scrollbar-none">
                    {categories.map((category) => (
                        <View
                            key={category.id}
                            className={`category-tag flex-shrink-0 px-4 py-2 rounded-full border-2 transition-all duration-200 ${activeCategory === category.id
                                ? 'bg-sakura-500 border-sakura-500'
                                : 'bg-white border-gray-200'
                                }`}
                            onClick={() => handleCategoryChange(category.id)}
                        >
                            <View className="flex flex-row items-center gap-1">
                                <Text className="text-base">{category.icon}</Text>
                                <Text
                                    className={`text-sm font-medium ${activeCategory === category.id ? 'text-white' : 'text-gray-700'
                                        }`}
                                >
                                    {category.name}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* 软件列表 */}
            <View className="software-list px-4 pb-6">
                {softwareList.length > 0 ? (
                    <View>
                        {softwareList.map((software) => renderSoftwareCard(software))}
                    </View>
                ) : (
                    <View className="empty-state py-20">
                        <Empty description="暂无软件数据" />
                        <View className="text-center mt-4">
                            <Text className="text-sm text-gray-500 block mb-3">
                                接口开发中，敬请期待...
                            </Text>
                            <Button
                                className="!bg-gradient-to-r !from-mint-400 !to-blue-400 !text-white !font-bold !py-2 !px-6 !rounded-full !shadow-md active:!shadow-sm !border-0"
                                open-type="contact"
                            >
                                联系客服了解更多
                            </Button>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

export default SoftwarePage;
