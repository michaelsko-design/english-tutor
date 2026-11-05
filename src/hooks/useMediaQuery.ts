import { useCallback, useSyncExternalStore } from 'react';

/**
 * The wide landscape layout (desktop, landscape tablet): the same query as the `wide:` screen in
 * tailwind.config.js. CSS `wide:` classes do most of the work; this is for layout chosen in code.
 */
export const WIDE_LAYOUT_QUERY = '(min-width: 1024px) and (orientation: landscape)';

function hasMatchMedia(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

/** Whether a CSS media query matches now; re-renders when it changes. False where matchMedia is missing. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!hasMatchMedia()) return () => undefined;
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query]
  );
  const getSnapshot = () => (hasMatchMedia() ? window.matchMedia(query).matches : false);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** True on the wide landscape layout (see WIDE_LAYOUT_QUERY). */
export function useIsWideLayout(): boolean {
  return useMediaQuery(WIDE_LAYOUT_QUERY);
}
