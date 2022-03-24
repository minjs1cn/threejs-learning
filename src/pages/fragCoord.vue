<!-- @format -->

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { initShaders, initBuffer } from '../hooks/useWebgl';
	const canvas = ref<HTMLCanvasElement>();

	const vertexShader = `
		attribute vec3 a_position;
		void main() {
			gl_Position = vec4(a_position, 1.0);
			gl_PointSize = 10.0;
		}`;

	const fragmentShader = `
		precision mediump float;
		uniform vec4 u_color;
		void main() {
			gl_FragColor = vec4(gl_FragCoord.x / 300.0, 0.0, gl_FragCoord.y / 300.0, 1.0);
		}`;

	function init() {
		const ca = canvas.value;
		const webgl = ca?.getContext('webgl');

		if (webgl) {
			const program = initShaders(webgl, vertexShader, fragmentShader);

			const a_position = webgl.getAttribLocation(program, 'a_position');
			const u_color = webgl.getUniformLocation(program, 'u_color');

			const points = new Float32Array([
				0.5, 0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0,
			]);

			initBuffer(webgl, a_position, points, 3);

			webgl.uniform4f(u_color, 1.0, 0.0, 0.0, 1.0);

			webgl.clearColor(0, 0, 1, 0.2);
			webgl.clear(webgl.COLOR_BUFFER_BIT);
			//绘制多种基本图形

			//webgl.LINES
			//webgl.LINE_STRIP
			//webgl.LINE_LOOP
			//webgl.TRIANGLE_STRIP
			//webgl.TRIANGLE_FAN
			//webgl.POINTS
			// webgl.drawArrays(webgl.LINES, 0, 3);
			// webgl.drawArrays(webgl.LINE_STRIP, 0, 3);
			// webgl.drawArrays(webgl.LINE_LOOP, 0, 3);
			// webgl.drawArrays(webgl.TRIANGLE_FAN, 0, 3);
			// webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 3);
			// webgl.drawArrays(webgl.POINTS, 0, 3);
			webgl.drawArrays(webgl.TRIANGLES, 0, 3);
		}
	}

	onMounted(init);
</script>

<template>
	<canvas class="scene" ref="canvas"></canvas>
</template>
