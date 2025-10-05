import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Enhance root for accessibility context
const container = document.getElementById('root');
if (container) {
  container.setAttribute('role', 'application');
  container.setAttribute('aria-label', 'Tic Tac Toe');
}
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
