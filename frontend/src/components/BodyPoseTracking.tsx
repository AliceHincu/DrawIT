import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { FemaleModel } from "./FemaleBot"
import { Model } from "./Model"
import { Stats, OrbitControls, Bounds } from '@react-three/drei'
import { useState, useEffect } from 'react';
import { Holistic, VERSION } from "@mediapipe/holistic"
import '@tensorflow/tfjs-backend-webgl';
import { useWindowDimensions } from "../utils/DimensionUtil"


export const BodyPoseTracking = () => {
  // The exclamation mark is a non-null assertion that will let TS know that ref.current is defined when we access it in effects.
  // const ref = useRef<Mesh>(null!)

  const { height, width } = useWindowDimensions();
  const aspect = width/height;
  const [isLoaded, setIsLoaded] = useState(false);

  const onResults = async (results: any) =>{
    // do something with prediction results
    // landmark names may change depending on TFJS/Mediapipe model version
    // let facelm = results.faceLandmarks;
    // let poselm = results.poseLandmarks;
    // // let poselm3D = results.ea;
    // let rightHandlm = results.rightHandLandmarks;
    // let leftHandlm = results.leftHandLandmarks;
    setIsLoaded(true);
    console.log(results);
  
    // let faceRig = Kalidokit.Face.solve(facelm,{runtime:'mediapipe',video:HTMLVideoElement})
    // let poseRig = Kalidokit.Pose.solve(poselm3d,poselm,{runtime:'mediapipe',video:HTMLVideoElement})
    // let rightHandRig = Kalidokit.Hand.solve(rightHandlm,"Right")
    // let leftHandRig = Kalidokit.Hand.solve(leftHandlm,"Left")
  };
  
  let image = new Image(408, 612);
  image.src = "ballerina.jpg";
  
  useEffect(() => {
    const holistic = new Holistic({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    }});
  
    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  
    holistic.onResults(onResults);
  
    image.onload = async (ev) => {
      await holistic.send({
        image: image
      });
    }
  });

  return(
    <>
      {isLoaded ? "Loaded" : "isLoading..."}
      <Canvas style={{ height: '100vh' }} 
        camera={{position: [0, 15, 50], fov: 60, aspect: aspect}}>
          <ambientLight /> 
          {/* <ambientLight intensity={0.1} />
          <directionalLight color="red" position={[0, 0, 5]} />
          <mesh>
              <boxGeometry />
              <meshStandardMaterial />
          </mesh> */}
        <Suspense fallback={null}>
            {/* <Model/> */}
            <Bounds fit clip observe margin={1.2}>
              <FemaleModel rotation={[0,0,0]}/>
            </Bounds>
        </Suspense>
        <OrbitControls makeDefault/>
          <Stats />
      </Canvas>
      <div>Hi!</div>
    </>
  )
}