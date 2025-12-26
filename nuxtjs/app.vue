<template>
	<ElConfigProvider>
		<NuxtLoadingIndicator
			color="#0f70d8"
			:height="2" />
		<NuxtPage />
	</ElConfigProvider>
</template>

<script setup lang="ts">
	import "@fortawesome/fontawesome-free/css/all.css";
	import { ID_INJECTION_KEY, ElConfigProvider } from "element-plus";
	import useAppStore from "./stores/app";
	import useConfStore from "./stores/conf";

	const appStore = useAppStore();
	const confStore = useConfStore();
	const pcConfig = appStore.getPcConfig;
	const websiteConfig = appStore.getWebsiteConfig;

	confStore.setTheme(confStore.primaryTheme, confStore.isDarkColor);

	provide(ID_INJECTION_KEY, {
		prefix: 100,
		current: 0,
	});
	useSeoMeta({
		title: pcConfig.title,
		description: pcConfig.description,
		keywords: pcConfig.keywords,
		ogTitle: pcConfig.title,
		ogDescription: pcConfig.description,
		// ogImage: pcConfig.ogImage,
		twitterTitle: pcConfig.title,
		twitterDescription: pcConfig.description,
		// twitterImage: pcConfig.ogImage,
	});
	const scripts =
		websiteConfig?.scripts?.map((it: any) => ({
			src: it,
		})) || [];
	if (websiteConfig.analyse) {
		scripts?.push({
			src: websiteConfig.analyse,
		});
	}
	useHead({
		titleTemplate: (productCategory) => {
			return productCategory
				? `${productCategory} - ${pcConfig.title}`
				: pcConfig.title;
		},
		link: [
			{
				rel: "icon",
				href: pcConfig.favicon,
			},
		],
		script: scripts,
	});
</script>
