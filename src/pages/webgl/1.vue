<script setup lang="ts">
import { onMounted, ref } from "vue";
import { initShaders } from "../../hooks/useWebgl";
const canvas = ref<HTMLCanvasElement>();

const vertexShader = `
  // 一个属性值，将会从缓冲中获取数据
  attribute vec2 a_position;
  uniform vec2 u_resolution;

  // 所有着色器都有一个main方法
  void main() {
    // 从像素坐标转换到 0.0 到 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // 再把 0->1 转换 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // 把 0->2 转换到 -1->+1 (裁剪空间)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  }`;

const fragmentShader = `
	// 片断着色器没有默认精度，所以我们需要设置一个精度
  // mediump是一个不错的默认值，代表“medium precision”（中等精度）
  precision mediump float;
  uniform vec4 u_color;
  void main() {
    // gl_FragColor是一个片断着色器主要设置的变量
    gl_FragColor = u_color; // 返回“红紫色”
  }`;

function setRectangle(
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  width: number,
  height: number
) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;

  // 注意: gl.bufferData(gl.ARRAY_BUFFER, ...) 将会影响到
  // 当前绑定点`ARRAY_BUFFER`的绑定缓冲
  // 目前我们只有一个缓冲，如果我们有多个缓冲
  // 我们需要先将所需缓冲绑定到`ARRAY_BUFFER`

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
}

// 返回 0 到 range 范围内的随机整数
function randomInt(range: number) {
  return Math.floor(Math.random() * range);
}
// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  var shader = gl.createShader(type); // 创建着色器对象
  if (!shader) {
    throw new Error("unable to create shader");
  }
  gl.shaderSource(shader, source); // 提供数据源
  gl.compileShader(shader); // 编译 -> 生成着色器
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  var program = gl.createProgram();
  if (!program) {
    throw new Error("unable to create program");
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  return program;
}

function init() {
  const ca = canvas.value;
  const gl = ca?.getContext("webgl") as WebGLRenderingContext;
  var vs = createShader(gl, gl.VERTEX_SHADER, vertexShader);
  var fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  if (!vs || !fs) {
    throw new Error("unable to create shader");
  }
  var program = createProgram(gl, vs, fs);
  var positionLocation = gl.getAttribLocation(program, "a_position");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var positions = [10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  // 告诉WebGL如何从裁剪空间对应到像素
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // 清空画布
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 使用我们的程序
  gl.useProgram(program);

  var resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  var colorUniformLocation = gl.getUniformLocation(program, "u_color");

  // 启用属性
  gl.enableVertexAttribArray(positionLocation);

  // 告诉属性怎么从positionBuffer中读取数据 (ARRAY_BUFFER)
  var size = 2; // 每次迭代运行提取两个单位数据
  var type = gl.FLOAT; // 每个单位的数据类型是32位浮点型
  var normalize = false; // 不需要归一化数据
  var stride = 0; // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
  var offset = 0; // 从缓冲起始位置开始读取
  gl.vertexAttribPointer(
    positionLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );
  // 绘制50个随机颜色矩形
  for (var ii = 0; ii < 10; ++ii) {
    // 创建一个随机矩形
    // 并将写入位置缓冲
    // 因为位置缓冲是我们绑定在
    // `ARRAY_BUFFER`绑定点上的最后一个缓冲
    setRectangle(
      gl,
      randomInt(300),
      randomInt(300),
      randomInt(300),
      randomInt(300)
    );

    // 设置一个随机颜色
    gl.uniform4f(
      colorUniformLocation,
      Math.random(),
      Math.random(),
      Math.random(),
      1
    );

    // 绘制矩形
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

onMounted(init);
</script>

<template>
  <canvas class="scene" ref="canvas"></canvas>
</template>
