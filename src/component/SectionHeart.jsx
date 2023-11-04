import * as THREE from 'three'
import {extend, useFrame, useThree} from '@react-three/fiber'
import {Cloud, shaderMaterial, Text, useScroll} from '@react-three/drei'
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {random} from 'maath'
import CONSTANT from "../constant.js";
import {gsap} from "gsap";
import {useStore, setPageOut, setPage, nextPage, PAGE_ACTION, setEnableScroll, TOTAL} from "../stores.jsx";





export default function SectionHeart() {
    const mainRef = useRef()
    const heartRef = useRef()

    const light = useRef()
    const [flash] = useState(() => new random.FlashGen({count: 15, minDuration: 30, maxDuration: 150}))

    const isZh = useStore((state)=>{return state.isZh})



    const camera = useThree(({camera}) => {
        return camera
    })
    const tlRef = useRef()
    const scroll = useScroll()
    useLayoutEffect(()=>{

            camera.position.set(0, 0, 10)
        camera.quaternion.set(0, 0, 0, 1)
            camera.lookAt(0, 0, 0)
            camera.updateProjectionMatrix()


            gsap.to(
                camera.position, {
                    duration: 1.2,
                    z: 5,
                    ease: "power2.inOut",
                }
            )



        tlRef.current = gsap.timeline();
        tlRef.current.to(
            mainRef.current.position,
            {
                duration: 2,
                z: 12,
            }
        )
        tlRef.current.seek(0)
        tlRef.current.pause()

        return ()=>{
            tlRef.current.clear()
        }
    })

    useFrame(()=>{
        const visible = scroll.visible(0, 1/6)
        if (!visible) {
            // setEnableScroll(false)
            nextPage(PAGE_ACTION.NEXT)
        }

        const v = scroll.range( 0, 1/6 )
        tlRef.current.seek(v * tlRef.current.duration());
    })


    useFrame((state, delta) => {

        heartRef.current.material.time += delta
        heartRef.current.quaternion.copy(state.camera.quaternion)
        const impulse = flash.update(state.clock.elapsedTime, delta * 1.2)
        light.current.intensity = impulse * 15000 * 3
    })


    const fontSize = 0.4

    return (
        <group ref={mainRef}>

            <Cloud
                position={[0, 4, -6]}
                seed={2}
                fade={1}
                speed={0.3}
                texture={CONSTANT.ROOT_URL + "/cloud.png"}
                growth={20}
                segments={15}
                volume={1}
                depthTest={false}
                opacity={0.6} bounds={[2, 2, 1]}/>
            <pointLight position={[0, 0, 0.5]} ref={light} color="blue"/>


            <group position={[0, -.6, 2]}>
                <Text font={CONSTANT.ROOT_URL + "/en0.ttf"} fontSize={fontSize}  position={[- fontSize * 1.6, 0, 0]}>Hi</Text>
                <mesh  ref={heartRef} rotation={[0 , 0 , 0]} position={[-.2, 0, 0]} >
                    <planeGeometry args={[fontSize * 1.2,  fontSize * 1.2]}/>
                    <heartMaterial/>
                </mesh>
                <Text font={CONSTANT.ROOT_URL + "/en0.ttf"} fontSize={fontSize}  position={[fontSize * 1.2, 0, 0]}>Friend</Text>

                {
                    isZh ? <>
                        <Text font={CONSTANT.ROOT_URL + "/cn0.ttf"} fontSize={fontSize} position={[-fontSize * 1.2, -fontSize * 1.6, 0]}>我是</Text>
                        <Text font={CONSTANT.ROOT_URL + "/cn0.ttf"} fontSize={fontSize * 1.2}  color={"#8080e6"} position={[fontSize * .8, -fontSize * 1.6, 0]}>盆栽</Text>
                    </> : <>
                        <Text font={CONSTANT.ROOT_URL + "/en0.ttf"} fontSize={fontSize} position={[-fontSize * 1.2, -fontSize * 1.6, 0]}>I am </Text>
                        <Text font={CONSTANT.ROOT_URL + "/en0.ttf"} fontSize={fontSize * 1.2}  color={"#8080e6"} position={[fontSize * .8, -fontSize * 1.6, 0]}>Julito</Text>
                    </>
                }
            </group>

        </group>

    )
}



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
    (mat) => {
        mat.transparent = true;
        mat.side = THREE.DoubleSide
        mat.depthWrite = false;
        mat.toneMapped = false
    }
)


extend({HeartMaterial})
