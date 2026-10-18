import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { ArtStatus, getArtStatus, preloadArt, subscribeArtStatus } from '../utils/artStatus';

/** Loads a picture once and tells whether it is loading, loaded or missing. */
export function useArtStatus(src: string): ArtStatus {
  useEffect(() => {
    preloadArt(src);
  }, [src]);
  const getSnapshot = useCallback(() => getArtStatus(src), [src]);
  return useSyncExternalStore(subscribeArtStatus, getSnapshot, () => 'loading' as ArtStatus);
}
