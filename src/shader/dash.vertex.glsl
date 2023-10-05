uniform float uTime;

varying vec2 vUv;
varying float vProgress;

void main() {
    vUv = uv;
    vProgress = smoothstep(-1., 1., sin(vUv.x * 8. + uTime * 3.));

    vec4 modelPosition = modelMatrix * vec4(position, 1.);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;
}
