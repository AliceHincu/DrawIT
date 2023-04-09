/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 public/model2.glb -t
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { Bone } from 'three'

type GLTFResult = GLTF & {
  nodes: {
    Wolf3D_Body: THREE.SkinnedMesh
    Wolf3D_Outfit_Bottom: THREE.SkinnedMesh
    Wolf3D_Outfit_Footwear: THREE.SkinnedMesh
    Wolf3D_Outfit_Top: THREE.SkinnedMesh
    Wolf3D_Hair: THREE.SkinnedMesh
    EyeLeft: THREE.SkinnedMesh
    EyeRight: THREE.SkinnedMesh
    Wolf3D_Head: THREE.SkinnedMesh
    Wolf3D_Teeth: THREE.SkinnedMesh
    Hips: THREE.Bone
  }
  materials: {
    Wolf3D_Body: THREE.MeshStandardMaterial
    Wolf3D_Outfit_Bottom: THREE.MeshStandardMaterial
    ['aleksandr@readyplayer']: THREE.MeshStandardMaterial
    Wolf3D_Outfit_Top: THREE.MeshStandardMaterial
    Wolf3D_Hair: THREE.MeshStandardMaterial
    Wolf3D_Eye: THREE.MeshStandardMaterial
    Wolf3D_Skin: THREE.MeshStandardMaterial
    Wolf3D_Teeth: THREE.MeshStandardMaterial
  }
}

let poseRig = {
  "RightUpperArm": {
      "x": 0.07092583400506086,
      "y": 0.6115875943832204,
      "z": 0.89079230895846
  },
  "RightLowerArm": {
      "x": 0.3,
      "y": 0.06304298139776437,
      "z": 0.8248256209082492
  },
  "LeftUpperArm": {
      "x": -0.16334135882781997,
      "y": 0.025704189184518833,
      "z": 0.49782478476025327
  },
  "LeftLowerArm": {
      "x": 0.3,
      "y": -0.1893719357472298,
      "z": 0
  },
  "RightHand": {
      "x": 0.13978573965326327,
      "y": -0.6,
      "z": 0.9375512409231381
  },
  "LeftHand": {
      "x": -0.31645903056296315,
      "y": 0.25271460121008765,
      "z": 0.29062179139160077
  },
  "RightUpperLeg": {
      "x": 0,
      "y": -0.04387420829534583,
      "z": 0.03470669328797461,
      "rotationOrder": "XYZ"
  },
  "RightLowerLeg": {
      "x": -0.19783134345735573,
      "y": 0,
      "z": 0,
      "rotationOrder": "XYZ"
  },
  "LeftUpperLeg": {
      "x": 0.11026987303946965,
      "y": -0.17369072981922273,
      "z": 0.28906006429249975,
      "rotationOrder": "XYZ"
  },
  "LeftLowerLeg": {
      "x": -0.18943688550096233,
      "y": 0,
      "z": 0,
      "rotationOrder": "XYZ"
  },
  "Hips": {
      "position": {
          "x": 0.05982724428176878,
          "y": 0,
          "z": -0.8143022487663486
      },
      "worldPosition": {
          "x": -0.12921588097626888,
          "y": 0,
          "z": -2.1598166943424633
      },
      "rotation": {
          "x": 0,
          "y": -0.5962267662637286,
          "z": -0.1841353478681009
      }
  },
  "Spine": {
      "x": 0,
      "y": -0.38018478696257835,
      "z": 0.4314103503736993
  }
};
interface Bones {
  Hips: Bone,
  Chest: Bone,
  LeftHand: Bone,
  LeftLowerArm: Bone,
  LeftUpperArm: Bone,
  LeftUpperLeg: Bone,
  LeftLowerLeg: Bone,
  RightHand: Bone,
  RightLowerArm: Bone,
  RightUpperArm: Bone,
  RightUpperLeg: Bone,
  RightLowerLeg: Bone,
  Spine: Bone,
  [key: string]: Bone;
}
export function Model2(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/model2.glb') as GLTFResult
  console.log(nodes)
  let bones:Bones = {
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
    Spine: new Bone()
  };

  // const mapSkeleton = () => {
  //      bones['Hips'] = nodes.Hips
  //       // if (child.name == 'Chest')        { bones['Chest'] = child }
  
  //      bones['LeftHand']     = nodes.LeftHand
  //      bones['LeftLowerArm'] = child 
  //      bones['LeftUpperArm'] = child 
  //      bones['LeftUpperLeg'] = child 
  //      bones['LeftLowerLeg'] = child 
  
  //      bones['RightHand']     = child 
  //      bones['RightLowerArm'] = child 
  //      bones['RightUpperArm'] = child 
  //      bones['RightUpperLeg'] = child 
  //      bones['RightLowerLeg'] = child 
        
  //      bones['Spine'] = child 
    
  // }

  // mapSkeleton()

  const rigRotation = (name: string, rotation = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
    // if (!currentVrm) {
    //     return;
    // }
    const Part = bones[name];
    if (!Part) {
        return;
    }


    let euler = new THREE.Euler(
        rotation.x * dampener,
        rotation.z * dampener,
        rotation.y * dampener,
        "XYZ"
    );
    let quaternion = new THREE.Quaternion().setFromEuler(euler);
    Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
};

  return (
    <group {...props} dispose={null}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials['aleksandr@readyplayer']} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
    </group>
  )
}

useGLTF.preload('/model2.glb')
