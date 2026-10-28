// Prozedural modellierte Objekte: Waage, Stein, Richterhammer, Sockel, Goldringe.
import * as THREE from 'three';
import { createDissolve, dissolvable, attachDissolveDepth } from './dissolve.js';
import { SCAN, place } from './glb.js';

const v2 = (pts) => pts.map(([x, y]) => new THREE.Vector2(x, y));
const lathe = (pts, seg = 96) => new THREE.LatheGeometry(v2(pts), seg);

function mesh(geo, mat, { cast = true, receive = true } = {}) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = cast;
  m.receiveShadow = receive;
  return m;
}

// Spiegelt ein Halbprofil (y >= 0) zu einem symmetrischen Profil
function mirrorProfile(half) {
  const lower = half.slice().reverse().map(([r, y]) => [r, -y]);
  return [...lower, ...half.filter(([, y]) => y > 0)];
}

function goldMaterial(tex, u, roughness = 0.3) {
  return dissolvable(new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#d9bd86'),
    metalness: 1,
    roughness,
    roughnessMap: tex.brushed,
    clearcoat: 0.25,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.25,
  }), u);
}

function woodMaterial(tex, u) {
  return dissolvable(new THREE.MeshPhysicalMaterial({
    map: tex.walnut.map,
    roughnessMap: tex.walnut.roughnessMap,
    roughness: 1,
    metalness: 0,
    clearcoat: 0.75,
    clearcoatRoughness: 0.22,
    envMapIntensity: 0.9,
  }), u);
}

// ---------------------------------------------------------------------------
// Waage
// ---------------------------------------------------------------------------
export const SCALE = {
  pivotY: 1.42,
  arm: 0.6,
  chain: 0.62,
  panRadius: 0.21,
  panFloor: -0.62 - 0.062 + 0.012, // Schalenboden relativ zum Aufhängepunkt
};

function chainInstances(material, anchors, count) {
  const link = new THREE.TorusGeometry(0.0105, 0.0026, 6, 14);
  link.scale(1.45, 1, 1);
  const total = anchors.length * count;
  const inst = new THREE.InstancedMesh(link, material, total);
  inst.castShadow = true;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const twist = new THREE.Quaternion();
  const X = new THREE.Vector3(1, 0, 0);
  const s = new THREE.Vector3(1, 1, 1);
  let n = 0;
  for (const [a, b] of anchors) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    dir.normalize();
    q.setFromUnitVectors(X, dir);
    for (let i = 0; i < count; i++) {
      const p = new THREE.Vector3().copy(a).addScaledVector(dir, ((i + 0.5) / count) * len);
      twist.setFromAxisAngle(X, i % 2 ? Math.PI / 2 : 0);
      m.compose(p, q.clone().multiply(twist), s);
      inst.setMatrixAt(n++, m);
    }
  }
  return inst;
}

export function buildScale(tex, scans = {}) {
  if (scans.stand && scans.beam && scans.pan) return buildScannedScale(tex, scans);
  const u = createDissolve(6);
  const gold = goldMaterial(tex, u, 0.3);
  const goldPolished = goldMaterial(tex, u, 0.16);
  const root = new THREE.Group();
  root.name = 'scale';

  // Fuß
  root.add(mesh(lathe([
    [0, 0], [0.40, 0], [0.42, 0.012], [0.422, 0.05], [0.405, 0.064], [0.34, 0.072], [0.322, 0.09],
    [0.31, 0.112], [0.24, 0.13], [0.15, 0.165], [0.085, 0.205], [0.064, 0.232], [0.06, 0.25], [0, 0.25],
  ]), gold));

  // Säule mit Zierringen
  root.add(mesh(lathe([
    [0, 0.25], [0.058, 0.25], [0.058, 0.272], [0.042, 0.29], [0.031, 0.32],
    [0.028, 0.7], [0.036, 0.715], [0.036, 0.735], [0.028, 0.75],
    [0.026, 1.3], [0.04, 1.33], [0.048, 1.37], [0.04, 1.392], [0, 1.392],
  ], 64), gold));

  // Aufsatz
  root.add(mesh(lathe([
    [0, 1.45], [0.03, 1.455], [0.036, 1.475], [0.028, 1.5], [0.016, 1.54], [0.02, 1.565], [0.008, 1.6], [0, 1.625],
  ], 48), goldPolished));

  // Balken
  const beam = new THREE.Group();
  beam.position.y = SCALE.pivotY;
  root.add(beam);
  const bar = new THREE.CylinderGeometry(0.013, 0.013, SCALE.arm * 2 + 0.06, 32);
  bar.rotateZ(Math.PI / 2);
  beam.add(mesh(bar, gold));
  const hub = new THREE.SphereGeometry(0.046, 48, 24);
  hub.scale(1, 1, 0.75);
  beam.add(mesh(hub, goldPolished));
  const center = new THREE.CylinderGeometry(0.026, 0.026, 0.11, 32);
  center.rotateX(Math.PI / 2);
  beam.add(mesh(center, gold));

  const pans = [];
  for (const side of [-1, 1]) {
    const knob = mesh(new THREE.SphereGeometry(0.022, 32, 16), goldPolished);
    knob.position.x = side * (SCALE.arm + 0.04);
    beam.add(knob);
    const hook = mesh(new THREE.TorusGeometry(0.014, 0.0035, 8, 24), gold);
    hook.position.set(side * SCALE.arm, -0.016, 0);
    beam.add(hook);

    // Aufhängung: dreht sich, um senkrecht zu hängen (Pendel)
    const hang = new THREE.Group();
    hang.position.set(side * SCALE.arm, -0.03, 0);
    beam.add(hang);

    const L = SCALE.chain;
    const anchors = [0, 1, 2].map((k) => {
      const a = (k / 3) * Math.PI * 2 - Math.PI / 2; // eine Kette hinten, zwei seitlich vorn – Blick auf den Stein bleibt frei
      return [new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(a) * SCALE.panRadius, -L, Math.sin(a) * SCALE.panRadius)];
    });
    hang.add(chainInstances(gold, anchors, 30));

    const bowl = mesh(lathe([
      [0, 0], [0.07, 0.003], [0.14, 0.016], [0.19, 0.036], [0.214, 0.052], [0.224, 0.06],
      [0.226, 0.066], [0.218, 0.068], [0.205, 0.058], [0.18, 0.042], [0.13, 0.024], [0.06, 0.012], [0, 0.01],
    ]), goldPolished);
    bowl.position.y = -L - 0.062;
    hang.add(bowl);
    pans.push(hang);
  }

  attachDissolveDepth(root, u);
  return { root, beam, pans, uniforms: u };
}

// Waage aus Higgsfield-Modellen: Säule, Balken und Schalen sind getrennte Teile,
// damit Balken und Schalen weiterhin physikalisch schwingen können.
function buildScannedScale(tex, scans) {
  const u = createDissolve(6);
  const gold = goldMaterial(tex, u, 0.22);
  const root = new THREE.Group();
  root.name = 'scale';

  const sStand = SCALE.pivotY / (SCAN.stand.pivotY - SCAN.stand.bottomY);
  adoptScanned(scans.stand, u, true);
  const stand = place(scans.stand, sStand, [0, SCAN.stand.bottomY, 0]);
  root.add(stand);

  const beam = new THREE.Group();
  beam.position.y = SCALE.pivotY;
  root.add(beam);
  const sBeam = SCALE.arm / SCAN.beam.hookX;
  adoptScanned(scans.beam, u, true);
  beam.add(place(scans.beam, sBeam));
  const hookY = SCAN.beam.hookY * sBeam;

  const sPan = SCALE.panRadius / SCAN.pan.radius;
  const eyeR = SCAN.pan.eyeR * sPan;
  const eyeY = SCAN.pan.eyeY * sPan;
  SCALE.panFloor = -SCALE.chain - eyeY + SCAN.pan.floorY * sPan;
  const pans = [];
  for (const side of [-1, 1]) {
    const hang = new THREE.Group();
    hang.position.set(side * SCALE.arm, hookY, 0);
    beam.add(hang);
    // Vier Ösen, um 45° gedreht: keine Kette verdeckt den Stein von vorn
    const anchors = Array.from({ length: SCAN.pan.eyes }, (_, k) => {
      const a = Math.PI / 4 + (k / SCAN.pan.eyes) * Math.PI * 2;
      return [new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.cos(a) * eyeR, -SCALE.chain, Math.sin(a) * eyeR)];
    });
    hang.add(chainInstances(gold, anchors, 30));
    const model = side < 0 ? scans.pan : scans.pan.clone(true);
    adoptScanned(model, u, true);
    const pan = place(model, sPan);
    pan.rotation.y = Math.PI / 4;
    pan.position.y = -SCALE.chain - eyeY;
    hang.add(pan);
    pans.push(hang);
  }

  attachDissolveDepth(root, u);
  return { root, beam, pans, uniforms: u };
}

// ---------------------------------------------------------------------------
// Stein mit eingraviertem „K“
// ---------------------------------------------------------------------------
export function buildStone(tex, scan) {
  const u = createDissolve(14);
  if (scan) {
    // Kantiger Basalt mit goldenem „K“ (Higgsfield), aufrecht; leicht nach hinten gekippt, damit das „K“ zur Kamera zeigt
    const s = 0.135 / SCAN.stone.halfY;
    const tilt = -0.14;
    adoptScanned(scan, u);
    const stone = place(scan, s);
    stone.rotation.set(tilt, 0, 0);
    const root = new THREE.Group();
    root.name = 'stone';
    root.add(stone);
    attachDissolveDepth(root, u);
    return { root, uniforms: u, halfHeight: (SCAN.stone.halfY * Math.cos(tilt) + SCAN.stone.halfZ * Math.sin(-tilt)) * s * 0.9 };
  }
  const geo = new THREE.SphereGeometry(0.15, 96, 64);
  const pos = geo.attributes.position;
  const p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    const n = Math.sin(p.x * 31 + 1.3) * Math.sin(p.y * 27 + 0.4) * Math.sin(p.z * 23 + 2.1);
    p.multiplyScalar(1 + n * 0.035);
    pos.setXYZ(i, p.x, p.y, p.z);
  }
  geo.scale(1.0, 0.74, 0.86);
  geo.computeVertexNormals();
  const mat = dissolvable(new THREE.MeshStandardMaterial({
    map: tex.granite.map,
    bumpMap: tex.granite.bumpMap,
    bumpScale: 2.2,
    roughness: 0.72,
    metalness: 0,
    envMapIntensity: 1.0,
  }), u);
  const stone = mesh(geo, mat);
  const root = new THREE.Group();
  root.name = 'stone';
  stone.rotation.set(-0.38, -0.05, 0.04); // „K“ leicht zur Kamera geneigt
  root.add(stone);
  attachDissolveDepth(root, u);
  return { root, uniforms: u, halfHeight: 0.15 * 0.74 };
}

// ---------------------------------------------------------------------------
// Richterhammer (Kopf senkrecht, Griff nach -X; Ursprung = Kopfmitte)
// ---------------------------------------------------------------------------
export const GAVEL = { headHalf: 0.215, handleLen: 1.0 };

// Materialien eines geladenen Modells auflösbar machen und Schatten aktivieren
// metal = true: Messing-Teile – Texturen entfallen, Metall-Look kommt aus dem Material
function adoptScanned(object, u, metal = false) {
  object.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = true;
    const m = o.material.clone();
    m.emissiveMap = null;
    m.emissive?.setScalar(0);
    if (metal) {
      // Einheitliches poliertes Messing ohne Texturen: die erzeugte Oberflächentextur war fleckig und wirkte verpixelt
      m.map = null;
      m.normalMap = null;
      m.metalnessMap = null;
      m.roughnessMap = null;
      m.metalness = 1;
      m.roughness = 0.26;
      m.color?.set('#d9bd86');
      m.envMapIntensity = 1.3;
    } else {
      m.envMapIntensity = 1.1;
    }
    // Feine Rillen und Gravuren auch unter flachem Blickwinkel scharf halten
    for (const t of [m.map, m.normalMap, m.roughnessMap]) if (t) t.anisotropy = 8;
    o.material = dissolvable(m, u);
  });
}

function gavelRoot(model, u) {
  // root (Position/Blickwinkel) → pivot am Griffende (Schwung) → model
  const root = new THREE.Group();
  root.name = 'gavel';
  const pivot = new THREE.Group();
  pivot.position.x = -GAVEL.handleLen;
  model.position.x = GAVEL.handleLen;
  pivot.add(model);
  root.add(pivot);
  attachDissolveDepth(root, u);
  return { root, pivot, uniforms: u };
}

export function buildGavel(tex, scanned) {
  const u = createDissolve(5);
  const model = new THREE.Group();
  if (scanned) {
    GAVEL.headHalf = scanned.headHalf;
    adoptScanned(scanned.object, u);
    model.add(scanned.object);
    return gavelRoot(model, u);
  }
  const wood = woodMaterial(tex, u);
  const gold = goldMaterial(tex, u, 0.14);

  model.add(mesh(lathe(mirrorProfile([
    [0.112, 0], [0.112, 0.064], [0.122, 0.07], [0.126, 0.085], [0.126, 0.13], [0.118, 0.136],
    [0.124, 0.146], [0.13, 0.152], [0.13, 0.182], [0.124, 0.19], [0.115, 0.2], [0.098, 0.212], [0.07, 0.215], [0, 0.215],
  ]), 96), wood));

  // Goldband
  model.add(mesh(lathe([
    [0.112, -0.066], [0.127, -0.064], [0.13, -0.056], [0.13, 0.056], [0.127, 0.064], [0.112, 0.066],
  ], 96), gold));
  // Feine Goldlinien an den Kanten
  for (const y of [-0.149, 0.149]) {
    const ring = mesh(new THREE.TorusGeometry(0.1305, 0.0025, 8, 96), gold);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    model.add(ring);
  }

  // Griff entlang -X
  const handle = mesh(lathe([
    [0, 0], [0.04, 0], [0.034, 0.03], [0.028, 0.07], [0.026, 0.14], [0.029, 0.3], [0.034, 0.55],
    [0.039, 0.76], [0.033, 0.8], [0.046, 0.84], [0.049, 0.9], [0.044, 0.95], [0.032, 0.985], [0.012, 1.0], [0, 1.0],
  ], 64), wood);
  handle.rotation.z = Math.PI / 2;
  handle.position.x = -0.1;
  model.add(handle);
  const ferrule = mesh(lathe([[0.03, 0], [0.036, 0.004], [0.036, 0.03], [0.03, 0.034]], 64), gold);
  ferrule.rotation.z = Math.PI / 2;
  ferrule.position.x = -0.135;
  model.add(ferrule);
  const capRing = mesh(lathe([[0.04, 0], [0.042, 0.004], [0.042, 0.018], [0.04, 0.022]], 64), gold);
  capRing.rotation.z = Math.PI / 2;
  capRing.position.x = -0.1 - 0.77;
  model.add(capRing);
  return gavelRoot(model, u);
}

// ---------------------------------------------------------------------------
// Sockel
// ---------------------------------------------------------------------------
export const BLOCK = { top: 0.13 };

export function buildBlock(tex, scanned) {
  const u = createDissolve(5);
  const root = new THREE.Group();
  root.name = 'block';
  if (scanned) {
    BLOCK.top = scanned.top;
    adoptScanned(scanned.object, u);
    root.add(scanned.object);
    attachDissolveDepth(root, u);
    return { root, uniforms: u };
  }
  const wood = woodMaterial(tex, u);
  const gold = goldMaterial(tex, u, 0.16);
  root.add(mesh(lathe([
    [0, 0], [0.39, 0], [0.402, 0.008], [0.408, 0.022], [0.408, 0.054], [0.398, 0.066], [0.37, 0.07],
    [0.356, 0.078], [0.352, 0.112], [0.344, 0.124], [0.33, 0.13], [0, 0.13],
  ]), wood));
  const inlay = mesh(new THREE.TorusGeometry(0.364, 0.005, 10, 128), gold);
  inlay.rotation.x = Math.PI / 2;
  inlay.position.y = 0.072;
  root.add(inlay);
  attachDissolveDepth(root, u);
  return { root, uniforms: u };
}

// ---------------------------------------------------------------------------
// Goldringe beim Aufschlag
// ---------------------------------------------------------------------------
export function buildRings() {
  const group = new THREE.Group();
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#e3c48a').multiplyScalar(1.6),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.985, 1, 160), mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.006 + i * 0.001;
    group.add(ring);
    rings.push(ring);
  }
  group.visible = false;
  return { group, rings };
}

// ---------------------------------------------------------------------------
// Funken / Staub: feste Zufallswerte, Position wird pro Frame aus dem Fortschritt berechnet
// ---------------------------------------------------------------------------
export function buildBurst(tex, { count, color, size, opacity = 1, seed = 7 }) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  const mat = new THREE.PointsMaterial({
    color: new THREE.Color(color),
    map: tex.glow,
    size,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  points.visible = false;
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const seeds = Array.from({ length: count }, () => ({ a: rnd() * Math.PI * 2, v: 0.35 + rnd(), vy: 0.4 + rnd() * 1.2 }));
  return { points, seeds, opacity };
}
