import Directives from "@/install/directives/All";

export default defineNuxtPlugin((nuxtApp) => {
	for (const directives of Directives) {
		nuxtApp.vueApp.directive(directives.name, directives.directive);
	}
});
