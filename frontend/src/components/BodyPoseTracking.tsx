import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { FemaleModel } from "./FemaleBot";
import { Model } from "./Model";
import { Stats, OrbitControls, Bounds } from "@react-three/drei";
import { useState, useEffect } from "react";
import { Holistic } from "@mediapipe/holistic";
import "@tensorflow/tfjs-backend-webgl";
import { useWindowDimensions } from "../utils/DimensionUtil";
import { ImageUploader } from "./image-uploader/ImageUploader";
import { CanvasLandmarks } from "./canvas/CanvasLandmarks";
import { ResultsHolistic } from "../utils/ModelInterfaces";
import { findPoseRotation } from "../utils/mediapipeToModel/ModelCoords";
// import { findPoseRotation } from "../utils/mediapipeToModel/ModelCoords";

export const BodyPoseTracking = () => {
  const [
    resultMediapipe,
    setResultMediapipe,
  ] = useState<ResultsHolistic | null>(null);
  const [rotation, setRotation] = useState({});
  const [imageUploadUrl, setImageUploadUrl] = useState<string>("ballerina.jpg");
  const [isLoaded, setIsLoaded] = useState(false);
  const [rotations, setRotations] = useState({});

  const { height, width } = useWindowDimensions();
  const aspect = width / height;

  const onResults = async (results: any) => {
    // do something with prediction results. Can't use Results interface because "za" is not there.
    // landmark names may change depending on TFJS/Mediapipe model version
    // console.log(results);
    setResultMediapipe(results);
    setRotations(findPoseRotation(results.poseLandmarks, results.za));
    setIsLoaded(true);
  };

  let image = new Image();
  image.src = imageUploadUrl;

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    holistic.setOptions({
      modelComplexity: 2,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      refineFaceLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults(onResults);

    image.onload = async (ev) => {
      await holistic.send({
        image: image,
      });
    };
  }, []);

  const imageUploaded = (imageSrc: string) => {
    setIsLoaded(false);
    setImageUploadUrl(imageSrc);
  };

  return (
    <>
      <ImageUploader callback={imageUploaded}></ImageUploader>
      {isLoaded ? "Loaded" : "isLoading..."}
      <CanvasLandmarks
        image={image}
        landmarks={resultMediapipe}
        width={width}
      ></CanvasLandmarks>

      <Canvas
        style={{ height: "100vh" }}
        // camera={{ position: [0, 30, 20], fov: 60, aspect: aspect }}
      >
        <ambientLight />
        <Suspense fallback={null}>
          {isLoaded ? <Model rotations={rotations} /> : "Model Loading..."}
        </Suspense>
        <OrbitControls makeDefault />
        <Stats />
      </Canvas>

      <div>Hi!</div>
    </>
  );
};
