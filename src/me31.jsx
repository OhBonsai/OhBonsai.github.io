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