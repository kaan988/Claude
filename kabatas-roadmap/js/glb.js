// Mit Higgsfield (Tripo) erzeugte GLB-Modelle laden und automatisch auf die Maße der Szene ausrichten.
// Die Modelle kommen in beliebiger Lage an; Hauptachsen (PCA) bestimmen Griff, Kopf und Oberseite.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

// Liefert die Szene des Modells oder null (dann bleiben die prozedural gebauten Objekte).
// Zweiter Versuch mit .wasm-Endung: die Artifact-Vorschau liefert keine .glb-Dateien aus.
export function loadGLB(url) {
  return loader.loadAsync(url)
    .catch(() => loader.loadAsync(url.replace(/\.glb$/, '.wasm')))
    .then((g) => g.scene)
    .catch(() => null);
}

function vertices(root) {
  root.updateMatrixWorld(true);
  const out = [];
  root.traverse((o) => {
    if (!o.isMesh) return;
    const p = o.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) out.push(new THREE.Vector3().fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld));
  });
  return out;
}

function centroid(pts) {
  const c = new THREE.Vector3();
  pts.forEach((p) => c.add(p));
  return c.divideScalar(pts.length);
}

function covariance(pts, c) {
  const m = new Array(9).fill(0);
  for (const p of pts) {
    const d = [p.x - c.x, p.y - c.y, p.z - c.z];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) m[i * 3 + j] += d[i] * d[j];
  }
  return m;
}

// Größte Hauptachse per Potenzmethode, optional senkrecht zu einer gegebenen Achse
function principal(m, ortho) {
  let v = new THREE.Vector3(0.577, 0.611, 0.541);
  for (let k = 0; k < 80; k++) {
    if (ortho) v.addScaledVector(ortho, -v.dot(ortho));
    v = new THREE.Vector3(
      m[0] * v.x + m[1] * v.y + m[2] * v.z,
      m[3] * v.x + m[4] * v.y + m[5] * v.z,
      m[6] * v.x + m[7] * v.y + m[8] * v.z,
    ).normalize();
  }
  if (ortho) v.addScaledVector(ortho, -v.dot(ortho)).normalize();
  return v;
}

// Mittlerer Abstand zur Achse für die Punkte nahe einem Ende
function endSpread(pts, c, axis, fromMax, frac) {
  const proj = pts.map((p) => p.clone().sub(c).dot(axis));
  const lo = Math.min(...proj);
  const hi = Math.max(...proj);
  const cut = fromMax ? hi - (hi - lo) * frac : lo + (hi - lo) * frac;
  let sum = 0;
  let n = 0;
  pts.forEach((p, i) => {
    if (fromMax ? proj[i] < cut : proj[i] > cut) return;
    const d = p.clone().sub(c);
    sum += d.addScaledVector(axis, -d.dot(axis)).length();
    n++;
  });
  return n ? sum / n : 0;
}

function wrap(scene, basisX, basisY, origin, s) {
  const z = new THREE.Vector3().crossVectors(basisX, basisY).normalize();
  const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(basisX, basisY, z)).invert();
  const fit = new THREE.Group();
  fit.add(scene);
  fit.quaternion.copy(q);
  fit.scale.setScalar(s);
  fit.position.copy(origin).applyQuaternion(q).multiplyScalar(-s);
  return fit;
}

// Hammer: Kopfmitte in den Ursprung, Kopfachse nach +Y, Griff nach -X; Griffende bei x = -reach
export function fitGavel(scene, reach = 1.1) {
  const pts = vertices(scene);
  const c = centroid(pts);
  const axis = principal(covariance(pts, c));
  // Achse zeigt vom Griff zum Kopf (dort ist der Querschnitt breiter)
  if (endSpread(pts, c, axis, false, 0.15) > endSpread(pts, c, axis, true, 0.15)) axis.negate();
  const proj = pts.map((p) => p.clone().sub(c).dot(axis));
  const lo = Math.min(...proj);
  const hi = Math.max(...proj);
  const head = pts.filter((_, i) => proj[i] > hi - (hi - lo) * 0.22);
  const hc = centroid(head);
  const headAxis = principal(covariance(head, hc), axis);
  const s = reach / (hc.clone().sub(c).dot(axis) - lo);
  const headHalf = Math.max(...head.map((p) => Math.abs(p.clone().sub(hc).dot(headAxis)))) * s;
  return { object: wrap(scene, axis, headAxis, hc, s), headHalf };
}

// Sockel: flachste Achse nach oben, Unterseite auf y = 0, Außenradius = radius
export function fitBlock(scene, radius = 0.408) {
  const pts = vertices(scene);
  const c = centroid(pts);
  const m = covariance(pts, c);
  const a1 = principal(m);
  const a2 = principal(m, a1);
  const up = new THREE.Vector3().crossVectors(a1, a2).normalize();
  // Oben ist das schmalere Ende (abgesetzte Platte)
  if (endSpread(pts, c, up, true, 0.12) > endSpread(pts, c, up, false, 0.12)) up.negate();
  const proj = pts.map((p) => p.clone().sub(c).dot(up));
  const lo = Math.min(...proj);
  const hi = Math.max(...proj);
  const r = Math.max(...pts.map((p) => { const d = p.clone().sub(c); return d.addScaledVector(up, -d.dot(up)).length(); }));
  const s = radius / r;
  const bottom = c.clone().addScaledVector(up, lo);
  return { object: wrap(scene, a1, up, bottom, s), top: (hi - lo) * s };
}

// Waage und Stein (Higgsfield/Meshy): kommen bereits aufrecht (Y oben) und zentriert an.
// Die Ankerpunkte unten wurden an den erzeugten Modellen vermessen (Modell-Einheiten).
export const SCAN = {
  stand: { pivotY: 0.663, bottomY: -0.951 },       // Mitte des Querstücks, Unterkante Fuß
  beam: { hookX: 0.899, hookY: -0.14 },            // Aufhängepunkt der Haken an den Enden
  pan: { radius: 0.951, eyeR: 0.9, eyeY: 0.12, floorY: -0.159, eyes: 4 },
  stone: { halfY: 0.95, halfZ: 0.458 },                // aufrecht, „K“ auf der Vorderseite (+Z)
};

// Modell um den Faktor s skalieren und den Modellpunkt `anchor` in den Ursprung legen
export function place(scene, s, anchor = [0, 0, 0]) {
  const g = new THREE.Group();
  scene.scale.setScalar(s);
  scene.position.set(-anchor[0] * s, -anchor[1] * s, -anchor[2] * s);
  g.add(scene);
  return g;
}
