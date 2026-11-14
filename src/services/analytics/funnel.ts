import { isFirebaseConfigured } from '../firebase';
import { getStoredAttribution } from '../../data/attribution';
import { isFunnelEvent, isFunnelSourceEvent, type FunnelEvent } from './events';

/** A method of the owner-stats function file (see api/_lib/funnelCounter.ts): Vercel Hobby allows 12 functions */
const FUNNEL_URL = '/api/owner-stats';

/** Off in unit tests, and when Firebase is not configured (the local no-cloud mode has no API) */
const isEnabled = (): boolean => isFirebaseConfigured && !import.meta.env.VITEST;

const sent = new Set<FunnelEvent>();

/**
 * Counts one sign-up step before an account exists. Each step is counted once per page load, never
 * waits for the network, and a failure is ignored: the funnel must never get in a child's way.
 */
export function trackFunnel(event: FunnelEvent, send: typeof fetch = fetch, enabled: boolean = isEnabled()): void {
  if (!enabled || !isFunnelEvent(event) || sent.has(event)) return;
  sent.add(event);
  try {
    void send(FUNNEL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isFunnelSourceEvent(event) ? { event, src: getStoredAttribution().src } : { event }),
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // A browser without fetch keepalive support: skip the count
  }
}
