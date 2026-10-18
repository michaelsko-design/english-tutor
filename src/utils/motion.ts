/** The learner's "reduce motion" setting: no confetti or animation, the final state at once. */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function getReducedMotionQuery(): MediaQueryList | null {
  if (typeof window === 'undefined' || !window.matchMedia) return null;
  return window.matchMedia(REDUCED_MOTION_QUERY);
}

export function prefersReducedMotion(): boolean {
  return getReducedMotionQuery()?.matches ?? false;
}

export function subscribeReducedMotion(onChange: () => void): () => void {
  const query = getReducedMotionQuery();
  if (!query) return () => {};
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
