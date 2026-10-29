import { auth, getAppCheckToken } from './firebase';
import { APP_CHECK_HEADER, TTS_TOKEN_HEADER } from './tts/ttsText';
import type { OwnerStats } from '../../api/_lib/ownerStats';

export type { OwnerStats };

const OWNER_STATS_URL = '/api/owner-stats';

export type OwnerStatsResult = { ok: true; stats: OwnerStats } | { ok: false; message: string };

const ERROR_BY_STATUS: Record<number, string> = {
  401: 'Sign in with your Google account.',
  403: 'This account is not the owner.',
  503: 'The dashboard is not configured on the server (OWNER_UID, service account).',
};

/** The owner's numbers; the server only answers the owner's Google account. */
export async function fetchOwnerStats(): Promise<OwnerStatsResult> {
  const user = auth?.currentUser;
  if (!user) return { ok: false, message: ERROR_BY_STATUS[401] };
  try {
    const [idToken, appCheckToken] = await Promise.all([user.getIdToken(), getAppCheckToken()]);
    const response = await fetch(OWNER_STATS_URL, {
      headers: { [TTS_TOKEN_HEADER]: idToken, ...(appCheckToken ? { [APP_CHECK_HEADER]: appCheckToken } : {}) },
    });
    if (!response.ok) return { ok: false, message: ERROR_BY_STATUS[response.status] ?? 'Could not load the stats.' };
    return { ok: true, stats: (await response.json()) as OwnerStats };
  } catch {
    // fetch only throws when there is no connection
    return { ok: false, message: 'No connection.' };
  }
}
