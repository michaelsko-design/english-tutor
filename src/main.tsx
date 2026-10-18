import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { watchVoices } from './utils/ttsVoice';

watchVoices();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed or unsupported in dev environment
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
