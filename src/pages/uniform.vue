<!-- @format -->

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { initShaders } from '../hooks/useWebgl';
	const canvas = ref<HTMLCanvasElement>();

	const vertexShader = `
		attribute vec3 a_position;
		attribute float a_pointSize;
		void main() {
			gl_Position = vec4(a_position, 1.0);
			gl_PointSize = a_pointSize;
		}`;

	const fragmentShader = `
		precision mediump float;
		uniform vec4 u_color;
		void main() {
			gl_FragColor = u_color;
		}`;

	function init() {
		const ca = canvas.value;
		const webgl = ca?.getContext('webgl');

		if (webgl) {
			const program = initShaders(webgl, vertexShader, fragmentShader);

			var a_position = webgl.getAttribLocation(program, 'a_position');
			var a_pointSize = webgl.getAttribLocation(program, 'a_pointSize');
			var u_color = webgl.getUniformLocation(program, 'u_color');

			webgl.vertexAttrib3f(a_position, 0.5, 0.5, 0.0);
			webgl.vertexAttrib1f(a_pointSize, 10.0);
			webgl.uniform4f(u_color, 1.0, 0.0, 0.0, 1.0);

			webgl.clearColor(0, 0, 1, 0.2);
			webgl.clear(webgl.COLOR_BUFFER_BIT);

			webgl.drawArrays(webgl.POINTS, 0, 1);

			ca?.addEventListener('mousedown', (e: MouseEvent) => {
				console.log(e, ca.width);
				webgl.vertexAttrib3f(
					a_position,
					e.clientX / ca.clientWidth,
					1 - e.clientY / ca.clientHeight,
					0.0,
				);
				webgl.vertexAttrib1f(a_pointSize, 10.0);
				webgl.uniform4f(u_color, 1.0, 0.0, 0.0, 1.0);

				webgl.clearColor(0, 0, 1, 0.2);
				webgl.clear(webgl.COLOR_BUFFER_BIT);

				webgl.drawArrays(webgl.POINTS, 0, 1);
			});
		}
	}

	onMounted(init);
</script>

<template>
	<canvas class="scene" ref="canvas"></canvas>
</template>
