import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../pages/Css/Doctorpanel.css'; 
import { API_URL } from '../helper';
function DoctorPanel() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptionDetails, setPrescriptionDetails] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get(`${API_URL}/auth/get_user_data`);
        setUserData(userResponse.data);

        // Fetch patient list
        const patientResponse = await axios.get(`${API_URL}/doctors/patients`, { withCredentials: true });
        setPatients(patientResponse.data);

        // Fetch appointments
        const appointmentResponse = await axios.get(`${API_URL}/doctors/appointments`, { withCredentials: true });
        setAppointments(appointmentResponse.data);

        // Filter patients based on appointments
        if (appointmentResponse.data.length > 0) {
          const patientUsernames = appointmentResponse.data.map(app => app.patient_username);
          setFilteredPatients(patientResponse.data.filter(patient => patientUsernames.includes(patient.username)));
        }
      } catch (error) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); 

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/doctors/prescriptions`, {
        patient_username: selectedPatient,
        prescription_details: prescriptionDetails
      }, { withCredentials: true });
      alert('Prescription added successfully');
      setPrescriptionDetails('');
      setSelectedPatient('');
    } catch (error) {
      setError('Error adding prescription.');
    }
  };
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    
      window.location.href = '/'; 
    } catch (error) {
      setError('Error logging out.');
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="doctor-panel-container">
      {error && <p className="error">{error}</p>}
      {userData && <h1>Welcome, Dr. {userData.username}!</h1>}

      <h2>Patient List</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map(patient => (
            <tr key={patient.username}>
              <td>{patient.username}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Appointments</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Patient Username</th>
            <th>Appointment Time</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={`${appointment.doctor_username}-${appointment.patient_username}-${appointment.appointment_time}`}>
              <td>{appointment.patient_username}</td>
              <td>{appointment.appointment_time}</td>
              <td>{appointment.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Prescribe Medicine</h2>
      <form onSubmit={handlePrescriptionSubmit} className="prescription-form">
        <div>
          <label>Select Patient:</label>
          <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} required>
            <option value="">--Select Patient--</option>
            {filteredPatients.map(patient => (
              <option key={patient.username} value={patient.username}>{patient.username}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Prescription Details:</label>
          <textarea value={prescriptionDetails} onChange={(e) => setPrescriptionDetails(e.target.value)} required />
        </div>
        <button type="submit">Submit Prescription</button>
      </form>
      <button onClick={handleLogout} id="logout-button">Log Out</button>
    </div>
  );
}

export default DoctorPanel;
