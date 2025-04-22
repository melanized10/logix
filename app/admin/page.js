'use client';

import React, { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const AdminPanel = () => {
  const [image, setImage] = useState(null);
  const [employeeName, setEmployeeName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [registeredFaces, setRegisteredFaces] = useState([]);
  const [deleteName, setDeleteName] = useState('');

  useEffect(() => {
    // Load face-api.js models when the component mounts
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };
    loadModels();

    // Load registered faces from localStorage
    const savedFaces = JSON.parse(localStorage.getItem('registeredFaces') || '[]');
    setRegisteredFaces(savedFaces);
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !employeeName.trim()) {
      setUploadStatus('❌ Please provide both image and employee name.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = async () => {
        // Detect face from uploaded image
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        if (!detections) {
          setUploadStatus('❌ No face detected. Please upload a valid passport image.');
          return;
        }

        const faceData = {
          name: employeeName,
          descriptor: detections.descriptor,
        };

        const existingFaces = JSON.parse(localStorage.getItem('registeredFaces') || '[]');
        
        // Check if the face already exists and replace it if necessary
        const index = existingFaces.findIndex((face) => face.name === employeeName);
        if (index !== -1) {
          existingFaces[index] = faceData; // Replacing the existing face data
        } else {
          existingFaces.push(faceData); // Add new face data
        }

        localStorage.setItem('registeredFaces', JSON.stringify(existingFaces));
        setRegisteredFaces(existingFaces);
        setUploadStatus('✅ Passport uploaded/replaced successfully!');
        setEmployeeName('');
      };
    };

    reader.readAsDataURL(file);
  };

  const handleDeletePassport = () => {
    if (!deleteName.trim()) {
      setUploadStatus('❌ Please provide an employee name to delete.');
      return;
    }

    const existingFaces = JSON.parse(localStorage.getItem('registeredFaces') || '[]');
    const updatedFaces = existingFaces.filter((face) => face.name !== deleteName);

    if (updatedFaces.length === existingFaces.length) {
      setUploadStatus('❌ Employee not found.');
      return;
    }

    localStorage.setItem('registeredFaces', JSON.stringify(updatedFaces));
    setRegisteredFaces(updatedFaces);
    setDeleteName('');
    setUploadStatus('✅ Passport deleted successfully!');
  };

  return (
    <div>
      <h2>Admin Panel: Manage Employee Passports</h2>

      <div>
        <h4>Upload/Replace Passport</h4>
        <input
          type="text"
          placeholder="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="form-control mb-2"
        />
        {uploadStatus && <p style={{ color: uploadStatus.startsWith('✅') ? 'green' : 'red' }}>{uploadStatus}</p>}
      </div>

      <div>
        <h4>Delete Passport</h4>
        <input
          type="text"
          placeholder="Employee Name to Delete"
          value={deleteName}
          onChange={(e) => setDeleteName(e.target.value)}
          className="form-control mb-2"
        />
        <button onClick={handleDeletePassport} className="btn btn-danger">
          Delete Passport
        </button>
      </div>

      <div>
        <h4>Registered Faces</h4>
        <ul>
          {registeredFaces.map((face, index) => (
            <li key={index}>
              {face.name} - {face.descriptor ? '✔️ Registered' : '❌ Not Registered'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
