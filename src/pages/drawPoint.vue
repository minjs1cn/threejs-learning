<!-- @format -->

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { initShaders } from '../hooks/useWebgl';
	const canvas = ref<HTMLCanvasElement>();

	const vertexShader = `
		void main() {
			gl_Position = vec4(0.5, 0.5, 0.0, 1.0);
			gl_PointSize = 10.0;
		}`;

	const fragmentShader = `
		void main() {
			gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		}`;

	function init() {
		const ca = canvas.value;
		const webgl = ca?.getContext('webgl');

		if (webgl) {
			initShaders(webgl, vertexShader, fragmentShader);

			webgl.clearColor(0, 0, 1, 0.2);
			webgl.clear(webgl.COLOR_BUFFER_BIT);

			webgl.drawArrays(webgl.POINTS, 0, 1);
		}
	}

	onMounted(init);
</script>

<template>
	<canvas class="scene" ref="canvas"></canvas>
</template>
