import * as THREE from "three"
import {useLoader, extend, useFrame} from "@react-three/fiber";
import {TextureLoader} from "three";
import React, {useEffect, useMemo, useRef} from "react";
import {Hud, shaderMaterial, Text, useGLTF} from "@react-three/drei";
import vertexShader from '../shader/dash.vertex.glsl'
import fragmentShader from '../shader/dash.fragment.glsl'
import { createNoise3D} from "simplex-noise"
import {create} from "zustand";
import {useControls} from "leva";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CurveExtras from 'three/examples/jsm/curves/CurveExtras'
import {useStore} from "../stores.jsx";
let guid = 1

export default function Section1() {
    return <>
        <Rig/>
        {/*<Track/>*/}
        <Drones/>
        <Planets/>
        <Rings/>
        <Particles/>
        <Rocks/>
    <Poet/>
        </>
}

function Poet() {
    const matTest = new THREE.ShaderMaterial({
        vertexShader: `    precision mediump float;
 
    varying vec2 vUv;

    uniform float uTime;


    void main() {
      vUv = uv;
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * modelPosition;
        gl_Position = projectionPosition;
    }`,
        fragmentShader: `
        
            precision mediump float;


    varying vec2 vUv;

    void main() {
      gl_FragColor = vec4(1.0, 1.0,1.0, 1.0); 

    }
        `,
    })

    return      <>
        <Text frustumCulled={false} font={"/cn0.ttf"} fontSize={.8} position={[0, 6, -10]} material={matTest}>勤学不怠</Text>
        <Text frustumCulled={false} font={"/cn0.ttf"} fontSize={.8} position={[0, 5, -10]} material={matTest}>刚猛精进</Text>
    </>


}

function Rocks() {
    const rocks = useStore((state)=>state.rocks)
    console.log(rocks, "rocks")
    const vvv = useGLTF('/rock.gltf')
    return   <> {
        rocks.map((data, _) => <Rock {...vvv} key={data.guid} data={data} />)
    }  </>
}

function Particles() {
    const instancedMesh = useRef()
    const particles   = useStore((state) => state.particles)
    const dummy   = useStore((state) => state.dummy)
    console.log(particles)
    useEffect(() => {
        particles.forEach((particle, i) => {
            const { offset, scale } = particle
            dummy.position.copy(offset)
            dummy.scale.set(scale, scale, scale)
            dummy.rotation.set(Math.sin(Math.random()) * Math.PI, Math.sin(Math.random()) * Math.PI, Math.cos(Math.random()) * Math.PI)
            dummy.updateMatrix()
            instancedMesh.current.setMatrixAt(i, dummy.matrix)
        })
        instancedMesh.current.instanceMatrix.needsUpdate = true
    }, [])

    return (
        <instancedMesh ref={instancedMesh} args={[null, null, particles.length]} frustumCulled={false}>
            <coneGeometry args={[2, 2, 3]} />
            <meshStandardMaterial color="#606060" />
        </instancedMesh>
    )
}


const box = new THREE.Box3()
box.setFromCenterAndSize(new THREE.Vector3(0, 0, 1), new THREE.Vector3(3, 3, 3))
const glowMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color('lightblue') })
const bodyMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color('black') })
function Drones() {
    const drones   = useStore((state) => state.drones)

    return <>{
        drones.map((data, i)=><Drone data={data} key={i}/>)
    }</>
}
function Drone({data}) {
    const { nodes, materials } = useGLTF('/spacedrone.gltf')

    const ref = useRef()

    useFrame(({clock}) => {
        const r = Math.cos((clock.getElapsedTime() / 2) * data.speed) * Math.PI
        ref.current.position.copy(data.offset)
        ref.current.rotation.set(r, r, r)
    })
    return     <group ref={ref} scale={[5, 5, 5]} >
        <mesh position={[0, 0, 50]} rotation={[Math.PI / 2, 0, 0]} material={glowMaterial}>
            <cylinderBufferGeometry args={[0.25, 0.25, 100, 4]} />
        </mesh>
        <mesh name="Sphere_DroneGlowmat_0" geometry={nodes.Sphere_DroneGlowmat_0.geometry} material={materials.DroneGlowmat} />
        <mesh name="Sphere_Body_0" geometry={nodes.Sphere_Body_0.geometry} material={bodyMaterial} />
    </group>

}

function Planets() {
    const ref = useRef()
    const [texture, moon] = useLoader(THREE.TextureLoader, ["/earth.jpg", "/moon2.jpg"])
    return (
        <group ref={ref} scale={[100, 100, 100]} position={[-500, -500, 1000]}>
            <mesh>
                <sphereGeometry args={[5, 32, 32]} />
                <meshStandardMaterial map={texture} roughness={1} fog={false} />
            </mesh>
            <mesh position={[5, -5, -5]}>
                <sphereGeometry args={[0.75, 32, 32]} />
                <meshStandardMaterial roughness={1} map={moon} fog={false} />
            </mesh>
            <pointLight position={[-5, -5, -5]} distance={1000} intensity={6} />
            <mesh position={[-30, -10, -60]}>
                <sphereGeometry args={[4, 32, 32]} />
                <meshBasicMaterial color="#FFFF99" fog={false} />
                <pointLight distance={6100} intensity={50} color="white" />
            </mesh>
        </group>
    )
}

function Rings() {
    const rings   = useStore((state) => state.rings)

    const geometry = new THREE.RingBufferGeometry(1, 1.01, 64)
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color('lightgreen'), side: THREE.DoubleSide })
    return rings.map(([pos, matrix], i) => {
        const f = (Math.sin(i / 10) * Math.PI) / 2
        return (
            <mesh
                key={i}
                position={pos}
                scale={[30 + i * 5 * f, 30 + i * 5 * f, 30 + i * 5 * f]}
                onUpdate={self => self.quaternion.setFromRotationMatrix(matrix)}
                geometry={geometry}
                material={material}
            />
        )
    })
}

function Rock ({ nodes, materials, data }) {
    const ref = useRef()

    useFrame(({clock})=>{
        const r = Math.cos((clock.getElapsedTime() / 2) * data.speed) * Math.PI
        ref.current.rotation.set(r, r, r)
    })


    const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color("red")
    })

    return (
        <group ref={ref} position={data.offset} scale={[data.scale, data.scale, data.scale]}>
            <group
                position={[-0.016298329457640648, -0.012838120572268963, 0.24073271453380585]}
                rotation={[3.0093872578726644, 0.27444228385461117, -0.22745113653772078]}
                scale={[20, 20, 20]}>
                <mesh geometry={nodes.node_id4_Material_52_0.geometry} material={materials.Material_52} material-roughness={1} material-metalness={1} />
                {/*<mesh geometry={nodes.node_id4_Material_52_0.geometry} material={material} material-roughness={1} material-metalness={1} />*/}
            </group>
        </group>
    )
}


function Track() {
    const track   = useStore((state) => state.track)
    const scale   = useStore((state) => state.scale)

    return (
        <mesh scale={[scale, scale, scale]} geometry={track}>
            <meshBasicMaterial color="red" />
        </mesh>
    )

}


let offset = 0

function Rig({children}) {
    const group = useRef()
    const rig = useRef()
    const { fov, position,  spline, binormal, normal, track} = useStore(state=>state)
    const segments = track.tangents.length
    console.log(track, "track")
    console.log("length", track.parameters.path.getLength())
    const looptime = 30
    const scale = 15



    useFrame(({camera, mouse, clock})=>{
        const t = (clock.getElapsedTime() % looptime) / looptime


        const pos = track.parameters.path.getPointAt(t)

        pos.multiplyScalar(scale)

        const pickt = t * segments
        const pick = Math.floor(pickt)
        const pickNext = (pick + 1) % segments

        // console.log("a", pickt, pick, pickNext)


        binormal.subVectors(track.binormals[pickNext], track.binormals[pick])
        binormal.multiplyScalar(pickt - pick).add(track.binormals[pick])
        const dir = track.parameters.path.getTangentAt(t)
        offset += (Math.max(15, 15 + -mouse.y / 20) - offset) * 0.05
        normal.copy(binormal).cross(dir)
        pos.add(normal.clone().multiplyScalar(offset))
        camera.position.copy(pos)

        const lookAt = track.parameters.path.getPointAt((t + 30 / track.parameters.path.getLength()) % 1).multiplyScalar(scale)
        camera.matrix.lookAt(camera.position, lookAt, normal)
        camera.quaternion.setFromRotationMatrix(camera.matrix)
        camera.fov += ((t > 0.4 && t < 0.45 ? 120 : fov) - camera.fov) * 0.05
        camera.updateProjectionMatrix()

        const lightPos = track.parameters.path.getPointAt((t + 1 / track.parameters.path.getLength()) % 1).multiplyScalar(scale)
        rig.current.position.copy(lightPos)
        rig.current.quaternion.setFromRotationMatrix(camera.matrix)

    })
    return (
        <group ref={group}>
            <pointLight distance={400} position={[0, 100, -420]} intensity={5} color="indianred" />
            <group ref={rig} >
                <mesh>
                    <boxGeometry args={[50, 50, 50]}/>
                    <meshBasicMaterial color={"#0000ff"}/>
                </mesh>
            </group>
        </group>
    )

}