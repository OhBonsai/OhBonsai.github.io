import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import {
    Gltf,
    OrbitControls,
    useAnimations,
    useFont,
    useGLTF,
    useTexture,
    ScrollControls,
    Scroll,
    useScroll, useVideoTexture
} from "@react-three/drei";
import {options, setBloom, setPage, useStore} from "./stores.jsx";
import {Bloom, EffectComposer, Glitch, SMAA} from "@react-three/postprocessing";
import SectionHeart from "./component/SectionHeart.jsx";
import SectionAtom from "./component/SectionAtom.jsx";
import SectionUniverseSpace from "./component/SectionUniverseSpace.jsx";
import SectionFlowerVideo from "./component/SectionFlowerVideo.jsx";
import SectionTree from "./component/SectionTree.jsx";
import SectionLight from "./component/SectionLight.jsx";
import {Loader} from '@react-three/drei'
import Hud from "./component/Hud.jsx";
import AboutMe from "./component/AboutMe.jsx";
import CONSTANT from "./constant.js";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader.js";
import LangSwitcher from "./component/LangSwitcher.jsx";



useFont.preload([
    CONSTANT.ROOT_URL + "/cn0.ttf"
])


useGLTF.preload([
    CONSTANT.ROOT_URL +"/rock.gltf",
    CONSTANT.ROOT_URL +"/spacedrone.gltf",
])


useTexture.preload([
    CONSTANT.ROOT_URL +"/moon1.jpg",
    CONSTANT.ROOT_URL +"/moon2.jpg",
    CONSTANT.ROOT_URL +"/earth.jpg",
])

useGLTF.preload([
    CONSTANT.ROOT_URL + "/tree.obj"
])

function initVideo(){
    const url = "/video-03.mp4"
    const vid = document.createElement("video");
    vid.setAttribute("id", "flowerVideo")
    vid.setAttribute("preload", "auto")
    vid.src = CONSTANT.ROOT_URL + url

    vid.style.display = "none"
    vid.crossOrigin = "Anonymous";
    vid.loop = false;
    vid.muted = true;
    document.body.append(vid)
    return vid;
}

initVideo()


export default function Portfolio2023() {
    const {
        isBloom,
        currentPage,
        orbitControl,
        bloomIntensity,
        bloomLuminanceThreshold,

        pageIn,
        pageOut,
    } = useStore()


    return <>
        <LangSwitcher/>
        <Loader/>
        <Canvas dpr={[1, 2]} camera={{
            position: [0, 0, -5],
            fov: 90,
            near: 0.1,
            far: 10000
        }}>

            {/*<Perf position={"top-left"}/>*/}
            <color attach="background" args={['black']}/>
            {/*{orbitControl ? <OrbitControls enableZoom={false}/> : null}*/}
            <ambientLight/>
            <directionalLight/>

            <Sections/>


        </Canvas>
        {currentPage === 6 ? <AboutMe/> : null}
        {currentPage !== 6 ? <Hud/>  : null}

    </>;

}


export function Sections() {

    const {
        isBloom,
        currentPage,
        orbitControl,
        bloomIntensity,
        bloomLuminanceThreshold,
        enableScroll,
        pageIn,
        pageOut,
    } = useStore()



    return <>
        <ScrollControls pages={6} damping={0.25} enabled={false} >

            {currentPage === 0 ? <SectionHeart/> : null}
            {currentPage === 1 ? <SectionAtom/> : null}
            {currentPage === 2 ? <SectionLight/> : null}
            {currentPage === 3 ? <SectionUniverseSpace/> : null}
            {currentPage === 4 ? <SectionFlowerVideo/> : null}
            {currentPage === 5 ? <SectionTree/> : null}

        </ScrollControls>

        {

            isBloom ?
                <EffectComposer>
                    <Bloom mipmapBlur resolutionScale = {1} luminanceThreshold={bloomLuminanceThreshold} intensity={bloomIntensity}  radius={0.7}/>
                    <SMAA/>
                </EffectComposer> : null
        }

    </>
}

