import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoot } from './components/AppRoot';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { StagingBadge } from './components/StagingBadge';
// Fonts are bundled with the app (not loaded from Google), so they work offline and send no requests out
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/rubik';
import './index.css';
import { watchVoices } from './utils/ttsVoice';
import { getTtsService } from './services/tts';
import { captureAttribution } from './data/attribution';

watchVoices();
// Created early so the clip list loads on the first tap
getTtsService();
// The link's `?src=` tag is kept before anything renders, so the very first funnel count carries it
captureAttribution(window.location.search);

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
      <AppRoot />
    </AppErrorBoundary>
    <StagingBadge />
  </React.StrictMode>
);
