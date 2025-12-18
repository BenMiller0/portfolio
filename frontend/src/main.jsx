import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import App from './App';
import Debug from './Debug';
import './assets/styles.css';

const NotFound = () => {
  const location = useLocation();
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page <code>{location.pathname}</code> doesn't exist.</p>
      <p><a href="/">Return to Home</a></p>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </React.StrictMode>
);