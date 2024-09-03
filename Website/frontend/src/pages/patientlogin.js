import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

function PatientLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/login', { username, password, role: 'patient' });
      
      console.log("Response data:", response.data); // Log the response data
  
      if (response.data.loginStatus === 'true') {
        setMessage('Login Successful! Redirecting...');
        navigate('/patientpanel');
      } else {
        navigate('/patientpanel');
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage('An error occurred. Please try again later.');
    }
  };
  
  return (
    <div>
      <h2>Patient Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default PatientLogin;
