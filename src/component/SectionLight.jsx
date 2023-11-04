import * as THREE from "three"
import {useFrame, extend, useLoader, useThree} from "@react-three/fiber";
import {shaderMaterial, Stars, Text, useScroll} from "@react-three/drei";
import vertexShader from '../shader/infinite.vertex.glsl'
import fragmentShader from '../shader/infinite.fragment.glsl'
import * as tools from "../tool.js";
import React, {useMemo, useRef} from "react";
import {TextureLoader} from "three";
import CONSTANT from "../constant.js";
import {nextPage, PAGE_ACTION, TOTAL, useStore} from "../stores.jsx";


const options = {
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 3,

    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,

    totalSideLightSticks: 50,
    lightPairsPerRoadWay: 50,

    // Percentage of the lane's width
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,

    /*** These ones have to be arrays of [min,max].  ***/
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],

    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],

    /****  Anything below can be either a number or an array of [min,max] ****/

    // Length of the lights. Best to be less than total length
    carLightsLength: [400 * 0.05, 400 * 0.15],
    // Radius of the tubes
    carLightsRadius: [0.05, 0.14],
    // Width is percentage of a lane. Numbers from 0 to 1
    carWidthPercentage: [0.3, 0.5],
    // How drunk the driver is.
    // carWidthPercentage's max + carShiftX's max -> Cannot go over 1.
    // Or cars start going into other lanes
    carShiftX: [-0.2, 0.2],
    // Self Explanatory
    carFloorSeparation: [0.05, 1],

    colors: {
        roadColor: 0x080808,
        islandColor: 0x0a0a0a,
        background: 0x000000,
        shoulderLines: 0x131318,
        brokenLines: 0x131318,
        /***  Only these colors can be an array ***/
        leftCars: ["#ff102a", "#EB383E", "#ff102a"].map(x=>new THREE.Color(x)),
        rightCars: ["#dadafa", "#BEBAE3", "#8F97E4"].map(x=>new THREE.Color(x)),
        sticks: 0xdadafa,
    }
};


const InfiniteLightMaterial = shaderMaterial(
    {
        uTime:  0,
        uTravelLength: options.length,
        uFade: new THREE.Vector2(0, .6),
        uFreq: new THREE.Vector3(3, 6, 10),
        uAmp: new THREE.Vector3(30, 30, 20)
    },
    vertexShader,
    fragmentShader,
    (material)=>{
        // material.side = THREE.DoubleSide
        material.transparent = true;
        material.depthTest = false;
        material.depthWrite = false;
        material.toneMapped = false

    }
)

extend({InfiniteLightMaterial})


function getDistortion(time, progress, uFreq, uAmp) {
    let movementProgressFix = 0.02;

    let distortion = new THREE.Vector3(
        Math.cos(progress * Math.PI * uFreq.x + time) * uAmp.x -
        Math.cos(movementProgressFix * Math.PI * uFreq.x + time) * uAmp.x,
        tools.nsin(progress * Math.PI * uFreq.y + time) * uAmp.y -
        tools.nsin(movementProgressFix * Math.PI * uFreq.y + time) * uAmp.y,
        tools.nsin(progress * Math.PI * uFreq.z + time) * uAmp.z -
        tools.nsin(movementProgressFix * Math.PI * uFreq.z + time) * uAmp.z
    );

    let lookAtAmp = new THREE.Vector3(2, 2, 2);
    let lookAtOffset = new THREE.Vector3(0, 0, -5);
    distortion =  distortion.multiply(lookAtAmp).add(lookAtOffset);
    return distortion
}


export default function SectionLight(
    {
        particleCount=200,
    }
) {

    useThree(({camera})=>{
        camera.position.set(6, 8, -5)
        camera.updateProjectionMatrix()
    })

    const curPage = 2
    const startingOut  = .5

    const scroll = useScroll()
    useFrame(()=>{
        const v = scroll.range(curPage/TOTAL + startingOut * (1 / TOTAL), (1-startingOut) * 1/TOTAL)
        if (v >= 1) {
            nextPage(PAGE_ACTION.NEXT)
        }

    })
    const isZh = useStore((state)=>{return state.isZh})

    useFrame(({camera, clock}, delta)=>{


        let lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
        let fovChange = tools.lerp(camera.fov, options.fov, lerpPercentage)
        camera.fov += fovChange * delta * 6;

        const time = clock.getElapsedTime()
        let progress = 0.025

        let uFreq =new THREE.Vector3(3, 6, 10)
        let uAmp = new THREE.Vector3(30, 30, 20)

        let  distortion =  getDistortion(time, progress, uFreq, uAmp)
        const lookAt =         new THREE.Vector3(
            camera.position.x + distortion.x,
            camera.position.y + distortion.y,
            camera.position.z + distortion.z,
        )

        camera.lookAt(lookAt)
        camera.updateProjectionMatrix()

    })

    const ref2 = useRef()

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
      gl_FragColor = vec4(vec3(.7), 1.0); 

    }
        `,
    })

    return <>
        <Moon  position={[0, 35, -50]}  />
        {
            isZh ? <>
                <Text frustumCulled={false} font={CONSTANT.ROOT_URL + "/cn0.ttf"} fontSize={1} position={[0, 5, -10]} material={matTest}>勤学不怠</Text>
                <Text frustumCulled={false}  font={CONSTANT.ROOT_URL + "/cn0.ttf"} fontSize={1 } position={[0, 3.8, -10]} material={matTest}>刚猛精进</Text>
            </> : <>
                <Text frustumCulled={false} font={CONSTANT.ROOT_URL + "/en0.ttf"} fontSize={.8} position={[0, 5, -10]} material={matTest}>Keep Learning</Text>
                <Text frustumCulled={false}  font={CONSTANT.ROOT_URL + "/en0.ttf"} fontSize={.7 } position={[0, 3.8, -10]} material={matTest}>With constant practice diligent</Text>
            </>
        }
        <CarLights particleCount={particleCount} position={[-options.roadWidth / 2 - options.islandWidth / 2, 0, 0]} />
        <CarLights particleCount={particleCount}
                   position={[ options.roadWidth / 2 + options.islandWidth / 2, 0, 0]}
                   speedRange={ [-120, -160]} colorsRange={options.colors.rightCars}/>
    </>
}


function  CarLights(
    {
        particleCount=50,
        speedRange= [60, 80],
        colorsRange = options.colors.leftCars,
        fade =   new THREE.Vector2(0, 0.6),
        ...props
    }
) {
    const meshRef = useRef()


    let tubeGeo = new THREE.TubeGeometry( new THREE.LineCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
    ), 40, 1, 8, false);
    let instanced = new THREE.InstancedBufferGeometry()
    instanced.index = tubeGeo.index;
    instanced.attributes = tubeGeo.attributes;

    const [aOffset, aMetrics, aColor] = useMemo(()=>{
        let laneWidth = options.roadWidth / options.lanesPerRoad;
        let aOffset = [];
        let aMetrics = [];
        let aColor = [];


        for (let i = 0; i < particleCount / 2; i++) {
            let radius = tools.myRandom(options.carLightsRadius);
            let length = tools.myRandom(options.carLightsLength);
            let speed = tools.myRandom(speedRange);

            let carLane = i % 3;
            let laneX = carLane * laneWidth - options.roadWidth / 2 + laneWidth / 2;

            let carWidth = tools.myRandom(options.carWidthPercentage) * laneWidth;
            // Drunk Driving
            let carShiftX = tools.myRandom(options.carShiftX) * laneWidth;
            // Both lights share same shiftX and lane;
            laneX += carShiftX;

            let offsetY = tools.myRandom(options.carFloorSeparation) + radius * 1.3;
            let offsetZ = -tools.myRandom(options.length);

            aOffset.push(laneX - carWidth / 2);
            aOffset.push(offsetY);
            aOffset.push(offsetZ);

            aOffset.push(laneX + carWidth / 2);
            aOffset.push(offsetY);
            aOffset.push(offsetZ);

            aMetrics.push(radius);
            aMetrics.push(length);
            aMetrics.push(speed);

            aMetrics.push(radius);
            aMetrics.push(length);
            aMetrics.push(speed);

            let color = tools.pickRandom(colorsRange);
            aColor.push(color.r);
            aColor.push(color.g);
            aColor.push(color.b);

            aColor.push(color.r);
            aColor.push(color.g);
            aColor.push(color.b);
        }
        return [aOffset, aMetrics, aColor]
    }, [particleCount])


    instanced.setAttribute( 'aOffset', new THREE.InstancedBufferAttribute( new Float32Array(aOffset), 3, false) );
    instanced.setAttribute( 'aMetrics', new THREE.InstancedBufferAttribute( new Float32Array(aMetrics), 3, false) );
    instanced.setAttribute( 'aColor', new THREE.InstancedBufferAttribute( new Float32Array(aColor), 3, false) );


    useFrame(({clock})=>{
        meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime()
    })

    return <group >
        <mesh frustumCulled={false} geometry={instanced} ref={meshRef} ufade={fade} {...props}>
            <infiniteLightMaterial/>
        </mesh>
    </group>
}





const MoonMaterial = shaderMaterial(
    // Uniform
    {
        uTime: 0,
        uColor: new THREE.Color(0.0, 0.0, 0.0),
        uTexture: new THREE.Texture()
    },
    // Vertex Shader
    `
    precision mediump float;
 
    varying vec2 vUv;

    uniform float uTime;


    void main() {
      vUv = uv;
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectionPosition = projectionMatrix * modelPosition;
        gl_Position = projectionPosition;
    }
  `,
    // Fragment Shader
    `
    precision mediump float;

    uniform vec3 uColor;
    uniform float uTime;
    uniform sampler2D uTexture;

    varying vec2 vUv;

    void main() {
      vec3 texture = texture2D(uTexture, vUv ).rgb * 1.2;
      gl_FragColor = vec4(texture, 1.0); 
    }
  `
);
extend({MoonMaterial})

export function Moon({move=false, ...props}) {

    const [image] = useLoader(THREE.TextureLoader, [
        CONSTANT.ROOT_URL +"/moon1.jpg"
        // CONSTANT.ROOT_URL +"/earth.jpg"
    ]);


    const meshRef = useRef()
    const materialRef = useRef()


    useFrame(({clock}, delta) => {
        meshRef.current.rotation.y += delta * .2

        if (move) {
            const time = clock.getElapsedTime() * .5
            let scale = Math.sin(time ) * 0.1  + 1
            meshRef.current.translateY( Math.sin(time) * 0.05)

            meshRef.current.scale.set(scale, scale, scale)
        }

        // meshRef.current.material.uniforms.time = clock.getElapsedTime()
    })
    return <group {...props}>
        <pointLight  distance={1000} intensity={100} />

        <mesh ref={meshRef}  frustumCulled={false} >
            <moonMaterial uColor={"white"} ref={materialRef} uTexture={image} />
            <sphereGeometry args={[5, 40, 16, 16]} />
        </mesh>
    </group>

}


