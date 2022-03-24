<!-- @format -->

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  initShaders,
  initBuffer,
  loadImage,
  loadTexture,
} from "../hooks/useWebgl";
const canvas = ref<HTMLCanvasElement>();

const vertexShader = `
		attribute vec3 a_position;
		attribute vec2 a_texCoord;
		varying vec2 vUv;
		void main() {
			gl_Position = vec4(a_position, 1.0);
			vUv = a_texCoord;
		}`;

// 片元着色器中float没有默认精度，所以需要手动提前指定
const fragmentShader = `
		precision mediump float;
		uniform vec4 u_color;
		uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
		varying vec2 vUv;
		void main() {
      vec4 color1 = texture2D(u_Sampler1, vUv);
      vec4 color2 = texture2D(u_Sampler2, vUv);
			gl_FragColor = color1 * color2;
		}`;

function init() {
  const ca = canvas.value;
  if (!ca) return;
  ca.width = 690;
  ca.height = 709;
  const webgl = ca?.getContext("webgl");

  if (webgl) {
    const program = initShaders(webgl, vertexShader, fragmentShader);

    const a_position = webgl.getAttribLocation(program, "a_position");
    const a_texCoord = webgl.getAttribLocation(program, "a_texCoord");
    const u_color = webgl.getUniformLocation(program, "u_color");

    const points = new Float32Array([
      1.0,
      1.0,
      0.0, // 右上
      -1.0,
      1.0,
      0.0, // 左上
      -1.0,
      -1.0,
      0.0, // 左下
      1.0,
      -1.0,
      0.0, // 右下
    ]);
    // 图片坐标系中原点在左上角要进行 y->t 反转
    const texCoords = new Float32Array([
      1.0,
      1.0, // 右上
      0.0,
      1.0, // 左上
      0.0,
      0.0, // 左下
      1.0,
      0.0, // 右下
    ]);

    initBuffer(webgl, a_position, points, 3, 0, 0);
    initBuffer(webgl, a_texCoord, texCoords, 2, 0, 0);

    webgl.uniform4f(u_color, 1.0, 0.0, 0.0, 1.0);

    webgl.clearColor(0, 0, 1, 0.2);
    Promise.all([loadImage("/f.png"), loadImage("/rain.png")]).then(
      (imgs: any[]) => {
        loadTexture(webgl, program, imgs[0], "u_Sampler1", 0);
        loadTexture(webgl, program, imgs[1], "u_Sampler2", 1);
        webgl.clear(webgl.COLOR_BUFFER_BIT);
        webgl.drawArrays(webgl.TRIANGLE_FAN, 0, 4);
      }
    );

    //绘制多种基本图形
    //webgl.LINES
    //webgl.LINE_STRIP
    //webgl.LINE_LOOP
    //webgl.TRIANGLE_STRIP
    //webgl.TRIANGLE_FAN
    //webgl.POINTS
    // webgl.drawArrays(webgl.LINES, 0, 3);
    // webgl.drawArrays(webgl.LINE_STRIP, 0, 4);
    // webgl.drawArrays(webgl.LINE_LOOP, 0, 3);
    // webgl.drawArrays(webgl.TRIANGLE_FAN, 0, 3);
    // webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);
    // webgl.drawArrays(webgl.POINTS, 0, 3);
    // webgl.drawArrays(webgl.TRIANGLES, 0, 3);
  }
}

onMounted(init);
</script>

<template>
  <canvas class="scene" ref="canvas"></canvas>
</template>
