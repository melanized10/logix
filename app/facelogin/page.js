'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceLogin = () => {
  const videoRef = useRef();
  const [match, setMatch] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);

      startVideo();
    };

    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error('Camera error:', err));
    };

    loadModels();
  }, []);

  const handleRecognition = async () => {
    const labeledDescriptor = await createLabeledDescriptors();
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptor, 0.6);

    const detections = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      const result = faceMatcher.findBestMatch(detections.descriptor);
      console.log(result);

      if (result.label === 'Admin') {
        setMatch(true);
        alert('Face matched: Access granted');
        window.location.href = '/admin'; // redirect to admin dashboard
      } else {
        alert('Face not recognized');
      }
    } else {
      alert('No face detected');
    }
  };

  const createLabeledDescriptors = async () => {
    const img = await faceapi.fetchImage('/passport/admin.jpg'); // Admin image
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    return new faceapi.LabeledFaceDescriptors('Admin', [detection.descriptor]);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1>Face Recognition Login</h1>
      <video ref={videoRef} autoPlay muted width="400" height="300" style={{ border: '1px solid gray' }} />
      <br />
      <button onClick={handleRecognition} style={{ marginTop: '20px' }}>Scan Face to Login</button>
    </div>
  );
};

export default FaceLogin;  