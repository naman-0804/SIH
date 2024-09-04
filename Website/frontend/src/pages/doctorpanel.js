import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DoctorPanel() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptionDetails, setPrescriptionDetails] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/auth/get_user_data');
        setUserData(response.data);
      } catch (error) {
        setError('Error fetching user data. Please log in.');
      }
    };

    const fetchPatientList = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/doctors/patients', { withCredentials: true });
        setPatients(response.data);
      } catch (error) {
        setError('Error fetching patient list.');
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/doctors/appointments', { withCredentials: true });
        setAppointments(response.data);
      } catch (error) {
        setError('Error fetching appointments.');
      }
    };

    fetchUserData();
    fetchPatientList();
    fetchAppointments();
    setLoading(false);
  }, []);

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/doctors/prescriptions', {
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

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {error && <p>{error}</p>}
      {userData && <p>Welcome, Dr. {userData.username}!</p>}

      <h2>Patient List</h2>
      <ul>
        {patients.map(patient => (
          <li key={patient.username}>{patient.username}</li>
        ))}
      </ul>

      <h2>Appointments</h2>
      <ul>
        {appointments.map(appointment => (
          <li key={`${appointment.doctor_username}-${appointment.patient_username}-${appointment.appointment_time}`}>
            {appointment.patient_username} - {appointment.appointment_time}: {appointment.description}
          </li>
        ))}
      </ul>

      <h2>Prescribe Medicine</h2>
      <form onSubmit={handlePrescriptionSubmit}>
        <div>
          <label>Select Patient:</label>
          <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} required>
            <option value="">--Select Patient--</option>
            {patients.map(patient => (
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
    </div>
  );
}

export default DoctorPanel;
