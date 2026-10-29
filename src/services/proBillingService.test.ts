import { afterEach, describe, expect, it, vi } from 'vitest';

const firebase = vi.hoisted(() => ({
  auth: { currentUser: { getIdToken: async () => 'id-token' } },
  getAppCheckToken: vi.fn(async () => null),
}));
vi.mock('./firebase', () => ({ auth: firebase.auth, getAppCheckToken: firebase.getAppCheckToken }));

import { startProCheckout } from './proBillingService';

const REQUEST = { childUids: ['kid1'], period: 'yearly' as const, payerName: 'Dan Cohen', payerPhone: '0501234567', payerEmail: '' };

function answer(status: number, body: Record<string, unknown>) {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(body), { status })));
}

describe('startProCheckout refusals', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('explains a refusal by its code', async () => {
    answer(409, { error: 'Renew one plan on its own', code: 'renewal_separate' });
    expect(await startProCheckout(REQUEST)).toEqual({ ok: false, errorHe: expect.stringContaining('חידוש מנוי שנתי') });

    answer(429, { error: 'Too many payment pages today', code: 'too_many_checkouts' });
    expect(await startProCheckout(REQUEST)).toEqual({ ok: false, errorHe: expect.stringContaining('יותר מדי דפי תשלום') });

    answer(409, { error: 'Too many linked children', code: 'too_many_children' });
    expect(await startProCheckout(REQUEST)).toEqual({ ok: false, errorHe: expect.stringContaining('יותר מ-6 ילדים') });
  });

  it('falls back to the status when there is no known code', async () => {
    answer(409, { error: 'A child already has Pro', code: 'has_pro' });
    expect(await startProCheckout(REQUEST)).toEqual({ ok: false, errorHe: 'לאחד הילדים כבר יש Pro.' });
    answer(500, {});
    expect(await startProCheckout(REQUEST)).toEqual({ ok: false, errorHe: 'משהו השתבש. כדאי לנסות שוב.' });
  });
});
