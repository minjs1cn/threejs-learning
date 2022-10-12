<script setup lang="ts">
import { onMounted } from 'vue';

type PolygonOptions = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  source: number[];
  sourceSize: number;
  attributes: Record<string, { size: number; index: number; }>;
  uniforms?: Record<string, { type: string; value: number | boolean; }>;
};

class Polygon {
  private bytesSize: number = 0;
  private isPointUniformLocation!: WebGLUniformLocation | null;

  constructor (public options: PolygonOptions) {
    this.init();
  }

  private init() {
    const { gl, source, program, } = this.options;
    const bufferSource = new Float32Array(source);
    this.bytesSize = bufferSource.BYTES_PER_ELEMENT;
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, bufferSource, gl.STATIC_DRAW);
    this.isPointUniformLocation = gl.getUniformLocation(program, 'u_IsPoint');
    this.update();
  }

  update() {
    this.updateAttribute();
    this.updateUniform();
  }

  private updateAttribute() {
    const { bytesSize, options } = this;
    const { gl, program, attributes } = options;
    let categorySize = 0;
    for (const key in attributes) {
      const { size } = attributes[key];
      categorySize += size;
    }

    const stride = categorySize * bytesSize;
    for (const key in attributes) {
      const { size, index } = attributes[key];
      const attr = gl.getAttribLocation(program, key);
      gl.vertexAttribPointer(attr, size, gl.FLOAT, false, stride, index * bytesSize);
      gl.enableVertexAttribArray(attr);
    }
  }

  private updateUniform() {
    const { options } = this;
    const { gl, program, uniforms = {} } = options;

    for (const key in uniforms) {
      const { type, value } = uniforms[key];
      const uniform = gl.getUniformLocation(program, key);
      // @ts-ignore
      gl[type](uniform, value);
    }
  }

  draw(type: 'POINTS' | 'TRIANGLES' | 'TRIANGLE_FAN' | 'TRIANGLE_STRIP' | 'LINES' | 'LINE_STRIP' | 'LINE_LOOP' = 'POINTS') {
    const { options, isPointUniformLocation } = this;
    const { gl, sourceSize } = options;
    gl.uniform1i(isPointUniformLocation, type === 'POINTS' ? 1 : 0);
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
  uniform float u_Width;
  uniform float u_Height;
  void main(){
    gl_FragColor = vec4(gl_FragCoord.x / u_Width, gl_FragCoord.y / u_Height, 0, 1);
  }
  `;

  const source = [
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
  ];


  try {
    const program = initShaders(gl, vertexShaderSource, fragmentShaderSource);

    const polygon = new Polygon({
      gl,
      program,
      source,
      sourceSize: 4,
      attributes: {
        a_Position: {
          size: 2,
          index: 0,
        },
        a_Color: {
          size: 1,
          index: 2,
        }
      },
      uniforms: {
        u_width: {
          type: 'uniform1f',
          value: gl.canvas.width,
        },
        u_Height: {
          type: 'uniform1f',
          value: gl.canvas.height,
        },
      }
    });



    polygon.draw('TRIANGLE_STRIP');

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