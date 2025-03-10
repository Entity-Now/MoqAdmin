<template>
    <NuxtLayout name="default">
        <template #container>
            <!-- Left -->
            <div class="w-full">
                <div class="w-full h-[calc(100vh-60px)]">
                    <Carousel :items="pageData.banner" />
                </div>
                <!-- 特性 -->
                <div class="flex flex-col items-center justify-center mt-4">
                    <div class="text-2xl font-bold text-center flex flex-row items-center justify-center gap-6">
                        <span class="block h-1 w-12 bg-gray-800"></span>
                        特性
                        <span class="block h-1 w-12 bg-gray-800"></span>
                    </div>
                    <div class="text-gray-500">
                        Product Features
                    </div>
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
import appApi from '~/api/app'
import Carousel from '~/components/Carousel/index.vue'
import Information from './article/_components/Information.vue'

// 页面数据
const { data: pageData } = await useAsyncData(
    () => appApi.homing(),
    {
        default() {
            return {} as AppHomingResponse
        }
    }
)
</script>
