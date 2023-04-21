import {
  NormalizedLandmarkList,
  FaceGeometry,
  GpuBuffer,
} from "@mediapipe/holistic";

/**
 * Possible results from Holistic.
 */
interface ResultsHolistic {
  poseLandmarks: NormalizedLandmarkList;
  faceLandmarks: NormalizedLandmarkList;
  multiFaceGeometry: FaceGeometry[];
  rightHandLandmarks: NormalizedLandmarkList;
  leftHandLandmarks: NormalizedLandmarkList;
  segmentationMask: GpuBuffer;
  image: GpuBuffer;
  za: NormalizedLandmarkList;
}

export type { ResultsHolistic };
