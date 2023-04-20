import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { FemaleModel } from "./FemaleBot";
import { Model } from "./Model";
import { Stats, OrbitControls, Bounds } from "@react-three/drei";
import { useState, useEffect } from "react";
import { Holistic } from "@mediapipe/holistic";
import "@tensorflow/tfjs-backend-webgl";
import { useWindowDimensions } from "../utils/DimensionUtil";
import { ImageUploader } from "./image-uploader/ImageUploader";
import { Face, Pose, Hand, TPose } from "kalidokit";
import { Model2 } from "./Model2";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import * as holistics from "@mediapipe/holistic";
import { findPoseCoordinates } from "../utils/mediapipeToModel/ModelCoords";

declare global {
  interface Window {
    drawConnectors: any;
  }
}

export const BodyPoseTracking = () => {
  // The exclamation mark is a non-null assertion that will let TS know that ref.current is defined when we access it in effects.
  // const ref = useRef<Mesh>(null!)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const connect = window.drawConnectors;

  const { height, width } = useWindowDimensions();
  const aspect = width / height;
  const [isLoaded, setIsLoaded] = useState(true);
  const [rigs, setRigs] = useState<TPose>();

  const [imageUploadUrl, setImageUploadUrl] = useState<string>("ballerina.jpg");

  let poseRig = {
    RightUpperArm: {
      x: 0.07092583400506086,
      y: 0.6115875943832204,
      z: 0.89079230895846,
    },
    RightLowerArm: {
      x: 0.3,
      y: 0.06304298139776437,
      z: 0.8248256209082492,
    },
    LeftUpperArm: {
      x: -0.16334135882781997,
      y: 0.025704189184518833,
      z: 0.49782478476025327,
    },
    LeftLowerArm: {
      x: 0.3,
      y: -0.1893719357472298,
      z: 0,
    },
    RightHand: {
      x: 0.13978573965326327,
      y: -0.6,
      z: 0.9375512409231381,
    },
    LeftHand: {
      x: -0.31645903056296315,
      y: 0.25271460121008765,
      z: 0.29062179139160077,
    },
    RightUpperLeg: {
      x: 0,
      y: -0.04387420829534583,
      z: 0.03470669328797461,
      rotationOrder: "XYZ",
    },
    RightLowerLeg: {
      x: -0.19783134345735573,
      y: 0,
      z: 0,
      rotationOrder: "XYZ",
    },
    LeftUpperLeg: {
      x: 0.11026987303946965,
      y: -0.17369072981922273,
      z: 0.28906006429249975,
      rotationOrder: "XYZ",
    },
    LeftLowerLeg: {
      x: -0.18943688550096233,
      y: 0,
      z: 0,
      rotationOrder: "XYZ",
    },
    Hips: {
      position: {
        x: 0.05982724428176878,
        y: 0,
        z: -0.8143022487663486,
      },
      worldPosition: {
        x: -0.12921588097626888,
        y: 0,
        z: -2.1598166943424633,
      },
      rotation: {
        x: 0,
        y: -0.5962267662637286,
        z: -0.1841353478681009,
      },
    },
    Spine: {
      x: 0,
      y: -0.38018478696257835,
      z: 0.4314103503736993,
    },
  };
  const scale = (fromRange: any, toRange: any) => {
    const d = (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]);
    return (from: number) => (from - fromRange[0]) * d + toRange[0];
  };

  const onResults = async (results: any) => {
    // do something with prediction results
    // landmark names may change depending on TFJS/Mediapipe model version
    let facelm = results.faceLandmarks;
    let poselm = results.poseLandmarks;
    let poselm3D = results.za;
    let rightHandlm = results.rightHandLandmarks;
    let leftHandlm = results.leftHandLandmarks;

    console.log("here");
    //let {leftShoulder, rightShoulder, neck, leftClavicle, rightClavicle, leftHip, rightHip, hip, spine, chest, middleSpine} = findPoseCoordinates(poselm);
    let landmarks = findPoseCoordinates(poselm);
    console.log(results);

    const imageWidth = 408;
    const imageHeight = 612;

    if (canvasRef.current) {
      canvasRef.current.width = imageWidth;
      canvasRef.current.height = imageHeight;

      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // ctx.save();

        ctx.clearRect(0, 0, imageWidth, imageHeight);
        ctx.drawImage(results.segmentationMask, 0, 0, imageWidth, imageHeight);
        ctx.globalCompositeOperation = "source-in";
        ctx.fillStyle = "#00FF00";
        ctx.fillRect(0, 0, imageWidth, imageHeight);

        ctx.globalCompositeOperation = "destination-atop";
        ctx.drawImage(results.image, 0, 0, imageWidth, imageHeight);

        ctx.globalCompositeOperation = "source-over";
        for (let landmark of landmarks) {
          ctx.beginPath();
          ctx.arc(
            scale([0, 1], [0, imageWidth])(landmark.position.x),
            scale([0, 1], [0, imageHeight])(landmark.position.y),
            3,
            0,
            2 * Math.PI,
            false
          );
          ctx.stroke();
        }

        //test from diff laptop
        // ctx.globalCompositeOperation = "source-over";
        // drawConnectors(ctx, results.poseLandmarks, holistics.POSE_CONNECTIONS, { color: '#C0C0C070', lineWidth: 4 });
        // drawLandmarks(ctx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });
        // drawConnectors(ctx, results.faceLandmarks, holistics.FACEMESH_TESSELATION,
        //   { color: '#C0C0C070', lineWidth: 1 });
        // drawConnectors(ctx, results.leftHandLandmarks, holistics.HAND_CONNECTIONS,
        //   { color: '#CC0000', lineWidth: 5 });
        // drawLandmarks(ctx, results.leftHandLandmarks,
        //   { color: '#00FF00', lineWidth: 1 });
        // drawConnectors(ctx, results.rightHandLandmarks, holistics.HAND_CONNECTIONS,
        //   { color: '#00CC00', lineWidth: 5 });
        // drawLandmarks(ctx, results.rightHandLandmarks,
        //   { color: '#FF0000', lineWidth: 1 });

        // ctx.restore();
      }
    }
    // console.log(poselm);
    // console.log(poselm3D);

    // let faceRig = Kalidokit.Face.solve(facelm,{runtime:'mediapipe',video:HTMLVideoElement})

    // let poseRig = Pose.solve(poselm3D,poselm,{runtime:'mediapipe'})
    // console.log(poseRig)
    // setRigs(poseRig)

    // let rightHandRig = Kalidokit.Hand.solve(rightHandlm,"Right")
    // let leftHandRig = Kalidokit.Hand.solve(leftHandlm,"Left")
    // setIsLoaded(true);
  };

  // let image = new Image();
  // image.src = "ballerina.jpg";

  let image = new Image();
  image.src = imageUploadUrl;

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      },
    });

    holistic.setOptions({
      modelComplexity: 1,
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
  });

  // const onChange = (imageList: any, addUpdateIndex: any) => {
  //   // data for submit
  //   setIsLoaded(false);
  //   console.log(imageList, addUpdateIndex);
  //   setImages(imageList);
  //   setImageUploadUrl(imageList[addUpdateIndex].data_url);
  // };

  const imageUploaded = (imageSrc: string) => {
    setIsLoaded(false);
    setImageUploadUrl(imageSrc);
  };

  return (
    <>
      <ImageUploader callback={imageUploaded}></ImageUploader>
      {isLoaded ? "Loaded" : "isLoading..."}
      <img src={imageUploadUrl} alt="" width="100" />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          width: 1280,
          height: 900,
        }}
        id="myCanvas"
      />
      {/* <Canvas style={{ height: '100vh' }} 
        camera={{position: [0, 15, 50], fov: 60, aspect: aspect}}>
          <ambientLight /> 
        <Suspense fallback={null}>
          {isLoaded ? <Model/> : "Model Loading..."}
        </Suspense>
        <OrbitControls makeDefault/>
          <Stats />
      </Canvas>  */}
      <div>Hi!</div>
    </>
  );
};
