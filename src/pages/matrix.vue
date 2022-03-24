<!-- @format -->

<script setup lang="ts">
	import { onMounted, ref } from 'vue';
	import { initShaders, initBuffer } from '../hooks/useWebgl';
	const canvas = ref<HTMLCanvasElement>();

	const vertexShader = `
		attribute vec3 a_position;
		uniform mat4 u_matrix;
		void main() {
			gl_Position = u_matrix * vec4(a_position, 1.0);
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

			const a_position = webgl.getAttribLocation(program, 'a_position');
			const u_color = webgl.getUniformLocation(program, 'u_color');

			const points = new Float32Array([
				0.5, 0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0,
			]);

			initBuffer(webgl, a_position, points, 3);

			webgl.uniform4f(u_color, 1.0, 0.0, 0.0, 1.0);

			// 旋转变换矩阵
			var tAngle = 90; //角度制
			var tRadian = (tAngle * Math.PI) / 180; //弧度制
			var cosB = Math.cos(tRadian);
			var sinB = Math.sin(tRadian);
			var rotateMatrix = new Float32Array([
				// webgl中矩阵是列主序
				cosB,
				sinB,
				0.0,
				0.0,
				-sinB,
				cosB,
				0.0,
				0.0,
				0.0,
				0.0,
				1.0,
				0.0,
				0.0,
				0.0,
				0.0,
				1.0,
			]);
			// 平移变换矩阵
			var tx = 0.5,
				ty = 0.5,
				tz = 0.0;
			var translateMatrix = new Float32Array([
				// webgl中矩阵是列主序
				1.0,
				0.0,
				0.0,
				0.0,
				0.0,
				1.0,
				0.0,
				0.0,
				0.0,
				0.0,
				1.0,
				0.0,
				tx,
				ty,
				tz,
				1.0,
			]);
			// 缩放变换矩阵
			var sx = 1.5,
				sy = 1.5,
				sz = 1.0;
			var scaleMatrix = new Float32Array([
				// webgl中矩阵是列主序
				sx,
				0.0,
				0.0,
				0.0,
				0.0,
				sy,
				0.0,
				0.0,
				0.0,
				0.0,
				sz,
				0.0,
				0.0,
				0.0,
				0.0,
				1.0,
			]);

			var xformMatrix = scaleMatrix;

			const u_matrix = webgl.getUniformLocation(program, 'u_matrix');
			webgl.uniformMatrix4fv(u_matrix, false, xformMatrix);

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
