import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../pages/Css/Patientpanel.css'; 

function PatientPanel() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [issue, setIssue] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments] = useState([
    { value: 'medicine', label: 'Medicine' },
    { value: 'orthopaedic', label: 'Orthopaedic' },
    { value: 'ent', label: 'ENT' },
    { value: 'general', label: 'General' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get('http://127.0.0.1:5000/auth/get_user_data');
        setUserData(userResponse.data);

        // Fetch doctors
        const doctorResponse = await axios.get('http://127.0.0.1:5000/patients/doctors', { withCredentials: true });
        setDoctors(doctorResponse.data);

        // Fetch appointments
        const appointmentResponse = await axios.get('http://127.0.0.1:5000/patients/appointments', { withCredentials: true });
        setAppointments(appointmentResponse.data);

        // Fetch prescriptions
        const prescriptionResponse = await axios.get('http://127.0.0.1:5000/patients/medicines', { withCredentials: true });
        setPrescriptions(prescriptionResponse.data);
      } catch (error) {
        setError('Error fetching data.');
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

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
      // Refresh the appointments list
      const response = await axios.get('http://127.0.0.1:5000/patients/appointments', { withCredentials: true });
      setAppointments(response.data);
    } catch (error) {
      setError('Error scheduling appointment.');
    }
  };

  if (!userData) {
    return <p>Loading...</p>;
  }

  const filteredDoctors = selectedDepartment
    ? doctors.filter(doctor => doctor.department.toLowerCase() === selectedDepartment.toLowerCase())
    : doctors;

  return (
    <div className="patient-panel-container">
      {error && <p id="error-message">{error}</p>}
      {userData && <h1 id="welcome-message">Welcome, {userData.username}!</h1>}

      <h2 id="schedule-appointment-header">Schedule Appointment</h2>
      <form onSubmit={handleAppointmentSubmit} id="appointment-form">
        <div id="department-select">
          <label htmlFor="department">Select Department:</label>
          <select 
            id="department" 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)} 
            required
          >
            <option value="">--Select Department--</option>
            {departments.map(dept => (
              <option key={dept.value} value={dept.value}>{dept.label}</option>
            ))}
          </select>
        </div>
        <div id="doctor-select">
          <label htmlFor="doctor">Select Doctor:</label>
          <select 
            id="doctor" 
            value={selectedDoctor} 
            onChange={(e) => setSelectedDoctor(e.target.value)} 
            required
          >
            <option value="">--Select Doctor--</option>
            {filteredDoctors.map(doctor => (
              <option key={doctor.username} value={doctor.username}>{doctor.username}</option>
            ))}
          </select>
        </div>
        <div id="appointment-date">
          <label htmlFor="appointment-date-input">Appointment Date:</label>
          <input 
            id="appointment-date-input"
            type="datetime-local" 
            value={appointmentDate} 
            onChange={(e) => setAppointmentDate(e.target.value)} 
            required 
          />
        </div>
        <div id="issue-textarea">
          <label htmlFor="issue">Issue:</label>
          <textarea 
            id="issue"
            value={issue} 
            onChange={(e) => setIssue(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" id="schedule-button">Schedule Appointment</button>
      </form>

      <h2 id="appointments-header">Your Appointments</h2>
      <table id="appointments-table" className="styled-table">
        <thead>
          <tr>
            <th>Doctor Username</th>
            <th>Appointment Time</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={`${appointment.doctor_username}-${appointment.appointment_time}`}>
              <td>{appointment.doctor_username}</td>
              <td>{appointment.appointment_time}</td>
              <td>{appointment.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 id="medicines-header">Your Medicines</h2>
      <table id="medicines-table" className="styled-table">
        <thead>
          <tr>
            <th>Doctor Username</th>
            <th>Prescription Details</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map(prescription => (
            <tr key={`${prescription.doctor_username}-${prescription.patient_username}`}>
              <td>{prescription.doctor_username}</td>
              <td>{prescription.prescription_details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientPanel;
