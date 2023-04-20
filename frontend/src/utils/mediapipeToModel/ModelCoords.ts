import Vector from "../Vector3";
import { PoseLandmarks, HeadLandmarks } from "./MediapipeBoneDictionary";
import *  as BodyPartNames from "./NamesForBodyParts";

let NECK_FRACTION = 0.2;  // from the center of arms to head
let SHOULDER_FRACTION = 2/3;  // from arm to neck
let HIP_FRACTION = 1/8; // from center of hips to center of shoulders
let SPINE_FRACTION = 0.28; // from center of hips to center of shoulders
let CHEST_FRACTION = 0.7; // from center of hips to center of shoulders
let CHEST_SPINE_OFFSET_MULTIPLIER = 0.2;
let MIDDLE_SPINE_OFFSET_MULTIPLIER = 0.4;
let LOWER_SPINE_OFFSET_MULTIPLIER = 0.2;

interface Joint {
    name: string;
    position: Vector;
    rotation: Vector | null; // todo: delete null
}
   
const ModelCoordinates = (poselm2D: any) => {
    let poseCoords = findPoseCoordinates(poselm2D);
}

const findPoseCoordinates = (poselm2D: any) => {
    const torsoJointsList = torsoJointsCoords(poselm2D);
    const legJointsList = legJointsCoords(poselm2D);
    const armJointsList = armJointsCoords(poselm2D);

    const joints = [...torsoJointsList, ...legJointsList, ...armJointsList];

    return joints;
}

/**
 * Find the coordinates of torso-related joints: shoulders, clavicles, neck, hips, chest, spine (bottom, middle, up).
 * @param {Array} lm2d : array of 2D pose vectors from mediapipe
 * @returns {Array} : array with the coordinates of the joints
 */
const torsoJointsCoords = (poselm2D: any) => {
    // calculate model's head beggining (chin)
    const bottomRightHead = vectorFromLandmark(PoseLandmarks.LeftEar, poselm2D);
    const bottomLeftHead = vectorFromLandmark(PoseLandmarks.RightEar, poselm2D);
    const head = bottomLeftHead.lerp(bottomRightHead, 0.5);

    // calculate model's neck & clavicles
    const leftShoulder = vectorFromLandmark(PoseLandmarks.LeftShoulder, poselm2D);
    const rightShoulder = vectorFromLandmark(PoseLandmarks.RightShoulder, poselm2D);
    const shoulderCenter = leftShoulder.lerp(rightShoulder, 0.5);
    const neck = shoulderCenter.lerp(head, NECK_FRACTION);
    const leftClavicle = leftShoulder.lerp(neck, SHOULDER_FRACTION);
    const rightClavicle = rightShoulder.lerp(neck, SHOULDER_FRACTION);

    // calculate model's spine & hip
    const leftHip = vectorFromLandmark(PoseLandmarks.LeftHip, poselm2D);
    const rightHip = vectorFromLandmark(PoseLandmarks.RightHip, poselm2D);
    const hipCenter = leftHip.lerp(rightHip, 0.5);
    const clavicleCenter = leftClavicle.lerp(rightClavicle, 0.5);
    const hip = hipCenter.lerp(clavicleCenter, HIP_FRACTION);

    // Middle spine bone: Calculate the midpoint between the upper and lower spine bones, 
    // and then offset it along the normal of the plane formed by the shoulders and hips. 
    // This would make the middle spine bone position follow the curvature of the back. 
    // To calculate the normal, you can use the cross product of the vectors connecting 
    // the shoulders and hips.

    // Calculate the normal of the plane formed by the shoulders and hips
    const shoulderVector = leftShoulder.subtract(rightShoulder);
    const hipVector = leftHip.subtract(rightHip);
    const normal = Vector.cross(shoulderVector, hipVector);

    // Determine the bending direction
    const globalUp = new Vector(0, 1, 0);
    const bendingForward = normal.dot(globalUp) < 0;

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
    const chestStraight = hipCenter.lerp(clavicleCenter, CHEST_FRACTION); // spine2
    const chest = normal.multiply(chest_offset_multiplier).add(chestStraight);

    // calculate the lower spine
    const spineStraight = hipCenter.lerp(clavicleCenter, SPINE_FRACTION); // spine
    const spine = normal.multiply(lower_offset_multiplier).add(spineStraight);

    // Calculate the straight middle spine bone position (midpoint between upper and lower spine bones)
    const middleSpineStraight = shoulderCenter.lerp(hipCenter, 0.5);
    // Offset the straight middle spine bone position along the normal to approximate the curved middle spine bone position
    // You may need to adjust the offset multiplier (0.2 in this case) to better match your 3D model
    const middleSpine = normal.multiply(middle_offset_multiplier).add(middleSpineStraight);

    // create torso list
    const torsoJointsList : Joint[] = [
        {
            name: BodyPartNames.NECK,
            position: neck,
            rotation: null
        },
        {
            name: BodyPartNames.LEFT_CLAVICLE,
            position: leftClavicle,
            rotation: null
        },
        {
            name: BodyPartNames.RIGHT_CLAVICLE,
            position: rightClavicle,
            rotation: null
        },
        {
            name: BodyPartNames.SPINE2,
            position: chest,
            rotation: null
        },
        {
            name: BodyPartNames.SPINE1,
            position: middleSpine,
            rotation: null
        },
        {
            name: BodyPartNames.SPINE,
            position: spine,
            rotation: null
        },
        {
            name: BodyPartNames.HIP,
            position: hip,
            rotation: null
        }
    ]
    return torsoJointsList;
}

/**
 * Find the coordinates of leg-related joints: hips, knees, ankles, toes
 * @param {Array} lm2d : array of 2D pose vectors from mediapipe
 * @returns {Array} : array with the coordinates of the joints
 */
const legJointsCoords = (poselm2D: any) => {
    const leftHip = vectorFromLandmark(PoseLandmarks.LeftHip, poselm2D);
    const rightHip = vectorFromLandmark(PoseLandmarks.RightHip, poselm2D);
    const leftKnee = vectorFromLandmark(PoseLandmarks.LeftKnee, poselm2D);
    const rightKnee = vectorFromLandmark(PoseLandmarks.RightKnee, poselm2D);
    const leftAnkle = vectorFromLandmark(PoseLandmarks.LeftAnkle, poselm2D);
    const rightAnkle = vectorFromLandmark(PoseLandmarks.RightAnkle, poselm2D);
    const leftToes = vectorFromLandmark(PoseLandmarks.LeftFootIndex, poselm2D);
    const rightToes = vectorFromLandmark(PoseLandmarks.RightFootIndex, poselm2D);


    const legJointsList : Joint[] = [
        {
            name: BodyPartNames.LEFT_UPPER_LEG,
            position: leftHip,
            rotation: null
        },
        {
            name: BodyPartNames.RIGHT_UPPER_LEG,
            position: rightHip,
            rotation: null
        },
        {
            name: BodyPartNames.LEFT_LOWER_LEG,
            position: leftKnee,
            rotation: null
        },
        {
            name: BodyPartNames.RIGHT_LOWER_LEG,
            position: rightKnee,
            rotation: null
        },
        {
            name: BodyPartNames.LEFT_FOOT,
            position: leftAnkle,
            rotation: null
        },
        {
            name: BodyPartNames.RIGHT_FOOT,
            position: rightAnkle,
            rotation: null
        },
        {
            name: BodyPartNames.LEFT_TOES,
            position: leftToes,
            rotation: null
        },
        {
            name: BodyPartNames.RIGHT_TOES,
            position: rightToes,
            rotation: null
        },
    ];

    return legJointsList;
}

/**
 * Find the coordinates of arm-related joints: hips, knees, ankles, toes
 * @param {Array} lm2d : array of 2D pose vectors from mediapipe
 * @returns {Array} : array with the coordinates of the joints
 */
const armJointsCoords = (poselm2D: any) => {
    const leftShoulder = vectorFromLandmark(PoseLandmarks.LeftShoulder, poselm2D);
    const rightShoulder = vectorFromLandmark(PoseLandmarks.RightShoulder, poselm2D);
    const leftElbow = vectorFromLandmark(PoseLandmarks.LeftElbow, poselm2D);
    const rightElbow = vectorFromLandmark(PoseLandmarks.RightShoulder, poselm2D);
    const leftWrist = vectorFromLandmark(PoseLandmarks.LeftWrist, poselm2D);
    const rightWrist = vectorFromLandmark(PoseLandmarks.RightWrist, poselm2D);
    const leftIndex = vectorFromLandmark(PoseLandmarks.LeftIndex, poselm2D);
    const rightIndex = vectorFromLandmark(PoseLandmarks.RightIndex, poselm2D);
    
    const armJointsList : Joint[] = [
        {
            name: BodyPartNames.LEFT_UPPER_ARM,
            position: leftShoulder,
            rotation: null
        },
        {
            name: BodyPartNames.RIGHT_UPPER_ARM,
            position: rightShoulder,
            rotation: null
        },
        {
            name: BodyPartNames.LEFT_LOWER_ARM,
            position: leftElbow,
            rotation: null
        },
        {
            name: BodyPartNames.RIGHT_LOWER_ARM,
            position: rightElbow,
            rotation: null
        },
        {
            name: BodyPartNames.LEFT_HAND,
            position: leftWrist,
            rotation: null
        },
        {
            name: BodyPartNames.RIGHT_HAND,
            position: rightWrist,
            rotation: null
        },
        {
            name: BodyPartNames.LEFT_INDEX,
            position: leftIndex,
            rotation: null
        },
        {
            name: BodyPartNames.RIGHT_INDEX,
            position: rightIndex,
            rotation: null
        },
    ];

    return armJointsList;
}

/**
 * Convert landmark coordinates to a vector.
 * @param property : number which represents the joint
 * @param poselm2D : array of 2D pose vectors from mediapipe
 * @returns 
 */
const vectorFromLandmark = (property: number, poselm2D: any) => {
    return new Vector(poselm2D[property].x, poselm2D[property].y, poselm2D[property].z);
}

export{findPoseCoordinates}