// Prozedurale Texturen (Canvas) – keine externen Bilddateien nötig.
import * as THREE from 'three';

// --- Kachelbares Value-Noise ------------------------------------------------
function hash(x, y, seed) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 144269)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function noise2(x, y, px, py, seed) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const x0 = ((xi % px) + px) % px, x1 = (x0 + 1) % px;
  const y0 = ((yi % py) + py) % py, y1 = (y0 + 1) % py;
  const a = hash(x0, y0, seed), b = hash(x1, y0, seed);
  const c = hash(x0, y1, seed), d = hash(x1, y1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

// u, v in [0,1); fx/fy = Grundfrequenz (ganzzahlig, damit die Textur kachelt)
function fbm(u, v, fx, fy, octaves, seed = 0) {
  let sum = 0, amp = 0.5, norm = 0, f = 1;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise2(u * fx * f, v * fy * f, fx * f, fy * f, seed + i * 31);
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / norm;
}

const mix = (a, b, t) => a + (b - a) * t;
const clamp01 = (t) => Math.min(1, Math.max(0, t));

function hexRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function paint(w, h, fn) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const [r, g, b] = fn(x / w, y / h);
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function toTexture(canvas, { color = false, repeat = 1, aniso = 8 } = {}) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = aniso;
  if (color) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// --- Dunkler polierter Stein (Boden) ------------------------------------------
function marble(size = 512) {
  const c0 = hexRgb('#0a131d'), c1 = hexRgb('#15253a'), vein = hexRgb('#24374d');
  const rough = [];
  const color = paint(size, size, (u, v) => {
    const n = fbm(u, v, 4, 4, 5, 3);
    const w = fbm(u, v, 3, 3, 5, 11);
    const t = Math.abs(Math.sin(Math.PI * 2 * (u * 2 + v + w * 1.6)));
    const veins = Math.pow(1 - t, 30) * 0.45 + Math.pow(1 - t, 6) * 0.1;
    const base = clamp01((n - 0.3) * 1.6);
    rough.push(veins);
    return [0, 1, 2].map((k) => mix(mix(c0[k], c1[k], base), vein[k], veins));
  });
  let i = 0;
  const roughness = paint(size, size, () => {
    const r = 140 - rough[i++] * 30;
    return [r, r, r];
  });
  return { map: toTexture(color, { color: true, repeat: 7 }), roughnessMap: toTexture(roughness, { repeat: 7 }) };
}

// --- Walnussholz (Hammer, Sockel) – Maserung entlang der Drehachse ----------------
function walnut() {
  const w = 1024, h = 256;
  const dark = hexRgb('#2a170d'), mid = hexRgb('#4f2f1b'), light = hexRgb('#83532f');
  const grainVals = [];
  const color = paint(w, h, (u, v) => {
    const warp = fbm(u, v, 6, 2, 4, 5);
    const g = fbm(u + warp * 0.08, v, 48, 2, 4, 7);
    const lines = Math.pow(Math.abs(Math.sin(Math.PI * (u * 90 + warp * 6))), 6);
    const tone = clamp01(g * 1.25 - 0.15);
    grainVals.push(lines);
    const base = [0, 1, 2].map((k) => mix(dark[k], mid[k], tone));
    return base.map((c, k) => mix(c, light[k], tone * tone * 0.45) * (1 - lines * 0.35));
  });
  let i = 0;
  const roughness = paint(w, h, () => {
    const r = 105 + grainVals[i++] * 70;
    return [r, r, r];
  });
  return { map: toTexture(color, { color: true }), roughnessMap: toTexture(roughness) };
}

// --- Gebürstetes Metall: feine Ringe um die Drehachse -----------------------------
function brushed() {
  const w = 256, h = 512;
  const rows = new Float32Array(h);
  for (let y = 0; y < h; y++) rows[y] = Math.random();
  const canvas = paint(w, h, (u, v) => {
    const y = Math.floor(v * h);
    const r = 70 + rows[y] * 35 + fbm(u, v, 4, 64, 2, 9) * 30;
    return [r, r, r];
  });
  return toTexture(canvas);
}

// --- Granit mit eingraviertem „K“ (Kugel-UVs: u=0.25 zeigt nach +Z) -------------------
function granite(fontFamily) {
  const w = 1024, h = 512;
  const mask = document.createElement('canvas');
  mask.width = w;
  mask.height = h;
  const m = mask.getContext('2d');
  m.fillStyle = '#000';
  m.fillRect(0, 0, w, h);
  m.fillStyle = '#fff';
  m.textAlign = 'center';
  m.textBaseline = 'middle';
  m.font = `600 210px ${fontFamily}`;
  m.save();
  m.translate(w * 0.25, h * 0.5);
  m.scale(0.62, 1); // Kugel-UVs sind horizontal gestaucht
  m.fillText('K', 0, 12);
  m.restore();
  const maskSoft = document.createElement('canvas');
  maskSoft.width = w;
  maskSoft.height = h;
  const ms = maskSoft.getContext('2d');
  ms.filter = 'blur(3px)';
  ms.drawImage(mask, 0, 0);
  const sharp = m.getImageData(0, 0, w, h).data;
  const soft = ms.getImageData(0, 0, w, h).data;

  const c0 = hexRgb('#77736c'), c1 = hexRgb('#aaa59c'), c2 = hexRgb('#d2cdc3'), engr = hexRgb('#2a2824');
  const bumpVals = new Float32Array(w * h);
  const color = paint(w, h, (u, v) => {
    const idx = Math.floor(v * h) * w + Math.floor(u * w);
    const n = fbm(u, v, 8, 4, 5, 21);
    const s = hash(Math.floor(u * w), Math.floor(v * h), 77);
    const speck = s > 0.985 ? 1 : s < 0.02 ? -1 : 0;
    const k = sharp[idx * 4] / 255;
    const kSoft = soft[idx * 4] / 255;
    bumpVals[idx] = clamp01(0.55 + (n - 0.5) * 0.6 + speck * 0.12 - kSoft * 0.55);
    let col = [0, 1, 2].map((i) => mix(c0[i], c1[i], clamp01((n - 0.25) * 1.8)));
    if (speck > 0) col = col.map((c, i) => mix(c, c2[i], 0.8));
    if (speck < 0) col = col.map((c) => c * 0.55);
    return col.map((c, i) => mix(c, engr[i], k * 0.85));
  });
  const bump = paint(w, h, (u, v) => {
    const b = bumpVals[Math.floor(v * h) * w + Math.floor(u * w)] * 255;
    return [b, b, b];
  });
  const map = toTexture(color, { color: true });
  const bumpMap = toTexture(bump);
  map.wrapT = bumpMap.wrapT = THREE.ClampToEdgeWrapping;
  return { map, bumpMap };
}

// --- Weicher Lichtschein für den Hintergrund ----------------------------------------
function glow() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(256, 200, 0, 256, 256, 256);
  g.addColorStop(0, 'rgba(70,110,150,0.55)');
  g.addColorStop(0.45, 'rgba(36,64,94,0.28)');
  g.addColorStop(1, 'rgba(11,23,36,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// only: Liste der benötigten Texturen – spart Rechenzeit, wenn nicht alle gebraucht werden
export async function createTextures(onProgress = () => {}, only = ['marble', 'walnut', 'brushed', 'granite', 'glow']) {
  const fontFamily = '"Cormorant Garamond", Georgia, serif';
  const need = new Set(only);
  if (need.has('granite')) {
    try {
      await Promise.race([
        document.fonts.load(`600 210px ${fontFamily}`),
        new Promise((r) => setTimeout(r, 2500)),
      ]);
    } catch { /* Fallback-Schrift */ }
  }

  // Zwischen den Schritten kurz an den Browser zurückgeben, damit der Loader animiert
  const tick = () => new Promise((r) => setTimeout(r, 0));
  const makers = { marble, walnut, brushed, granite: () => granite(fontFamily), glow };
  const out = {};
  let n = 0;
  for (const name of Object.keys(makers)) {
    if (!need.has(name)) continue;
    out[name] = makers[name]();
    onProgress(++n / need.size);
    await tick();
  }
  return out;
}
