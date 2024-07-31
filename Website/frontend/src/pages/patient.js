import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await axios.get('http://localhost:5000/patients');
      setPatients(response.data);
    };
    fetchPatients();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/patients', { username, password });
      setMessage(response.data.message);
      setPatients([...patients, { username }]);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Patients</h2>
      <form onSubmit={handleAddPatient}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Add Patient</button>
      </form>
      {message && <p>{message}</p>}
      <ul>
        {patients.map((patient, index) => (
          <li key={index}>{patient.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default Patients;
