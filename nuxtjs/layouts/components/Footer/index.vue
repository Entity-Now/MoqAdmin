<template>
	<footer
		class="bg-background border-t border-border/40 w-full py-16 lg:py-24">
		<div class="max-w-[1450px] mx-auto px-6 lg:px-12">
			<div
				class="flex flex-col lg:flex-row justify-between gap-16 lg:gap-8">
				<!-- Brand Section -->
				<div class="space-y-6 lg:max-w-sm">
					<h2
						v-if="pcConfig.title"
						class="text-2xl font-nike font-bold tracking-tight text-foreground uppercase">
						{{ pcConfig.title }}
					</h2>
					<p
						class="text-sm text-muted-foreground leading-relaxed font-medium">
						{{ pcConfig.description }}
					</p>
				</div>

				<!-- Links Grid -->
				<div
					class="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16">
					<!-- Navigation -->
					<div class="space-y-6">
						<h3
							class="text-xs font-nike font-bold text-foreground uppercase tracking-widest">
							Resources
						</h3>
						<ul class="space-y-4">
							<li
								v-for="link in links"
								:key="link.title">
								<NuxtLink
									:to="link.url"
									:target="link.target"
									class="text-[13px] text-muted-foreground hover:text-primary transition-colors font-medium">
									{{ link.title }}
								</NuxtLink>
							</li>
						</ul>
					</div>

					<!-- Support -->
					<div class="space-y-6">
						<h3
							class="text-xs font-nike font-bold text-foreground uppercase tracking-widest">
							Company
						</h3>
						<ul class="space-y-4">
							<li>
								<NuxtLink
									:to="`/policy/${policyEnum.SERVICE}`"
									class="text-[13px] text-muted-foreground hover:text-primary transition-colors font-medium">
									Terms of Service
								</NuxtLink>
							</li>
							<li>
								<NuxtLink
									:to="`/policy/${policyEnum.PRIVACY}`"
									class="text-[13px] text-muted-foreground hover:text-primary transition-colors font-medium"
									>Privacy Policy</NuxtLink
								>
							</li>
						</ul>
					</div>

					<!-- Contact -->
					<div class="space-y-6">
						<h3
							class="text-xs font-nike font-bold text-foreground uppercase tracking-widest">
							Support
						</h3>
						<ul class="space-y-4 text-[13px] font-medium">
							<li class="flex items-center gap-3">
								<span class="text-muted-foreground w-12"
									>QQ</span
								>
								<span class="text-foreground">{{
									pcConfig.qq
								}}</span>
							</li>
							<li class="flex items-center gap-3">
								<span class="text-muted-foreground w-12"
									>Email</span
								>
								<span class="text-foreground truncate">{{
									pcConfig.email
								}}</span>
							</li>
							<li class="flex items-center gap-3">
								<span class="text-muted-foreground w-12"
									>Work</span
								>
								<span class="text-foreground">{{
									pcConfig.work_time
								}}</span>
							</li>
						</ul>
					</div>
				</div>

				<!-- QR Codes Section -->
				<div
					class="flex flex-row md:flex-col lg:flex-row gap-8 lg:gap-12">
					<div class="flex flex-col items-center gap-3">
						<div
							class="p-2 bg-secondary rounded-2xl border border-border/40">
							<img
								src="/wx_qrcode.jpg"
								alt="Official Account"
								class="w-24 h-24 lg:w-28 lg:h-28 object-contain" />
						</div>
						<span
							class="text-[10px] font-nike font-bold uppercase tracking-widest text-muted-foreground"
							>Public</span
						>
					</div>
					<div class="flex flex-col items-center gap-3">
						<div
							class="p-2 bg-secondary rounded-2xl border border-border/40">
							<img
								src="/wx_miniprogram_qrcode.png"
								alt="Miniprogram"
								class="w-24 h-24 lg:w-28 lg:h-28 object-contain" />
						</div>
						<span
							class="text-[10px] font-nike font-bold uppercase tracking-widest text-muted-foreground"
							>Miniprogram</span
						>
					</div>
				</div>
			</div>

			<!-- Divider -->
			<div class="w-full h-px bg-border/40 my-12 lg:my-16"></div>

			<!-- Bottom Bar -->
			<div
				class="flex flex-col md:flex-row items-center justify-between gap-6">
				<div class="flex flex-wrap items-center justify-center gap-6">
					<span
						class="text-[11px] font-medium text-muted-foreground/60">
						{{ websiteConfig.copyright }}
					</span>
					<NuxtLink
						class="text-[11px] font-medium text-muted-foreground/60 hover:text-primary transition-colors"
						to="https://beian.miit.gov.cn/"
						rel="nofollow"
						target="_blank">
						{{ websiteConfig.icp }}
					</NuxtLink>
					<NuxtLink
						class="text-[11px] font-medium text-muted-foreground/60 hover:text-primary transition-colors"
						to="https://beian.miit.gov.cn/"
						rel="nofollow"
						target="_blank">
						{{ websiteConfig.pcp }}
					</NuxtLink>
				</div>

				<!-- Social/Local Icons could go here -->
				<div class="flex items-center gap-4 text-muted-foreground/60">
					<span
						class="text-[11px] font-nike font-bold uppercase tracking-tighter"
						>© 2026 Moqi Selected</span
					>
				</div>
			</div>
		</div>
	</footer>
</template>

<script lang="ts" setup>
	import { policyEnum } from "~/enums/app";
	import useAppStore from "~/stores/app";

	const appStore = useAppStore();
	const pcConfig = appStore.getPcConfig;
	const links = appStore.getLinks;
	const websiteConfig = appStore.getWebsiteConfig;
</script>

<style scoped lang="scss"></style>
