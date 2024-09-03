import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [details, setDetails] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const response = await axios.get('http://127.0.0.1:5000/auth/prescriptions');
      setPrescriptions(response.data);
    };
    fetchPrescriptions();
  }, []);

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/prescriptions', { details });
      setMessage(response.data.message);
      setPrescriptions([...prescriptions, { details }]);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Prescriptions</h2>
      <form onSubmit={handleAddPrescription}>
        <div>
          <label>Details:</label>
          <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} />
        </div>
        <button type="submit">Add Prescription</button>
      </form>
      {message && <p>{message}</p>}
      <ul>
        {prescriptions.map((prescription, index) => (
          <li key={index}>{prescription.details}</li>
        ))}
      </ul>
    </div>
  );
}

export default Prescriptions;
