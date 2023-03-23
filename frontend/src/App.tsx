import React from 'react';
import './App.css';
import { BodyPoseTracking } from './components/BodyPoseTracking';

const App = () => {
  let kp:any;
  const mapJoints = (keypoints:any) => {
    kp = keypoints;
  }

  const getJoints = () => {
    return kp;
  }

  return (
    <div className="App">
      {/* Hi! */}
      {/* <CameraView/> */}
      <BodyPoseTracking></BodyPoseTracking>
    </div>
  );
}

export default App;
