import { OWNER_ERROR_BY_STATUS, ownerAuthHeaders } from './ownerStatsService';
import type { InviteEntry, OwnerTestersView, TesterEntry } from '../../api/owner-testers';

export type { InviteEntry, OwnerTestersView, TesterEntry };

const TESTERS_URL = '/api/owner-testers';

export type TestersResult = { ok: true; view: OwnerTestersView } | { ok: false; message: string };

async function call(method: 'GET' | 'POST' | 'DELETE', body?: Record<string, unknown>): Promise<TestersResult> {
  try {
    const headers = await ownerAuthHeaders();
    if (!headers) return { ok: false, message: OWNER_ERROR_BY_STATUS[401] };
    const response = await fetch(TESTERS_URL, {
      method,
      headers: body ? { ...headers, 'Content-Type': 'application/json' } : headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (response.ok) return { ok: true, view: (await response.json()) as OwnerTestersView };
    // The server's own message is safe to show to the owner
    const detail = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, message: detail?.error ?? OWNER_ERROR_BY_STATUS[response.status] ?? 'Could not update the testers.' };
  } catch {
    return { ok: false, message: 'No connection.' };
  }
}

export const fetchTesters = (): Promise<TestersResult> => call('GET');
/** One single-use invite per alias */
export const createInvites = (labels: string[], cohort: string, days: number): Promise<TestersResult> =>
  call('POST', { labels, cohort, days });
export const withdrawInvite = (code: string): Promise<TestersResult> => call('DELETE', { code });
/** Hides used and expired invites from the list (they stay in the database) */
export const archiveFinishedInvites = (): Promise<TestersResult> => call('POST', { archiveFinished: true });
export const lockOutTester = (uid: string): Promise<TestersResult> => call('DELETE', { uid });

/** Deletes the tester's sign-in and all data. `confirm` must repeat the alias, or the server refuses. */
export const removeTesterCompletely = (uid: string, confirm: string): Promise<TestersResult> =>
  call('DELETE', { uid, erase: true, confirm });
/** Same for an account that is no longer listed (locked out earlier); `confirm` repeats the username. */
export const removeTesterByUsername = (username: string, confirm: string): Promise<TestersResult> =>
  call('DELETE', { username, erase: true, confirm });

/** The link a parent opens on the child's device */
export const inviteLink = (origin: string, code: string): string => `${origin.replace(/\/$/, '')}/?access=${code}`;
