import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api`)
      .then((res) => setMessage(res.data))
      .catch(() => setMessage('❌ Could not connect to backend'));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Backend Status</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
