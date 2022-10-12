<script setup lang="ts">
import { onMounted } from 'vue';

type PolygonOptions = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  source: number[];
  sourceSize: number;
  attributes: Record<string, { size: number; index: number; }>;
};

class Polygon {
  private bytesSize: number = 0;

  constructor (public options: PolygonOptions) {
    this.init();
  }

  private init() {
    const { gl, source, } = this.options;
    const bufferSource = new Float32Array(source);
    this.bytesSize = bufferSource.BYTES_PER_ELEMENT;
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, bufferSource, gl.STATIC_DRAW);
    this.update();
  }

  update() {
    this.updateAttribute();
  }

  private updateAttribute() {
    const { gl, program, sourceSize, attributes } = this.options;
    const bytesSize = this.bytesSize;
    const stride = sourceSize * bytesSize;
    for (const key in attributes) {
      const { size, index } = attributes[key];
      const attr = gl.getAttribLocation(program, key);
      gl.vertexAttribPointer(attr, size, gl.FLOAT, false, stride, index * bytesSize);
      gl.enableVertexAttribArray(attr);
    }
  }

  draw(type: 'POINTS' | 'TRIANGLES' = 'POINTS') {
    const { gl, sourceSize } = this.options;
    gl.drawArrays(gl[type], 0, sourceSize);
  }
}

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
    float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
    if (dist <= 0.5) {
      gl_FragColor = v_Color;
    } else {
      discard;
    }
  }
  `;

  const source = [
    0.0, 0.0, 1.0, 0.0, 0.0, 50.0,
    0.5, 0.0, 0.0, 1.0, 0.0, 50.0,
    0.5, 0.5, 0.0, 0.0, 1.0, 50.0,

    0.0, 0.0, 1.0, 0.0, 0.0, 50.0,
    0.5, 0.5, 0.0, 0.0, 1.0, 50.0,
    0.0, 0.5, 0.0, 0.0, 1.0, 50.0,
  ];


  try {
    const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);

    const polygon = new Polygon({
      gl,
      program,
      source,
      sourceSize: 6,
      attributes: {
        a_Position: {
          size: 2,
          index: 0,
        },
        a_Color: {
          size: 3,
          index: 2,
        },
        a_PointSize: {
          size: 1,
          index: 5,
        },
      }
    });

    polygon.draw();
    polygon.draw('TRIANGLES');
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