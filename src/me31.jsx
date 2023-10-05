import {Canvas, useFrame} from "@react-three/fiber";
import {Gltf, OrbitControls, useAnimations} from "@react-three/drei";
import {Perf} from "r3f-perf";
import { useLoader } from '@react-three/fiber'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {useEffect} from "react";
import * as THREE from "three"
import Section1 from "./component/Section1.jsx";
import {useControls} from "leva";
import {options, setBloom, setPage, useStore} from "./stores.jsx";
import {Bloom, EffectComposer, Glitch, SMAA} from "@react-three/postprocessing";
import Section2 from "./component/Section2.jsx";
import Section4 from "./component/Section4.jsx";
import Section3 from "./component/Section3.jsx";
import Section5 from "./component/Section5.jsx";
import Section6 from "./component/Section6.jsx";
import Hud from "./component/Hud.jsx";



export default function Portfolio2023() {

    const {
        isBloom,
        currentPage,
        bloomIntensity,
        bloomLuminanceThreshold,
    } = useStore()


    // useControls( {
    //     bloom: {value: options.isBloom, onChange: (v)=>setBloom(v)},
    //     currentPage: {value: options.currentPage, min:0, max: 4, step: 1,
    //         onChange: (v)=>setPage(v)
    //     }
    //     // count: {value: 100, min: 5, max: 200, step: 1},
    //     // luminanceThreshold: {value: 0.3, min: 0.1, max: 1.0, step: 0.01},
    //     // intensity:{value: 0.7, min: 0.1, max: 1.0, step: 0.01},
    //     // isBloom: false,
    //     // particleCount: {value: 100, min: 10, max: 200, step: 10},
    // })


    return <>
        <Hud/>
        <Canvas dpr={[1, 2]} camera={{
            position: [0, 0, -5],
            fov: 90,
            near: 0.1,
            far: 10000
        }}>

            {/*<Perf position={"top-left"}/>*/}
            <color attach="background" args={['black']}/>
            {/*<OrbitControls/>*/}
            <ambientLight/>
            <directionalLight/>

            {currentPage === 0 ? <Section4/> : null}
            {currentPage === 1 ? <Section2/> : null}
            {currentPage === 2 ? <Section1/> : null}
            {currentPage === 3 ? <Section3/> : null}
            {currentPage === 4 ? <Section5/> : null}

            {/*{*/}

            {/*        <EffectComposer>*/}
            {/*            <Bloom mipmapBlur resolutionScale = {1} luminanceThreshold={luminanceThreshold} luminanceSmoothing = {0} radius={intensity}/>*/}
            {/*            <SMAA/>*/}
            {/*            /!*<Glitch/>*!/*/}
            {/*        </EffectComposer>*/}
            {/*}*/}

            {

                isBloom ?
                    <EffectComposer>
                        <Bloom mipmapBlur resolutionScale = {1} luminanceThreshold={bloomLuminanceThreshold} intensity={bloomIntensity}  radius={0.7}/>
                        <SMAA/>
                        {/*<Glitch/>*/}
                    </EffectComposer> : null
            }



        </Canvas>
        {/*<Overlay/>*/}
    </>;

}

// https://fonts.googleapis.com/css2?family=Zhi+Mang+Xing&text=%E4%BA%B2%E7%88%B1%E7%9A%84%E6%9C%8B%E5%8F%8B%EF%BC%8C%E4%BD%A0%E5%A5%BD%E6%88%91%E5%8F%AB%E7%9B%86%E6%A0%BD%E4%B8%94%E5%90%AC%E9%A3%8E%E5%90%9F%E9%9D%99%E5%BE%85%E8%8A%B1%E5%BC%80%E5%8B%A4%E5%AD%A6%E4%B8%8D%E6%80%A0%E5%88%9A%E7%8C%9B%E7%B2%BE%E8%BF%9B%E6%88%91%E5%B8%8C%E6%9C%9B%E8%87%AA%E5%B7%B1%E5%8B%87%E6%95%A2%EF%BC%8C%E7%8E%87%E7%9C%9F%EF%BC%8C%E8%AF%9A%E6%81%B3%E5%B0%91%E5%8D%B3%E6%98%AF%E5%A4%9A%E6%85%A2%E5%8D%B3%E6%98%AF%E5%BF%AB