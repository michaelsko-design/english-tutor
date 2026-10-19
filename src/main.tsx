import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppErrorBoundary } from './components/AppErrorBoundary';
// Fonts are bundled with the app (not loaded from Google), so they work offline and send no requests out
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/rubik';
import './index.css';
import { watchVoices } from './utils/ttsVoice';
import { getTtsService } from './services/tts';

watchVoices();
// Created early so the clip list loads on the first tap
getTtsService();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed or unsupported in dev environment
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
