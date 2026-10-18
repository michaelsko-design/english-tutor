import { useSyncExternalStore } from 'react';
import { isSfxMuted, subscribeSfxMuted } from '../utils/sfx';

export function useSfxMuted(): boolean {
  return useSyncExternalStore(subscribeSfxMuted, isSfxMuted, () => false);
}
