import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('doctor');
  const [department, setDepartment] = useState('Medicine'); // New state for department
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/register', {
        username,
        password,
        role,
        department: role === 'doctor' ? department : null, // Send department only if the role is doctor
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>
        {role === 'doctor' && (
          <div>
            <label>Department:</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              <option value="Medicine">Medicine</option>
              <option value="Orthopaedic">Orthopaedic</option>
              <option value="ENT">ENT</option>
              <option value="General">General</option>
            </select>
          </div>
        )}
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
