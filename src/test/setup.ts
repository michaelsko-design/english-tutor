/**
 * Setup for the component tests (the "components" Vitest project, jsdom). Firebase never loads,
 * nothing is read aloud or played, and the browser APIs jsdom lacks get quiet stand-ins.
 */
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

vi.mock('../services/firebase', () => ({
  app: null,
  appCheck: null,
  auth: null,
  db: null,
  googleProvider: null,
  isFirebaseConfigured: false,
  getAppCheckToken: async () => null,
}));

vi.mock('../services/tts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../services/tts')>();
  const { createSpeechStatus } = await import('../services/tts/speechStatus');
  const silentService = createSpeechStatus({
    speak: async () => {},
    stop: () => {},
    isReady: () => true,
  });
  return {
    ...actual,
    getTtsService: () => silentService,
    stopSpeech: () => silentService.stop(),
    speakHebrew: async () => {},
  };
});

vi.mock('../utils/celebrate', () => ({ celebrate: () => {} }));

vi.mock('../utils/sfx', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/sfx')>();
  return { ...actual, playSfx: () => {} };
});

function stubMatchMedia(query: string): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  };
}

class StubObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): [] {
    return [];
  }
}

if (!window.matchMedia) window.matchMedia = stubMatchMedia;
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};
globalThis.IntersectionObserver ??= StubObserver as unknown as typeof IntersectionObserver;
globalThis.ResizeObserver ??= StubObserver as unknown as typeof ResizeObserver;
HTMLMediaElement.prototype.play = async () => {};
HTMLMediaElement.prototype.pause = () => {};

afterEach(() => {
  cleanup();
  localStorage.clear();
});
