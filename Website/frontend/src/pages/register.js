import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../helper';
import '../pages/Css/Register.css'; 

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('doctor');
  const [department, setDepartment] = useState('Medicine');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
        role,
        department: role === 'doctor' ? department : null,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };
  const handleBack = () => {
    navigate('/'); 
  };
  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form onSubmit={handleRegister} className="register-form">
        <table className="register-table">
          <tbody>
            <tr>
              <td><label>Username:</label></td>
              <td><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label>Password:</label></td>
              <td><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></td>
            </tr>
            <tr>
              <td><label>Role:</label></td>
              <td>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="doctor">Doctor</option>
                  <option value="patient">Patient</option>
                </select>
              </td>
            </tr>
            {role === 'doctor' && (
              <tr>
                <td><label>Department:</label></td>
                <td>
                  <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="Medicine">Medicine</option>
                    <option value="Orthopaedic">Orthopaedic</option>
                    <option value="ENT">ENT</option>
                    <option value="General">General</option>
                  </select>
                </td>
              </tr>
            )}
            <tr>
              <td colSpan="2"><button type="submit" className="register-button">Register</button>
              <br></br><br></br>
              <button type="button" className="back-button" onClick={handleBack}>Back</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      {message && <p className="register-message">{message}</p>}
    </div>
  );
}

export default Register;
