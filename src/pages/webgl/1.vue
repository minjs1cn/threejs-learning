<script setup lang="ts">
import { onMounted } from 'vue';

function init() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = canvas.parentElement!.clientWidth;
  canvas.height = canvas.parentElement!.clientHeight;

  const gl = canvas.getContext('webgl') as WebGLRenderingContext;


  const vertexShaderSource = `
  void main(){
    gl_Position = vec4(0, 0, 0, 1);
    gl_PointSize = 50.0;
  }
  `;

  const fragmentShaderSource = `
  void main(){
    gl_FragColor = vec4(1, 0, 0, 1);
  }
  `;

  try {
    initShaders(gl, vertexShaderSource, fragmentShaderSource);
    render();
  } catch (error) {
    console.log(error);
  }

  function render() {
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  function initShaders(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = gl.createProgram();
    if (!program) {
      throw Error('create program failed');
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      throw new Error("unable to link program");
    }
    gl.useProgram(program);
    return program;
  }

  function loadShader(type: number, shaderSource: string) {
    const shader = gl.createShader(type);
    if (!shader) {
      throw Error('create shader failed');
    }
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw Error(`unable to compile ${type} shader`);
    }
    return shader;
  }



}
onMounted(init);
</script>

<template>
  <canvas id="canvas" class="scene"></canvas>
</template>