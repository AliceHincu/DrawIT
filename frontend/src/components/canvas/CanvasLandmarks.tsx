import React, { useEffect, useRef } from "react";
import { findPoseCoordinates } from "../../utils/mediapipeToModel/ModelCoords";
import { ResultsHolistic } from "../../utils/ModelInterfaces";

interface CanvasLandmarksProps {
  image: HTMLImageElement;
  landmarks: ResultsHolistic | null;
  width: number;
}

const scale = (fromRange: any, toRange: any) => {
  const d = (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]);
  return (from: number) => (from - fromRange[0]) * d + toRange[0];
};

const draw = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  landmarks: any
) => {
  if (!landmarks) {
    return;
  }

  const imageWidth = image.width;
  const imageHeight = image.height;
  context.clearRect(0, 0, imageWidth, imageHeight);
  context.drawImage(landmarks.segmentationMask, 0, 0, imageWidth, imageHeight);

  context.globalCompositeOperation = "source-in";
  context.fillStyle = "#00FF00";
  context.fillRect(0, 0, imageWidth, imageHeight);

  context.globalCompositeOperation = "destination-atop";
  context.drawImage(image, 0, 0, imageWidth, imageHeight);

  context.globalCompositeOperation = "source-over";
  const poseCoords = findPoseCoordinates(landmarks.poseLandmarks);
  for (let landmark of poseCoords) {
    context.beginPath();
    context.arc(
      scale([0, 1], [0, imageWidth])(landmark.position.x),
      scale([0, 1], [0, imageHeight])(landmark.position.y),
      3,
      0,
      2 * Math.PI,
      false
    );
    context.stroke();
  }
};

export const CanvasLandmarks = ({
  image,
  landmarks,
  width,
}: CanvasLandmarksProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // for future: when implementing multiple HPE models, have a modal with preview from each landmarks, from which you can select the final version
  const aspectRatio: number = image.height / image.width;
  image.width = width / 4;
  image.height = aspectRatio * image.width;

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        draw(context, image, landmarks);
      }
    }
  }, [landmarks]);

  if (landmarks) {
    return <canvas ref={canvasRef} width={image.width} height={image.height} />;
  } else {
    return <></>;
  }
};
