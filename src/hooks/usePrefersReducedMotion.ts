import { useSyncExternalStore } from 'react';
import { prefersReducedMotion, subscribeReducedMotion } from '../utils/motion';

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
}
