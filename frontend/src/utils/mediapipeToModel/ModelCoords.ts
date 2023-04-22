import Vector from "../Vector3";
import { PoseLandmarks, HeadLandmarks } from "./MediapipeBoneDictionary";
import * as BodyPartNames from "./NamesForBodyParts";

let NECK_FRACTION = 0.2; // from the center of arms to head
let SHOULDER_FRACTION = 2 / 3; // from arm to neck
let HIP_FRACTION = 1 / 8; // from center of hips to center of shoulders
let SPINE_FRACTION = 0.28; // from center of hips to center of shoulders
let CHEST_FRACTION = 0.7; // from center of hips to center of shoulders
let CHEST_SPINE_OFFSET_MULTIPLIER = 0.4;
let MIDDLE_SPINE_OFFSET_MULTIPLIER = 0.8;
let LOWER_SPINE_OFFSET_MULTIPLIER = 0.2;

type Matrix3x3 = number[][];
type Quaternion = [number, number, number, number];

export interface JointPose {
  position: Vector;
  rotation: Quaternion | null; // todo: delete null
}

export interface Landmark {
  [name: string]: JointPose;
}

const findPoseCoordinates = (poselm2D: any) => {
  const torsoJointsList = torsoJointsCoords(poselm2D);
  const legJointsList = legJointsCoords(poselm2D);
  const armJointsList = armJointsCoords(poselm2D);
  const headLandmarksList = headLandmarksCoords(poselm2D);

  const joints = {
    ...torsoJointsList,
    ...legJointsList,
    ...armJointsList,
    ...headLandmarksList,
  };

  return joints;
};

/**
 * Find the coordinates of torso-related joints: shoulders, clavicles, neck, hips, chest, spine (bottom, middle, up).
 * @param {Array} lm2d : array of 2D pose vectors from mediapipe
 * @returns {Landmark} : dictionary with the pose of the torso joints
 */
const torsoJointsCoords = (poselm2D: any) => {
  // calculate model's head beggining (chin)
  const bottomRightHead = vectorFromLandmark(PoseLandmarks.LeftEar, poselm2D);
  const bottomLeftHead = vectorFromLandmark(PoseLandmarks.RightEar, poselm2D);
  const head = bottomLeftHead.lerp(bottomRightHead, 0.5);

  // calculate model's neck & clavicles
  const leftShoulder = vectorFromLandmark(PoseLandmarks.LeftShoulder, poselm2D);
  const rightShoulder = vectorFromLandmark(
    PoseLandmarks.RightShoulder,
    poselm2D
  );
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
  const middleSpine = normal
    .multiply(middle_offset_multiplier)
    .add(middleSpineStraight);

  const torsoJoints: Landmark = {
    [BodyPartNames.NECK]: initPoseJoint(neck),
    [BodyPartNames.LEFT_CLAVICLE]: initPoseJoint(leftClavicle),
    [BodyPartNames.RIGHT_CLAVICLE]: initPoseJoint(rightClavicle),
    [BodyPartNames.SPINE2]: initPoseJoint(chest),
    [BodyPartNames.SPINE1]: initPoseJoint(middleSpine),
    [BodyPartNames.SPINE]: initPoseJoint(spine),
    [BodyPartNames.HIP]: initPoseJoint(hip),
  };

  return torsoJoints;
};

/**
 * Find the coordinates of leg-related joints: hips, knees, ankles, toes
 * @param {Array} lm2d : array of 2D pose vectors from mediapipe
 * @returns {Landmark} : dictionary with the pose of the leg joints
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

  const legJoints: Landmark = {
    [BodyPartNames.LEFT_UPPER_LEG]: initPoseJoint(leftHip),
    [BodyPartNames.RIGHT_UPPER_LEG]: initPoseJoint(rightHip),
    [BodyPartNames.LEFT_LOWER_LEG]: initPoseJoint(leftKnee),
    [BodyPartNames.RIGHT_LOWER_LEG]: initPoseJoint(rightKnee),
    [BodyPartNames.LEFT_FOOT]: initPoseJoint(leftAnkle),
    [BodyPartNames.RIGHT_FOOT]: initPoseJoint(rightAnkle),
    [BodyPartNames.LEFT_TOES]: initPoseJoint(leftToes),
    [BodyPartNames.RIGHT_TOES]: initPoseJoint(rightToes),
  };

  return legJoints;
};

/**
 * Find the coordinates of arm-related joints: hips, knees, ankles, toes
 * @param {Array} lm2d : array of 2D pose vectors from mediapipe
 * @returns {Landmark} : dictionary with the pose of the arm joints
 */
const armJointsCoords = (poselm2D: any) => {
  const leftShoulder = vectorFromLandmark(PoseLandmarks.LeftShoulder, poselm2D);
  const rightShoulder = vectorFromLandmark(
    PoseLandmarks.RightShoulder,
    poselm2D
  );
  const leftElbow = vectorFromLandmark(PoseLandmarks.LeftElbow, poselm2D);
  const rightElbow = vectorFromLandmark(PoseLandmarks.RightShoulder, poselm2D);
  const leftWrist = vectorFromLandmark(PoseLandmarks.LeftWrist, poselm2D);
  const rightWrist = vectorFromLandmark(PoseLandmarks.RightWrist, poselm2D);
  const leftIndex = vectorFromLandmark(PoseLandmarks.LeftIndex, poselm2D);
  const rightIndex = vectorFromLandmark(PoseLandmarks.RightIndex, poselm2D);

  const armJoints: Landmark = {
    [BodyPartNames.LEFT_UPPER_ARM]: initPoseJoint(leftShoulder),
    [BodyPartNames.RIGHT_UPPER_ARM]: initPoseJoint(rightShoulder),
    [BodyPartNames.LEFT_LOWER_ARM]: initPoseJoint(leftElbow),
    [BodyPartNames.RIGHT_LOWER_ARM]: initPoseJoint(rightElbow),
    [BodyPartNames.LEFT_HAND]: initPoseJoint(leftWrist),
    [BodyPartNames.RIGHT_HAND]: initPoseJoint(rightWrist),
    [BodyPartNames.LEFT_INDEX]: initPoseJoint(leftIndex),
    [BodyPartNames.RIGHT_INDEX]: initPoseJoint(rightIndex),
  };

  return armJoints;
};

/**
 * Find the coordinates of head-related landmarks: nose, ears
 * @param {Array} lm2d : array of 2D pose vectors from mediapipe
 * @returns {Landmark} : dictionary with the pose of the head landmarks
 */
const headLandmarksCoords = (poselm2D: any) => {
  const nose = vectorFromLandmark(PoseLandmarks.Nose, poselm2D);
  const leftEar = vectorFromLandmark(PoseLandmarks.LeftEar, poselm2D);
  const rightEar = vectorFromLandmark(PoseLandmarks.RightEar, poselm2D);

  const headJoints: Landmark = {
    [BodyPartNames.NOSE]: initPoseJoint(nose),
    [BodyPartNames.LEFT_EAR]: initPoseJoint(leftEar),
    [BodyPartNames.RIGHT_EAR]: initPoseJoint(rightEar),
  };

  return headJoints;
};

/**
 * Convert landmark coordinates to a vector.
 * @param {number} property : number which represents the joint
 * @param {Array} lm2d : array of 2D pose vectors from mediapipe
 * @returns {Vector}
 */
const vectorFromLandmark = (property: number, lm2d: any) => {
  return new Vector(lm2d[property].x, lm2d[property].y, lm2d[property].z);
};

/**
 * Helper function to create the initial pose of a joint (rotation is null initially)
 * @param {Vector} position : the position of the joint
 * @returns
 */
const initPoseJoint = (position: Vector): JointPose => ({
  position: position,
  rotation: null,
});

/**
 * Convert rotation matrix to quaternion
 * https://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/
 * @param matrix : rotation matrix
 * @returns {Quaternion}: quaternion of the form [qw, qx, qy, qz]
 */
const rotationMatrixToQuaternion = (matrix: Matrix3x3): Quaternion => {
  let q: Quaternion = [0, 0, 0, 0];
  let trace = matrix[0][0] + matrix[1][1] + matrix[2][2];

  if (trace > 0) {
    let s = Math.sqrt(trace + 1.0) * 2; // S=4*qw
    q[3] = 0.25 * s;
    q[0] = (matrix[2][1] - matrix[1][2]) / s;
    q[1] = (matrix[0][2] - matrix[2][0]) / s;
    q[2] = (matrix[1][0] - matrix[0][1]) / s;
  } else {
    if (matrix[0][0] > matrix[1][1] && matrix[0][0] > matrix[2][2]) {
      let s = Math.sqrt(1.0 + matrix[0][0] - matrix[1][1] - matrix[2][2]) * 2; // S=4*qx
      q[3] = (matrix[2][1] - matrix[1][2]) / s;
      q[0] = 0.25 * s;
      q[1] = (matrix[0][1] + matrix[1][0]) / s;
      q[2] = (matrix[0][2] + matrix[2][0]) / s;
    } else if (matrix[1][1] > matrix[2][2]) {
      let s = 2.0 * Math.sqrt(1.0 + matrix[1][1] - matrix[0][0] - matrix[2][2]); // S=4*qy
      q[3] = (matrix[0][2] - matrix[2][0]) / s;
      q[0] = (matrix[0][1] + matrix[1][0]) / s;
      q[1] = 0.25 * s;
      q[2] = (matrix[1][2] + matrix[2][1]) / s;
    } else {
      let s = 2.0 * Math.sqrt(1.0 + matrix[2][2] - matrix[0][0] - matrix[1][1]); // S=4*qz
      q[3] = (matrix[1][0] - matrix[0][1]) / s;
      q[0] = (matrix[0][2] + matrix[2][0]) / s;
      q[1] = (matrix[1][2] + matrix[2][1]) / s;
      q[2] = 0.25 * s;
    }
  }

  return q;
};

/**
 * Construct rotation matrix from right, up and forward vectors.
 * @param {Vector} right
 * @param {Vector} up
 * @param {Vector} forward
 */
const getRotationMatrix = (
  right: Vector,
  up: Vector,
  forward: Vector
): Matrix3x3 => {
  let rotationMatrix: Matrix3x3 = [
    [right.x, right.y, right.z],
    [up.x, up.y, up.z],
    [forward.x, forward.y, forward.z],
  ];
  return rotationMatrix;
};

const findPoseRotation = (poselm2D: any, poselm3D: any) => {
  let poseCoords = findPoseCoordinates(poselm2D);

  console.log(poseCoords);
  console.log(poselm3D);

  // hip rotation
  const leftHip = vectorFromLandmark(PoseLandmarks.LeftHip, poselm2D);
  const rightHip = vectorFromLandmark(PoseLandmarks.RightHip, poselm2D);

  let forward = rightHip.subtract(leftHip);
  let globalUp = new Vector(0, 1, 0);
  let right = Vector.normalize(Vector.cross(globalUp, forward));
  let up = Vector.cross(forward, right);

  let quaternionHip = rotationMatrixToQuaternion(
    getRotationMatrix(right, up, forward)
  );

  // lower spine rotation
  let middleSpine = poseCoords[BodyPartNames.SPINE1].position;
  let lowerSpine = poseCoords[BodyPartNames.SPINE].position;
  let upperSpine = poseCoords[BodyPartNames.SPINE2].position;
  let neck = poseCoords[BodyPartNames.NECK].position;
  let leftShoulder = poseCoords[BodyPartNames.LEFT_UPPER_ARM].position;
  let rightShoulder = poseCoords[BodyPartNames.RIGHT_UPPER_ARM].position;
  let nose = poseCoords[BodyPartNames.NOSE].position;
  let leftEar = poseCoords[BodyPartNames.LEFT_EAR].position;
  let rightEar = poseCoords[BodyPartNames.RIGHT_EAR].position;
  let leftClavicle = poseCoords[BodyPartNames.LEFT_CLAVICLE].position;
  let rightClavicle = poseCoords[BodyPartNames.RIGHT_CLAVICLE].position;
  // for (let coord of poseCoords) {
  //   if (coord.name == BodyPartNames.SPINE) {
  //     lowerSpine = coord.position;
  //   } else if (coord.name == BodyPartNames.SPINE1) {
  //     middleSpine = coord.position;
  //   } else if (coord.name == BodyPartNames.SPINE2) {
  //     upperSpine = coord.position;
  //   } else if (coord.name == BodyPartNames.NECK) {
  //     neck = coord.position;
  //   } else if (coord.name == BodyPartNames.LEFT_UPPER_ARM) {
  //     leftShoulder = coord.position;
  //   } else if (coord.name == BodyPartNames.RIGHT_UPPER_ARM) {
  //     rightShoulder = coord.position;
  //   } else if (coord.name == BodyPartNames.NOSE) {
  //     nose = coord.position;
  //   } else if (coord.name == BodyPartNames.LEFT_EAR) {
  //     leftEar = coord.position;
  //   } else if (coord.name == BodyPartNames.RIGHT_EAR) {
  //     rightEar = coord.position;
  //   } else if (coord.name == BodyPartNames.LEFT_CLAVICLE) {
  //     leftClavicle = coord.position;
  //   } else if (coord.name == BodyPartNames.RIGHT_CLAVICLE) {
  //     rightClavicle = coord.position;
  //   }
  // }

  let up2D = new Vector(
    middleSpine.x - lowerSpine.x,
    middleSpine.y - lowerSpine.y,
    0
  );

  let length2D = Math.sqrt(up2D.x * up2D.x + up2D.y * up2D.y);
  globalUp = new Vector(up2D.x / length2D, up2D.y / length2D, 0);
  right = Vector.normalize(Vector.cross(globalUp, forward));
  up = Vector.cross(forward, right);

  let quaternionSpine = rotationMatrixToQuaternion(
    getRotationMatrix(right, up, forward)
  );

  // middle spine
  up2D = new Vector(
    upperSpine.x - middleSpine.x,
    upperSpine.y - middleSpine.y,
    0
  );
  length2D = Math.sqrt(up2D.x * up2D.x + up2D.y * up2D.y);
  globalUp = new Vector(up2D.x / length2D, up2D.y / length2D, 0);
  right = Vector.normalize(Vector.cross(globalUp, forward));
  up = Vector.cross(forward, right);

  let quaternionSpine1 = rotationMatrixToQuaternion(
    getRotationMatrix(right, up, forward)
  );

  // upper spine
  up2D = new Vector(neck.x - upperSpine.x, neck.y - upperSpine.y, 0);
  length2D = Math.sqrt(up2D.x * up2D.x + up2D.y * up2D.y);
  globalUp = new Vector(up2D.x / length2D, up2D.y / length2D, 0);
  right = Vector.normalize(Vector.cross(globalUp, forward));
  up = Vector.cross(forward, right);

  let quaternionSpine2 = rotationMatrixToQuaternion(
    getRotationMatrix(right, up, forward)
  );

  // neck
  let shoulderCenter = leftShoulder.lerp(rightShoulder, 0.5);
  forward = Vector.normalize(nose.subtract(shoulderCenter));
  globalUp = Vector.normalize(rightEar.subtract(leftEar));
  right = Vector.normalize(Vector.cross(up, forward));
  up = Vector.cross(forward, right);

  let quaternionNeck = rotationMatrixToQuaternion(
    getRotationMatrix(right, up, forward)
  );

  // clavicles
  globalUp = Vector.normalize(rightHip.subtract(leftHip));

  // Left clavicle joint rotation
  forward = Vector.normalize(leftShoulder.subtract(leftClavicle));
  right = Vector.normalize(Vector.cross(up, forward));
  up = Vector.cross(forward, right);

  let quaternionLeftClavicle = rotationMatrixToQuaternion(
    getRotationMatrix(right, up, forward)
  );

  // Right clavicle joint rotation
  forward = Vector.normalize(rightShoulder.subtract(rightClavicle));
  right = Vector.normalize(Vector.cross(up, forward));
  up = Vector.cross(forward, right);

  let quaternionRightClavicle = rotationMatrixToQuaternion(
    getRotationMatrix(right, up, forward)
  );

  poseCoords[BodyPartNames.HIP].rotation = quaternionHip;
  poseCoords[BodyPartNames.SPINE1].rotation = quaternionSpine1;
  poseCoords[BodyPartNames.SPINE].rotation = quaternionSpine;
  poseCoords[BodyPartNames.SPINE2].rotation = quaternionSpine2;
  poseCoords[BodyPartNames.NECK].rotation = quaternionNeck;
  poseCoords[BodyPartNames.LEFT_CLAVICLE].rotation = quaternionLeftClavicle;
  poseCoords[BodyPartNames.RIGHT_CLAVICLE].rotation = quaternionRightClavicle;

  // for (let coord of poseCoords) {
  //   if (coord.name == BodyPartNames.HIP) {
  //     coord.rotation = quaternionHip;
  //   }
  //   if (coord.name == BodyPartNames.SPINE) {
  //     coord.rotation = quaternionSpine;
  //   }
  //   if (coord.name == BodyPartNames.SPINE1) {
  //     coord.rotation = quaternionSpine1;
  //   }
  //   if (coord.name == BodyPartNames.SPINE2) {
  //     coord.rotation = quaternionSpine2;
  //   }
  //   if (coord.name == BodyPartNames.NECK) {
  //     coord.rotation = quaternionNeck;
  //   }
  //   if (coord.name == BodyPartNames.LEFT_CLAVICLE) {
  //     coord.rotation = quaternionLeftClavicle;
  //   }
  //   if (coord.name == BodyPartNames.RIGHT_CLAVICLE) {
  //     coord.rotation = quaternionRightClavicle;
  //   }
  // }
  return poseCoords;
};

export { findPoseCoordinates, findPoseRotation };
