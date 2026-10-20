import { describe, expect, it } from 'vitest';
import { shouldShowSyncButton } from './HomeHud';
import { AuthUserSummary } from '../../types/learner';

const savedUser = { uid: 'u1', isAnonymous: false } as AuthUserSummary;
const guestUser = { uid: 'g1', isAnonymous: true } as AuthUserSummary;

describe('shouldShowSyncButton', () => {
  it('hides the button for a saved account that is synced or syncing', () => {
    expect(shouldShowSyncButton('synced', savedUser)).toBe(false);
    expect(shouldShowSyncButton('syncing', savedUser)).toBe(false);
  });

  it('shows the button on a sync problem', () => {
    expect(shouldShowSyncButton('offline-error', savedUser)).toBe(true);
    expect(shouldShowSyncButton('local-only', savedUser)).toBe(true);
  });

  it('shows the button for a guest so the account can be saved', () => {
    expect(shouldShowSyncButton('synced', guestUser)).toBe(true);
  });
});
