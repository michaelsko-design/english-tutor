import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const played: string[] = [];

class FakeAudio {
  src: string;
  preload = '';
  volume = 1;
  constructor(src = '') {
    this.src = src;
  }
  canPlayType() {
    return 'probably';
  }
  cloneNode() {
    return new FakeAudio(this.src);
  }
  play() {
    played.push(this.src);
    return Promise.resolve();
  }
}

function setupBrowser(stored: Record<string, string> = {}) {
  const listeners = new Map<string, () => void>();
  const storage = new Map(Object.entries(stored));
  vi.stubGlobal('window', {
    addEventListener: (type: string, handler: () => void) => listeners.set(type, handler),
    removeEventListener: (type: string) => listeners.delete(type),
  });
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  });
  vi.stubGlobal('Audio', FakeAudio);
  return { listeners, storage };
}

async function loadSfx() {
  vi.resetModules();
  return import('./sfx');
}

beforeEach(() => {
  played.length = 0;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('sfx', () => {
  it('stays silent until the first tap, then plays', async () => {
    const { listeners } = setupBrowser();
    const sfx = await loadSfx();

    sfx.playSfx('star');
    expect(played).toEqual([]);

    listeners.get('pointerdown')?.();
    sfx.playSfx('star');
    expect(played).toEqual(['/sfx/star.ogg']);
  });

  it('saves the mute setting on the device and plays nothing while muted', async () => {
    const { listeners, storage } = setupBrowser();
    const sfx = await loadSfx();
    listeners.get('keydown')?.();

    sfx.setSfxMuted(true);
    sfx.playSfx('correct');
    expect(played).toEqual([]);
    expect(storage.get(sfx.SFX_MUTED_STORAGE_KEY)).toBe('1');
  });

  it('reads a saved mute setting on load', async () => {
    setupBrowser({ english_tutor_sfx_muted: '1' });
    const sfx = await loadSfx();
    expect(sfx.isSfxMuted()).toBe(true);
  });

  it('tells subscribers when the setting changes', async () => {
    setupBrowser();
    const sfx = await loadSfx();
    const listener = vi.fn();
    const unsubscribe = sfx.subscribeSfxMuted(listener);
    sfx.setSfxMuted(true);
    unsubscribe();
    sfx.setSfxMuted(false);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
