import { describe, expect, it, vi } from 'vitest';
import { handleFunnelRequest } from './funnel';
import { createFakeFirestore } from './_lib/testing/fakeFirestoreAdmin';
import { SERVICE_ACCOUNT_JSON } from './_lib/testing/parentRequestFixtures';

const NOW = Date.UTC(2026, 9, 29, 10);
const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON };

const post = (body: unknown, method = 'POST') =>
  new Request('https://app.test/api/funnel', { method, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) });

function setup(extra: Partial<Parameters<typeof handleFunnelRequest>[2]> = {}) {
  const fake = createFakeFirestore();
  const deps = { nowMs: () => NOW, createAdmin: vi.fn(() => fake.admin) as never, ...extra };
  return { fake, deps };
}

describe('handleFunnelRequest', () => {
  it('counts an allowed event in the document of the day (Israel time)', async () => {
    const { fake, deps } = setup();
    expect((await handleFunnelRequest(post({ event: 'gate_view' }), ENV, deps)).status).toBe(204);
    expect((await handleFunnelRequest(post({ event: 'gate_view' }), ENV, deps)).status).toBe(204);
    await handleFunnelRequest(post({ event: 'signup_done' }), ENV, deps);
    expect(fake.get('funnelDaily', '2026-10-29')).toEqual({ gate_view: 2, signup_done: 1 });
  });

  it('refuses an event outside the allow-list and stores nothing', async () => {
    const { fake, deps } = setup();
    const response = await handleFunnelRequest(post({ event: 'mission_finish' }), ENV, deps);
    expect(response.status).toBe(400);
    expect(fake.docs.size).toBe(0);
  });

  it('refuses other methods, bad bodies and an unconfigured server', async () => {
    const { deps } = setup();
    expect((await handleFunnelRequest(post(null, 'GET'), ENV, deps)).status).toBe(405);
    expect((await handleFunnelRequest(new Request('https://app.test/api/funnel', { method: 'POST', body: 'nope' }), ENV, deps)).status).toBe(400);
    expect((await handleFunnelRequest(post({ event: 'gate_view' }), {}, deps)).status).toBe(503);
  });

  it('stops an address that is over its limit', async () => {
    const { fake, deps } = setup({ isIpWithinLimit: () => false });
    expect((await handleFunnelRequest(post({ event: 'gate_view' }), ENV, deps)).status).toBe(429);
    expect(fake.docs.size).toBe(0);
  });

  it('answers 502 when counting fails, without leaking why', async () => {
    const { deps } = setup({
      createAdmin: (() => ({ incrementCounters: async () => { throw new Error('secret detail'); } })) as never,
    });
    const response = await handleFunnelRequest(post({ event: 'gate_view' }), ENV, deps);
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain('secret');
  });
});
