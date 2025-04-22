"use client";

import React, { useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [scannedResult, setScannedResult] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };
    loadModels();

    const videoElement = document.getElementById("videoElement");

    const streamWebcam = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
    };
    streamWebcam();

    return () => {
      const stream = videoElement?.srcObject;
      const tracks = stream?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, []);

  const handleScanFace = async () => {
    const videoElement = document.getElementById("videoElement");
    const detections = await faceapi
      .detectSingleFace(videoElement)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) return;

    const inputDescriptor = detections.descriptor;
    const storedFaces = JSON.parse(localStorage.getItem("registeredFaces")) || [];
    let bestMatch = null;
    let smallestDistance = 1.0;

    storedFaces.forEach((face) => {
      const distance = faceapi.euclideanDistance(inputDescriptor, new Float32Array(face.descriptor));
      if (distance < smallestDistance && distance < 0.5) {
        smallestDistance = distance;
        bestMatch = face.name;
      }
    });

    if (bestMatch) {
      const timestamp = new Date().toLocaleString();
      localStorage.setItem("loggedInUser", bestMatch);
      localStorage.setItem("loginTime", timestamp);
      setLoginTime(timestamp);
      setScannedResult(`Welcome, ${bestMatch}`);
      alert("Face matched! Login successful.");
      router.push("/dashboard");
    } else {
      setScannedResult("No matching face found.");
    }
  };

  const handleAdminLogin = () => {
    if (username === "admin" && password === "1234") {
      alert("Admin login successful.");
      router.push("/admin");
    } else {
      alert("Invalid admin credentials.");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">Sign In</h2>
      <div className="card shadow-lg">
        <div className="card-body">
          <div className="mb-3 text-center">
            <video id="videoElement" width="300" height="200" autoPlay muted className="border rounded" />
          </div>

          <button onClick={handleScanFace} className="btn btn-primary w-100">
            Scan Face
          </button>

          <hr className="my-4" />
          {scannedResult && <p className="text-center">{scannedResult}</p>}
          {loginTime && (
            <p className="text-center">
              Login Time: <strong>{loginTime}</strong>
            </p>
          )}

          <hr />
          <h5 className="text-center mt-4">Admin Login (First-Time Only)</h5>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control mb-3"
          />
          <button onClick={handleAdminLogin} className="btn btn-dark w-100">
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
}
