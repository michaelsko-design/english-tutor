import { afterEach, describe, expect, it, vi } from 'vitest';

const firebase = vi.hoisted(() => ({
  auth: { currentUser: { getIdToken: async () => 'id-token' } },
  getAppCheckToken: vi.fn(async () => null),
}));
vi.mock('./firebase', () => ({ auth: firebase.auth, getAppCheckToken: firebase.getAppCheckToken }));

import { changeProPlan, quoteProCancellation, startProCheckout } from './proBillingService';

const REQUEST = { childUids: ['kid1'], period: 'yearly' as const, payerName: 'Dan Cohen', payerPhone: '0501234567', payerEmail: 'dan@example.com', acceptedTerms: true as const };

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

    expect(await startProCheckout(REQUEST)).not.toEqual({ ok: false, errorHe: expect.stringContaining('וואטסאפ') });
  });

  it('falls back to the status when there is no known code', async () => {
    answer(409, { error: 'A child already has Pro', code: 'has_pro' });
    expect(await startProCheckout(REQUEST)).toEqual({ ok: false, errorHe: 'לאחד הילדים כבר יש Pro.' });
    answer(500, {});
    expect(await startProCheckout(REQUEST)).toEqual({ ok: false, errorHe: 'משהו השתבש. כדאי לנסות שוב.' });
  });
});

describe('plan changes', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('reads a cancellation quote', async () => {
    answer(200, { ok: true, mode: 'yearly_prorata', refundAgorot: 19300, accessUntil: 123 });
    expect(await quoteProCancellation('a'.repeat(32))).toEqual({
      ok: true,
      value: { mode: 'yearly_prorata', refundAgorot: 19300, accessUntil: 123 },
    });
    answer(200, { ok: true, mode: 'bogus' });
    expect((await quoteProCancellation('a'.repeat(32))).ok).toBe(false);
  });

  it('sends the confirmed monthly amount when adding a child, and explains a refusal by its code', async () => {
    answer(409, { error: 'Confirm the new monthly price', code: 'confirm_price', amountAgorot: 8900 });
    expect(await changeProPlan('addChild', 'a'.repeat(32), { childUid: 'kid3', confirmedAmountAgorot: 8900 })).toEqual({
      ok: false,
      errorHe: expect.stringContaining('המחיר החודשי השתנה'),
    });
    const sent = JSON.parse(String((fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].body));
    expect(sent).toMatchObject({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 });
  });
});
