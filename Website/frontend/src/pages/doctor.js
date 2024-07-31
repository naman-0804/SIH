import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get('http://localhost:5000/doctors');
      setDoctors(response.data);
    };
    fetchDoctors();
  }, []);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/doctors', { username, password });
      setMessage(response.data.message);
      setDoctors([...doctors, { username }]);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Doctors</h2>
      <form onSubmit={handleAddDoctor}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Add Doctor</button>
      </form>
      {message && <p>{message}</p>}
      <ul>
        {doctors.map((doctor, index) => (
          <li key={index}>{doctor.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default Doctors;
