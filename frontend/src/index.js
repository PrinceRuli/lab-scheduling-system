import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render app with error boundary
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring
reportWebVitals();