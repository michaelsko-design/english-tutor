import { useSyncExternalStore } from 'react';
import { getStickerImages, subscribeStickerImages } from '../data/stickerImageStore';

/** Re-renders when a drawn sticker's picture arrives, changes or is removed. */
export function useStickerImages(): Readonly<Record<string, string>> {
  return useSyncExternalStore(subscribeStickerImages, getStickerImages, getStickerImages);
}
