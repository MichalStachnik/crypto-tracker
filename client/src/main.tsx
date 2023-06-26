import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ReactGA from 'react-ga4';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

ReactGA.initialize('G-YFRTYN1N15');

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
