<template>
    <NuxtLayout name="default">
        <template #container>
            <!-- Left -->
            <div class="w-full flex flex-col justify-center items-center">
                <div class="w-full h-[calc(100vh-60px)] mb-8">
                    <Carousel :items="pageData.banner" />
                </div>
                <!-- 特性 -->
                <div class="item-container my-8 flex flex-col items-center justify-center mt-4 max-w-[1450px] w-full">
                    <div class="text-2xl font-bold text-center flex flex-row items-center justify-center gap-6">
                        <span class="block h-1 w-12 bg-[#5b6bd8] dark:bg-[#7986cb]"></span>
                        特性
                        <span class="block h-1 w-12 bg-[#5b6bd8] dark:bg-[#7986cb]"></span>
                    </div>
                    <div class="text-[#5b6bd8] dark:text-[#7986cb]">Product Features</div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 my-8 w-full">
                        <Motion as="div" v-bind="fromBottomToUp" v-for="item in pageData.feature" :key="item.title"
                            class="w-full mx-auto md:w-[300px] flex flex-col justify-center items-center bg-gradient-to-br from-white to-[#f0f4ff] dark:from-gray-800 dark:to-[#1a237e] rounded-xl shadow-lg hover:shadow-xl ring-2 ring-[#5b6bd8] dark:ring-[#7986cb] hover:ring-[#3f51b5] dark:hover:ring-[#5b6bd8] transition-all duration-300 transform hover:-translate-y-2 p-6 space-y-4">
                            <!-- Icon -->
                            <div
                                class="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-[#5b6bd8] to-[#3f51b5] dark:from-[#5b6bd8] dark:to-[#3f51b5] rounded-full shadow-md">
                                <Icon :name="item.icon" :size="48" class="fa-solid text-white" />
                            </div>

                            <!-- Title -->
                            <div class="font-bold text-2xl text-gray-800 dark:text-gray-100">
                                {{ item.title }}
                            </div>

                            <!-- Description -->
                            <div class="text-gray-600 dark:text-gray-300 text-center">
                                {{ item.desc }}
                            </div>
                        </Motion>
                    </div>
                </div>

                <!-- 多平台支付 -->
                <div class="item-container my-8 flex flex-col items-center justify-center mt-4 w-full max-w-[1450px]">
                    <div class="text-2xl font-bold text-center flex flex-row items-center justify-center gap-6">
                        <span class="block h-1 w-12 bg-[#5b6bd8] dark:bg-[#7986cb]"></span>
                        多平台支付
                        <span class="block h-1 w-12 bg-[#5b6bd8] dark:bg-[#7986cb]"></span>
                    </div>
                    <div class="text-[#5b6bd8] dark:text-[#7986cb]">Multiple Pay</div>
                    <div class="flex flex-row flex-wrap items-center justify-center sm:justify-around gap-8 w-full">
                        <!-- 图片 -->
                        <img class="max-w-[350px] max-h-[350px] rounded-xl shadow-lg" src="~/public/play_success.png" />

                        <!-- 支付选项 -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full md:max-w-[600px]">
                            <!-- 支付宝支付 -->
                            <Motion as="div" v-bind="GradientOpacity"
                                class="w-full rounded-xl flex flex-row items-center bg-gradient-to-br from-white to-[#f0f4ff] dark:from-gray-800 dark:to-[#1a237e] shadow-lg hover:shadow-xl ring-2 ring-[#5b6bd8] dark:ring-[#7986cb] hover:ring-[#3f51b5] dark:hover:ring-[#5b6bd8] transition-all duration-300 transform hover:-translate-y-2 px-4 py-3 gap-4 h-[80px]">
                                <img class="w-12 h-12 object-fill rounded-full" src="~/public/alipay.png" alt="支付宝支付" />
                                <div class="w-full text-xl font-bold text-center text-gray-800 dark:text-gray-100">
                                    支付宝支付
                                </div>
                            </Motion>

                            <!-- 微信支付 -->
                            <Motion as="div" v-bind="GradientOpacity"
                                class="w-full rounded-xl flex flex-row items-center bg-gradient-to-br from-white to-[#f0f4ff] dark:from-gray-800 dark:to-[#1a237e] shadow-lg hover:shadow-xl ring-2 ring-[#5b6bd8] dark:ring-[#7986cb] hover:ring-[#3f51b5] dark:hover:ring-[#5b6bd8] transition-all duration-300 transform hover:-translate-y-2 px-4 py-3 gap-4 h-[80px]">
                                <img class="w-12 h-12 object-fill rounded-full" src="~/public/wechat.png" alt="微信支付" />
                                <div class="w-full text-xl font-bold text-center text-gray-800 dark:text-gray-100">
                                    微信支付
                                </div>
                            </Motion>

                            <!-- PayPal支付 -->
                            <Motion as="div" v-bind="GradientOpacity"
                                class="w-full rounded-xl flex flex-row items-center bg-gradient-to-br from-white to-[#f0f4ff] dark:from-gray-800 dark:to-[#1a237e] shadow-lg hover:shadow-xl ring-2 ring-[#5b6bd8] dark:ring-[#7986cb] hover:ring-[#3f51b5] dark:hover:ring-[#5b6bd8] transition-all duration-300 transform hover:-translate-y-2 px-4 py-3 gap-4 h-[80px]">
                                <img class="w-12 h-12 object-fill rounded-full" src="~/public/paypal.png"
                                    alt="PayPal支付" />
                                <div class="w-full text-xl font-bold text-center text-gray-800 dark:text-gray-100">
                                    PayPal支付
                                </div>
                            </Motion>

                            <!-- 银行卡支付 -->
                            <Motion as="div" v-bind="GradientOpacity"
                                class="w-full rounded-xl flex flex-row items-center bg-gradient-to-br from-white to-[#f0f4ff] dark:from-gray-800 dark:to-[#1a237e] shadow-lg hover:shadow-xl ring-2 ring-[#5b6bd8] dark:ring-[#7986cb] hover:ring-[#3f51b5] dark:hover:ring-[#5b6bd8] transition-all duration-300 transform hover:-translate-y-2 px-4 py-3 gap-4 h-[80px]">
                                <img class="w-12 h-12 object-fill rounded-full" src="~/public/bankCard.png"
                                    alt="银行卡支付" />
                                <div class="w-full text-xl font-bold text-center text-gray-800 dark:text-gray-100">
                                    银行卡支付
                                </div>
                            </Motion>

                            <!-- 立即体验按钮 -->
                            <Motion as-child v-bind="GradientOpacity">
                                <NuxtLink class="col-span-1 sm:col-span-2 block" to="/login" target="_self">
                                    <el-button
                                        class="w-full !bg-gradient-to-br from-[#5b6bd8] to-[#3f51b5] dark:from-[#5b6bd8] dark:to-[#3f51b5] !text-white !h-[50px] rounded-xl shadow-lg hover:shadow-xl transition duration-500 hover:-translate-y-1">
                                        立即体验
                                    </el-button>
                                </NuxtLink>
                            </Motion>
                        </div>
                    </div>
                </div>
                <div class="item-container my-8 flex flex-col items-center justify-center mt-4 w-full max-w-[1450px]">
                    <div class="text-2xl font-bold text-center flex flex-row items-center justify-center gap-6">
                        <span class="block h-1 w-12 bg-[#5b6bd8] dark:bg-[#7986cb]"></span>
                        及时更新
                        <span class="block h-1 w-12 bg-[#5b6bd8] dark:bg-[#7986cb]"></span>
                    </div>
                    <div class="text-[#5b6bd8] dark:text-[#7986cb]">Up To Date</div>
                    <div class="box-border pt-8 flex flex-row flex-wrap items-center justify-around gap-8 w-full">
                        <!-- 左侧内容 -->
                        <div
                            class="flex flex-col md:max-w-[550px] w-full bg-gradient-to-br from-white to-[#f0f4ff] dark:from-gray-800 dark:to-[#1a237e] rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            <div class="font-bold text-2xl text-[#5b6bd8] dark:text-[#7986cb]">
                                我们的技术优势，打造高效可靠的服务体验
                            </div>
                            <ul class="list-none pl-0 space-y-4 mt-6">
                                <Motion as="li" :custom="1" v-bind="listFromBottomToUp" class="flex items-start gap-3">
                                    <img class="w-6 h-6 mt-1" src="~/public/hot.png" alt="hot" />
                                    <div class="flex-1 text-gray-700 dark:text-gray-300">
                                        <span class="font-medium text-[#5b6bd8] dark:text-[#7986cb]">专业程序员团队：</span>
                                        随时跟进和修复 BUG，确保系统稳定运行。
                                    </div>
                                </Motion>
                                <Motion as="li" :custom="2" v-bind="listFromBottomToUp" class="flex items-start gap-3">
                                    <img class="w-6 h-6 mt-1" src="~/public/hot.png" alt="hot" />
                                    <div class="flex-1 text-gray-700 dark:text-gray-300">
                                        <span class="font-medium text-[#5b6bd8] dark:text-[#7986cb]">精心设计的系统架构：</span>
                                        易于更新与迭代，为未来的发展和扩展提供保障。
                                    </div>
                                </Motion>
                                <Motion as="li" :custom="3" v-bind="listFromBottomToUp" class="flex items-start gap-3">
                                    <img class="w-6 h-6 mt-1" src="~/public/hot.png" alt="hot" />
                                    <div class="flex-1 text-gray-700 dark:text-gray-300">
                                        <span class="font-medium text-[#5b6bd8] dark:text-[#7986cb]">严格的上线前测试流程：</span>
                                        最大限度避免潜在的 BUG，保障用户体验。
                                    </div>
                                </Motion>
                                <Motion as="li" :custom="4" v-bind="listFromBottomToUp" class="flex items-start gap-3">
                                    <img class="w-6 h-6 mt-1" src="~/public/hot.png" alt="hot" />
                                    <div class="flex-1 text-gray-700 dark:text-gray-300">
                                        <span class="font-medium text-[#5b6bd8] dark:text-[#7986cb]">高效响应机制：</span>
                                        第一时间处理反馈问题，持续优化服务。
                                    </div>
                                </Motion>
                                <Motion as="li" :custom="5" v-bind="listFromBottomToUp" class="flex items-start gap-3">
                                    <img class="w-6 h-6 mt-1" src="~/public/hot.png" alt="hot" />
                                    <div class="flex-1 text-gray-700 dark:text-gray-300">
                                        <span class="font-medium text-[#5b6bd8] dark:text-[#7986cb]">技术驱动创新：</span>
                                        不断探索新技术，提升产品性能与安全性。
                                    </div>
                                </Motion>
                            </ul>
                        </div>

                        <!-- 右侧图片 -->
                        <img class="max-w-[350px] max-h-[350px] w-full h-full rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                            src="~/public/development.png" />
                    </div>
                </div>
                <div class="item-container my-8 flex flex-col items-center justify-center mt-4 w-full max-w-[1450px]">
                    <div class="text-2xl font-bold text-center flex flex-row items-center justify-center gap-6">
                        <span class="block h-1 w-12 bg-[#5b6bd8] dark:bg-[#7986cb]"></span>
                        常见问题
                        <span class="block h-1 w-12 bg-[#5b6bd8] dark:bg-[#7986cb]"></span>
                    </div>
                    <div class="text-[#5b6bd8] dark:text-[#7986cb]">Up To Date</div>
                    <div class="flex flex-col md:flex-row items-start justify-around gap-8 w-full">
                        <!-- 图片 -->
                        <img class="max-w-[380px] max-h-[380px] w-full h-full rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                            src="~/public/question.png" />

                        <!-- 问答部分 -->
                        <div class="flex flex-col w-full md:mt-6 md:max-w-[600px] space-y-4">
                            <Disclosure v-slot="{ open }" v-for="item in pageData.questions" :key="item.title">
                                <DisclosureButton
                                    class="flex items-center w-full justify-between rounded-xl bg-gradient-to-br from-white to-[#f0f4ff] dark:from-gray-800 dark:to-[#1a237e] shadow-lg hover:shadow-xl ring-2 ring-[#5b6bd8] dark:ring-[#7986cb] hover:ring-[#3f51b5] dark:hover:ring-[#5b6bd8] transition-all duration-300 transform hover:-translate-y-2 px-6 py-4">
                                    <div class="text-lg font-medium text-[#5b6bd8] dark:text-[#7986cb]">
                                        <icon :name="item.icon" :size="18"/>
                                        <span>
                                            {{ item.title }}
                                        </span>
                                    </div>
                                    <Icon name="el-icon-ArrowDownBold" :size="18"
                                        class="text-[#5b6bd8] dark:text-[#7986cb] transition-transform duration-500"
                                        :class="{ 'rotate-180': open }" />
                                </DisclosureButton>

                                <!-- 使用 TransitionRoot 组件实现动画 -->
                                <TransitionRoot :show="open" enter="transition-all duration-300 ease-out"
                                    enterFrom="opacity-0 max-h-0" enterTo="opacity-100 max-h-[200px]"
                                    leave="transition-all duration-200 ease-in" leaveFrom="opacity-100 max-h-[200px]"
                                    leaveTo="opacity-0 max-h-0">
                                    <DisclosurePanel
                                        class="bg-gradient-to-br from-white to-[#f0f4ff] dark:from-gray-800 dark:to-[#1a237e] rounded-xl shadow-lg px-6 py-4 text-gray-700 dark:text-gray-300 overflow-hidden">
                                        {{ item.desc }}
                                    </DisclosurePanel>
                                </TransitionRoot>
                            </Disclosure>
                        </div>
                    </div>
                </div>
                <div class="item-container my-8 flex flex-col items-center justify-center mt-4 w-full max-w-[1450px]">
                    <div class="text-2xl font-bold text-center flex flex-row items-center justify-center gap-6">
                        <span class="block h-1 w-12 bg-gray-800"></span>
                        文章教程
                        <span class="block h-1 w-12 bg-gray-800"></span>
                    </div>
                    <div class="text-gray-500">Articles</div>

                    <ArticleTabs :data="pageData" class="mt-8" />
                </div>
            </div>

            <!-- Right -->
            <!-- <div class="w-[370px] mt-4">
                <Information type="topping" title="最近更新" :data="pageData.everyday" />

                <Information class="mt-4" type="ranking" title="排名榜单" :data="pageData.ranking" />

                <Information class="mt-4" type="adv" :data="pageData.adv" />
            </div> -->
        </template>
    </NuxtLayout>
</template>

<script setup lang="ts">
import appApi from "~/api/app";
import Carousel from "~/components/Carousel/index.vue";
import Information from "./article/_components/Information.vue";
import Icon from "~/components/Icon/index.vue";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    TransitionRoot
} from '@headlessui/vue'
import { Motion } from 'motion-v'
import { fromBottomToUp, GradientOpacity, listFromBottomToUp } from '~/animate/inViewAnimate'


// 页面数据
const { data: pageData } = await useAsyncData(() => appApi.homing(), {
	default() {
		return {} as AppHomingResponse;
	},
});
</script>
<style scope lang="scss">
.item-container {
    max-width: 1450px;
}
    @media not all and (min-width: 1200px){
        .item-container {
            padding: 0 8%;
        }
    }
</style>