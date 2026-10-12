import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

// Pencil drawing is always visible. A watercolor-style wash of uColor
// bleeds up from the bottom with a ragged edge as uReveal goes 0 -> 1.
const fragmentShader = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uRepeat;
  uniform vec3 uColor;
  uniform vec3 uFog;
  uniform float uReveal;
  varying vec2 vUv;
  varying float vDepth;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    vec3 base = texture2D(uTex, vUv * uRepeat).rgb;
    float n = noise(vUv * vec2(6.0, 9.0)) * 0.6 + noise(vUv * vec2(26.0, 38.0)) * 0.4;
    float v = vUv.y * 0.75 + n * 0.35;
    float mask = 1.0 - smoothstep(uReveal * 1.4 - 0.15, uReveal * 1.4, v);
    vec3 wash = base * uColor * (0.88 + 0.3 * n) * 1.12;
    vec3 col = mix(base, wash, mask * 0.92);
    float f = smoothstep(7.0, 34.0, vDepth);
    col = mix(col, uFog, f * 0.92);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`

export function createPaintMaterial({ map, color = '#ffffff', repeat = [1, 1], reveal = 0 }) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTex: { value: map },
      uRepeat: { value: new THREE.Vector2(repeat[0], repeat[1]) },
      uColor: { value: new THREE.Color(color) },
      uFog: { value: new THREE.Color('#efe8d9') },
      uReveal: { value: reveal },
    },
  })
}
