import { useEffect, useState } from 'react';
import axios from 'axios';

function Debug() {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [envUrl, setEnvUrl] = useState(import.meta.env.VITE_API_URL);

  useEffect(() => {
    axios.get(`${envUrl}/api`)
      .then(res => setApiStatus(res.data))
      .catch(() => setApiStatus('❌ Failed to reach API'));
  }, [envUrl]);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h2>🔧 Debug Page</h2>
      <p><strong>API status:</strong> {apiStatus}</p>
    </div>
  );
}

export default Debug;
