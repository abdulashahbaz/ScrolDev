// Living sky: the hero's sky layer redrawn in WebGL with a slow domain-warp
// so the clouds drift, plus a soft lens that follows the pointer.
// Falls back silently to the plain <img> underneath.

const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main() { vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

void main() {
  // object-fit: cover, object-position: 50% 100%
  float rs = uRes.x / uRes.y, ri = uImg.x / uImg.y;
  vec2 scale = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
  vec2 uv = vec2((vUv.x - 0.5) * scale.x + 0.5, vUv.y * scale.y);

  float t = uTime * 0.035;
  float sky = smoothstep(0.25, 0.75, uv.y);
  vec2 q = vec2(fbm(uv * 3.0 + vec2(t, 0.0)), fbm(uv * 3.0 + vec2(-t * 0.7, 4.2)));
  vec2 warp = (q - 0.5) * 0.022 * sky;
  warp.x += sin(uTime * 0.05) * 0.004 * sky;

  vec2 m = uMouse;
  vec2 d = vUv - m;
  d.x *= uRes.x / uRes.y;
  float r = length(d);
  float lens = smoothstep(0.32, 0.0, r) * uHover;
  vec2 dir = r > 0.0 ? normalize(d) : vec2(0.0);
  warp -= dir * lens * 0.018 * scale;

  vec2 st = uv + warp;
  float ca = lens * 0.004;
  vec3 col;
  col.r = texture2D(uTex, st + vec2(ca, 0.0)).r;
  col.g = texture2D(uTex, st).g;
  col.b = texture2D(uTex, st - vec2(ca, 0.0)).b;
  col += lens * 0.035;
  gl_FragColor = vec4(col, 1.0);
}`;

export function livingSky(canvas, url) {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "low-power" });
  if (!gl) return null;

  const sh = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (err) {
    console.warn("[oriel] sky shader disabled:", err.message);
    return null;
  }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n) => gl.getUniformLocation(prog, n);
  const U = { res: u("uRes"), img: u("uImg"), time: u("uTime"), mouse: u("uMouse"), hover: u("uHover") };

  const tex = gl.createTexture();
  const state = { tick: 0, running: false, visible: true, mouse: [0.5, 0.6], target: [0.5, 0.6], hover: 0, hoverTarget: 0, start: performance.now(), raf: 0 };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U.res, canvas.width, canvas.height);
  };

  const frame = (now) => {
    state.raf = requestAnimationFrame(frame);
    // a pinned host confuses IntersectionObserver, so poll the rect instead
    if (state.tick++ % 12 === 0) {
      const r = canvas.getBoundingClientRect();
      state.visible = r.bottom > 0 && r.top < window.innerHeight && document.visibilityState === "visible";
    }
    if (!state.visible) return;
    state.mouse[0] += (state.target[0] - state.mouse[0]) * 0.06;
    state.mouse[1] += (state.target[1] - state.mouse[1]) * 0.06;
    state.hover += (state.hoverTarget - state.hover) * 0.05;
    gl.uniform1f(U.time, (now - state.start) / 1000);
    gl.uniform2f(U.mouse, state.mouse[0], state.mouse[1]);
    gl.uniform1f(U.hover, state.hover);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const image = new Image();
  image.decoding = "async";
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.uniform2f(U.img, image.naturalWidth, image.naturalHeight);
    resize();
    state.raf = requestAnimationFrame(frame);
    canvas.classList.add("is-ready");
  };
  image.src = url;

  window.addEventListener("resize", resize);
  const host = canvas.closest("section") || canvas.parentElement;
  host.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    state.target = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
    state.hoverTarget = 1;
  });
  host.addEventListener("pointerleave", () => (state.hoverTarget = 0));

  return {
    destroy() {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("resize", resize);
    },
  };
}
