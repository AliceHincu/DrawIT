import Vector from "../Vector3";
import {PoseLandmarks, HeadLandmarks} from "./MediapipeBoneDictionary";

let NECK_FRACTION = 0.2;  // from the center of arms to head
let SHOULDER_FRACTION = 2/3;  // from arm to neck
let HIP_FRACTION = 1/8; // from center of hips to center of shoulders
let SPINE_FRACTION = 0.28; // from center of hips to center of shoulders
let CHEST_FRACTION = 0.7; // from center of hips to center of shoulders
let CHEST_SPINE_OFFSET_MULTIPLIER = 0.2;
let MIDDLE_SPINE_OFFSET_MULTIPLIER = 0.4;
let LOWER_SPINE_OFFSET_MULTIPLIER = 0.2;

const ModelCoordinates = (poselm2D: any) => {
    let poseCoords = findPoseCoordinates(poselm2D);
}

const findPoseCoordinates = (poselm2D: any) => {
    let leftShoulder = new Vector(poselm2D[PoseLandmarks.LeftShoulder].x,poselm2D[PoseLandmarks.LeftShoulder].y, poselm2D[PoseLandmarks.LeftShoulder].z);
    let rightShoulder = new Vector(poselm2D[PoseLandmarks.RightShoulder].x, poselm2D[PoseLandmarks.RightShoulder].y, poselm2D[PoseLandmarks.RightShoulder].z);
    let bottomRightHead = new Vector(poselm2D[PoseLandmarks.LeftEar].x, poselm2D[PoseLandmarks.LeftEar].y, poselm2D[PoseLandmarks.LeftEar].z);
    let bottomLeftHead = new Vector(poselm2D[PoseLandmarks.RightEar].x, poselm2D[PoseLandmarks.RightEar].y, poselm2D[PoseLandmarks.RightEar].z);
    let leftHip = new Vector(poselm2D[PoseLandmarks.LeftHip].x, poselm2D[PoseLandmarks.LeftHip].y, poselm2D[PoseLandmarks.LeftHip].z);
    let rightHip = new Vector(poselm2D[PoseLandmarks.RightHip].x, poselm2D[PoseLandmarks.RightHip].y, poselm2D[PoseLandmarks.RightHip].z);
    
    // calculate model's head beggining (chin)
    let head = bottomLeftHead.lerp(bottomRightHead, 0.5);

    // calculate model's neck & shoulders 
    let shoulderCenter = leftShoulder.lerp(rightShoulder, 0.5);
    let neck = shoulderCenter.lerp(head, NECK_FRACTION);
    let leftClavicle = leftShoulder.lerp(neck, SHOULDER_FRACTION);
    let rightClavicle = rightShoulder.lerp(neck, SHOULDER_FRACTION);

    // calculate model's spine & hips
    let hipCenter = leftHip.lerp(rightHip, 0.5);
    let clavicleCenter = leftClavicle.lerp(rightClavicle, 0.5);
    let hip = hipCenter.lerp(clavicleCenter, HIP_FRACTION);

    // Middle spine bone: Calculate the midpoint between the upper and lower spine bones, 
    // and then offset it along the normal of the plane formed by the shoulders and hips. 
    // This would make the middle spine bone position follow the curvature of the back. 
    // To calculate the normal, you can use the cross product of the vectors connecting 
    // the shoulders and hips.

    // Calculate the normal of the plane formed by the shoulders and hips
    let shoulderVector = leftShoulder.subtract(rightShoulder);
    let hipVector = leftHip.subtract(rightHip);
    let normal = Vector.cross(shoulderVector, hipVector);

    // Determine the bending direction
    let globalUp = new Vector(0, 1, 0);
    let bendingForward = normal.dot(globalUp) < 0;

    // Choose the multiplier sign based on the bending direction
    let chest_offset_multiplier = CHEST_SPINE_OFFSET_MULTIPLIER;
    let middle_offset_multiplier = MIDDLE_SPINE_OFFSET_MULTIPLIER;
    let lower_offset_multiplier = LOWER_SPINE_OFFSET_MULTIPLIER;
    if (bendingForward) {
        middle_offset_multiplier *= -1;
        chest_offset_multiplier *= -1;
        lower_offset_multiplier *= -1;
    }

    // Calculate the upper spine
    let chestStraight = hipCenter.lerp(clavicleCenter, CHEST_FRACTION); // spine2
    let chest = normal.multiply(chest_offset_multiplier).add(chestStraight);

    // calculate the lower spine
    let spineStraight = hipCenter.lerp(clavicleCenter, SPINE_FRACTION); // spine
    let spine = normal.multiply(lower_offset_multiplier).add(spineStraight);

    // Calculate the straight middle spine bone position (midpoint between upper and lower spine bones)
    let middleSpineStraight = shoulderCenter.lerp(hipCenter, 0.5);
    // Offset the straight middle spine bone position along the normal to approximate the curved middle spine bone position
    // You may need to adjust the offset multiplier (0.2 in this case) to better match your 3D model
    let middleSpine = normal.multiply(middle_offset_multiplier).add(middleSpineStraight);

    return {leftShoulder, rightShoulder, neck, leftClavicle, rightClavicle, leftHip, rightHip, hip, spine, chest, middleSpine};
}


export{findPoseCoordinates}