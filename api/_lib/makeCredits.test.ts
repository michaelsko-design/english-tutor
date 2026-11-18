import { describe, expect, it, vi } from 'vitest';
import { checkMakeCredits, creditLevel, readMakeApiConfig } from './makeCredits';
import { createFakeFirestore } from './testing/fakeFirestoreAdmin';

const ENV = { MAKE_API_TOKEN: 'make-token', MAKE_ORGANIZATION_ID: '9621113' };
const NOW = Date.UTC(2026, 10, 18);

function organization(creditsUsed: number, overrides: Record<string, unknown> = {}) {
  return {
    organization: {
      id: 9621113,
      license: { operations: 1000 },
      centicreditsConsumed: String(creditsUsed * 100),
      centicreditsExtra: '0',
      lastReset: '2026-11-13T09:32:30.066Z',
      nextReset: '2026-12-13T09:32:30.066Z',
      ...overrides,
    },
  };
}

function setup(creditsUsed: number, { status = 200, sent = true, overrides = {} as Record<string, unknown> } = {}) {
  const fake = createFakeFirestore();
  const fetchImpl = vi.fn<(url: string, init: RequestInit) => Promise<Response>>(
    async () => new Response(JSON.stringify(organization(creditsUsed, overrides)), { status })
  );
  const notify = vi.fn(async () => sent);
  const run = (env: Record<string, string | undefined> = ENV) =>
    checkMakeCredits(env, fake.admin, notify, { fetchImpl: fetchImpl as unknown as typeof fetch, nowMs: () => NOW });
  return { fake, fetchImpl, notify, run };
}

describe('readMakeApiConfig', () => {
  it('needs the token and the organization id', () => {
    expect(readMakeApiConfig({})).toBeNull();
    expect(readMakeApiConfig({ MAKE_API_TOKEN: 't' })).toBeNull();
    expect(readMakeApiConfig(ENV)).toEqual({ token: 'make-token', organizationId: '9621113', zone: 'eu1.make.com' });
  });

  it('refuses an organization id or zone that could point the token anywhere else', () => {
    expect(readMakeApiConfig({ ...ENV, MAKE_ORGANIZATION_ID: '1/../x' })).toBeNull();
    expect(readMakeApiConfig({ ...ENV, MAKE_ZONE: 'evil.example' })).toBeNull();
    expect(readMakeApiConfig({ ...ENV, MAKE_ZONE: 'us2.make.com' })?.zone).toBe('us2.make.com');
  });
});

describe('creditLevel', () => {
  it('is the highest warning level reached', () => {
    expect(creditLevel(69, 100)).toBe(0);
    expect(creditLevel(70, 100)).toBe(70);
    expect(creditLevel(95, 100)).toBe(90);
    expect(creditLevel(5, 0)).toBe(0);
  });
});

describe('checkMakeCredits', () => {
  it('does nothing without a Make API token', async () => {
    const { run, fetchImpl } = setup(900);
    expect(await run({})).toBeNull();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("reads the organization's usage with the token", async () => {
    const { run, fetchImpl, notify } = setup(56);

    expect(await run()).toMatchObject({ used: 56, limit: 1000, percent: 6, alerted: false });

    expect(fetchImpl.mock.calls[0][0]).toBe('https://eu1.make.com/api/v2/organizations/9621113');
    expect(fetchImpl.mock.calls[0][1].headers).toMatchObject({ Authorization: 'Token make-token' });
    expect(notify).not.toHaveBeenCalled();
  });

  it('warns the owner once at 70% and once more at 90% in the same cycle', async () => {
    const first = setup(720);
    expect(await first.run()).toMatchObject({ percent: 72, alerted: true });
    expect(first.notify).toHaveBeenCalledTimes(1);
    const [notice] = first.notify.mock.calls[0] as unknown as [{ kind: string; subject: string; text: string }];
    expect(notice.kind).toBe('make_credits');
    expect(notice.subject).toContain('70%');
    expect(notice.text).toContain('720');
    expect(notice.text).toContain('13.12.2026');

    // The next night, still at 70-something: no repeat
    expect(await first.run()).toMatchObject({ alerted: false });
    expect(first.notify).toHaveBeenCalledTimes(1);

    const saved = first.fake.get('ownerNotices', 'makeCredits');
    const second = setup(910);
    second.fake.seed('ownerNotices', 'makeCredits', saved!);
    expect(await second.run()).toMatchObject({ percent: 91, alerted: true });
    expect((second.notify.mock.calls[0] as unknown as [{ subject: string }])[0].subject).toContain('90%');
  });

  it('warns again in a new cycle', async () => {
    const { run, fake, notify } = setup(750);
    fake.seed('ownerNotices', 'makeCredits', { cycleStart: '2026-10-13T09:32:30.066Z', level: 90 });
    expect(await run()).toMatchObject({ alerted: true });
    expect(notify).toHaveBeenCalledTimes(1);
  });

  it('counts extra credits bought this cycle in the limit', async () => {
    const { run } = setup(720, { overrides: { centicreditsExtra: String(1000 * 100) } });
    expect(await run()).toMatchObject({ limit: 2000, percent: 36, alerted: false });
  });

  it('tries again the next night when the warning could not be sent', async () => {
    const { run, fake } = setup(720, { sent: false });
    expect(await run()).toMatchObject({ alerted: false });
    expect(fake.get('ownerNotices', 'makeCredits')).toBeUndefined();
  });

  it("throws on a refused API call, without the token in the error", async () => {
    const { run } = setup(0, { status: 401 });
    await expect(run()).rejects.toThrow('Make API 401');
    await expect(run()).rejects.not.toThrow('make-token');
  });
});
