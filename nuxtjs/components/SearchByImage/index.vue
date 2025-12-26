<script setup>
	import { ref } from "vue";
	import {
		TransitionRoot,
		TransitionChild,
		Dialog,
		DialogPanel,
		DialogTitle,
		DialogOverlay,
	} from "@headlessui/vue";

	const emit = defineEmits(["submit"]);

	const isOpen = ref(false);
	const file = ref(null);
	const url = ref("");
	const error = ref("");
	const isDragging = ref(false);
	const isLoading = ref(false);

	// 暴露 open 方法给父组件调用
	defineExpose({
		open: () => {
			isOpen.value = true;
			file.value = null;
			url.value = "";
			error.value = "";
		},
	});

	const processFile = (uploadedFile) => {
		if (uploadedFile.type.startsWith("image/")) {
			file.value = uploadedFile;
			error.value = "";
		} else {
			error.value = "请上传图片文件";
			file.value = null;
		}
	};

	const handleFileChange = (e) => {
		const selectedFiles = e.target.files;
		if (selectedFiles.length > 0) {
			processFile(selectedFiles[0]);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		isDragging.value = false;
		const droppedFiles = e.dataTransfer.files;
		if (droppedFiles.length > 0) {
			processFile(droppedFiles[0]);
		}
	};

	const handleSubmit = async () => {
		if (file.value) {
			emit("submit", file.value);
			isOpen.value = false;
			return;
		}

		if (url.value.trim()) {
			try {
				isLoading.value = true;
				const response = await fetch(url.value.trim());
				if (!response.ok) throw new Error("无法获取图片");
				const blob = await response.blob();
				if (!blob.type.startsWith("image/"))
					throw new Error("URL 不是有效的图片地址");

				const urlFile = new File([blob], "image_from_url.jpg", {
					type: blob.type,
				});
				emit("submit", urlFile);
				isOpen.value = false;
			} catch (err) {
				error.value = err.message || "无效的图片 URL";
			} finally {
				isLoading.value = false;
			}
			return;
		}

		error.value = "请上传图片或输入有效的 URL";
	};
</script>

<template>
	<TransitionRoot
		appear
		:show="isOpen"
		as="template">
		<Dialog
			as="div"
			class="relative z-50"
			@close="isOpen = false">
			<TransitionChild
				as="template"
				enter="ease-out duration-300"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in duration-200"
				leave-from="opacity-100"
				leave-to="opacity-0">
				<DialogOverlay
					class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div
					class="flex min-h-full items-center justify-center p-4 text-center">
					<TransitionChild
						as="template"
						enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enter-to="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 sm:scale-100"
						leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<DialogPanel
							class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all w-full max-w-lg sm:my-8 sm:p-6">
							<DialogTitle
								as="h3"
								class="text-lg font-semibold leading-6 text-gray-900">
								以图搜图 - 上传图片
							</DialogTitle>

							<div class="mt-4">
								<!-- 拖拽上传区域 -->
								<div
									@dragenter.prevent="isDragging = true"
									@dragover.prevent
									@dragleave.prevent="isDragging = false"
									@drop.prevent="handleDrop"
									:class="[
										'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
										isDragging
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-300 hover:border-gray-400',
									]">
									<input
										type="file"
										accept="image/*"
										class="hidden"
										id="file-upload"
										@change="handleFileChange" />
									<label
										for="file-upload"
										class="cursor-pointer block">
										<p class="text-gray-600">
											拖拽图片到这里，或
											<span
												class="text-blue-600 underline"
												>点击选择</span
											>
										</p>
									</label>

									<p
										v-if="file"
										class="mt-3 text-sm text-green-600 font-medium">
										已选择: {{ file.name }}
									</p>
								</div>

								<!-- URL 输入 -->
								<div class="mt-6">
									<label
										for="url-input"
										class="block text-sm font-medium text-gray-700">
										或输入图片 URL
									</label>
									<input
										v-model="url"
										type="url"
										id="url-input"
										placeholder="https://example.com/image.jpg"
										class="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
								</div>

								<!-- 错误提示 -->
								<div
									v-if="error"
									class="mt-4 flex items-center text-sm text-red-600">
									<Icon
										icon="fas fa-camera"
										class="h-5 w-5 mr-2 flex-shrink-0" />
									<span>{{ error }}</span>
								</div>
							</div>

							<!-- 按钮区 -->
							<div class="mt-6 flex flex-row-reverse gap-3">
								<button
									type="button"
									:disabled="isLoading"
									@click="handleSubmit"
									class="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
									{{ isLoading ? "处理中..." : "提交" }}
								</button>
								<button
									type="button"
									@click="isOpen = false"
									class="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
									取消
								</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
