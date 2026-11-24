import { describe, expect, it } from 'vitest';
import { isContestWaitingFor } from './contestReminder';

const NOW = Date.UTC(2026, 10, 24, 13);
const open = { uids: ['me', 'friend'], status: 'invited', expiresAtMs: NOW + 1000 };

describe('isContestWaitingFor', () => {
  it("is true for an open contest the learner hasn't played, even after the friend played", () => {
    expect(isContestWaitingFor(open, 'me', NOW)).toBe(true);
    expect(isContestWaitingFor({ ...open, results: { friend: {} } }, 'me', NOW)).toBe(true);
  });

  it('is false once the learner played, after it closed, when declined, or for someone else', () => {
    expect(isContestWaitingFor({ ...open, results: { me: {} } }, 'me', NOW)).toBe(false);
    expect(isContestWaitingFor({ ...open, expiresAtMs: NOW }, 'me', NOW)).toBe(false);
    expect(isContestWaitingFor({ ...open, status: 'declined' }, 'me', NOW)).toBe(false);
    expect(isContestWaitingFor(open, 'stranger', NOW)).toBe(false);
  });

  it('is false for a malformed document', () => {
    expect(isContestWaitingFor({}, 'me', NOW)).toBe(false);
    expect(isContestWaitingFor({ ...open, expiresAtMs: 'soon' }, 'me', NOW)).toBe(false);
  });
});
