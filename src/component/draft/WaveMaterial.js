// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
import {shaderMaterial} from "@react-three/drei";
import * as THREE from "three";
import {extend} from "@react-three/fiber";

const WaveMaterial = shaderMaterial(
    {
        time: 0,
        resolution: new THREE.Vector2(),
        pointer: new THREE.Vector2()
    },
    /*glsl*/ `
      varying vec2 vUv;
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * viewPosition;
        gl_Position = projectionPosition;
        vUv = uv;
      }`,
    /*glsl*/ `
      uniform float time;
      uniform vec2 resolution;
      uniform vec2 pointer;
      varying vec2 vUv;      

      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);
        
         a = vec3(0.8,0.5,0.4);
         b = vec3(0.2,0.4,0.2);
         c = vec3(2.0,1.0,1.0);
         d = vec3(0.0,0.25,0.25) ;
        
        
        return a + b * cos(6.28318 * (c * t + d));
      }
      
      

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;      
        vec2 uv0 = vUv * 2.0 - 1.0;
        vec3 finalColor = vec3(0.0);
        // uv = fract(uv * 1.5) - 0.5;     
        // uv = sin(uv * 0.5) - pointer;     
        float d = length(uv) * exp(-length(uv0));
        vec3 col = palette(length(uv0) + time * 0.4);
        


        d = sin(d * 4.0 - time) / 8.0;
        d = abs(d);
        // d = ss;
        d = pow(0.005 / d, 2.0);
        finalColor += col * d;
        float alpha = d > 0.0 ? 1.0 : 0.0;
        gl_FragColor = vec4(finalColor, alpha);   
      }`,
    (material) => {
        material.side = THREE.DoubleSide
        material.transparent = true;

    }
)

extend({WaveMaterial})
