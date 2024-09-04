import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../src/pages/app'; // Ensure the correct path
import DoctorLogin from '../src/pages/doctorlogin'; // Ensure the correct path
import PatientLogin from '../src/pages/patientlogin'; // Ensure the correct path
import Register from '../src/pages/register'; // Ensure the correct path
import DoctorPanel from '../src/pages/doctorpanel'; // Ensure the correct path
import PatientPanel from '../src/pages/patientpanel'; // Ensure the correct path

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/doctorlogin" element={<DoctorLogin />} />
      <Route path="/patientlogin" element={<PatientLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctorpanel" element={<DoctorPanel />} />
      <Route path="/patientpanel" element={<PatientPanel />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
