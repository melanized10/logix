'use client';

import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employees, setEmployees] = useState([]);
  const [file, setFile] = useState(null); // State to store the selected file
  const [previewUrl, setPreviewUrl] = useState(''); // State to store the preview URL of the image

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('employees') || '[]');
    setEmployees(saved);
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Set the preview URL for the image
      };
      reader.readAsDataURL(selectedFile); // Read the selected file as a data URL
    }
  };

  const handleUploadClick = async () => {
    if (!file || !employeeName.trim()) {
      setUploadStatus('❌ Please provide both an image and an employee name.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      const newEmployee = {
        name: employeeName,
        image: base64Image,
      };

      const existing = JSON.parse(localStorage.getItem('employees') || '[]');
      existing.push(newEmployee);
      localStorage.setItem('employees', JSON.stringify(existing));

      setUploadStatus('✅ Passport uploaded and saved!');
      setEmployeeName('');
      setFile(null); // Reset the file input
      setPreviewUrl(''); // Reset the preview image
      setEmployees(existing); // Update state to reflect the new employee
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>👑 Welcome to the Admin Dashboard</h1>
      <p>Upload employee images and manage sign-in records.</p>

      <div style={{ marginTop: '30px' }}>
        <h3>Upload Employee Passport</h3>
        <input
          type="text"
          placeholder="Employee Name"
          value={employeeName}
          onChange={(e) => setEmployeeName(e.target.value)}
          style={{ padding: '5px', marginBottom: '10px' }}
        />
        <br />
        <input type="file" accept="image/*" onChange={handleFileSelect} />
        <p style={{ fontSize: '12px', color: '#666' }}>
          Upload an image and enter the name to register the employee.
        </p>

        {/* Display Image Preview */}
        {previewUrl && (
          <div style={{ marginTop: '20px' }}>
            <h4>Preview:</h4>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
            />
          </div>
        )}

        <button onClick={handleUploadClick} style={{ padding: '10px 20px', marginTop: '10px' }}>
          Upload
        </button>

        {uploadStatus && (
          <p style={{ color: uploadStatus.startsWith('✅') ? 'green' : 'red' }}>
            {uploadStatus}
          </p>
        )}
      </div>

      <h2 style={{ marginTop: '50px' }}>Registered Employees</h2>
      <ul>
        {employees.map((emp, i) => (
          <li key={i}>
            {emp.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
