import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pages/Css/Doctorlogin.css'; 
import { API_URL } from '../helper';
axios.defaults.withCredentials = true;

function DoctorLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password, role: 'doctor' });
      
      console.log("Response data:", response.data); 
  
      if (response.data.loginStatus === 'true') {
        setMessage('Login Successful! Redirecting...');
        navigate('/DoctorPanel');
      } else {

        navigate('/DoctorPanel');
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage('An error occurred. Please try again later.');
    }
  };
  const handleBack = () => {
    navigate('/'); 
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Doctor Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
          <br></br><br></br>
          <button type="button" className="back-button" onClick={handleBack}>Back</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default DoctorLogin;
