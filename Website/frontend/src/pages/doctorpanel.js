import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DoctorPanel() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/auth/get_user_data');
        console.log("User Data:", response.data);
        setUserData(response.data);
      } catch (error) {
        setError('Error fetching user data. Please log in.');
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      {error ? <p>{error}</p> : <div>{userData && <p>Welcome, {userData.username}!</p>}</div>}
    </div>
  );
}

export default DoctorPanel;
