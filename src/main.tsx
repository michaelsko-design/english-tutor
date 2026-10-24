import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { isParentRoute, parseParentParam } from './data/parentLink';
import { lazyNamed } from './utils/lazyNamed';
import { ScreenLoading } from './components/ScreenLoading';
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

// The parent area is a separate, lazy screen: it never starts the learner app or its cloud sync
const ParentPortal = lazyNamed(() => import('./components/parent/ParentPortal'), 'ParentPortal');
const isParentView = isParentRoute(window.location.search);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      {isParentView ? (
        <React.Suspense fallback={<ScreenLoading />}>
          <ParentPortal initialCode={parseParentParam(window.location.search)} />
        </React.Suspense>
      ) : (
        <App />
      )}
    </AppErrorBoundary>
  </React.StrictMode>
);
