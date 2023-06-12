import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ReactGA from 'react-ga4';
import './index.css';

ReactGA.initialize('G-6FEC3JDXV6');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
