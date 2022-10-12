<script setup lang="ts">
import { onMounted } from 'vue';

function init() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  canvas.width = canvas.parentElement!.clientWidth;
  canvas.height = canvas.parentElement!.clientHeight;

  const gl = canvas.getContext('webgl') as WebGLRenderingContext;
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vertexShaderSource = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  attribute float a_PointSize;
  varying vec4 v_Color;
  void main(){
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
    v_Color = a_Color;
  }
  `;

  const fragmentShaderSource = `
  precision mediump float;
  varying vec4 v_Color;
  void main(){
    gl_FragColor = v_Color;
  }
  `;

  const vertexData = new Float32Array([
    0.0, 0.0, 1.0, 0.0, 0.0, 5.0,
    0.5, 0.0, 0.0, 1.0, 0.0, 10.0,
    0.5, 0.5, 0.0, 0.0, 1.0, 50.0,

    0.2, 0.2, 1.0, 0.0, 0.0, 20.0,
    0.5, 0.7, 0.0, 1.0, 0.0, 40.0,
    0.0, 0.7, 0.0, 0.0, 1.0, 10.0,
  ]);
  const bytesSize = vertexData.BYTES_PER_ELEMENT;
  console.log(bytesSize);


  try {
    const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

    /**
     * {
     *  a_Position:{
     *    size: 2,
     *    index: 0
     *  },
     *  a_PointSize: {
     *    size: 1,
     *    index: 5
     *  },
     *  a_Color: {
     *    size: 3,
     *    index: 2
     *  }
     * }
     */
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, bytesSize * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    const a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, bytesSize * 6, bytesSize * 5);
    gl.enableVertexAttribArray(a_PointSize);

    const a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, bytesSize * 6, bytesSize * 2);
    gl.enableVertexAttribArray(a_Color);


    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 6);
    gl.drawArrays(gl.LINE_LOOP, 0, 6);
  } catch (error) {
    console.log(error);
  }

  function getPosition(offsetX: number, offsetY: number, el: HTMLElement) {
    const { width, height } = el.getBoundingClientRect();
    return [offsetX / width * 2 - 1, offsetY / height * -2 + 1];
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