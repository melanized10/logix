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

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("Loading face-api.js models...");
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        console.log("Models loaded successfully.");
      } catch (error) {
        console.error("Error loading models: ", error);
      }
    };
    loadModels();

    const videoElement = document.getElementById("videoElement");

    // Stream webcam to video element
    const streamWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
      } catch (error) {
        console.error("Error accessing webcam: ", error);
      }
    };
    streamWebcam();

    // Cleanup function to stop webcam on component unmount
    return () => {
      const stream = videoElement?.srcObject;
      const tracks = stream?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, []);

  // Handle face scan and comparison with stored faces
  const handleScanFace = async () => {
    try {
      console.log("Starting face scan...");

      const videoElement = document.getElementById("videoElement");
      const detections = await faceapi
        .detectSingleFace(videoElement)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        console.log("No face detected.");
        setScannedResult("No face detected. Please try again.");
        return;
      }

      const inputDescriptor = detections.descriptor;
      const storedFaces = JSON.parse(localStorage.getItem("registeredFaces")) || [];
      let bestMatch = null;
      let smallestDistance = 1.0;

      // Compare the input face descriptor with stored descriptors
      storedFaces.forEach((face) => {
        const distance = faceapi.euclideanDistance(inputDescriptor, new Float32Array(face.descriptor));
        if (distance < smallestDistance && distance < 0.5) {
          smallestDistance = distance;
          bestMatch = face;  // Save the entire face data (name, image, descriptor)
        }
      });

      if (bestMatch) {
        const timestamp = new Date().toLocaleString();
        localStorage.setItem("loggedInUser", bestMatch.name); // Store name in localStorage
        localStorage.setItem("loginTime", timestamp); // Store login time
        setLoginTime(timestamp);
        setScannedResult(`Welcome, ${bestMatch.name}!`);

        // You can now retrieve the employee's image as well
        const employeeImage = bestMatch.image;

        // Display the employee's image (this could be done dynamically in your UI)
        const imageElement = document.createElement("img");
        imageElement.src = employeeImage;
        imageElement.alt = "Employee Image";
        imageElement.width = 100;
        document.getElementById("employeeImageContainer").appendChild(imageElement);

        console.log("Face matched! Login successful.");
        alert("Face matched! Login successful.");
        router.push("/dashboard");
      } else {
        console.log("No matching face found.");
        setScannedResult("No matching face found.");
      }
    } catch (error) {
      console.error("Error during face scan or comparison: ", error);
    }
  };

  // Handle admin login with a fixed username and password
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
            <video
              id="videoElement"
              width="300"
              height="200"
              autoPlay
              muted
              className="border rounded"
            />
          </div>

          <button onClick={handleScanFace} className="btn btn-primary w-100">
            Scan Face for Login
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

      {/* Employee Image Preview */}
      <div
        id="employeeImageContainer"
        style={{ textAlign: "center", marginTop: "20px" }}
      ></div>
    </div>
  );
}
