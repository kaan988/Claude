// Auflöse-Effekt: Rauschmaske mit glühender Goldkante, per onBeforeCompile in Standard-Materialien eingesetzt.
import * as THREE from 'three';

const NOISE = /* glsl */ `
float dsH(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float dsNoise(vec3 x) {
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(dsH(i), dsH(i + vec3(1,0,0)), f.x), mix(dsH(i + vec3(0,1,0)), dsH(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(dsH(i + vec3(0,0,1)), dsH(i + vec3(1,0,1)), f.x), mix(dsH(i + vec3(0,1,1)), dsH(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float dsFbm(vec3 p) {
  return (0.5 * dsNoise(p) + 0.25 * dsNoise(p * 2.03) + 0.125 * dsNoise(p * 4.01) + 0.0625 * dsNoise(p * 8.07)) / 0.9375;
}
`;

const VERTEX = /* glsl */ `#include <begin_vertex>
  vec4 dsP = vec4(transformed, 1.0);
  #ifdef USE_INSTANCING
    dsP = instanceMatrix * dsP;
  #endif
  vDsPos = (modelMatrix * dsP).xyz;
`;

const CLIP = /* glsl */ `#include <clipping_planes_fragment>
  float dsN = dsFbm(vDsPos * uDsScale);
  float dsT = uDissolve * 1.1 - 0.05;
  if (dsN < dsT) discard;
  float dsEdge = (1.0 - smoothstep(0.0, 0.05, dsN - dsT)) * step(0.001, uDissolve);
`;

function patch(material, uniforms, withEmissive) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uDissolve = uniforms.uDissolve;
    shader.uniforms.uDsScale = uniforms.uDsScale;
    shader.uniforms.uEdgeColor = uniforms.uEdgeColor;
    shader.vertexShader = 'varying vec3 vDsPos;\n' + shader.vertexShader.replace('#include <begin_vertex>', VERTEX);
    let frag = 'uniform float uDissolve;\nuniform float uDsScale;\nuniform vec3 uEdgeColor;\nvarying vec3 vDsPos;\n' + NOISE + shader.fragmentShader;
    frag = frag.replace('#include <clipping_planes_fragment>', CLIP);
    if (withEmissive) {
      frag = frag.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n  totalEmissiveRadiance += uEdgeColor * dsEdge;');
    }
    shader.fragmentShader = frag;
  };
  material.customProgramCacheKey = () => (withEmissive ? 'ds-color' : 'ds-depth');
}

export function createDissolve(scale = 7) {
  return {
    uDissolve: { value: 0 },
    uDsScale: { value: scale },
    uEdgeColor: { value: new THREE.Color('#e8c98a').multiplyScalar(7) },
  };
}

// Material + passendes Schatten-Material, damit auch der Schatten sich auflöst
export function dissolvable(material, uniforms) {
  patch(material, uniforms, true);
  return material;
}

export function attachDissolveDepth(root, uniforms) {
  const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
  patch(depth, uniforms, false);
  root.traverse((o) => {
    if (o.isMesh) o.customDepthMaterial = depth;
  });
}
