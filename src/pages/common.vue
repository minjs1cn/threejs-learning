<!-- @format -->

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { initShaders, initBuffer } from '../hooks/useWebgl';
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
		void main() {
      vec2 pos = gl_FragCoord.xy;
      float a = atan(pos.y, pos.x);
      float f = cos(a * 1.0);
      float r = length(pos) * 4.0;
      vec3 color = vec3(0.0);
			gl_FragColor = vec4(vec3(smoothstep(f, f, r)), 1.0);
		}`;

function init() {
  const ca = canvas.value;

  if (!ca) return;
  ca.width = ca.offsetWidth;
  ca.height = ca.offsetHeight;
  const webgl = ca?.getContext('webgl');

  if (webgl) {
    const program = initShaders(webgl, vertexShader, fragmentShader);

    var a_position = webgl.getAttribLocation(program, 'a_position');
    var a_pointSize = webgl.getAttribLocation(program, 'a_pointSize');

    const points = new Float32Array([
      1.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0, -1.0, 0.0,
      -1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 0.0, 0.0, 0.0
    ]);

    initBuffer(webgl, a_position, points, 3, 0, 0);

    // webgl.uniform4f(u_color, 1.0, 0.0, 0.0, 1.0);

    // webgl.clearColor(0, 0, 1, 0.2);
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    webgl.drawArrays(webgl.TRIANGLES, 0, 3);
  }
}

onMounted(init);
</script>

<template>
  <canvas class="scene" ref="canvas"></canvas>
</template>
