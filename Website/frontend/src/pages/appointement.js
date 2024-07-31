import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [details, setDetails] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await axios.get('http://localhost:5000/appointments');
      setAppointments(response.data);
    };
    fetchAppointments();
  }, []);

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/appointments', { details });
      setMessage(response.data.message);
      setAppointments([...appointments, { details }]);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Appointments</h2>
      <form onSubmit={handleAddAppointment}>
        <div>
          <label>Details:</label>
          <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} />
        </div>
        <button type="submit">Add Appointment</button>
      </form>
      {message && <p>{message}</p>}
      <ul>
        {appointments.map((appointment, index) => (
          <li key={index}>{appointment.details}</li>
        ))}
      </ul>
    </div>
  );
}

export default Appointments;
