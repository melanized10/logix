import React from 'react';

const AdminDashboard = () => {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>👑 Welcome to the Admin Dashboard</h1>
      <p>Here you can manage all user activities, monitor hours worked, and perform admin-level tasks.</p>
      
      {/* Example of displaying employee working hours */}
      <h2>Employee Work Hours (Last 24 Hours)</h2>
      <table style={{ margin: "0 auto", width: "80%", border: "1px solid #ddd", padding: "10px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Login Time</th>
            <th>Logout Time</th>
            <th>Worked Hours</th>
          </tr>
        </thead>
        <tbody>
          {/* Dynamically fill in employee data */}
          <tr>
            <td>John Doe</td>
            <td>8:00 AM</td>
            <td>4:00 PM</td>
            <td>8 Hours</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>9:00 AM</td>
            <td>5:00 PM</td>
            <td>8 Hours</td>
          </tr>
          {/* You can fetch this data dynamically */}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
