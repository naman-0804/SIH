import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../src/pages/app';
import Login from '../src/pages/login';
import Register from '../src/pages/register';
import Doctors from '../src/pages/doctor';
import Patients from '../src/pages/patient';
import Appointments from '../src/pages/appointement';
import Prescriptions from '../src/pages/prescription';


ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/prescriptions" element={<Prescriptions />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
