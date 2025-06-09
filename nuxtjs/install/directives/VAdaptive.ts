import type { DirectiveBinding } from "vue";

interface BindingValue {
	offsetHeight: number;
	throttleTime: number;
}

interface HTMLElementWithResize extends HTMLElement {
	_onResize?: () => void;
}

export default {
	mounted(
		el: HTMLElementWithResize,
		binding: DirectiveBinding<BindingValue>
	) {
		const { offsetHeight, throttleTime } = binding.value || {
			offsetHeight: 0,
			throttleTime: 0,
		};

		const setElementHeight = () => {
			const windowHeight = window.innerHeight;
			const elementY = el.getBoundingClientRect().top;
			const minHeight = windowHeight - elementY - (offsetHeight || 0);
			el.style.height = `${minHeight}px`;
			el.setAttribute("height", minHeight.toString());
			// el.style.height = `${minHeight < 500 ? 500 : minHeight}px`;
		};

		// 节流函数
		let timer: number | null = null;
		const handleResize = () => {
			if (timer) {
				clearTimeout(timer);
			}
			timer = window.setTimeout(() => {
				setElementHeight();
			}, throttleTime || 0);
		};
		// 初始设置高度
		handleResize();

		window.addEventListener("resize", handleResize);

		// 解绑事件监听器
		el._onResize = handleResize;
	},
	unmounted(el: HTMLElementWithResize) {
		if (el._onResize) {
			window.removeEventListener("resize", el._onResize);
			delete el._onResize;
		}
	},
};
