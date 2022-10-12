<script setup lang="ts">
import { onMounted } from 'vue';

type UniformType = 'uniform1f' | 'uniform2f' | 'uniform2fv';
type UniformValue = number | number[];

type PolygonOptions = {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  source: number[];
  sourceSize: number;
  attributes: Record<string, { size: number; index: number; }>;
  uniforms?: Record<string, { type: UniformType; value: UniformValue; }>;
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

  updateAttribute() {
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

  setUniform(key: string, value: UniformValue) {
    const { options } = this;
    const { uniforms = {} } = options;
    const uniform = uniforms[key];
    if (uniform) {
      uniform.value = value;
    }
  }

  updateUniform() {
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
  void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize;
    v_Color = a_Color;
  }
  `;

  const fragmentShaderSource = `
  precision mediump float;
  varying vec4 v_Color;
  uniform vec2 u_CanvasSize;
  uniform float u_Time;
  vec2 center = u_CanvasSize / 2.0;
  float pi2 = radians(360.0);
  float noise(vec2 fragCoord) {
    vec2 a = vec2(0.1234, 0.5678);
    float d = dot(fragCoord, a);
    float n = sin(d) * 10000.0;
    float f = fract(n);
    return f;
  }
  float getAngle(vec2 p) {
    float ang = atan(p.y, p.x);
    if (ang < 0.0) {
      ang += pi2;
    }
    return ang;
  }
  float gradient(float a) {
    float f = 0.5 * sin(a * 4.0) + 0.5;
    return f;
  }
  float wire(vec2 p) {
    vec2 a = vec2(0.0, 1.0);
    float d = dot(p, a);
    float n = tan(d) * 10000.0;
    float f = fract(n);
    return f;
  }
  void main() {
    vec2 p = gl_FragCoord.xy - center;
    float len = length(p);
    float cLen = length(center);
    float ang = getAngle(p);
    float f1 = gradient(ang);
    f1 = 0.5 + 0.5 *f1;

    float x = center.x * ang * pi2;
    float y = (len / cLen) * center.y;
    float f2 = wire(vec2(int(x), int(y)));
    f2 = clamp(f2, 0.75, 0.8);

    float f3 = noise(gl_FragCoord.xy);
    f3 *= 0.07;
    float f = f1 * f2 + f3;
    gl_FragColor = vec4(vec3(f), 1);
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
        u_CanvasSize: {
          type: 'uniform2fv',
          value: [gl.canvas.width, gl.canvas.height],
        },
        u_Time: {
          type: 'uniform1f',
          value: 0,
        }
      }
    });





    function animate(dt: number) {
      polygon.setUniform('u_Time', dt);
      polygon.updateUniform();
      gl.clear(gl.COLOR_BUFFER_BIT);
      polygon.draw('TRIANGLE_STRIP');
      requestAnimationFrame(animate);
    }

    animate(0);

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