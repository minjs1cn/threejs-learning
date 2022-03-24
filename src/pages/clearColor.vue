<!-- @format -->

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	const canvas = ref<HTMLCanvasElement>();

	function init() {
		const ca = canvas.value;
		const webgl = ca?.getContext('webgl');

		if (webgl) {
			webgl.clearColor(0, 0, 1, 0.2);
			webgl.clear(webgl.COLOR_BUFFER_BIT);
		}
	}

	onMounted(init);
</script>

<template>
	<canvas class="scene" ref="canvas"></canvas>
</template>
