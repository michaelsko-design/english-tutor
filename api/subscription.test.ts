import { describe, expect, it, vi } from 'vitest';
import { handleSubscriptionRequest } from './subscription';
import { subscriptionFields, type Subscription } from './_lib/proBilling';
import { createFakeFirestore } from './_lib/testing/fakeFirestoreAdmin';
import { linksFetch, parentRequest, SERVICE_ACCOUNT_JSON } from './_lib/testing/parentRequestFixtures';
import type { PaymentProvider } from './_lib/payments/provider';

const NOW = Date.UTC(2026, 9, 28);
const DAY = 24 * 60 * 60 * 1000;
const SUB_ID = 'a'.repeat(32);
const ENV = { FIREBASE_SERVICE_ACCOUNT_JSON: SERVICE_ACCOUNT_JSON };

function plan(overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: SUB_ID, payerParentUid: 'parent1', childUids: ['kid1', 'kid2'], seatLimit: 2, period: 'monthly', status: 'active',
    periodEnd: NOW + 20 * DAY, amountAgorot: 6400, provider: 'grow', recurringRef: 'DD7', billing: 'BILLING',
    lastRemovalAt: 0, lastSwapAt: 0, createdAt: NOW - 10 * DAY, ...overrides,
  };
}

function setup(sub: Subscription = plan(), linked = ['parent1_kid1', 'parent1_kid2', 'parent1_kid3'], canChangeRecurring = true) {
  const fake = createFakeFirestore();
  fake.seed('subscriptions', SUB_ID, subscriptionFields(sub, NOW));
  fake.seed('checkouts', SUB_ID, {
    parentUid: 'parent1', amountAgorot: sub.amountAgorot, payerName: 'ישראל ישראלי', payerPhone: '0501234567', payerEmail: '',
  });
  const gateway = {
    id: 'grow',
    canChangeRecurring,
    createPaymentPage: vi.fn(),
    confirmPayment: vi.fn(),
    acknowledge: vi.fn(),
    updateRecurring: vi.fn(async () => {}),
  } satisfies PaymentProvider;
  const deps = {
    fetchImpl: linksFetch(linked) as unknown as typeof fetch,
    verifyToken: vi.fn(async () => true),
    nowMs: () => NOW,
    createAdmin: vi.fn(() => fake.admin) as never,
    createProvider: vi.fn(() => gateway) as never,
  };
  return { fake, gateway, deps };
}

const call = (body: Record<string, unknown>, uid = 'parent1') =>
  parentRequest('/api/subscription', { subscriptionId: SUB_ID, ...body }, uid);

describe('handleSubscriptionRequest', () => {
  it('cancels a monthly plan at the gateway and keeps Pro until periodEnd', async () => {
    const { fake, gateway, deps } = setup();

    expect((await handleSubscriptionRequest(call({ action: 'cancel' }), ENV, deps)).status).toBe(200);

    expect(gateway.updateRecurring).toHaveBeenCalledWith('BILLING', { cancel: true });
    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ status: 'canceled', periodEnd: NOW + 20 * DAY });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ status: 'canceled', periodEnd: NOW + 20 * DAY });
  });

  it('leaves the owner a task to cancel in Grow when the gateway cannot (Make)', async () => {
    const { fake, gateway, deps } = setup(plan(), undefined, false);

    expect((await handleSubscriptionRequest(call({ action: 'cancel' }), ENV, deps)).status).toBe(200);

    expect(gateway.updateRecurring).not.toHaveBeenCalled();
    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ status: 'canceled' });
    expect(fake.get('gatewayTasks', `${SUB_ID}_cancel`)).toMatchObject({
      kind: 'cancel', subscriptionId: SUB_ID, dueAt: NOW + 20 * DAY, payerPhone: '0501234567', doneAt: 0,
    });
    expect(fake.commits).toHaveLength(1);
  });

  it('alerts the owner through the Make scenario when a parent cancels', async () => {
    const { deps } = setup(plan(), undefined, false);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const env = { ...ENV, GROW_MAKE_WEBHOOK_URL: 'https://hook.eu1.make.com/abc', GROW_MAKE_API_KEY: 'k' };

    expect((await handleSubscriptionRequest(call({ action: 'cancel' }), env, deps)).status).toBe(200);

    const fetchMock = deps.fetchImpl as unknown as ReturnType<typeof linksFetch>;
    const alerts = fetchMock.mock.calls.filter(([url]) => String(url) === env.GROW_MAKE_WEBHOOK_URL);
    expect(alerts).toHaveLength(1);
    expect(JSON.parse(String(alerts[0][1]?.body))).toMatchObject({ action: 'notify', kind: 'cancel' });
    vi.restoreAllMocks();
  });

  it('leaves the owner a task to change the amount when the gateway cannot (Make)', async () => {
    const { fake, gateway, deps } = setup(plan(), undefined, false);

    const response = await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 }), ENV, deps);

    expect(await response.json()).toEqual({ ok: true, amountAgorot: 8900, seatLimit: 3 });
    expect(gateway.updateRecurring).not.toHaveBeenCalled();
    expect(fake.get('gatewayTasks', `${SUB_ID}_amount`)).toMatchObject({ kind: 'amount', amountAgorot: 8900, chargedAgorot: 6400 });
    expect(fake.get('entitlements', 'kid3')).toMatchObject({ status: 'active' });
  });

  it('closes the amount task when the price goes back to what Grow still charges (Make)', async () => {
    const { fake, deps } = setup(plan(), undefined, false);

    await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 }), ENV, deps);
    expect((await handleSubscriptionRequest(call({ action: 'removeChild', childUid: 'kid3' }), ENV, deps)).status).toBe(200);

    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ amountAgorot: 6400 });
    expect(fake.get('gatewayTasks', `${SUB_ID}_amount`)).toMatchObject({ amountAgorot: 8900, doneAt: NOW });
  });

  it('keeps what Grow charges across several changes before the owner makes one (Make)', async () => {
    const { fake, deps } = setup(plan(), undefined, false);

    await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 }), ENV, deps);
    await handleSubscriptionRequest(call({ action: 'removeChild', childUid: 'kid2' }), ENV, deps);
    await handleSubscriptionRequest(call({ action: 'removeChild', childUid: 'kid3' }), ENV, deps);

    // 64 -> 89 -> 64 -> 39: Grow still charges 64, so the owner is asked for 39
    expect(fake.get('gatewayTasks', `${SUB_ID}_amount`)).toMatchObject({ amountAgorot: 3900, chargedAgorot: 6400, doneAt: 0 });
  });

  it('starts from the plan price once the owner has made the last change (Make)', async () => {
    const { fake, deps } = setup(plan(), undefined, false);
    fake.seed('gatewayTasks', `${SUB_ID}_amount`, { kind: 'amount', amountAgorot: 6400, chargedAgorot: 3900, doneAt: NOW - DAY });

    await handleSubscriptionRequest(call({ action: 'removeChild', childUid: 'kid2' }), ENV, deps);

    expect(fake.get('gatewayTasks', `${SUB_ID}_amount`)).toMatchObject({ amountAgorot: 3900, chargedAgorot: 6400, doneAt: 0 });
  });

  it('closes an open amount task when the plan is cancelled (Make)', async () => {
    const { fake, deps } = setup(plan(), undefined, false);

    await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 }), ENV, deps);
    expect((await handleSubscriptionRequest(call({ action: 'cancel' }), ENV, deps)).status).toBe(200);

    expect(fake.get('gatewayTasks', `${SUB_ID}_amount`)).toMatchObject({ doneAt: NOW });
    expect(fake.get('gatewayTasks', `${SUB_ID}_cancel`)).toMatchObject({ kind: 'cancel', doneAt: 0 });
  });

  it('has nothing to cancel on a yearly plan', async () => {
    const { gateway, deps } = setup(plan({ period: 'yearly', amountAgorot: 56900 }));
    expect((await handleSubscriptionRequest(call({ action: 'cancel' }), ENV, deps)).status).toBe(409);
    expect(gateway.updateRecurring).not.toHaveBeenCalled();
  });

  it('hides another parent\'s plan', async () => {
    const { gateway, deps } = setup();
    expect((await handleSubscriptionRequest(call({ action: 'cancel' }, 'parent2'), ENV, deps)).status).toBe(404);
    expect(gateway.updateRecurring).not.toHaveBeenCalled();
  });

  it('adds a linked child, re-pricing the next monthly charge', async () => {
    const { fake, gateway, deps } = setup();

    const response = await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 }), ENV, deps);

    expect(await response.json()).toEqual({ ok: true, amountAgorot: 8900, seatLimit: 3 });
    expect(gateway.updateRecurring).toHaveBeenCalledWith('BILLING', { amountAgorot: 8900 });
    expect(fake.get('entitlements', 'kid3')).toMatchObject({ status: 'active', subscriptionId: SUB_ID });
  });

  it('refuses an unlinked child or one who holds a seat on another plan', async () => {
    const unlinked = setup(plan(), ['parent1_kid1', 'parent1_kid2']);
    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 }), ENV, unlinked.deps)).status).toBe(403);
    const taken = setup();
    taken.fake.seed('entitlements', 'kid3', { status: 'active', periodEnd: NOW + DAY, subscriptionId: 'other' });
    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 }), ENV, taken.deps)).status).toBe(409);
    expect(taken.gateway.updateRecurring).not.toHaveBeenCalled();
  });

  it('enforces the swap cooldown', async () => {
    const { deps } = setup(plan({ childUids: ['kid1'], lastRemovalAt: NOW - DAY, lastSwapAt: NOW - 5 * DAY }));
    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 }), ENV, deps)).status).toBe(429);
  });

  it('removes a child, who keeps Pro until periodEnd without a seat', async () => {
    const { fake, gateway, deps } = setup();

    expect((await handleSubscriptionRequest(call({ action: 'removeChild', childUid: 'kid2' }), ENV, deps)).status).toBe(200);

    expect(gateway.updateRecurring).toHaveBeenCalledWith('BILLING', { amountAgorot: 3900 });
    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ childUids: ['kid1'], lastRemovalAt: NOW });
    expect(fake.get('entitlements', 'kid2')).toMatchObject({ status: 'canceled', periodEnd: NOW + 20 * DAY });    expect(fake.get('entitlements', 'kid1')).toMatchObject({ status: 'active' });
  });

  it('lets a child who leaves a yearly plan keep Pro for at most a month', async () => {
    const { fake, deps } = setup(plan({ period: 'yearly', amountAgorot: 56900, periodEnd: NOW + 300 * DAY }));
    expect((await handleSubscriptionRequest(call({ action: 'removeChild', childUid: 'kid2' }), ENV, deps)).status).toBe(200);
    expect(fake.get('entitlements', 'kid2')).toMatchObject({ status: 'canceled', periodEnd: Date.UTC(2026, 10, 28) });
    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ periodEnd: NOW + 300 * DAY });
  });

  it('puts the gateway amount back when the plan changed meanwhile', async () => {
    const { fake, gateway, deps } = setup();
    const commit = fake.admin.commit;
    fake.admin.commit = async (writes) => {
      fake.seed('subscriptions', SUB_ID, subscriptionFields(plan(), NOW));
      return commit(writes);
    };

    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 }), ENV, deps)).status).toBe(409);
    expect(gateway.updateRecurring).toHaveBeenNthCalledWith(2, 'BILLING', { amountAgorot: 6400 });
  });

  it("refuses the seat when another plan took the child meanwhile, and puts the amount back", async () => {
    const { fake, gateway, deps } = setup();
    const commit = fake.admin.commit;
    fake.admin.commit = async (writes) => {
      fake.seed('entitlements', 'kid3', { status: 'active', periodEnd: NOW + 30 * DAY, subscriptionId: 'other' });
      return commit(writes);
    };

    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 }), ENV, deps)).status).toBe(409);
    expect(fake.get('entitlements', 'kid3')).toMatchObject({ subscriptionId: 'other' });
    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ childUids: ['kid1', 'kid2'] });
    expect(gateway.updateRecurring).toHaveBeenNthCalledWith(2, 'BILLING', { amountAgorot: 6400 });
  });

  it('changes nothing when the gateway refuses', async () => {
    const { fake, gateway, deps } = setup();
    gateway.updateRecurring.mockRejectedValueOnce(new Error('down'));
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 }), ENV, deps)).status).toBe(502);
    errors.mockRestore();
    expect(fake.get('entitlements', 'kid3')).toBeUndefined();
  });

  it('asks the parent to confirm a higher monthly charge, and saves the confirmation', async () => {
    const { fake, gateway, deps } = setup();

    const unconfirmed = await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3' }), ENV, deps);
    expect(unconfirmed.status).toBe(409);
    expect(await unconfirmed.json()).toMatchObject({ code: 'confirm_price', amountAgorot: 8900 });
    expect(gateway.updateRecurring).not.toHaveBeenCalled();
    const wrongAmount = call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 6400 });
    expect((await handleSubscriptionRequest(wrongAmount, ENV, deps)).status).toBe(409);

    const confirmed = call({ action: 'addChild', childUid: 'kid3', confirmedAmountAgorot: 8900 });
    expect((await handleSubscriptionRequest(confirmed, ENV, deps)).status).toBe(200);
    expect(fake.get('planConsents', `${SUB_ID}_add_${NOW}`)).toMatchObject({
      parentUid: 'parent1', kind: 'add_child', childUid: 'kid3', fromAgorot: 6400, toAgorot: 8900, acceptedAt: NOW,
    });
  });

  it('needs no confirmation to fill a paid yearly seat', async () => {
    const { deps } = setup(plan({ period: 'yearly', amountAgorot: 79900, seatLimit: 3, periodEnd: NOW + 300 * DAY }));
    expect((await handleSubscriptionRequest(call({ action: 'addChild', childUid: 'kid3' }), ENV, deps)).status).toBe(200);
  });

  it('quotes a full refund within 14 days, changing nothing', async () => {
    const { fake, deps } = setup();
    const response = await handleSubscriptionRequest(call({ action: 'quoteCancel' }), ENV, deps);
    expect(await response.json()).toEqual({ ok: true, mode: 'full_refund', refundAgorot: 6400, accessUntil: NOW });
    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ status: 'active' });
  });

  it('cancels with a full refund within 14 days: Pro closes now, charges stop, the owner gets the refund task', async () => {
    const { fake, gateway, deps } = setup(plan(), undefined, false);

    const response = await handleSubscriptionRequest(call({ action: 'cancelWithRefund' }), ENV, deps);

    expect(await response.json()).toEqual({ ok: true, mode: 'full_refund', refundAgorot: 6400, accessUntil: NOW });
    expect(gateway.updateRecurring).not.toHaveBeenCalled();
    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ status: 'canceled', periodEnd: NOW });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ status: 'expired', periodEnd: NOW });
    expect(fake.get('gatewayTasks', `${SUB_ID}_cancel`)).toMatchObject({ kind: 'cancel', doneAt: 0 });
    expect(fake.get('gatewayTasks', `${SUB_ID}_refund_cancel`)).toMatchObject({
      kind: 'refund', amountAgorot: 6400, dueAt: NOW + 14 * DAY, payerPhone: '0501234567',
    });
    expect(fake.get('refundRequests', SUB_ID)).toMatchObject({ parentUid: 'parent1', mode: 'full_refund', amountAgorot: 6400 });
    // A plan is refunded once
    expect((await handleSubscriptionRequest(call({ action: 'cancelWithRefund' }), ENV, deps)).status).toBe(409);
  });

  it('stops two plans of one family from both taking the full refund at the same moment', async () => {
    const { fake, deps } = setup();
    // The other plan's request landed between this quote and this save: only the family record shows it
    const commit = fake.admin.commit;
    fake.admin.commit = async (writes) => {
      fake.seed('refundRequests', 'family_parent1', { parentUid: 'parent1', mode: 'full_refund' });
      return commit(writes);
    };
    const response = await handleSubscriptionRequest(call({ action: 'cancelWithRefund' }), ENV, deps);
    expect(response.status).toBe(409);
    expect(fake.get('subscriptions', SUB_ID)).toMatchObject({ status: 'active' });
    expect(fake.get('refundRequests', SUB_ID)).toBeUndefined();
  });

  it('cancels the gateway only after the records are saved, and leaves a task when the gateway refuses', async () => {
    const { fake, gateway, deps } = setup();
    gateway.updateRecurring.mockRejectedValueOnce(new Error('down'));
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect((await handleSubscriptionRequest(call({ action: 'cancelWithRefund' }), ENV, deps)).status).toBe(200);
    expect(fake.get('refundRequests', SUB_ID)).toMatchObject({ mode: 'full_refund' });
    expect(fake.get('gatewayTasks', `${SUB_ID}_cancel`)).toMatchObject({ kind: 'cancel', doneAt: 0 });
    logged.mockRestore();
  });

  it('refunds nothing here when the plan has no recorded payment', async () => {
    const { fake, deps } = setup();
    fake.seed('checkouts', SUB_ID, { parentUid: 'parent1' });
    expect((await handleSubscriptionRequest(call({ action: 'cancelWithRefund' }), ENV, deps)).status).toBe(409);
  });

  it('refunds a yearly renewal not yet begun without taking the year already paid before it', async () => {
    const oldEnd = NOW + 20 * DAY;
    const renewal = plan({ period: 'yearly', amountAgorot: 56900, createdAt: NOW - 30 * DAY, periodEnd: Date.UTC(2027, 10, 17) });
    const { fake, deps } = setup({ ...renewal, periodEnd: Date.UTC(2027, 10, 17) });
    // The renewal's year starts at the old end (2026-11-17), after now
    const response = await handleSubscriptionRequest(call({ action: 'cancelWithRefund' }), ENV, deps);
    expect(await response.json()).toMatchObject({ mode: 'yearly_prorata', refundAgorot: 56900, accessUntil: oldEnd });
    expect(fake.get('entitlements', 'kid1')).toMatchObject({ status: 'canceled', periodEnd: oldEnd });
  });

  it('gives the full refund once per family', async () => {
    const { fake, deps } = setup(plan({ period: 'yearly', amountAgorot: 56900, periodEnd: NOW + 355 * DAY }));
    fake.seed('refundRequests', 'b'.repeat(32), { parentUid: 'parent1', mode: 'full_refund' });
    const response = await handleSubscriptionRequest(call({ action: 'quoteCancel' }), ENV, deps);
    // A 2-child yearly plan in its first month: ₪569 − 1 × ₪64
    expect(await response.json()).toMatchObject({ mode: 'yearly_prorata', refundAgorot: 56900 - 6400 });
  });

  it('cancels a yearly plan after 14 days by the formula, keeping Pro to the end of the plan month', async () => {
    const createdAt = NOW - 100 * DAY;
    const periodEnd = Date.UTC(2027, 6, 20); // started 2026-07-20: the 4th month began 2026-10-20
    const { fake, gateway, deps } = setup(plan({ period: 'yearly', amountAgorot: 56900, createdAt, periodEnd }));

    const response = await handleSubscriptionRequest(call({ action: 'cancelWithRefund' }), ENV, deps);

    expect(await response.json()).toEqual({
      ok: true, mode: 'yearly_prorata', refundAgorot: 56900 - 4 * 6400, accessUntil: Date.UTC(2026, 10, 20),
    });
    expect(gateway.updateRecurring).not.toHaveBeenCalled();
    expect(fake.get('entitlements', 'kid2')).toMatchObject({ status: 'canceled', periodEnd: Date.UTC(2026, 10, 20) });
  });

  it('refuses a refund when the formula leaves nothing', async () => {
    const periodEnd = Date.UTC(2027, 1, 20); // started 2026-02-20: in its 9th month
    const { deps } = setup(plan({ period: 'yearly', amountAgorot: 56900, createdAt: NOW - 250 * DAY, periodEnd }));
    const response = await handleSubscriptionRequest(call({ action: 'cancelWithRefund' }), ENV, deps);
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ code: 'no_refund' });
  });

  it('rejects malformed requests', async () => {
    const { deps } = setup();
    expect((await handleSubscriptionRequest(call({ action: 'delete' }), ENV, deps)).status).toBe(400);
    expect((await handleSubscriptionRequest(call({ action: 'addChild' }), ENV, deps)).status).toBe(400);
    expect((await handleSubscriptionRequest(parentRequest('/api/subscription', { action: 'cancel', subscriptionId: '../x' }), ENV, deps)).status).toBe(400);
  });
});
