import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/Css/App.css'; 

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Medical Admin Panel</h1>
      <table className="navigation-table">
        <thead>

        </thead>
        <tbody>
          <tr>
            <td><Link to="/doctorlogin" className="nav-link">Doctor Login</Link></td>
          </tr>
          <tr>
            <td><Link to="/patientlogin" className="nav-link">Patient Login</Link></td>
          </tr>
          <tr>
            <td><Link to="/register" className="nav-link">Register</Link></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;
