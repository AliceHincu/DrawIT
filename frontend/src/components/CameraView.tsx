import React from 'react';
import { useRef } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet"

export const CameraView = (props: any) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const style = {
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 9,
        width: 320,
        height: 240
    }

    const runPosenet = async () => {
        const net = await posenet.load()
        setInterval(() => {detect(net)}, 100);
    }

    const drawPose = (predictions:any, canvas:any) => {
        if(predictions.score > 0) {
            const keypoints = predictions.keypoints;
            props.mapJoints(keypoints);
            keypoints.forEach((point:any) => {
                const x = point.position.x 
                const y = point.position.y 
                canvas.beginPath();
                canvas.arc(x, y, 5, 0, 3*Math.PI);
                canvas.fillStyle = "Blue";
                canvas.fill();
            })
        }
    }
    const detect = async (net:any) => {
        if(
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current["video"]["readyState"] === 4
        ) {
            const video = webcamRef.current["video"];
            const videoWidth = video["width"];
            const videoHeight = video["height"];

            webcamRef.current["video"]["width"] = videoWidth;
            webcamRef.current["video"]["height"] = videoHeight;

            // canvasRef.current["width"] = videoWidth;
            // canvasRef.current["height"] = videoWidth;
        }
    }

    runPosenet();
    
    return (
        <div>
            <Webcam ref={webcamRef}/>
            <canvas ref={canvasRef}/>
        </div>
    )
}