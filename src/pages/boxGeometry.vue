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
    webgl.enable(webgl.DEPTH_TEST); // 开启深度测试
    webgl.enable(webgl.CULL_FACE); // 开启背面剔除
    webgl.clearColor(0.0, 0.0, 0.0, 1.0);

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

    let d = 0;
    function animation() {
      requestAnimationFrame(animation);
      // if (d > 1000) {
      //   d = 0.1;
      // }
      d += 1;
      const pMatrix = mat4.create();
      // 正交投影
      // mat4.ortho(
      //   pMatrix,
      //   -ca!.width / 2,
      //   ca!.width / 2,
      //   -ca!.height / 2,
      //   ca!.height / 2,
      //   0.1,
      //   1000
      // );
      // 透视投影
      mat4.perspective(
        pMatrix,
        (90 * Math.PI) / 180,
        ca!.width / ca!.height,
        0.1,
        1000
      );
      const mvMatrix = mat4.create();
      const mMatrix = mat4.create();
      const rMatrix = mat4.create();
      const sMatrix = mat4.create();
      const tMatrix = mat4.create();
      mat4.scale(sMatrix, sMatrix, [1, -1, 0]); // y 翻转
      mat4.rotate(rMatrix, rMatrix, (d * Math.PI) / 180, [1, 1, 0]);
      mat4.translate(tMatrix, tMatrix, [-ca!.width / 2, ca!.height / 2, 0]); // 平移
      mat4.lookAt(mvMatrix, [0, 0, 800], [0, 0, 0], [0, 1, 0]); // 相机
      mat4.multiply(mMatrix, sMatrix, rMatrix);
      mat4.multiply(mMatrix, mMatrix, tMatrix);
      mat4.multiply(mvMatrix, mvMatrix, mMatrix);

      webgl!.uniformMatrix4fv(projectionMatrix, false, pMatrix);
      webgl!.uniformMatrix4fv(modelViewMatrix, false, mvMatrix);

      webgl!.clear(webgl!.COLOR_BUFFER_BIT | webgl!.DEPTH_BUFFER_BIT);
      webgl!.drawElements(webgl!.TRIANGLES, n, webgl!.UNSIGNED_BYTE, 0);
    }

    animation();
  }
}

function initBuffer(webgl: WebGLRenderingContext, program: WebGLProgram) {
  const w = canvas.value!.width / 2;
  const h = canvas.value!.height / 2;
  const d = 300;
  // 正方体的八个顶点
  var vertexData = new Float32Array([
    //顶点坐标颜色
    0,
    0,
    d,
    1.0,
    1.0,
    0.0, // v0
    0,
    h,
    d,
    1.0,
    1.0,
    0.0, // v1
    w,
    h,
    d,
    1.0,
    1.0,
    0.0, // v2
    w,
    0,
    d,
    1.0,
    1.0,
    0.0, // v3
    w,
    0,
    0,
    1.0,
    0.0,
    1.0, // v4
    0,
    0,
    0,
    1.0,
    0.0,
    1.0, // v5
    0,
    h,
    0,
    1.0,
    0.0,
    1.0, // v6
    w,
    h,
    0,
    1.0,
    0.0,
    1.0, // v7
  ]);
  // 每个面的索引
  var indices = new Uint8Array([
    0,
    1,
    2,
    0,
    2,
    3, // 前
    0,
    3,
    4,
    0,
    4,
    5, // 右
    0,
    5,
    6,
    0,
    6,
    1, // 上
    1,
    6,
    7,
    1,
    7,
    2, // 左
    7,
    4,
    3,
    7,
    3,
    2, // 下
    4,
    7,
    6,
    4,
    6,
    5, // 后
  ]);
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
  var indicesBuffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, indices, webgl.STATIC_DRAW);
  webgl.bindBuffer(webgl.ARRAY_BUFFER, null);
  return indices.length;
}

onMounted(init);
</script>

<template>
  <canvas class="scene" ref="canvas"></canvas>
</template>
