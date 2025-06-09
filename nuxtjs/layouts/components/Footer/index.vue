<template>
    <footer class="layout-footer bg-slate-800 w-full py-4">
        <div class="w-full flex flex-col items-center">
            <h1 class="hidden md:block text-custom-primary text-2xl text-center">{{ pcConfig.title }}</h1>
            <p class="mx-8 hidden md:block !my-1 text-slate-300 text-xs">{{ pcConfig.description }}</p>
            <div class="my-8 grid place-content-around grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                    <p class="text-white text-lg">友情链接</p>
                    <ul v-for="link in links" :key="link.title" class="list-none flex flex-col text-slate-300">
                        <li>
                            <NuxtLink :to="link.url" :target="link.target">{{ link.title }}</NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="text-white text-lg">帮助中心</p>
                    <ul class="list-none flex flex-col text-slate-300">
                        <li>
                            <NuxtLink :to="`/policy/${policyEnum.SERVICE}`">用户协议</NuxtLink>
                        </li>
                        <li>
                            <NuxtLink :to="`/policy/${policyEnum.PRIVACY}`">隐私政策</NuxtLink>
                        </li>
                    </ul>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="text-white text-lg">联系我们</p>
                    <ul class="list-none flex flex-col text-slate-300">
                        <li class="flex flex-row">
                            <span class="inline-block w-[80px] text-justify">QQ客服</span>
                            <span>{{pcConfig.qq}}</span>
                        </li>
                        <li class="flex flex-row">
                            <span class="inline-block w-[80px] text-left tracking-wide">官方邮箱</span>
                            <span>{{ pcConfig.email }}</span>
                        </li>
                        <li class="flex flex-row">
                            <span class="inline-block w-[80px] text-left tracking-wide ">工作时间</span>
                            <span>{{ pcConfig.work_time }}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- <div class="flex justify-center py-[30px]">
                <div class="mii">
                    <div class="nav">
                        <NuxtLink :to="`/policy/${policyEnum.SERVICE}`">用户协议</NuxtLink>
                        <NuxtLink :to="`/policy/${policyEnum.PRIVACY}`">隐私政策</NuxtLink>
                        <NuxtLink to="https://www.waitadmin.cn/docs">开发文档</NuxtLink>
                        <NuxtLink to="tps://www.waitadmin.cn">源码下载</NuxtLink>
                    </div>
                    <p>
                        {{ pcConfig.description }}
                    </p>
                </div>
            </div> -->
            <div class="w-full h-[1px] mx-8 my-4 bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500"></div>
            <div class="copyright flex flex-row flex-wrap gap-2">
                <span class="text-white">{{ websiteConfig.copyright }}</span>
                <NuxtLink class="text-gray-300" to="https://beian.miit.gov.cn/" rel="nofollow" target="_blank">
                    {{ websiteConfig.icp }}
                </NuxtLink>
                <NuxtLink class="text-gray-300" to="https://beian.miit.gov.cn/" rel="nofollow" target="_blank">
                    {{ websiteConfig.pcp }}
                </NuxtLink>
            </div>
        </div>
    </footer>
</template>

<script lang="ts" setup>
import { policyEnum } from '~/enums/app'
import useAppStore from '~/stores/app'

const appStore = useAppStore()
const pcConfig = appStore.getPcConfig
const links = appStore.getLinks
const websiteConfig = appStore.getWebsiteConfig
</script>

<style scoped lang="scss">

</style>
