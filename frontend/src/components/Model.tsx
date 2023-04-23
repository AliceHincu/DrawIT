/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 public/model.glb -t
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { Bone } from "three";
import { any } from "@tensorflow/tfjs";
// import * as BodyPartNames from "./NamesForBodyParts";

type ActionName = "Armature|mixamo.com|Layer0";
interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    Ch36: THREE.SkinnedMesh;
    mixamorig1Hips: THREE.Bone;
  };
  materials: {
    Ch36_Body: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

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

interface Bones {
  Hips: Bone;
  Chest: Bone;
  LeftHand: Bone;
  LeftLowerArm: Bone;
  LeftUpperArm: Bone;
  LeftUpperLeg: Bone;
  LeftLowerLeg: Bone;
  RightHand: Bone;
  RightLowerArm: Bone;
  RightUpperArm: Bone;
  RightUpperLeg: Bone;
  RightLowerLeg: Bone;
  Spine: Bone;
  [key: string]: Bone;
}

export function Model(props: any) {
  const group = useRef<THREE.Group>();
  const { nodes, materials, animations } = useGLTF("/model.glb") as GLTFResult;
  console.log(nodes);
  console.log("inside model, ", props.poseRig);
  const { actions } = useAnimations(animations, group);
  let bones: Bones = {
    Hips: new Bone(),
    Chest: new Bone(),
    LeftHand: new Bone(),
    LeftLowerArm: new Bone(),
    LeftUpperArm: new Bone(),
    LeftUpperLeg: new Bone(),
    LeftLowerLeg: new Bone(),
    RightHand: new Bone(),
    RightLowerArm: new Bone(),
    RightUpperArm: new Bone(),
    RightUpperLeg: new Bone(),
    RightLowerLeg: new Bone(),
    Spine: new Bone(),
    Spine1: new Bone(),
    Spine2: new Bone(),
    Neck: new Bone(),
  };

  const mapSkeleton = () => {
    for (let child of nodes.Ch36.skeleton.bones) {
      if (child.name == "mixamorig1Hips") {
        bones["Hip"] = child;
      }
      // if (child.name == 'Chest')        { bones['Chest'] = child }

      if (child.name == "mixamorig1LeftHand") {
        bones["LeftHand"] = child;
      }
      if (child.name == "mixamorig1LeftForeArm") {
        bones["LeftLowerArm"] = child;
      }
      if (child.name == "mixamorig1LeftArm") {
        bones["LeftUpperArm"] = child;
      }
      if (child.name == "mixamorig1LeftShoulder") {
        bones["LeftClavicle"] = child;
      }
      if (child.name == "mixamorig1LeftUpLeg") {
        bones["LeftUpperLeg"] = child;
      }
      if (child.name == "mixamorig1LeftLeg") {
        bones["LeftLowerLeg"] = child;
      }

      if (child.name == "mixamorig1RightHand") {
        bones["RightHand"] = child;
      }
      if (child.name == "mixamorig1RightForeArm") {
        bones["RightLowerArm"] = child;
      }
      if (child.name == "mixamorig1RightArm") {
        bones["RightUpperArm"] = child;
      }
      if (child.name == "mixamorig1RightShoulder") {
        bones["RightClavicle"] = child;
      }
      if (child.name == "mixamorig1RightUpLeg") {
        bones["RightUpperLeg"] = child;
      }
      if (child.name == "mixamorig1RightLeg") {
        bones["RightLowerLeg"] = child;
      }

      if (child.name == "mixamorig1Spine") {
        bones["Spine"] = child;
      }
      if (child.name == "mixamorig1Spine1") {
        bones["Spine1"] = child;
      }
      if (child.name == "mixamorig1Spine2") {
        bones["Spine2"] = child;
      }

      if (child.name == "mixamorig1Neck") {
        bones["Neck"] = child;
      }
    }
  };

  mapSkeleton();

  const rigRotation = (
    name: string,
    rotation = { x: 0, y: 0, z: 0 },
    dampener = 1,
    lerpAmount = 0.3
  ) => {
    // if (!currentVrm) {
    //     return;
    // }
    const Part = bones[name];
    if (!Part) {
      return;
    }

    let euler = new THREE.Euler(
      -rotation.x * dampener,
      rotation.z * dampener,
      -rotation.y * dampener,
      "XYZ"
    );
    let quaternion = new THREE.Quaternion().setFromEuler(euler);
    Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
  };

  const rigPosition = (
    name: string,
    position = { x: 0, y: 0, z: 0 },
    dampener = 1,
    lerpAmount = 0.3
  ) => {
    // if (!currentVrm) {
    //     return;
    // }
    const Part = bones[name];
    if (!Part) {
      return;
    }
    let vector = new THREE.Vector3(
      position.x * dampener,
      position.y * dampener,
      position.z * dampener
    );
    Part.position.lerp(vector, lerpAmount); // interpolate
  };
  // Animate Rotation Helper function

  // hips
  // rigRotation("Hips", poseRig.Hips.rotation, 0.7);
  // rigPosition('Hips', {
  //   x: -poseRig.Hips.position.x,
  //   y: poseRig.Hips.position.y + 1,
  //   z: -poseRig.Hips.position.z
  // }, 1, 0.07)
  // nodes.Ch36.skeleton.bones[0].rotation.x = poseRig.Hips.rotation.x;
  // nodes.Ch36.skeleton.bones[0].rotation.y = poseRig.Hips.rotation.y;
  // nodes.Ch36.skeleton.bones[0].rotation.z = poseRig.Hips.rotation.z;
  // rigRotation("Spine", poseRig.Spine, 0.45, 0.4);
  // rigRotation("Spine1", poseRig.Spine, 0.25, 0.4);
  // rigRotation("Spine2", poseRig.Spine, 0.25, 0.4);
  // rigRotation("RightUpperArm", poseRig.RightUpperArm, 1, 0.4);
  // rigRotation("RightLowerArm", poseRig.RightLowerArm, 1, 0.4);
  // rigRotation("LeftUpperArm", poseRig.LeftUpperArm, 1, 0.4);
  // rigRotation("LeftLowerArm", poseRig.LeftLowerArm, 1, 0.4);

  const rigRotationQ2 = (name: any, q: any) => {
    const quaternion = new THREE.Quaternion(q[0], q[1], -q[2], q[3]); // Replace x, y, z, and w with the actual quaternion values
    const joint = bones[name];
    joint.quaternion.slerp(quaternion, 0.3); // interpolate
  };

  const rigRotationQ = (name: any, q: any) => {
    const quaternion = new THREE.Quaternion(q[0], q[1], q[2], q[3]); // Replace x, y, z, and w with the actual quaternion values
    const joint = bones[name];
    joint.quaternion.slerp(quaternion, 0.5); // interpolate
  };

  const rigPositionQ = (name: any, p: any) => {
    const position = new THREE.Vector3(p.x, p.y, p.z); // Replace x, y, and z with the desired position values
    const joint = bones[name];
    joint.position.copy(position);
  };

  // console.log(props.rotations);
  //todo: get rid of if-elses and rename in blender the joints to mat=tch BodyPartsNames
  // for (let landmark in props.rotations) {
  //   const jointPose = props.rotations[landmark];
  //   if (landmark == "Hip") {
  //     rigRotationQ("Hip", jointPose.rotation);
  //     rigPositionQ("Hip", jointPose.position);
  //   }
  //   if (landmark == "Spine") {
  //     rigRotationQ("Spine", jointPose.rotation);
  //   }
  //   if (landmark == "Spine1") {
  //     rigRotationQ("Spine1", jointPose.rotation);
  //   }
  //   if (landmark == "Spine2") {
  //     rigRotationQ("Spine2", jointPose.rotation);
  //   }
  //   if (landmark == "Neck") {
  //     rigRotationQ("Neck", jointPose.rotation);
  //   }
  //   if (landmark == "LeftUpperArm") {
  //     rigRotationQ2("LeftUpperArm", jointPose.rotation);
  //   }
  //   if (landmark == "RightUpperArm") {
  //     console.log(jointPose.rotation);
  //     rigRotationQ2("RightUpperArm", jointPose.rotation);
  //   }
  // if (landmark == "RightClavicle") {
  //   rigRotationQ("RightClavicle", jointPose.rotation);
  // }
  // if (landmark == "LeftClavicle") {
  //   rigRotationQ("LeftClavicle", jointPose.rotation);
  // }
  // }

  return (
    // @ts-ignore
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" scale={0.1}>
          {" "}
          {/*rotation={[0, 0, 0]>*/}
          <primitive object={nodes.mixamorig1Hips} />
          <skinnedMesh
            name="Ch36"
            geometry={nodes.Ch36.geometry}
            material={materials.Ch36_Body}
            skeleton={nodes.Ch36.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/model.glb");
