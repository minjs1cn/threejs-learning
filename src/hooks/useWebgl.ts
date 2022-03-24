/** @format */

export function initBuffer(
  gl: WebGLRenderingContext,
  attribute: number,
  data: any,
  n: number,
  stride = 0,
  offset = 0
) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.vertexAttribPointer(attribute, n, gl.FLOAT, false, stride, offset);
  gl.enableVertexAttribArray(attribute);
  return buffer;
}

export function loadShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type);
  if (shader == null) {
    throw new Error("unable to create shader");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    throw new Error(`unable to compile ${type} shader`);
  }
  return shader;
}

export function initShaders(
  webgl: WebGLRenderingContext,
  v: string,
  f: string
) {
  const vertexShader = loadShader(webgl, webgl.VERTEX_SHADER, v);
  const fragmentShader = loadShader(webgl, webgl.FRAGMENT_SHADER, f);
  if (!vertexShader || !fragmentShader) {
    throw new Error("unable to create fragment shader");
  }

  const program = webgl.createProgram();
  if (!program) {
    throw new Error("unable to create program");
  }
  webgl.attachShader(program, vertexShader);
  webgl.attachShader(program, fragmentShader);
  webgl.linkProgram(program);

  if (!webgl.getProgramParameter(program, webgl.LINK_STATUS)) {
    webgl.deleteProgram(program);
    webgl.deleteShader(vertexShader);
    webgl.deleteShader(fragmentShader);
    throw new Error("unable to link program");
  }

  webgl.useProgram(program);

  return program;
}
// 图片加载
export function loadImage(url: string) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (e) => {
      console.error("Failed to load image!");
      reject(e);
    };
    img.src = url;
  });
}

// 纹理加载器
export function loadTexture(
  webgl: WebGLRenderingContext,
  program: WebGLProgram,
  image: TexImageSource,
  uniform = "u_Sampler",
  i = 0
) {
  // 创建纹理对象
  var texture = webgl.createTexture();
  // 获取纹理的存储位置
  var u_Sampler = webgl.getUniformLocation(program, uniform);
  //对纹理进行Y轴反转
  webgl.pixelStorei(webgl.UNPACK_FLIP_Y_WEBGL, 1);
  //开启0号纹理单元
  // @ts-ignore
  webgl.activeTexture(webgl[`TEXTURE${i}`]);
  //向target绑定纹理对象
  webgl.bindTexture(webgl.TEXTURE_2D, texture);
  //配置纹理参数
  webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
  webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.LINEAR);
  // webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.MIRRORED_REPEAT);
  // 告诉WebGL如果纹理坐标超出了s坐标的最大/最小值，直接取边界值
  webgl.texParameteri(
    webgl.TEXTURE_2D,
    webgl.TEXTURE_WRAP_S,
    webgl.CLAMP_TO_EDGE
  );
  // 告诉WebGL如果纹理坐标超出了t坐标的最大/最小值，直接取边界值
  webgl.texParameteri(
    webgl.TEXTURE_2D,
    webgl.TEXTURE_WRAP_T,
    webgl.CLAMP_TO_EDGE
  );

  //配置纹理图像
  webgl.texImage2D(
    webgl.TEXTURE_2D,
    0,
    webgl.RGB,
    webgl.RGB,
    webgl.UNSIGNED_BYTE,
    image
  );
  //将0号纹理传递给着色器
  webgl.uniform1i(u_Sampler, i);
}
