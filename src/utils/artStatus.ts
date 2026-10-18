/**
 * Which art files exist (Feature 25). Most generated art is added later, so every picture is
 * probed once: `loaded` pictures are shown, `missing` ones show a fallback instead of a broken
 * image. Results are cached for the visit, so a picture shown again never flashes.
 */

export type ArtStatus = 'loading' | 'loaded' | 'missing';

type ArtLoader = (src: string, onDone: (isLoaded: boolean) => void) => void;

const loadInBrowser: ArtLoader = (src, onDone) => {
  if (typeof Image === 'undefined') {
    onDone(false);
    return;
  }
  const image = new Image();
  image.decoding = 'async';
  // A missing file may come back as the app's HTML page, which fails to decode: also "missing".
  image.onload = () => onDone(image.naturalWidth > 0);
  image.onerror = () => onDone(false);
  image.src = src;
};

let loader: ArtLoader = loadInBrowser;
const statusBySrc = new Map<string, ArtStatus>();
const listeners = new Set<() => void>();

/** A picture that was never requested counts as loading. */
export function getArtStatus(src: string): ArtStatus {
  return statusBySrc.get(src) ?? 'loading';
}

/** Starts loading a picture once; later calls do nothing. */
export function preloadArt(src: string): void {
  if (statusBySrc.has(src)) return;
  statusBySrc.set(src, 'loading');
  loader(src, (isLoaded) => {
    statusBySrc.set(src, isLoaded ? 'loaded' : 'missing');
    listeners.forEach((listener) => listener());
  });
}

export function subscribeArtStatus(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Tests: swap the image loader and forget every cached result. */
export function setArtLoaderForTests(testLoader: ArtLoader | null): void {
  loader = testLoader ?? loadInBrowser;
  statusBySrc.clear();
}
