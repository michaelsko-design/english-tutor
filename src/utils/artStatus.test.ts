import { afterEach, describe, expect, it, vi } from 'vitest';
import { getArtStatus, preloadArt, setArtLoaderForTests, subscribeArtStatus } from './artStatus';

afterEach(() => setArtLoaderForTests(null));

describe('art status', () => {
  it('counts a picture that was never requested as loading', () => {
    setArtLoaderForTests(() => undefined);
    expect(getArtStatus('/art/x.webp')).toBe('loading');
  });

  it('records loaded and missing pictures and tells the listeners', () => {
    const finish: Record<string, (isLoaded: boolean) => void> = {};
    setArtLoaderForTests((src, onDone) => {
      finish[src] = onDone;
    });
    const listener = vi.fn();
    const unsubscribe = subscribeArtStatus(listener);

    preloadArt('/art/a.webp');
    preloadArt('/art/b.webp');
    expect(getArtStatus('/art/a.webp')).toBe('loading');

    finish['/art/a.webp'](true);
    finish['/art/b.webp'](false);
    expect(getArtStatus('/art/a.webp')).toBe('loaded');
    expect(getArtStatus('/art/b.webp')).toBe('missing');
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
  });

  it('loads each picture only once', () => {
    const loader = vi.fn();
    setArtLoaderForTests(loader);
    preloadArt('/art/c.webp');
    preloadArt('/art/c.webp');
    expect(loader).toHaveBeenCalledTimes(1);
  });
});
