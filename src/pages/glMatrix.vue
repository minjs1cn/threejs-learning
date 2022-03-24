<script setup lang="ts">
import { onMounted, ref } from "vue";
import { initShaders, initBuffer } from "../hooks/useWebgl";
import { mat4 } from "gl-matrix";

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
  const webgl = ca?.getContext("webgl");

  if (webgl) {
    const program = initShaders(webgl, vertexShader, fragmentShader);

    const a_position = webgl.getAttribLocation(program, "a_position");
    const u_color = webgl.getUniformLocation(program, "u_color");

    const points = new Float32Array([
      0.5, 0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0,
    ]);

    initBuffer(webgl, a_position, points, 3);

    webgl.uniform4f(u_color, 1.0, 0.0, 0.0, 1.0);

    // 先平移后旋转
    const m1 = mat4.create();
    mat4.rotate(m1, m1, Math.PI / 4, [0, 0, 1]);
    mat4.translate(m1, m1, [0.1, 0.1, 0]);

    // 先旋转后平移
    const m2 = mat4.create();
    mat4.translate(m2, m2, [0.1, 0.1, 0]);
    mat4.rotate(m2, m2, Math.PI / 4, [0, 0, 1]);

    const uMatrix = m2;
    const u_matrix = webgl.getUniformLocation(program, "u_matrix");
    webgl.uniformMatrix4fv(u_matrix, false, uMatrix);

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
