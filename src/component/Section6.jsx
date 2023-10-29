import {useFrame, useLoader} from "@react-three/fiber";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {useRef} from "react";
import {useGLTF} from "@react-three/drei";
import CONSTANT from "../constant.js";


export default function Section6() {
    // al-ro.github.io
    // https://github.com/OhBonsai/resume
    // const model = useLoader(GLTFLoader, '/whale/scene.gltf')
    console.log(model)

    return <>
        {/*<mesh geometry={model.nodes.root}>*/}
        {/*    <meshBasicMaterial color={"red"}/>*/}
        {/*</mesh>*/}
        <primitive object={model.scene} rotation={[0, Math.PI, Math.PI * 0.2]} scale={[.5, .5, .5]}/>
        {/*<mesh>*/}
        {/*    <boxGeometry/>*/}
        {/*</mesh>*/}
    </>
}
