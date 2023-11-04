import {useFrame, useLoader, useThree} from "@react-three/fiber";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {useMemo, useRef} from "react";
import {Hud, Text, useGLTF} from "@react-three/drei";
import CONSTANT from "../constant.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import {MeshSurfaceSampler} from "three/examples/jsm/math/MeshSurfaceSampler.js";
import * as THREE from "three"
import {useEffect} from "react";
import {gsap} from "gsap";
import {useStore} from "../stores.jsx";


export default function SectionTree() {

    const fontSize = 0.2
    const isZh = useStore((state)=>{return state.isZh})

    return <>
       <Tree/>
        <LeafRain/>
       {
           isZh ? <>
               <Text font={CONSTANT.ROOT_URL + "/cn0.ttf"} rotation={[0, Math.PI * -0.02 , 0]} fontSize={fontSize} position={[-.3, -.25, 3.0]}>各美其美</Text>
               <Text font={CONSTANT.ROOT_URL + "/cn0.ttf"} rotation={[0, Math.PI * -0.02 , 0]} fontSize={fontSize} position={[-.3, -.55, 3.0]}>美人之美</Text>
           </> : <>
               <Text font={CONSTANT.ROOT_URL + "/en0.ttf"} rotation={[0, Math.PI * -0.02 , 0]} fontSize={fontSize} position={[-.3, -.25, 3.0]}>Appreciate the values of</Text>
               <Text font={CONSTANT.ROOT_URL + "/en0.ttf"} rotation={[0, Math.PI * -0.02 , 0]} fontSize={fontSize} position={[-.3, -.55, 3.0]}>others as do to mine</Text>
           </>
       }

    </>
}

function Tree() {
    let bc = new THREE.Color("#ffaacc");

    const treeObj = useLoader(OBJLoader, CONSTANT.ROOT_URL + "/tree.obj")
    const {camera, clock} = useThree(({camera, clock}) => {
        return  {camera, clock}
    })

    window.CCC = camera

    const elapsedTime = clock.getElapsedTime()




    let uniformsTree = {
        time: {value: 0},
        penzaiSize: {value: 0.05},
    };

    useEffect(()=>{
        camera.position.set(1.27, 4.83, -0.04)
        camera.quaternion.set(-0.439, 0.55, 0.42, 0.57)
        camera.updateProjectionMatrix()

        const cameraDistance = 1.5
        gsap.to(camera.position, {
            x: -0.34 * cameraDistance,
            y: 0.8 * cameraDistance,
            z: 4.2 * cameraDistance,
            duration: 5,
        })

        gsap.to(camera.quaternion, {
            x: 0.057,
            y: 0.986,
            z: -1.61,
            w: -0.035,
            duration: 5,
            onUpdate: ()=>{
                camera.lookAt(0, 1., 0)
            }
        })



        uniformsTree.penzaiSize.value = 0.05;
        gsap.to(uniformsTree.penzaiSize, {
            value: 0.30,
            duration: 3,
        })
    })

    let mat = new THREE.MeshBasicMaterial({
        color: 0xff2266, wireframe: false, transparent: true, opacity: 0.75});
    treeObj.children[0].material = mat;

    let sampler = new MeshSurfaceSampler( treeObj.children[0] )
        .setWeightAttribute( null )
        .build();
    let pts = [];
    let angle = [];
    let idx = [];
    let n = new THREE.Vector3();
    for (let i = 0; i < 250; i++){
        let p = new THREE.Vector3();
        sampler.sample(p, n);
        pts.push(p);
        angle.push(Math.random() * Math.PI * 2 / 5);
        idx.push(i);
    }

    let treePoints = new THREE.Points(new THREE.BufferGeometry().setFromPoints(pts), new THREE.PointsMaterial({color:0xffbbff, size: 0.15}));
    treePoints.geometry.setAttribute("angle", new THREE.BufferAttribute(new Float32Array(angle), 1));
    treePoints.geometry.setAttribute("idx", new THREE.BufferAttribute(new Float32Array(idx), 1));
    treePoints.material.onBeforeCompile = shader => {
        //console.log(shader.vertexShader);
        shader.uniforms.time = uniformsTree.time;
        shader.uniforms.penzaiSize = uniformsTree.penzaiSize;
        shader.vertexShader = `
    uniform float time;
    uniform float penzaiSize;

    attribute float angle;
    attribute float idx;
    
    varying float vAngle;
` + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
       vAngle = angle;
`
        );
        shader.vertexShader = shader.vertexShader.replace(
            `gl_PointSize = size;`,
            `
            float halfSize = penzaiSize * 0.5;
      float tIdx = idx + time * 2.0;
gl_PointSize = penzaiSize + (sin(tIdx) * cos(tIdx * 2.5) * 0.5 + 0.5) * halfSize ;`
        );

        shader.fragmentShader = `
      varying float vAngle;
` + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <clipping_planes_fragment>`,
            `
    vec2 uv = gl_PointCoord - 0.5;

    float a = atan(uv.y, uv.x) + vAngle;
    float f = 0.4 + 0.1 * cos(a * 5.);
    f = 1. - step(f, length(uv));
    if (f < 0.5) discard;  // shape function

    #include <clipping_planes_fragment>`
        );
        shader.fragmentShader = shader.fragmentShader.replace(
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `
        vec3 col = vec3(1, 1, 0.8);
        uv *= 2.;
        float d = clamp(length(uv), 0., 1.);
        vec4 diffuseColor = vec4(mix(col, diffuse, pow(d, 2.)), 1.);
`
        );
        //console.log(shader.fragmentShader);
    }

    treeObj.add(treePoints)
    // treeObj.rotation.y = THREE.MathUtils.DEG2RAD * 20;
    treeObj.scale.setScalar(5);


    useFrame(({clock})=>{
        // console.log(treePoints.material)
        uniformsTree.time.value = clock.getElapsedTime() ;
    })


    return <>
        <primitive object={treeObj}/>
    </>

}


function Ground() {
    let bc = new THREE.Color(0xffaacc);

    let baseGeom = new THREE.CircleGeometry(6, 64);
    baseGeom.rotateX(-Math.PI * 0.5);
    let baseMat = new THREE.MeshBasicMaterial({color: 0xff0088});
    baseMat.defines = {"USE_UV" : ""};
    baseMat.onBeforeCompile = shader => {
        //console.log(shader.fragmentShader);
        shader.fragmentShader = shader.fragmentShader.replace(
            `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
            `
      vec3 col = vec3(${bc.r}, ${bc.g}, ${bc.b});
      vec2 uv = vUv - 0.5;
      uv *= 2.;
      col = mix(outgoingLight, col, length(uv));
      gl_FragColor = vec4(col, diffuseColor.a);
    `
        );
    }
    return <mesh position={[0, -0.15, 0]} geometry={baseGeom} material={baseMat}>
    </mesh>
}



function LeafRain() {




    let r = 3.5; // radius
    let MAX_POINTS = 5000;
    let pointsCount = 0;
    let points = []; //3
    let delay = [];  //1
    let speed = [];  //2
    let color = [];  //3
    let c = new THREE.Color();
    while( pointsCount < MAX_POINTS){
        let vec = new THREE.Vector3(THREE.MathUtils.randFloat(-r, r), 0, THREE.MathUtils.randFloat(-r, r));
        let rRatio = vec.length() / r;
        if (vec.length() <= r && Math.random() < (1. - rRatio)) {
            points.push(vec);
            c.set(0xffffcc);
            color.push(c.r,c.g - Math.random() * 0.1,c.b + Math.random() * 0.2);
            delay.push(THREE.MathUtils.randFloat(-10,0));
            let val = THREE.MathUtils.randFloat(1, 2);
            val = Math.random() < 0.25 ? 0 : val;
            speed.push(Math.PI * val * 0.35, val); // angle, height
            pointsCount++;
        }
    }
    let uniforms = {
        time: {value: 0},
        upperLimit: {value: 3.5},
        upperRatio: {value: 1.25},
        spiralRadius: {value: 0.0},
        spiralTurns: {value: 2.},
        azimuth: {value: 0.},
        percentage: {value: 0.},
        // tex2020: {value: tex2020},

    }
    let pointsGeom = new THREE.BufferGeometry().setFromPoints(points);
    pointsGeom.setAttribute("color", new THREE.BufferAttribute(new Float32Array(color), 3));
    pointsGeom.setAttribute("delay", new THREE.BufferAttribute(new Float32Array(delay), 1));
    pointsGeom.setAttribute("speed", new THREE.BufferAttribute(new Float32Array(speed), 2));

    let pointsMat = new THREE.PointsMaterial({/*color: 0xffddaa,*/ vertexColors: THREE.VertexColors, size: 0.1, transparent: true});
    pointsMat.onBeforeCompile = shader => {

        shader.uniforms.time = uniforms.time;
        shader.uniforms.upperLimit = uniforms.upperLimit;
        shader.uniforms.upperRatio = uniforms.upperRatio;
        shader.uniforms.spiralRadius = uniforms.spiralRadius;
        shader.uniforms.spiralTurns = uniforms.spiralTurns;
        shader.uniforms.tex2020 = uniforms.tex2020;
        shader.uniforms.percentage = uniforms.percentage;
        shader.uniforms.azimuth = uniforms.azimuth;

        shader.vertexShader = `
  uniform float time;
  uniform float upperLimit;
  uniform float upperRatio;
  uniform float spiralRadius;
  uniform float spiralTurns;
  uniform float azimuth;
  uniform sampler2D tex2020;

  attribute float delay;
  attribute vec2 speed;

  varying float vRatio;
  varying vec2 vSpeed;
  varying float vIsEffect;


float rand22(vec2 n) { 
 return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}


float noise(vec2 n) {
 const vec2 d = vec2(0.0, 1.0);
  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
 return mix(mix(rand22(b), rand22(b + d.yx), f.x), mix(rand22(b + d.xy), rand22(b + d.yy), f.x), f.y);
}


  mat2 rot( float a){
    return mat2(cos(a), -sin(a), sin(a), cos(a));
  }

` + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>

    float t = time + delay;
    t = t < 0. ? 0. : t;
    
    float h = mod(speed.y * t, upperLimit);
    float hRatio = clamp(h / upperLimit, 0., 1.);
    vRatio = hRatio;
    vSpeed = speed;
    
    transformed.y = h;
    
    float a = atan(position.x, position.z);
    a += speed.x * t;
    float initLength = length(position.xz);
    float finalLength = initLength * upperRatio;
    float ratio = mix(initLength, finalLength, hRatio);
    transformed.x = cos(a) * ratio;
    transformed.z = sin(a) * -ratio;
    
    float sTurns = sin(time * 0.5) * 0.5 + spiralTurns;

    float spiralA = hRatio * sTurns * PI * 2.;
    float sRadius = mix(spiralRadius, 0., hRatio);
    transformed.x += cos(spiralA) * sRadius;
    transformed.z += sin(spiralA) * -sRadius;

    // 2020 effect
    vec3 efcPos = vec3(0, 6, 0.5);
    vec3 efcClamp = vec3(1., 0.75, 0.25) * 3.5;
    vec3 efcMin = efcPos - efcClamp;
    vec3 efcMax = efcPos + efcClamp;
    vec3 UVTransformed = vec3(transformed);
    UVTransformed.xz *= rot(azimuth); // following the camera's azimuthal angle    
    vec3 efcUV = (UVTransformed - efcMin) / (efcMax - efcMin);
    
    // float isEffect = texture2D(tex2020, efcUV.xy).r;
    
     float isEffect = noise(position.zy) > 0.6 ? 1. : 0.;
     isEffect *= (efcUV.y > -0.5) ? 1. : 0.;

     
    vIsEffect = isEffect;
`
        );
        shader.vertexShader = shader.vertexShader.replace(
            `gl_PointSize = size;`,
            `bool cond = floor(speed.y + 0.5) == 0.;
gl_PointSize = size * ( cond ? 0.75 : ((1. - hRatio) * (smoothstep(0., 0.01, hRatio) * 0.25) + 0.75));
    gl_PointSize = mix(gl_PointSize, size * 2., isEffect);
    `
        );
        shader.fragmentShader = `
  uniform float time;
  uniform float percentage;

  varying float vRatio;
  varying vec2 vSpeed;
  varying float vIsEffect;
  mat2 rot( float a){
    return mat2(cos(a), -sin(a), sin(a), cos(a));
  }
` + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
            `#include <clipping_planes_fragment>`,
            `
    if (vRatio == 1.) discard;

    vec2 uv = gl_PointCoord - 0.5;

    float a = (time * vSpeed.x + vSpeed.x) * 10.;
    
    uv *= rot(a);
    uv.y *= floor(a + 0.5) == 0. ? 1.25 : 2. + sin(a * PI);

    if (length(uv) > 0.5) discard;  // shape function

    #include <clipping_planes_fragment>`
        );
        shader.fragmentShader = shader.fragmentShader.replace(
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `
        vec3 col = vec3(1, 0.7, 0.9);
        float d = clamp(uv.x + .5, 0., 1.);
        vec4 diffuseColor = vec4(mix(diffuse, col, pow(d, 2.)), 1.);
        diffuseColor = vec4(mix(diffuseColor.rgb, vec3(0.95, 0, 0.45), vIsEffect), 1.);
       
`
        );
        console.log(shader.vertexShader);
        console.log(THREE.ShaderChunk.color_fragment)
    }
    const {camera, clock} = useThree(({camera, clock}) => {
        return  {camera, clock}
    })

    const elapsedTime = clock.getElapsedTime()

    useFrame(({clock, controls})=>{
        uniforms.time.value = (clock.getElapsedTime() - elapsedTime) * .2;
    })

    let p = new THREE.Points(pointsGeom, pointsMat);
    return <>
        <primitive object={p}/>
    </>
}


