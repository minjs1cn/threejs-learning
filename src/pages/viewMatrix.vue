<script setup lang="ts">
import { onMounted, ref } from "vue";
import { initShaders } from "../hooks/useWebgl";
import { mat4 } from "gl-matrix";

const canvas = ref<HTMLCanvasElement>();

const vertexShader = `
		attribute vec4 a_Position;
    attribute vec4 a_Color;
    uniform mat4 projectionMatrix;
    uniform mat4 modelViewMatrix;
    varying vec4 v_Color;
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * a_Position;
        v_Color = a_Color;
    }`;

const fragmentShader = `
		precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }`;

function init() {
  const ca = canvas.value;
  if (!ca) return;
  ca.width = window.innerWidth;
  ca.height = window.innerHeight;
  const w = ca.width / 2;
  const h = ca.height / 2;
  const webgl = ca.getContext("webgl");
  if (webgl) {
    webgl.viewport(0, 0, ca.width, ca.height);
    const program = initShaders(webgl, vertexShader, fragmentShader);

    var n = initBuffer(webgl, program);
    if (n < 0) {
      console.error("Failed to init buffer!");
      return;
    }

    const projectionMatrix = webgl.getUniformLocation(
      program,
      "projectionMatrix"
    );
    const modelViewMatrix = webgl.getUniformLocation(
      program,
      "modelViewMatrix"
    );

    const pMatrix = mat4.create();
    // 正交投影
    // mat4.ortho(
    //   pMatrix,
    //   -ca.width / 2,
    //   ca.width / 2,
    //   -ca.height / 2,
    //   ca.height / 2,
    //   0.1,
    //   1000
    // );
    // 透视投影
    mat4.perspective(
      pMatrix,
      (90 * Math.PI) / 180,
      ca.width / ca.height,
      0.1,
      1000
    );
    let d = 0.1;
    function animation() {
      requestAnimationFrame(animation);
      if (d > 1000) {
        d = 0.1;
      }
      d += 10;
      const mvMatrix = mat4.create();
      const mMatrix = mat4.create();
      const sMatrix = mat4.create();
      const tMatrix = mat4.create();
      mat4.scale(sMatrix, sMatrix, [1, -1, 0]); // y 翻转
      mat4.translate(tMatrix, tMatrix, [-ca!.width / 2, ca!.height / 2, 0]); // 平移
      mat4.lookAt(mvMatrix, [0, 0, d], [0, 0, 0], [0, 1, 0]); // 相机
      mat4.multiply(mMatrix, tMatrix, sMatrix);
      mat4.multiply(mvMatrix, mvMatrix, mMatrix);

      webgl!.uniformMatrix4fv(projectionMatrix, false, pMatrix);
      webgl!.uniformMatrix4fv(modelViewMatrix, false, mvMatrix);

      webgl!.clearColor(0.0, 0.0, 0.0, 1.0);
      webgl!.clear(webgl!.COLOR_BUFFER_BIT);
      webgl!.drawArrays(webgl!.TRIANGLES, 0, n);
    }

    animation();
  }
}

function initBuffer(webgl: WebGLRenderingContext, program: WebGLProgram) {
  const w = canvas.value!.width / 2;
  const h = canvas.value!.height / 2;
  var vertexData = new Float32Array([
    //顶点坐标颜色
    0,
    0,
    0.0,
    1.0,
    0.0,
    0.0, // 1 红
    0,
    h,
    0.0,
    0.0,
    1.0,
    0.0, // 2 绿
    w,
    h,
    0.0,
    0.0,
    0.0,
    1.0, // 3 蓝
    0,
    0,
    0.0,
    1.0,
    1.0,
    0.0, // 1 红
    w,
    h,
    0.0,
    0.0,
    1.0,
    1.0, // 3 蓝
    w,
    0,
    0.0,
    1.0,
    0.0,
    1.0, // 2
  ]);
  var n = vertexData.length / 6;
  console.log(n);
  var FSIZE = vertexData.BYTES_PER_ELEMENT;

  var a_Position = webgl.getAttribLocation(program, "a_Position");
  var a_Color = webgl.getAttribLocation(program, "a_Color");

  var buffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
  webgl.bufferData(webgl.ARRAY_BUFFER, vertexData, webgl.STATIC_DRAW);
  webgl.vertexAttribPointer(a_Position, 3, webgl.FLOAT, false, FSIZE * 6, 0);
  webgl.vertexAttribPointer(
    a_Color,
    3,
    webgl.FLOAT,
    false,
    FSIZE * 6,
    FSIZE * 3
  );
  webgl.enableVertexAttribArray(a_Position);
  webgl.enableVertexAttribArray(a_Color);

  return n;
}

onMounted(init);
</script>

<template>
  <canvas class="scene" ref="canvas"></canvas>
</template>
