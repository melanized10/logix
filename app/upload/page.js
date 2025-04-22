"use client";

import React, { useState } from "react";
import * as faceapi from "face-api.js";

export default function AdminUpload() {
  const [employeeName, setEmployeeName] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const img = await faceapi.bufferToImage(file);
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      alert("No face detected. Please upload a clearer image.");
      return;
    }

    const descriptorArray = Array.from(detection.descriptor);
    const registeredFaces = JSON.parse(localStorage.getItem("registeredFaces")) || [];

    // Store face descriptor and employee name
    registeredFaces.push({
      name: employeeName,
      descriptor: descriptorArray,
    });

    localStorage.setItem("registeredFaces", JSON.stringify(registeredFaces));
    alert("Employee face successfully registered!");
  };

  return (
    <div className="container mt-5 mb-5">
      <h2 className="text-center mb-4">Admin: Upload Passport Photo</h2>
      <div className="card shadow-lg">
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="employeeName" className="form-label">
              Employee Name
            </label>
            <input
              type="text"
              id="employeeName"
              className="form-control"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="passportImage" className="form-label">
              Upload Passport Image
            </label>
            <input
              type="file"
              id="passportImage"
              accept="image/*"
              className="form-control"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>

          <button onClick={handleImageUpload} className="btn btn-primary w-100">
            Register Face
          </button>
        </div>
      </div>
    </div>
  );
}
