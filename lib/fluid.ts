/**
 * A small WebGL fluid simulation that distorts an image, driven by the cursor.
 *
 * Ported from react-fluid-distortion by Jeremie Nallet (MIT, https://github.com/whatisjery/react-fluid-distortion),
 * which is based on Pavel Dobryakov's WebGL Fluid Simulation (MIT). Rewritten as plain WebGL2 so it can
 * run inside one image (not a full-screen three.js canvas) with no extra packages. The final pass
 * bends the image along the fluid and inverts its colours where the fluid is.
 */

const SIM_RES = 128;
const DYE_RES = 512;

/** Tuning, roughly the library's defaults. */
const CONFIG = {
  force: 1.1,
  radius: 0.2,
  curl: 1.9,
  swirl: 4,
  pressure: 0.8,
  velocityDissipation: 1.0,
  densityDissipation: 0.96,
  distortion: 0.9,
};

const BASE_VERT = `
attribute vec2 aPosition;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 texelSize;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const HEAD = `precision highp float;
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
`;

const FRAG = {
  splat: `${HEAD}
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 uColor;
uniform vec2 uPointer;
uniform float uRadius;
void main() {
  vec2 p = vUv - uPointer;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
  gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + splat, 1.0);
}`,
  curl: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture2D(uVelocity, vL).y;
  float R = texture2D(uVelocity, vR).y;
  float T = texture2D(uVelocity, vT).x;
  float B = texture2D(uVelocity, vB).x;
  gl_FragColor = vec4(R - L - T + B, 0.0, 0.0, 1.0);
}`,
  vorticity: `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uCurlValue;
uniform float dt;
void main() {
  float L = texture2D(uCurl, vL).x;
  float R = texture2D(uCurl, vR).x;
  float T = texture2D(uCurl, vT).x;
  float B = texture2D(uCurl, vB).x;
  float C = texture2D(uCurl, vUv).x;
  vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L)) * 0.5;
  force /= length(force) + 1.0;
  force *= uCurlValue * C;
  force.y *= -1.0;
  gl_FragColor = vec4(texture2D(uVelocity, vUv).xy + force * dt, 0.0, 1.0);
}`,
  divergence: `${HEAD}
uniform sampler2D uVelocity;
void main() {
  float L = texture2D(uVelocity, vL).x;
  float R = texture2D(uVelocity, vR).x;
  float T = texture2D(uVelocity, vT).y;
  float B = texture2D(uVelocity, vB).y;
  vec2 C = texture2D(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  gl_FragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  clear: `${HEAD}
uniform sampler2D uTexture;
uniform float uClearValue;
void main() { gl_FragColor = uClearValue * texture2D(uTexture, vUv); }`,
  pressure: `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `${HEAD}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture2D(uPressure, vL).x;
  float R = texture2D(uPressure, vR).x;
  float T = texture2D(uPressure, vT).x;
  float B = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}`,
  advection: `${HEAD}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float uDissipation;
void main() {
  vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
  gl_FragColor = uDissipation * texture2D(uSource, coord);
  gl_FragColor.a = 1.0;
}`,
  // The image, bent along the fluid, and inverted where the fluid is.
  display: `${HEAD}
uniform sampler2D uImage;
uniform sampler2D uFluid;
uniform vec2 uScale;
uniform vec2 uOffset;
uniform float uDistort;
vec2 imageUv(vec2 uv) {
  vec2 top = vec2(uv.x, 1.0 - uv.y) * uScale - uOffset;
  return vec2(top.x, 1.0 - top.y);
}
void main() {
  vec3 fluid = texture2D(uFluid, vUv).rgb;
  vec2 uv = vUv - fluid.rg * uDistort * 0.001;
  vec3 color = texture2D(uImage, imageUv(uv)).rgb;
  float amount = smoothstep(0.6, 5.0, length(fluid));
  gl_FragColor = vec4(mix(color, 1.0 - color, amount), 1.0);
}`,
};

type Program = { program: WebGLProgram; uniforms: Record<string, WebGLUniformLocation | null> };
type Target = { fbo: WebGLFramebuffer; texture: WebGLTexture; width: number; height: number };
type Double = { read: Target; write: Target; swap: () => void };

export type FluidSim = {
  /** Feed a pointer position in CSS pixels, relative to the canvas. */
  pointer: (x: number, y: number) => void;
  /** Forget the last pointer position (so re-entering doesn't fling the fluid). */
  resetPointer: () => void;
  resize: () => void;
  /** Advance and draw one frame. */
  step: (dt: number) => void;
  destroy: () => void;
};

/**
 * Starts a simulation on `canvas`, distorting `image` cropped like the site's cover images
 * (16:10 box, `focusX`% across). Returns null when WebGL2 float rendering isn't available.
 */
export function createFluid(canvas: HTMLCanvasElement, image: HTMLImageElement, focusX = 50): FluidSim | null {
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false, premultipliedAlpha: false });
  if (!gl || !(gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float"))) return null;
  gl.getExtension("OES_texture_float_linear");

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const vert = compile(gl.VERTEX_SHADER, BASE_VERT);
  const make = (src: string): Program => {
    const program = gl.createProgram()!;
    gl.attachShader(program, vert);
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, src));
    gl.bindAttribLocation(program, 0, "aPosition");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link");
    const uniforms: Program["uniforms"] = {};
    const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const name = gl.getActiveUniform(program, i)!.name;
      uniforms[name] = gl.getUniformLocation(program, name);
    }
    return { program, uniforms };
  };

  let programs: Record<keyof typeof FRAG, Program>;
  try {
    programs = Object.fromEntries(Object.entries(FRAG).map(([k, src]) => [k, make(src)])) as typeof programs;
  } catch {
    return null;
  }

  // One full-screen quad, drawn for every pass.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);

  const createTarget = (width: number, height: number, filter: number): Target => {
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { fbo, texture, width, height };
  };
  const createDouble = (width: number, height: number, filter: number): Double => {
    const d = { read: createTarget(width, height, filter), write: createTarget(width, height, filter) } as Double;
    d.swap = () => ([d.read, d.write] = [d.write, d.read]);
    return d;
  };
  const freeTarget = (t: Target) => {
    gl.deleteTexture(t.texture);
    gl.deleteFramebuffer(t.fbo);
  };

  // The image texture.
  const imageTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, imageTex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  let width = 1;
  let height = 1;
  let sim: { velocity: Double; density: Double; pressure: Double; divergence: Target; curl: Target; texel: [number, number] } | null = null;
  const cover = { scale: [1, 1], offset: [0, 0] };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (w === canvas.width && h === canvas.height && sim) return;
    canvas.width = width = w;
    canvas.height = height = h;
    const aspect = w / h;
    const simW = Math.round(SIM_RES * Math.max(1, aspect));
    const simH = Math.round(SIM_RES * Math.max(1, 1 / aspect));
    const dyeW = Math.round(DYE_RES * Math.max(1, aspect));
    const dyeH = Math.round(DYE_RES * Math.max(1, 1 / aspect));
    if (sim) {
      for (const d of [sim.velocity, sim.density, sim.pressure]) {
        freeTarget(d.read);
        freeTarget(d.write);
      }
      freeTarget(sim.divergence);
      freeTarget(sim.curl);
    }
    sim = {
      velocity: createDouble(simW, simH, gl.LINEAR),
      density: createDouble(dyeW, dyeH, gl.LINEAR),
      pressure: createDouble(simW, simH, gl.NEAREST),
      divergence: createTarget(simW, simH, gl.NEAREST),
      curl: createTarget(simW, simH, gl.NEAREST),
      texel: [1 / simW, 1 / simH],
    };

    // Crop the image the way ProjectCover does: a 16:10 box at least as big as the frame, placed
    // `focusX`% across, with the image covering that box.
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    const bw = Math.max(W, H * 1.6);
    const bh = bw / 1.6;
    const bx = (focusX / 100) * (W - bw);
    const by = (H - bh) / 2;
    const s = Math.max(bw / image.naturalWidth, bh / image.naturalHeight);
    const dw = image.naturalWidth * s;
    const dh = image.naturalHeight * s;
    const ix = bx + (bw - dw) / 2;
    const iy = by + (bh - dh) / 2;
    cover.scale = [W / dw, H / dh];
    cover.offset = [ix / dw, iy / dh];
  };

  const use = (p: Program) => {
    gl.useProgram(p.program);
    return p.uniforms;
  };
  const bindTex = (unit: number, tex: WebGLTexture | null) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    return unit;
  };
  const draw = (target: Target | null) => {
    if (target) {
      gl.viewport(0, 0, target.width, target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
    } else {
      gl.viewport(0, 0, width, height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const splats: { x: number; y: number; dx: number; dy: number }[] = [];
  let last: { x: number; y: number } | null = null;

  const pointer = (x: number, y: number) => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!last) {
      last = { x, y };
      return;
    }
    splats.push({ x: x / w, y: 1 - y / h, dx: (x - last.x) * CONFIG.force, dy: -(y - last.y) * CONFIG.force });
    last = { x, y };
  };

  const step = (dt: number) => {
    if (!sim) resize();
    const s = sim!;
    const frames = Math.min(dt, 1 / 20) * 60;
    const texel = s.texel;

    while (splats.length) {
      const sp = splats.pop()!;
      let u = use(programs.splat);
      gl.uniform2f(u.texelSize, texel[0], texel[1]);
      gl.uniform1f(u.aspectRatio, width / height);
      gl.uniform2f(u.uPointer, sp.x, sp.y);
      gl.uniform1f(u.uRadius, CONFIG.radius / 100);
      gl.uniform3f(u.uColor, sp.dx, sp.dy, 10);
      gl.uniform1i(u.uTarget, bindTex(0, s.velocity.read.texture));
      draw(s.velocity.write);
      s.velocity.swap();
      u = use(programs.splat);
      gl.uniform1i(u.uTarget, bindTex(0, s.density.read.texture));
      draw(s.density.write);
      s.density.swap();
    }

    let u = use(programs.curl);
    gl.uniform2f(u.texelSize, texel[0], texel[1]);
    gl.uniform1i(u.uVelocity, bindTex(0, s.velocity.read.texture));
    draw(s.curl);

    u = use(programs.vorticity);
    gl.uniform2f(u.texelSize, texel[0], texel[1]);
    gl.uniform1i(u.uVelocity, bindTex(0, s.velocity.read.texture));
    gl.uniform1i(u.uCurl, bindTex(1, s.curl.texture));
    gl.uniform1f(u.uCurlValue, CONFIG.curl);
    gl.uniform1f(u.dt, dt);
    draw(s.velocity.write);
    s.velocity.swap();

    u = use(programs.divergence);
    gl.uniform2f(u.texelSize, texel[0], texel[1]);
    gl.uniform1i(u.uVelocity, bindTex(0, s.velocity.read.texture));
    draw(s.divergence);

    u = use(programs.clear);
    gl.uniform2f(u.texelSize, texel[0], texel[1]);
    gl.uniform1i(u.uTexture, bindTex(0, s.pressure.read.texture));
    gl.uniform1f(u.uClearValue, Math.pow(CONFIG.pressure, frames));
    draw(s.pressure.write);
    s.pressure.swap();

    u = use(programs.pressure);
    gl.uniform2f(u.texelSize, texel[0], texel[1]);
    gl.uniform1i(u.uDivergence, bindTex(1, s.divergence.texture));
    for (let i = 0; i < CONFIG.swirl; i++) {
      gl.uniform1i(u.uPressure, bindTex(0, s.pressure.read.texture));
      draw(s.pressure.write);
      s.pressure.swap();
    }

    u = use(programs.gradient);
    gl.uniform2f(u.texelSize, texel[0], texel[1]);
    gl.uniform1i(u.uPressure, bindTex(0, s.pressure.read.texture));
    gl.uniform1i(u.uVelocity, bindTex(1, s.velocity.read.texture));
    draw(s.velocity.write);
    s.velocity.swap();

    u = use(programs.advection);
    gl.uniform2f(u.texelSize, texel[0], texel[1]);
    gl.uniform1f(u.dt, dt);
    gl.uniform1i(u.uVelocity, bindTex(0, s.velocity.read.texture));
    gl.uniform1i(u.uSource, bindTex(1, s.velocity.read.texture));
    gl.uniform1f(u.uDissipation, Math.pow(CONFIG.velocityDissipation, frames));
    draw(s.velocity.write);
    s.velocity.swap();

    gl.uniform1i(u.uVelocity, bindTex(0, s.velocity.read.texture));
    gl.uniform1i(u.uSource, bindTex(1, s.density.read.texture));
    gl.uniform1f(u.uDissipation, Math.pow(CONFIG.densityDissipation, frames));
    draw(s.density.write);
    s.density.swap();

    u = use(programs.display);
    gl.uniform2f(u.texelSize, texel[0], texel[1]);
    gl.uniform1i(u.uImage, bindTex(0, imageTex));
    gl.uniform1i(u.uFluid, bindTex(1, s.density.read.texture));
    gl.uniform2f(u.uScale, cover.scale[0], cover.scale[1]);
    gl.uniform2f(u.uOffset, cover.offset[0], cover.offset[1]);
    gl.uniform1f(u.uDistort, CONFIG.distortion);
    draw(null);
  };

  const destroy = () => {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };

  resize();
  return {
    pointer,
    resetPointer: () => (last = null),
    resize,
    step,
    destroy,
  };
}
