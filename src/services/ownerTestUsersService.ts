import { OWNER_ERROR_BY_STATUS, ownerAuthHeaders } from './ownerStatsService';
import type { TestUserEntry } from '../../api/owner-test-users';

export type { TestUserEntry };

const TEST_USERS_URL = '/api/owner-test-users';

export type TestUsersResult = { ok: true; users: TestUserEntry[] } | { ok: false; message: string };

async function call(method: 'GET' | 'POST' | 'DELETE', body?: Record<string, string>): Promise<TestUsersResult> {
  try {
    const headers = await ownerAuthHeaders();
    if (!headers) return { ok: false, message: OWNER_ERROR_BY_STATUS[401] };
    const response = await fetch(TEST_USERS_URL, {
      method,
      headers: body ? { ...headers, 'Content-Type': 'application/json' } : headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (response.ok) return { ok: true, users: ((await response.json()) as { users: TestUserEntry[] }).users };
    // The server's own message (e.g. "No account found…") is safe to show to the owner
    const detail = (await response.json().catch(() => null)) as { error?: string } | null;
    return { ok: false, message: detail?.error ?? OWNER_ERROR_BY_STATUS[response.status] ?? 'Could not update the list.' };
  } catch {
    return { ok: false, message: 'No connection.' };
  }
}

/** The owner's test accounts, which the dashboard leaves out of its numbers. */
export const fetchTestUsers = (): Promise<TestUsersResult> => call('GET');
/** Adds an account by username, email or uid. */
export const addTestUser = (identifier: string): Promise<TestUsersResult> => call('POST', { identifier });
export const removeTestUser = (uid: string): Promise<TestUsersResult> => call('DELETE', { uid });
