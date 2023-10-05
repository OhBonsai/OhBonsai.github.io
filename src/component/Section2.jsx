import * as THREE from "three"
import {useLoader, extend, useThree} from "@react-three/fiber";
import {TextureLoader} from "three";
import React, {useEffect, useMemo, useRef} from "react";
import {Trail, Float, Line, Sphere, Stars, Text} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import {useFrame} from "@react-three/fiber";
import {shaderMaterial} from "@react-three/drei";
import vertexShader from '../shader/dash.vertex.glsl'
import fragmentShader from '../shader/dash.fragment.glsl'
import { createNoise3D} from "simplex-noise"
import {create} from "zustand";
import {useControls} from "leva";


export default function Section2() {



    useThree(({camera})=>{
        camera.position.set(0, 0, -12)
        camera.lookAt(new THREE.Vector3(0, 0, 0))
        camera.updateProjectionMatrix()
    })

    useFrame(({camera})=>{
        // console.log(camera.position)
        // console.log(camera.rotation)
    })

    return <>
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
            <Atom position={[0 , 2,0]}/>
        </Float>
        <group rotation={[0, Math.PI, 0]}>
            <Text font={"/cn0.ttf"} fontSize={.8} position={[0, -3, 0]}>我希望自己 </Text>
            <Text font={"/cn0.ttf"}  fontSize={.8} position={[0, -4.3, 0]}>勇敢，率真，诚恳</Text>
        </group>
        <Stars radius= {1.0} factor={2.0} saturation={0} count={4000} speed={0.5} />
    </>
}


function Atom(props) {
    const points = useMemo(() => new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])
    return (
        <group {...props}>
            <Line worldUnits points={points} color="turquoise" lineWidth={0.3} />
            <Line worldUnits points={points} color="turquoise" lineWidth={0.3} rotation={[0, 0, 1]} />
            <Line worldUnits points={points} color="turquoise" lineWidth={0.3} rotation={[0, 0, -1]} />
            <Electron position={[0, 0, 0.5]} speed={6} />
            <Electron position={[0, 0, 0.5]} rotation={[0, 0, Math.PI / 3]} speed={6.5} />
            <Electron position={[0, 0, 0.5]} rotation={[0, 0, -Math.PI / 3]} speed={7} />
            <Sphere args={[0.55, 64, 64]}>
                <meshBasicMaterial color={[6, 0.5, 2]} toneMapped={false} />
            </Sphere>
        </group>
    )
}

function Electron({ radius = 2.75, speed = 6, ...props }) {
    const ref = useRef()
    useFrame((state) => {
        const t = state.clock.getElapsedTime() * speed
        ref.current.position.set(Math.sin(t) * radius, (Math.cos(t) * radius * Math.atan(t)) / Math.PI / 1.25, 0)
    })
    return (
        <group {...props}>
            <Trail local width={5} length={6} color={new THREE.Color(0.2, 1, 10)} attenuation={(t) => t * t}>
                <mesh ref={ref}>
                    <sphereGeometry args={[0.25]} />
                    <meshBasicMaterial color={[0.2, 1, 10]} toneMapped={false} />
                </mesh>
            </Trail>
        </group>
    )
}
