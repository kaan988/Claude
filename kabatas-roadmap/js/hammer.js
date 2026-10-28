// KABATAS – Modern Legal Excellence
// Ein Richterhammer aus Walnuss zieht beim Scrollen eine Linie durch vier Etappen und schlägt am Ende auf den Sockel.
// Ablauf (Scroll-Fortschritt p): Einführung → Aufbruch → vier Etappen → Finale mit Schlag und Kontakt-Einladung.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createTextures } from './textures.js';
import { buildGavel, buildBlock, GAVEL, BLOCK } from './models.js';
import { loadGLB, fitGavel, fitBlock } from './glb.js';
import { dissolvable } from './dissolve.js';

const $ = (s) => document.querySelector(s);
const SVG = 'http://www.w3.org/2000/svg';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = window.matchMedia('(pointer: coarse)').matches;

const clamp01 = (t) => Math.min(1, Math.max(0, t));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t) => t * t * t;
const TURN = Math.PI * 2;

// ---------------------------------------------------------------------------
// Choreografie
// ---------------------------------------------------------------------------
const P = {
  heroHold: 0.04,                    // Einführung steht, bis der Hammer aufbricht
  stops: [0.17, 0.36, 0.55, 0.74],   // Ankunft an den vier Etappen
  hold: 0.045,                       // Ruhezone nach jeder Ankunft
};
const RAISED = 0.5;                  // Ausholwinkel auf dem Weg zur letzten Etappe
const STRIKE = { lift: 0.42, drop: 0.13, settle: 1.3, end: 2.2 }; // Sekunden

// Layout in Bildschirmanteilen; way = Linie (Etappen markiert), offset = Hammer neben der Linie (in Bildhöhen)
const LAYOUTS = {
  wide: {
    hero: { x: 0.68, y: 0.5, size: 0.44, rz: -0.42, roll: 0.5 },
    size: 0.26,
    offset: -0.1,
    labelX: 0.585,
    way: [
      { x: 0.47, y: 0.24, stop: 0 }, { x: 0.42, y: 0.32 },
      { x: 0.4, y: 0.4, stop: 1 }, { x: 0.44, y: 0.49 },
      { x: 0.49, y: 0.58, stop: 2 }, { x: 0.47, y: 0.67 },
      { x: 0.42, y: 0.76, stop: 3 },
    ],
    poses: [
      { rz: 0.45, roll: 0.45 }, { rz: -0.7, roll: -0.5 },
      { rz: Math.PI / 2, roll: TURN }, { rz: 0, roll: TURN + 0.3 },
    ],
  },
  // Hochformat: Linie links, Hammer rechts daneben, Text in einem ruhigen Feld unten
  tall: {
    hero: { x: 0.52, y: 0.34, size: 0.28, rz: -2.72, roll: 0.5 },
    size: 0.17,
    offset: 0.12,
    way: [
      { x: 0.34, y: 0.2, stop: 0 }, { x: 0.26, y: 0.255 },
      { x: 0.27, y: 0.31, stop: 1 }, { x: 0.36, y: 0.365 },
      { x: 0.37, y: 0.42, stop: 2 }, { x: 0.28, y: 0.475 },
      { x: 0.29, y: 0.53, stop: 3 },
    ],
    // gespiegelt und fortlaufend gezählt, damit sich der Hammer nie zurückdreht
    poses: [
      { rz: -3.59, roll: 0.45 }, { rz: -2.44, roll: -0.5 },
      { rz: -4.71, roll: TURN }, { rz: -TURN, roll: TURN + 0.3 },
    ],
  },
};

// Gedämpfte Feder: folgt dem Ziel mit Trägheit; zeta < 1 schwingt minimal nach
function spring(s, target, dt, k, zeta) {
  const c = 2 * Math.sqrt(k) * zeta;
  s.v += (k * (target - s.x) - c * s.v) * dt;
  s.x += s.v * dt;
}

// ---------------------------------------------------------------------------
// Bühne: dunkles Studio, Schlüssellicht von links oben, kühles Kantenlicht von hinten rechts
// ---------------------------------------------------------------------------
function createStage(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, coarse ? 2 : 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 60);
  camera.position.set(0, 0, 10);

  const key = new THREE.DirectionalLight('#fff0dc', 2.6);
  key.position.set(-4, 6, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  key.shadow.radius = 6;
  key.shadow.blurSamples = 16;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 24 });
  const rim = new THREE.DirectionalLight('#d6e2f2', 3.2);
  rim.position.set(5, 3, -6);
  const fill = new THREE.HemisphereLight('#9fb3c8', '#0c1825', 0.35);
  scene.add(key, rim, fill);

  // Nur der Schatten wird sichtbar – wie ein Objekt vor einer Studiowand
  const catcher = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.24 }));
  catcher.position.z = -1.2;
  catcher.receiveShadow = true;
  scene.add(catcher);

  const size = { w: 1, h: 1, H: 1, W: 1 };
  function resize() {
    size.w = window.innerWidth;
    size.h = window.innerHeight;
    renderer.setSize(size.w, size.h, false);
    camera.aspect = size.w / size.h;
    camera.updateProjectionMatrix();
  }
  resize();
  return { renderer, scene, camera, key, rim, size, resize };
}

// Sichtbare Höhe/Breite auf der Ebene z = 0 bei aktueller Kameradistanz
function frustumAt(stage) {
  const { camera, size } = stage;
  size.H = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  size.W = size.H * camera.aspect;
}
function pxToWorld(stage, px, py, out) {
  return out.set((px / stage.size.w - 0.5) * stage.size.W, (0.5 - py / stage.size.h) * stage.size.H, 0);
}

// Gescannte Modelle: Walnuss etwas dunkler, dünne Lackschicht, kontrollierte Reflexionen
function refineMaterials(root, uniforms, { darken = 0.8, clearcoat = 0.4 } = {}) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    const m = o.material;
    const p = new THREE.MeshPhysicalMaterial({
      map: m.map, normalMap: m.normalMap, roughnessMap: m.roughnessMap, metalnessMap: m.metalnessMap,
      roughness: m.roughness ?? 1, metalness: m.metalness ?? 0,
      color: (m.color ? m.color.clone() : new THREE.Color(1, 1, 1)).multiplyScalar(darken),
      clearcoat, clearcoatRoughness: 0.32, envMapIntensity: 0.6,
    });
    if (m.normalScale) p.normalScale.copy(m.normalScale);
    for (const t of [p.map, p.normalMap, p.roughnessMap, p.metalnessMap]) if (t) t.anisotropy = 8;
    o.material = dissolvable(p, uniforms);
  });
}

// Weicher Kontaktschatten unter dem Sockel
function contactShadow() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.75)');
  grad.addColorStop(0.45, 'rgba(0,0,0,0.35)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.002;
  mesh.renderOrder = -1;
  return mesh;
}

// Impuls beim Aufschlag: ein feiner Champagner-Ring und wenige Staubpartikel – kein Leuchten
function buildImpact() {
  const group = new THREE.Group();
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.992, 1, 180),
    new THREE.MeshBasicMaterial({ color: '#b49a68', transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.004;
  const dot = document.createElement('canvas');
  dot.width = dot.height = 32;
  const g = dot.getContext('2d');
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  const count = 16;
  const dust = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({
    color: '#e9e2d4', map: new THREE.CanvasTexture(dot), size: 0.028, transparent: true, opacity: 0, depthWrite: false,
  }));
  dust.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  dust.frustumCulled = false;
  let s = 7;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const seeds = Array.from({ length: count }, () => ({ a: rnd() * TURN, v: 0.25 + rnd() * 0.5, vy: 0.15 + rnd() * 0.35 }));
  group.add(ring, dust);
  group.visible = false;
  return { group, ring, dust, seeds };
}

function updateImpact(fx, t) {
  const on = t > 0 && t < 1;
  fx.group.visible = on;
  if (!on) return;
  const r = easeOutCubic(clamp01(t / 0.7));
  fx.ring.scale.setScalar(0.5 + r * 0.9);
  fx.ring.material.opacity = (1 - r) * 0.5;
  const pos = fx.dust.geometry.attributes.position;
  fx.seeds.forEach((sd, i) => {
    const d = 0.38 + sd.v * easeOutCubic(t) * 0.7;
    pos.setXYZ(i, Math.cos(sd.a) * d, BLOCK.top + sd.vy * Math.sin(Math.min(1, t * 1.4) * Math.PI) * 0.6, Math.sin(sd.a) * d);
  });
  pos.needsUpdate = true;
  fx.dust.material.opacity = Math.pow(1 - t, 1.5) * 0.7;
}

// ---------------------------------------------------------------------------
// Linie: eine Kurve, auf der der Hammer fährt; Abtastung einmal pro Aufbau statt pro Bild
// ---------------------------------------------------------------------------
const route = {
  svg: $('#route'), base: $('#routeBase'), walked: $('#routeWalked'), grad: $('#walkGrad'),
  tip: $('#tip'), tipRing: $('#tipRing'), nodes: [], leaders: [],
  len: 1, stopLen: [0, 0, 0, 0], stopPt: [], xs: null, ys: null, N: 600,
};
const stations = [...document.querySelectorAll('.station')];
const finale = $('#finale');
const hero = $('#hero');
const progress = { el: $('#progress'), no: $('#progressNo'), bar: $('#progressBar') };
let layout = LAYOUTS.wide;

function catmullRom(pts) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function buildRoute() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  layout = w / h < 0.85 ? LAYOUTS.tall : LAYOUTS.wide;
  const wide = layout === LAYOUTS.wide;
  route.svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  const pts = layout.way.map((p) => [p.x * w, p.y * h]);
  const d = catmullRom(pts);
  route.base.setAttribute('d', d);
  route.walked.setAttribute('d', d);
  route.len = route.walked.getTotalLength();
  route.walked.style.strokeDasharray = `${route.len} ${route.len}`;
  const a = pts[0];
  const b = pts[pts.length - 1];
  Object.entries({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }).forEach(([k, v]) => route.grad.setAttribute(k, v));

  const N = route.N;
  route.xs = new Float32Array(N + 1);
  route.ys = new Float32Array(N + 1);
  for (let i = 0; i <= N; i++) {
    const pt = route.walked.getPointAtLength((i / N) * route.len);
    route.xs[i] = pt.x;
    route.ys[i] = pt.y;
  }
  route.stopPt = [];
  layout.way.forEach((wp, i) => {
    if (wp.stop === undefined) return;
    const [x, y] = pts[i];
    let best = 0;
    let bestD = Infinity;
    for (let j = 0; j <= N; j++) {
      const dd = (route.xs[j] - x) ** 2 + (route.ys[j] - y) ** 2;
      if (dd < bestD) { bestD = dd; best = j; }
    }
    route.stopLen[wp.stop] = wp.stop === 0 ? 0 : wp.stop === 3 ? route.len : (best / N) * route.len;
    route.stopPt[wp.stop] = [x, y];
  });

  // Knoten, Ringe und (Desktop) feine Verbindungen zur Textspalte
  const nodes = $('#nodes');
  const leaders = $('#leaders');
  nodes.replaceChildren();
  leaders.replaceChildren();
  route.nodes = route.stopPt.map(([x, y], i) => {
    const ring = document.createElementNS(SVG, 'circle');
    Object.entries({ cx: x, cy: y, r: 11, class: 'node-ring' }).forEach(([k, v]) => ring.setAttribute(k, v));
    const dot = document.createElementNS(SVG, 'circle');
    Object.entries({ cx: x, cy: y, r: 3.5, class: 'node' }).forEach(([k, v]) => dot.setAttribute(k, v));
    nodes.append(ring, dot);
    if (!wide) {
      const no = document.createElementNS(SVG, 'text');
      Object.entries({ x: x - 34, y: y + 3.5, class: 'node-no' }).forEach(([k, v]) => no.setAttribute(k, v));
      no.textContent = `0${i + 1}`;
      nodes.append(no);
    }
    return { ring, dot };
  });
  route.leaders = wide ? route.stopPt.map(([x, y]) => {
    const ln = document.createElementNS(SVG, 'line');
    Object.entries({ x1: x + 16, y1: y, x2: layout.labelX * w - 18, y2: y, class: 'leader' }).forEach(([k, v]) => ln.setAttribute(k, v));
    leaders.append(ln);
    return ln;
  }) : [];

  // Texte: Desktop an den Knoten ausgerichtet, Hochformat übernimmt das CSS
  stations.forEach((el, i) => {
    el.style.left = wide ? `${layout.labelX * w}px` : '';
    el.style.top = wide ? `${route.stopPt[i][1] - 11}px` : '';
  });
  finale.style.left = wide ? `${layout.labelX * w}px` : '';
  finale.style.top = wide ? `${0.3 * h}px` : '';
  ui.cache = {};
}

// Punkt und Richtung auf der Linie aus der Abtastung
function routeAt(l, out) {
  const f = clamp01(l / route.len) * route.N;
  const i = Math.min(route.N - 1, Math.floor(f));
  const t = f - i;
  out.x = lerp(route.xs[i], route.xs[i + 1], t);
  out.y = lerp(route.ys[i], route.ys[i + 1], t);
  return out;
}

// Scroll → Weglänge: Ruhezonen nach jeder Ankunft, dazwischen weich, aber nie stehend
function progressToLength(p) {
  const S = P.stops;
  for (let i = 0; i < S.length - 1; i++) {
    const holdEnd = S[i] + P.hold;
    if (p <= holdEnd) return route.stopLen[i];
    if (p < S[i + 1]) {
      const t = (p - holdEnd) / (S[i + 1] - holdEnd);
      return lerp(route.stopLen[i], route.stopLen[i + 1], lerp(t, smooth(t), 0.65));
    }
  }
  return route.len;
}

function segmentAt(l) {
  let i = 0;
  while (i < 2 && l > route.stopLen[i + 1]) i++;
  return { i, t: clamp01((l - route.stopLen[i]) / (route.stopLen[i + 1] - route.stopLen[i] || 1)) };
}

// ---------------------------------------------------------------------------
// Pose des Hammers aus dem (gefederten) Fortschritt
// ---------------------------------------------------------------------------
const tmpPt = { x: 0, y: 0 };
function targetPose(p) {
  const { w, h } = stage.size;
  const L = layout;
  const off = L.offset * h;
  if (p < P.stops[0]) {
    // Einführung und Aufbruch: von der Bühnenmitte zur ersten Etappe
    const t = smooth(clamp01((p - P.heroHold) / (P.stops[0] - P.heroHold)));
    const st = route.stopPt[0];
    return {
      x: lerp(L.hero.x * w, st[0] + off, t),
      y: lerp(L.hero.y * h, st[1], t) - Math.sin(t * Math.PI) * 0.05 * h,
      size: lerp(L.hero.size, L.size, t),
      rz: lerp(L.hero.rz, L.poses[0].rz, t),
      roll: lerp(L.hero.roll, L.poses[0].roll, t),
      l: 0, seg: -1, segT: t, hero: 1 - t,
    };
  }
  const l = progressToLength(p);
  const { i, t } = segmentAt(l);
  const a = L.poses[i];
  const b = L.poses[i + 1];
  const e = smooth(t);
  routeAt(l, tmpPt);
  return {
    x: tmpPt.x + off,
    y: tmpPt.y,
    size: L.size,
    rz: lerp(a.rz, b.rz, e),
    // Etappe 2 → 3: eine volle Drehung um den Griff, schnell an und sanft aus
    roll: i === 1 ? lerp(a.roll, b.roll, easeOutCubic(t)) : lerp(a.roll, b.roll, e),
    l, seg: i, segT: t, hero: 0,
  };
}

// Schlag aus einer Uhr, die vorwärts läuft, solange der Hammer am Ziel ist, und sonst zurück:
// so verhält sich das Finale in beide Scrollrichtungen gleich
function strikeState(c) {
  const { lift, drop, settle } = STRIKE;
  if (c <= 0) return { swing: RAISED, z: 0, impact: 0, u: -1 };
  if (c < lift) {
    const t = easeOutCubic(c / lift);
    return { swing: RAISED + 0.2 * t, z: 0.22 * t, impact: 0, u: -1 };
  }
  if (c < lift + drop) {
    const t = easeInCubic((c - lift) / drop);
    return { swing: (RAISED + 0.2) * (1 - t), z: 0.22 * (1 - t), impact: 0, u: -1 };
  }
  const u = (c - lift - drop) / settle;
  return { swing: 0.06 * Math.exp(-8 * u) * Math.abs(Math.sin(u * Math.PI * 4)), z: 0, impact: clamp01(u / 0.85), u };
}

// ---------------------------------------------------------------------------
// Oberfläche: Zustände nur schreiben, wenn sie sich ändern
// ---------------------------------------------------------------------------
const ui = { cache: {} };
function setStyle(el, prop, value, key) {
  if (ui.cache[key] === value) return;
  ui.cache[key] = value;
  el.style.setProperty(prop, value);
}
function setClass(el, cls, on, key) {
  if (ui.cache[key] === on) return;
  ui.cache[key] = on;
  el.classList.toggle(cls, on);
}

function updateUI(p, l, finaleOn) {
  const wide = layout === LAYOUTS.wide;
  const heroOut = smooth(clamp01((p - 0.012) / 0.075));
  setStyle(hero, 'opacity', (1 - heroOut).toFixed(3), 'heroO');
  setStyle(hero, 'transform', `translateY(${(-28 * heroOut).toFixed(1)}px)`, 'heroT');
  hero.inert = heroOut > 0.5;
  setStyle(route.svg, 'opacity', smooth(clamp01((p - 0.07) / 0.09)).toFixed(3), 'routeO');

  route.walked.style.strokeDashoffset = String(route.len - l);
  routeAt(l, tmpPt);
  for (const el of [route.tip, route.tipRing]) {
    el.setAttribute('cx', tmpPt.x.toFixed(1));
    el.setAttribute('cy', tmpPt.y.toFixed(1));
  }

  const started = p >= P.stops[0] - 0.012;
  let current = -1;
  stations.forEach((el, i) => {
    const reached = started && l >= route.stopLen[i] - 1;
    if (reached) current = i;
    const near = reached ? 1 - clamp01(Math.abs(l - route.stopLen[i]) / (route.len * 0.24)) : 0;
    setClass(el, 'is-reached', reached, `r${i}`);
    setStyle(el, '--near', near.toFixed(2), `n${i}`);
    setClass(route.nodes[i].dot, 'is-reached', reached, `d${i}`);
    setClass(route.nodes[i].ring, 'is-near', reached && near > 0.82, `g${i}`);
    if (route.leaders[i]) setClass(route.leaders[i], 'is-reached', reached, `l${i}`);
  });
  stations.forEach((el, i) => setClass(el, 'is-current', i === current && !finaleOn, `c${i}`));
  // Im Finale weicht die Etappenspalte der Abschlussbotschaft
  setStyle($('.stations'), 'opacity', finaleOn ? '0' : '1', 'stO');
  setStyle($('#leaders'), 'opacity', finaleOn ? '0' : '1', 'leO');
  setClass(finale, 'is-on', finaleOn, 'fin');
  finale.inert = !finaleOn;

  if (!wide) {
    setClass(progress.el, 'is-on', current >= 0 && !finaleOn, 'prO');
    if (current >= 0 && ui.cache.prN !== current) { ui.cache.prN = current; progress.no.textContent = `0${current + 1}`; }
    setStyle(progress.bar, 'transform', `scaleX(${(l / route.len).toFixed(3)})`, 'prB');
  }
}

// ---------------------------------------------------------------------------
// Bild für Bild
// ---------------------------------------------------------------------------
let stage;
let world;
const state = {
  p: { x: 0, v: 0 },
  rz: { x: 0, v: 0 },
  roll: { x: 0, v: 0 },
  clock: 0,
  light: 0,
};
const tmpV = new THREE.Vector3();
const track = $('#top');

function scrollProgress() {
  const max = track.offsetHeight - window.innerHeight;
  return max > 0 ? clamp01(window.scrollY / max) : 0;
}

function frame(now, dt) {
  const { gavel, block, impact, anvil, shadow } = world;
  const { size, camera, key, rim } = stage;
  const target = scrollProgress();

  // Fortschritt gefedert (kritisch gedämpft), Winkel leicht nachschwingend
  if (reduceMotion) { state.p.x = target; state.p.v = 0; } else spring(state.p, target, dt, 70, 1);
  const p = clamp01(state.p.x);
  const pose = targetPose(p);
  if (reduceMotion) {
    state.rz.x = pose.rz;
    state.roll.x = pose.roll;
  } else {
    spring(state.rz, pose.rz, dt, 42, 0.72);
    spring(state.roll, pose.roll, dt, 36, 0.75);
  }

  // Finale: Uhr läuft am Ziel vorwärts, sonst zügig zurück
  const arrived = p >= P.stops[3] - 0.002 && pose.l >= route.len - 1;
  state.clock = reduceMotion ? (arrived ? STRIKE.end : 0) : Math.min(STRIKE.end, Math.max(0, state.clock + (arrived ? dt : -dt * 1.8)));
  const st = strikeState(state.clock);
  const finaleOn = state.clock >= STRIKE.lift + STRIKE.drop + 0.45;

  // Kamera: minimales Heranrücken im Finale, kurzer Impuls beim Aufschlag
  const finaleW = smooth(clamp01((p - P.stops[3]) / 0.12));
  const push = st.u > 0 && !reduceMotion ? Math.exp(-7 * st.u) * Math.sin(Math.min(1, st.u * 6) * Math.PI) * 0.06 : 0;
  const shake = st.u > 0 && !reduceMotion ? Math.exp(-16 * st.u) * 0.006 : 0;
  camera.position.set(Math.sin(now * 0.083) * shake, Math.cos(now * 0.071) * shake, 10 - 0.3 * finaleW - push);
  camera.lookAt(0, 0, 0);
  frustumAt(stage);

  // Licht fährt beim Laden langsam hoch
  state.light = reduceMotion ? 1 : Math.min(1, state.light + dt / 1.8);
  const lightUp = smooth(state.light);
  key.intensity = 2.6 * lightUp;
  rim.intensity = 3.2 * lightUp;

  // Hammer
  const k = (pose.size * size.H) / (GAVEL.handleLen + 0.3);
  const speed = state.p.v;
  const idle = reduceMotion ? 0 : 1;
  const breathe = Math.sin(now / 1000 * 0.9) * 0.006 * size.H * idle * (1 - Math.min(1, Math.abs(speed) * 20)) * (arrived ? 0 : 1);
  const hop = pose.seg >= 0 && pose.segT > 0 && pose.segT < 1 ? Math.sin(pose.segT * Math.PI) * 0.35 : 0;
  pxToWorld(stage, pose.x, pose.y, tmpV);
  gavel.root.position.set(tmpV.x, tmpV.y + breathe, hop + st.z + pose.hero * 0.2);
  gavel.root.scale.setScalar(k);
  // Einführung: ruhige Präsentationsdrehung; unterwegs leichte Neigung in Fahrtrichtung
  const present = pose.hero * (0.3 + Math.sin(now / 1000 * 0.32) * 0.2 * idle);
  const bank = Math.max(-0.3, Math.min(0.3, speed * 5));
  gavel.root.rotation.set(state.roll.x, present + bank, state.rz.x, 'ZYX');

  // Ausholen auf dem Weg zur letzten Etappe, dann der Schlag
  const approach = pose.seg === 2 ? smooth(clamp01((pose.segT - 0.3) / 0.7)) * RAISED : pose.seg < 2 ? 0 : RAISED;
  gavel.pivot.rotation.z = arrived || state.clock > 0 ? st.swing : approach;
  key.shadow.radius = 3 + (hop + st.z) * 14 + gavel.pivot.rotation.z * 5;

  // Sockel und Kontaktschatten unter der Endposition
  const blockIn = smooth(clamp01((p - 0.6) / 0.13));
  block.uniforms.uDissolve.value = 1 - blockIn;
  block.root.visible = blockIn > 0.002;
  const end = route.stopPt[3];
  pxToWorld(stage, end[0] + layout.offset * size.h, end[1], tmpV);
  const kEnd = (layout.size * size.H) / (GAVEL.handleLen + 0.3);
  anvil.position.set(tmpV.x, tmpV.y - (GAVEL.headHalf + BLOCK.top) * kEnd, 0);
  anvil.scale.setScalar(kEnd);
  const squash = st.u > 0 ? Math.exp(-9 * st.u) * Math.cos(st.u * 26) : 0;
  block.root.scale.set(1 + 0.03 * squash, 1 - 0.065 * squash, 1 + 0.03 * squash);
  shadow.visible = blockIn > 0.002;
  shadow.material.opacity = blockIn * (0.55 + 0.25 * Math.max(0, squash));
  shadow.scale.setScalar(1.05 * (1 + 0.06 * Math.max(0, squash)));
  updateImpact(impact, st.u > 0 ? st.impact : 0);

  updateUI(p, pose.l, finaleOn);
}

// ---------------------------------------------------------------------------
// Navigation, Menü, Kapitel, Formular
// ---------------------------------------------------------------------------
function setupChrome() {
  const nav = $('#nav');
  const toneEls = [...document.querySelectorAll('[data-tone]')].filter((el) => el !== nav);
  const setTone = () => {
    const y = nav.offsetHeight;
    const hit = toneEls.find((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    nav.dataset.tone = hit ? hit.dataset.tone : 'dark';
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', setTone, { passive: true });
  setTone();

  const btn = $('#menuBtn');
  const menu = $('#menu');
  const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Menü'; document.body.style.overflow = ''; };
  btn.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Schließen' : 'Menü';
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menu.querySelector('a').focus();
  });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { close(); btn.focus(); } });

  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  $('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    $('#formNote').textContent = e.currentTarget.checkValidity()
      ? 'Danke. Ihre Anfrage ist vorbereitet – der Versand wird noch angebunden.'
      : 'Bitte füllen Sie Name, E-Mail und Anliegen aus und bestätigen Sie die Einwilligung.';
  });
  $('#year').textContent = new Date().getFullYear();
}

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

async function boot() {
  setupChrome();
  requestAnimationFrame(() => document.body.classList.add('is-loaded'));
  if (!hasWebGL()) {
    document.body.classList.add('no-webgl');
    $('#loading').hidden = true;
    return;
  }

  // Modelle direkt unter ihrem ausgelieferten Pfad laden (keine Fehlanfragen)
  const [gavelScan, blockScan] = await Promise.all([loadGLB('assets/models/gavel.wasm'), loadGLB('assets/models/block.wasm')]);
  // Texturen nur, wenn ein Modell fehlt und der gebaute Ersatz sie braucht
  const tex = gavelScan && blockScan ? {} : await createTextures(() => {}, ['walnut', 'brushed']);

  stage = createStage($('#stage'));
  const gavel = buildGavel(tex, gavelScan && fitGavel(gavelScan, GAVEL.handleLen + 0.1));
  const block = buildBlock(tex, blockScan && fitBlock(blockScan));
  if (gavelScan) refineMaterials(gavel.root, gavel.uniforms, { darken: 0.78, clearcoat: 0.45 });
  if (blockScan) refineMaterials(block.root, block.uniforms, { darken: 0.78, clearcoat: 0.35 });
  // dezente Kante beim Erscheinen des Sockels statt Glühen
  block.uniforms.uEdgeColor.value.set('#b49a68').multiplyScalar(1.4);

  const impact = buildImpact();
  const shadow = contactShadow();
  const anvil = new THREE.Group();
  anvil.rotation.x = 0.3; // Oberseite des Sockels leicht sichtbar
  anvil.add(shadow, block.root, impact.group);
  stage.scene.add(gavel.root, anvil);
  world = { gavel, block, impact, anvil, shadow };

  buildRoute();
  state.p.x = scrollProgress();
  const first = targetPose(state.p.x);
  state.rz.x = first.rz;
  state.roll.x = first.roll;

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { stage.resize(); buildRoute(); }, 120);
  });

  // Nur rendern, solange die Bühne sichtbar ist
  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(track);

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(1 / 30, (now - last) / 1000);
    last = now;
    if (visible) {
      frame(now, dt);
      stage.renderer.render(stage.scene, stage.camera);
    }
    requestAnimationFrame(loop);
  }
  stage.renderer.compile(stage.scene, stage.camera);
  document.body.classList.add('is-ready');
  requestAnimationFrame(loop);
}

boot();
