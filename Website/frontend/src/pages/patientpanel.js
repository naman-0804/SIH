import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PatientPanel() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [issue, setIssue] = useState('');

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/patients/appointments', { withCredentials: true });
      setAppointments(response.data);
    } catch (error) {
      setError('Error fetching appointments.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/auth/get_user_data');
        setUserData(response.data);
      } catch (error) {
        setError('Error fetching user data. Please log in.');
      }
    };

    const fetchDoctors = async () => {
      try {
        // Assuming an endpoint exists to get the list of doctors
        const response = await axios.get('http://127.0.0.1:5000/patients/doctors', { withCredentials: true });
        setDoctors(response.data);
      } catch (error) {
        setError('Error fetching doctor list.');
      }
    };

    const fetchPrescriptions = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/patients/medicines', { withCredentials: true });
        setPrescriptions(response.data);
      } catch (error) {
        setError('Error fetching medicines.');
      }
    };

    fetchUserData();
    fetchDoctors();
    fetchAppointments();
    fetchPrescriptions();
  }, []);

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/patients/appointments', {
        doctor_username: selectedDoctor,
        appointment_time: appointmentDate,
        description: issue
      }, { withCredentials: true });
      alert('Appointment scheduled successfully');
      setSelectedDoctor('');
      setAppointmentDate('');
      setIssue('');
      // Optionally refresh the appointments list after scheduling
      fetchAppointments();
    } catch (error) {
      setError('Error scheduling appointment.');
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {error && <p>{error}</p>}
      {userData && <p>Welcome, {userData.username}!</p>}

      <h2>Schedule Appointment</h2>
      <form onSubmit={handleAppointmentSubmit}>
        <div>
          <label>Select Doctor:</label>
          <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required>
            <option value="">--Select Doctor--</option>
            {doctors.map(doctor => (
              <option key={doctor.username} value={doctor.username}>{doctor.username}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Appointment Date:</label>
          <input 
            type="datetime-local" 
            value={appointmentDate} 
            onChange={(e) => setAppointmentDate(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Issue:</label>
          <textarea value={issue} onChange={(e) => setIssue(e.target.value)} required />
        </div>
        <button type="submit">Schedule Appointment</button>
      </form>

      <h2>Your Appointments</h2>
      <ul>
        {appointments.map(appointment => (
          <li key={`${appointment.doctor_username}-${appointment.appointment_time}`}>
            Dr. {appointment.doctor_username} - {appointment.appointment_time}: {appointment.description}
          </li>
        ))}
      </ul>

      <h2>Your Medicines</h2>
      <ul>
        {prescriptions.map(prescription => (
          <li key={`${prescription.doctor_username}-${prescription.patient_username}`}>
            Prescribed by Dr. {prescription.doctor_username}: {prescription.prescription_details}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PatientPanel;
