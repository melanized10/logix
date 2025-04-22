'use client';

import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [uploadStatus, setUploadStatus] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('employees') || '[]');
    setEmployees(saved);
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !employeeName.trim()) {
      setUploadStatus('❌ Please provide both image and employee name.');
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
      setEmployees(existing); // update state to reflect the new employee
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
        <input type="file" accept="image/*" onChange={handleFileUpload} />
        <p style={{ fontSize: '12px', color: '#666' }}>
          Upload an image and enter the name to register the employee.
        </p>
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
