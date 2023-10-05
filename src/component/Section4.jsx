import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import {Cloud, Float, shaderMaterial, Sparkles, Stars, Text} from '@react-three/drei'
import React, { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'

// Tutorial: https://www.youtube.com/watch?v=f4s1h2YETNY
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
    (material)=>{
        material.side = THREE.DoubleSide
        material.transparent = true;

    }
)

extend({ WaveMaterial })


const HeartMaterial = shaderMaterial(
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
        vec2 p = vUv * 2.0 - 1.0;
// background color
vec3 bcol = vec3(1.0,0.8,0.7-0.07*p.y)*(1.0-0.25*length(p));

// animate
float tt = mod(time,1.5)/1.5;
float ss = pow(tt,.2)*0.5 + 0.5;
ss = 1.0 + ss*0.5*sin(tt*6.2831*3.0 + p.y*0.5)*exp(-tt*4.0);
p *= vec2(0.5,1.5) + ss*vec2(0.5,-0.5);

// shape
vec2 p2 = p;
p.y -= 0.25;
float a = atan(p.x,p.y)/3.141593;
float r = length(p);
float h = abs(a);
float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);




// d = mix(d, .5, abs(sin(time * 2. + .5) ));
// d = .5;

// color
float s = 0.75 + 0.75*p.x;
s *= 1.0-0.4*r;
s = 0.3 + 0.7*s;
s *= 0.5+0.5*pow( 1.0-clamp(r/d, 0.0, 1.0 ), 0.1 );
vec3 hcol = vec3(3.0,0.4*r,0.3)*s;

         // hcol = palette(length(p) + time * 0.4);


vec3 finalColor = mix( bcol, hcol, smoothstep( -0.01, 0.01, d-r) );
float alpha = d < r? 0.0 : 1.0;
        gl_FragColor = vec4(finalColor, alpha);   
      }`,
    (mat)=>{
        mat.transparent = true;
        mat.side = THREE.DoubleSide
        mat.depthWrite = false;
        mat.toneMapped = false
    }
)




extend({ HeartMaterial })




export default function Section4() {
    const ref = useRef()
    const ref2 = useRef()
    const ref3 = useRef()
    const ref4 = useRef()

    useThree(({camera})=>{
        camera.position.set(0, 0, -2)
        camera.lookAt(new THREE.Vector3(0, 0, 0))
        camera.updateProjectionMatrix()
    })

    useFrame((state, delta) => {
        ref2.current.material.time += delta
        ref2.current.quaternion.copy(state.camera.quaternion)
        // ref3.current.quaternion.copy(state.camera.quaternion)
        // ref3.current.rotation.x += delta;
        // console.log(state.camera.position)

        // easing.damp3(ref.current.pointer, state.pointer, 0.2, delta)
    })
    return (
        <>
            {/*<mesh  ref={ ref3} position={[0,0, -2]}>*/}
            {/*    <planeGeometry args={[10, 10]} />*/}
            {/*    <waveMaterial ref={ref} key={WaveMaterial.key} resolution={[size.width * viewport.dpr, size.height * viewport.dpr]} />*/}
            {/*</mesh>*/}
            <mesh  ref={ref2} rotation={[0 , 0 , 0]} position={[0, 0.6, 0]}>
                <planeGeometry args={[1, 1]}/>
                <heartMaterial/>
            </mesh>

            {/*<mesh>*/}
            {/*    <sphereGeometry args={[.3, 64]}/>*/}
            {/*    <meshBasicMaterial color={"red"}/>*/}
            {/*</mesh>*/}


                <Float>

                    <group rotation={[0, Math.PI, 0]}>
                    <Text font={"/cn0.ttf"} fontSize={0.1} position={[0, -.6, 0]}>朋友，你好 </Text>
                    <Text font={"/cn0.ttf"} ref={ref4} fontSize={0.2} position={[0, -.9, 0]}>我叫盆栽</Text>
                    </group>

                    {/*<Stars*/}
                    {/*    color={"red"}*/}
                    {/*    radius={0.6} saturation={0.5} factor={8.} count={1000} fade speed={2.0} />*/}
                </Float>
            {/*<Cloud />*/}
        </>

    )
}

