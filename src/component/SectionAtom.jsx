import * as THREE from "three"
import {useLoader, extend, useThree} from "@react-three/fiber";
import {TextureLoader} from "three";
import React, {useEffect, useMemo, useRef, useLayoutEffect, useState} from "react";
import {Trail, Float, Line, Sphere, Stars, Text, Cloud, useScroll} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import {useFrame} from "@react-three/fiber";
import {shaderMaterial} from "@react-three/drei";
import vertexShader from '../shader/dash.vertex.glsl'
import fragmentShader from '../shader/dash.fragment.glsl'
import { createNoise3D} from "simplex-noise"
import {create} from "zustand";
import {useControls} from "leva";
import CONSTANT from "../constant.js";
import {gsap} from "gsap";
import {nextPage, PAGE_ACTION, setEnableScroll, TOTAL, useStore} from "../stores.jsx";


export default function SectionAtom() {
    const mainRef = useRef()
    const starRef = useRef()
    const atomRef = useRef()
    const expectSphereRef = useRef()
    const camera = useThree(({camera}) => {
        return camera
    })
    const moonRef = useRef()
    const tlRef = useRef()
    const scroll = useScroll()

    let [starCount, setStarCount] = useState({value: 1000})
    const isZh = useStore((state)=>{return state.isZh})


    useLayoutEffect(()=>{

        camera.position.set(0, 0, 5)
        camera.quaternion.set(0, 0, 0, 1)
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix()


        gsap.to(
            mainRef.current.position, {
                duration: 1.2,
                z: 0,
                ease: "power3.inOut"
            }
        )

        tlRef.current = gsap.timeline();
        tlRef.current.addPause(0)
        tlRef.current.add(gsap.fromTo(
            moonRef.current.position,
            {
                y: 0,
            },
            {
                y: 3,
                duration: 1,

            }
        ))
        tlRef.current.add(gsap.fromTo(
            moonRef.current.scale,{x: 1, y:1, z:1},{duration: 1, x: 0.8, y:0.8, z:0.8},
        ), 0)
        tlRef.current.add(gsap.fromTo(
            expectSphereRef.current.position,
            {z: 0},
            {
                duration: 1,
                z: -100
            }
        ), 0.5)


        return ()=>{
            tlRef.current.clear()
        }
    })

    const curPage = 1
    const startingOut  = .6

    useFrame(()=>{
        const v = scroll.range(curPage/TOTAL + startingOut * (1 / TOTAL), (1-startingOut) * 1/TOTAL)
        if (v >= 1) {
            nextPage(PAGE_ACTION.NEXT)
        }

        tlRef.current.seek(v * tlRef.current.duration());
    })

    const fontSize = 0.4


    return <group ref={mainRef} position={[0, 0, -12]}>
        <Sphere args={[0.6, 64, 64]} ref={moonRef}>
            <meshBasicMaterial color={[6, 0.5, 2]} toneMapped={false} />
        </Sphere>

        <group ref={expectSphereRef}>
        <Float speed={4} rotationIntensity={1} floatIntensity={4}>
            <Atom position={[0 , 0, -3]}/>
        </Float>

        <group rotation={[0, 0 , 0]} position={[0, -1.5, 0]}>
            {
                isZh ? <>
                    <Text font={CONSTANT.ROOT_URL + "/cn0.ttf"} fontSize={fontSize} position={[0, 0, 0]}>我希望自己 </Text>
                    <Text font={CONSTANT.ROOT_URL + "/cn0.ttf"}  fontSize={fontSize} position={[0, -fontSize * 1.5, 0]}>勇敢，率真，诚恳</Text>
                </> : <>
                    <Text font={CONSTANT.ROOT_URL + "/en0.ttf"} fontSize={fontSize} position={[0, 0, 0]}>Try to be </Text>
                    <Text font={CONSTANT.ROOT_URL + "/en0.ttf"}  fontSize={fontSize} position={[0, -fontSize * 1.5, 0]}>Brave  Innocent  Sincere</Text>
                </>
            }
        </group>

        <Stars ref={starRef} radius= {10.0} factor={2.0} saturation={1.0} count={starCount.value} speed={0.5} />
        </group>
    </group>
}


function Atom(props) {
    const points = useMemo(() => new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])
    return (
        <group {...props}>
            <Electron position={[0, 0, 0.5]} rotation={[0, 0, 0 * Math.PI / 5]} speed={2}  offset={0.25 * 0}/>
            <Electron position={[0, 0, 0.5]} rotation={[0, 0, 1 * Math.PI / 5]} speed={3} offset={0.25 * 1}/>
            <Electron position={[0, 0, 0.5]} rotation={[0, 0, 2 * Math.PI / 5]} speed={4}  offset={0.25 * 2}/>
            <Electron position={[0, 0, 0.5]} rotation={[0, 0, 3 * Math.PI / 5]} speed={5}  offset={0.25 * 3}/>
            <Electron position={[0, 0, 0.5]} rotation={[0, 0, 4 * Math.PI / 5]} speed={5}  offset={0.25 * 4}/>
        </group>
    )
}

function Electron({ radius = 5, speed = 6, offset=0., color= [0.2, 1, 10],...props }) {
    const ref = useRef()
    useFrame((state) => {
        let t = state.clock.getElapsedTime() * speed
        t = offset * Math.PI * 2 + t
        ref.current.position.set(Math.sin(t) * radius, (Math.cos(t) * radius * Math.atan(t)) / Math.PI / 1.25, 0)
    })
    return (
        <group {...props}>
            {/*<Trail local width={5} length={6} color={new THREE.Color(0.2, 1, 10)} attenuation={(t) => t * t}>*/}
                <mesh ref={ref}>
                    <sphereGeometry args={[0.25]} />
                    <meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
            {/*</Trail>*/}
        </group>
    )
}
