import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../src/pages/app'; 
import DoctorLogin from '../src/pages/doctorlogin'; 
import PatientLogin from '../src/pages/patientlogin'; 
import Register from '../src/pages/register'; 
import DoctorPanel from '../src/pages/doctorpanel'; 
import PatientPanel from '../src/pages/patientpanel'; 

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/doctorlogin" element={<DoctorLogin />} />
      <Route path="/patientlogin" element={<PatientLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctorpanel" element={<DoctorPanel />} />
      <Route path="/patientpanel" element={<PatientPanel />} />
    </Routes>
  </Router>
);
