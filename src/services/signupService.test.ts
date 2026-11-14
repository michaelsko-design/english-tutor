// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildSignupRecord, isNewAccount, recordSignup, type SignupRecord } from './signupService';

const NOW = new Date('2026-12-15T12:00:00');
const HOUR = 60 * 60 * 1000;
const created = (hoursAgo: number) => new Date(NOW.getTime() - hoursAgo * HOUR).toUTCString();
const deps = (write: (record: SignupRecord) => Promise<void>) => ({ write, now: () => NOW });

beforeEach(() => window.localStorage.clear());

describe('isNewAccount', () => {
  it('is true only within a day of the account being created', () => {
    expect(isNewAccount(created(1), NOW.getTime())).toBe(true);
    expect(isNewAccount(created(25), NOW.getTime())).toBe(false);
    expect(isNewAccount(undefined, NOW.getTime())).toBe(false);
    expect(isNewAccount('not a date', NOW.getTime())).toBe(false);
  });
});

describe('buildSignupRecord', () => {
  it('holds the local day and the tag, and no campaign key when there is none', () => {
    expect(buildSignupRecord('u1', { src: 'landing', campaign: null }, NOW)).toEqual({ uid: 'u1', day: '2026-12-15', src: 'landing' });
    expect(buildSignupRecord('u1', { src: 'wa-family', campaign: 'dec-soft' }, NOW)).toEqual({
      uid: 'u1',
      day: '2026-12-15',
      src: 'wa-family',
      campaign: 'dec-soft',
    });
  });
});

describe('recordSignup', () => {
  it('stores a new account once', async () => {
    const write = vi.fn(async () => undefined);
    const account = { uid: 'u1', creationTime: created(1) };
    expect(await recordSignup(account, { src: 'qr', campaign: null }, deps(write))).toBe(true);
    expect(await recordSignup(account, { src: 'qr', campaign: null }, deps(write))).toBe(false);
    expect(write).toHaveBeenCalledTimes(1);
    expect(write).toHaveBeenCalledWith({ uid: 'u1', day: '2026-12-15', src: 'qr' });
  });

  it('leaves an old account alone', async () => {
    const write = vi.fn(async () => undefined);
    expect(await recordSignup({ uid: 'old', creationTime: created(48) }, { src: 'landing', campaign: null }, deps(write))).toBe(false);
    expect(write).not.toHaveBeenCalled();
  });

  it('tries again on the next load after a refused write', async () => {
    const refuse = vi.fn(async () => {
      throw new Error('permission-denied');
    });
    const account = { uid: 'u2', creationTime: created(2) };
    expect(await recordSignup(account, { src: 'direct', campaign: null }, deps(refuse))).toBe(false);
    const write = vi.fn(async () => undefined);
    expect(await recordSignup(account, { src: 'direct', campaign: null }, deps(write))).toBe(true);
  });
});
