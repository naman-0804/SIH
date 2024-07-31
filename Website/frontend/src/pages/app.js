import React from 'react';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1>Medical Admin Panel</h1>
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/doctors">Manage Doctors</Link></li>
          <li><Link to="/patients">Manage Patients</Link></li>
          <li><Link to="/appointments">Manage Appointments</Link></li>
          <li><Link to="/prescriptions">Manage Prescriptions</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default App;
