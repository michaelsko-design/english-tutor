import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ParentLink } from '../../data/parentLink';
import { paymentReturnUrl } from '../../data/parentProRoute';
import type { Entitlement } from '../../data/proGate';
import { TEST_THEME } from '../../test/fixtures';
import type { ChildProStatus } from '../../data/proPlanStatus';
import { useParentPro } from './useParentPro';

const mocks = vi.hoisted(() => ({
  entitlements: {} as Record<string, unknown>,
  changeProPlan: vi.fn(),
  quoteProCancellation: vi.fn(),
  trackFunnel: vi.fn(),
}));
vi.mock('../../services/analytics/funnel', () => ({ trackFunnel: mocks.trackFunnel }));
vi.mock('../../hooks/useChildEntitlements', () => ({ useChildEntitlements: () => mocks.entitlements }));
vi.mock('../../services/proBillingService', () => ({
  changeProPlan: mocks.changeProPlan,
  quoteProCancellation: mocks.quoteProCancellation,
}));

// Stand-ins that expose the props the hook passes down as buttons and text
vi.mock('./ChildProSection', () => ({
  ChildProSection: (p: {
    childName: string;
    status: ChildProStatus | undefined;
    onUpgrade: () => void;
    onRenew: () => void;
    onCancelRenewal: () => void;
    onLoadCancelQuote: () => Promise<unknown>;
    onCancelWithRefund: () => void;
    onAddToPlan: () => void;
    onRemoveFromPlan: () => void;
  }) => (
    <div>
      <span>{`${p.childName}:${p.status?.kind ?? 'loading'}`}</span>
      <button type="button" onClick={p.onUpgrade}>{`upgrade ${p.childName}`}</button>
      <button type="button" onClick={p.onRenew}>{`renew ${p.childName}`}</button>
      <button type="button" onClick={p.onCancelRenewal}>{`cancel ${p.childName}`}</button>
      <button type="button" onClick={() => void p.onLoadCancelQuote()}>{`quote ${p.childName}`}</button>
      <button type="button" onClick={p.onCancelWithRefund}>{`refund ${p.childName}`}</button>
      <button type="button" onClick={p.onAddToPlan}>{`add ${p.childName}`}</button>
      <button type="button" onClick={p.onRemoveFromPlan}>{`remove ${p.childName}`}</button>
    </div>
  ),
}));
vi.mock('./ProCheckoutPanel', () => ({
  ProCheckoutPanel: (p: { initialPeriod: string; initialChildUids: string[]; parentEmail: string | null; parentName?: string | null }) => (
    <div>
      <span>{`plans:${p.initialPeriod}:${p.initialChildUids.join(',')}:${p.parentEmail}`}</span>
      <span>{`payer:${p.parentName}`}</span>
    </div>
  ),
}));
vi.mock('./ProPaymentReturn', () => ({
  ProPaymentReturn: (p: { isCancelled: boolean; activatedNames: readonly string[] | null; hasFullRefund?: boolean | null; onDismiss: () => void }) => (
    <div>
      <span>{`return:${p.isCancelled}:${p.activatedNames ? p.activatedNames.join('|') : 'waiting'}`}</span>
      <span>{`full-refund:${String(p.hasFullRefund ?? null)}`}</span>
      <button type="button" onClick={p.onDismiss}>dismiss</button>
    </div>
  ),
}));
vi.mock('./MockPaymentPage', () => ({ MockPaymentPage: () => <div>mock payment</div> }));

const DAY_MS = 24 * 60 * 60 * 1000;
const CHECKOUT_ID = 'a'.repeat(32);
const USER = { uid: 'parent-1', email: 'parent@example.com', displayName: 'Dana Cohen' } as User;
const link = (childUid: string, childName: string): ParentLink => ({
  parentUid: 'parent-1', childUid, childName, childAvatar: '🐱', inviteCode: 'ABCD2345', linkedAt: '2026-03-04T10:00:00.000Z',
});
const NOA = link('c1', 'נועה');
const ITAY = link('c2', 'איתי');

function plan(overrides: Partial<Entitlement> = {}): Entitlement {
  return {
    plan: 'pro',
    status: 'active',
    source: 'subscription',
    billingPeriod: 'monthly',
    periodEnd: Date.now() + 20 * DAY_MS,
    subscriptionId: 's1',
    payerParentUid: 'parent-1',
    ...overrides,
  } as Entitlement;
}

const onNotice = vi.fn();
const onError = vi.fn();

function Harness({ links, isEnabled = true }: { links: ParentLink[] | null; isEnabled?: boolean }) {
  const pro = useParentPro({ user: USER, theme: TEST_THEME, links, isEnabled, onNotice, onError });
  return (
    <div>
      {pro.topArea}
      {links?.map((l) => <div key={l.childUid}>{pro.renderChildSection(l)}</div>)}
      {pro.plansArea}
      <span>renewing:{String(pro.hasRenewingPlan)}</span>
    </div>
  );
}

beforeEach(() => {
  mocks.entitlements = {};
  mocks.changeProPlan.mockReset();
  mocks.trackFunnel.mockReset();
  onNotice.mockReset();
  onError.mockReset();
  window.history.replaceState(null, '', '/?parent');
  Element.prototype.scrollIntoView = vi.fn();
});

describe('useParentPro visibility', () => {
  it('shows nothing when Pro is not enabled', () => {
    mocks.entitlements = { c1: null };
    render(<Harness links={[NOA]} isEnabled={false} />);

    expect(screen.queryByText(/נועה:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/plans:/)).not.toBeInTheDocument();
  });

  it('waits for every child\'s plan before offering the plans', () => {
    mocks.entitlements = { c1: null };
    render(<Harness links={[NOA, ITAY]} />);

    expect(screen.getByText('נועה:free')).toBeInTheDocument();
    expect(screen.getByText('איתי:loading')).toBeInTheDocument();
    expect(screen.queryByText(/plans:/)).not.toBeInTheDocument();
  });

  it('opens the plans on yearly with every child who can join ticked', () => {
    mocks.entitlements = { c1: null, c2: null };
    render(<Harness links={[NOA, ITAY]} />);

    expect(screen.getByText('plans:yearly:c1,c2:parent@example.com')).toBeInTheDocument();
  });

  it.each([
    ['a monthly plan this parent pays', plan(), true],
    ['a monthly plan whose renewal was cancelled', plan({ status: 'canceled' }), false],
    ['a yearly plan, which never renews by itself', plan({ billingPeriod: 'yearly', seatLimit: 1 }), false],
    ["another parent's monthly plan", plan({ payerParentUid: 'parent-2' }), false],
  ])('knows whether the parent has a plan that charges again: %s', (_label, entitlement, expected) => {
    mocks.entitlements = { c1: entitlement };
    render(<Harness links={[NOA]} />);
    expect(screen.getByText(`renewing:${expected}`)).toBeInTheDocument();
  });

  it('does not know about renewing plans while a child\'s plan is still loading', () => {
    mocks.entitlements = { c1: null };
    render(<Harness links={[NOA, ITAY]} />);
    expect(screen.getByText('renewing:null')).toBeInTheDocument();
  });

  it('offers no plans once every child has Pro', () => {
    mocks.entitlements = { c1: plan(), c2: plan() };
    render(<Harness links={[NOA, ITAY]} />);

    expect(screen.getByText('נועה:plan')).toBeInTheDocument();
    expect(screen.queryByText(/plans:/)).not.toBeInTheDocument();
  });

  it('offers no plans while the children are still loading', () => {
    render(<Harness links={null} />);

    expect(screen.queryByText(/plans:/)).not.toBeInTheDocument();
  });
});

describe('useParentPro checkout', () => {
  it('counts the plans view and passes the Google name and email to the plan-and-pay screen', () => {
    mocks.entitlements = { c1: null };
    render(<Harness links={[NOA]} />);
    expect(mocks.trackFunnel).toHaveBeenCalledWith('pro_plans_view');
    expect(screen.getByText('payer:Dana Cohen')).toBeInTheDocument();
  });

  it('does not count a plans view while the plans are hidden', () => {
    mocks.entitlements = { c1: plan() };
    render(<Harness links={[NOA]} />);
    expect(mocks.trackFunnel).not.toHaveBeenCalled();
  });

  it('ticks only the child picked from a card', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: null, c2: null };
    render(<Harness links={[NOA, ITAY]} />);

    await user.click(screen.getByRole('button', { name: 'upgrade איתי' }));

    expect(onError).toHaveBeenCalledWith(null);
    expect(screen.getByText('plans:yearly:c2:parent@example.com')).toBeInTheDocument();
  });

  it('opens a yearly renewal for everyone on the same plan', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: plan({ billingPeriod: 'yearly', periodEnd: Date.now() + 3 * DAY_MS }), c2: null };
    render(<Harness links={[NOA, ITAY]} />);

    await user.click(screen.getByRole('button', { name: 'renew נועה' }));

    expect(screen.getByText('plans:yearly:c1:parent@example.com')).toBeInTheDocument();
  });

  it('ignores a renewal request from a child who is not on a plan', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: null };
    render(<Harness links={[NOA]} />);

    await user.click(screen.getByRole('button', { name: 'renew נועה' }));

    expect(screen.getByText('plans:yearly:c1:parent@example.com')).toBeInTheDocument();
  });
});

describe('useParentPro plan changes', () => {
  it('cancels the renewal and tells the parent', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: plan() };
    mocks.changeProPlan.mockResolvedValue({ ok: true, value: undefined });
    render(<Harness links={[NOA]} />);

    await user.click(screen.getByRole('button', { name: 'cancel נועה' }));

    expect(mocks.changeProPlan).toHaveBeenCalledWith('cancel', 's1', {});
    expect(onNotice).toHaveBeenCalledWith(expect.stringContaining('החידוש בוטל'));
  });

  it('adds a free child to the paying parent\'s open plan', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: plan(), c2: null };
    mocks.changeProPlan.mockResolvedValue({ ok: true, value: undefined });
    render(<Harness links={[NOA, ITAY]} />);

    await user.click(screen.getByRole('button', { name: 'add איתי' }));

    // The monthly price the parent confirmed goes with it (the server checks it)
    expect(mocks.changeProPlan).toHaveBeenCalledWith('addChild', 's1', { childUid: 'c2', confirmedAmountAgorot: 6400 });
    expect(onNotice).toHaveBeenCalledWith(expect.stringContaining('נוסף/ה למנוי'));
  });

  it('removes a child from a plan that goes on for the others', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: plan(), c2: plan() };
    mocks.changeProPlan.mockResolvedValue({ ok: true, value: undefined });
    render(<Harness links={[NOA, ITAY]} />);

    await user.click(screen.getByRole('button', { name: 'remove איתי' }));

    expect(mocks.changeProPlan).toHaveBeenCalledWith('removeChild', 's1', { childUid: 'c2' });
    expect(onNotice).toHaveBeenCalledWith(expect.stringContaining('הוצא/ה מהמנוי'));
  });

  it('cancels with a refund and says when the money comes back', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: plan() };
    mocks.changeProPlan.mockResolvedValue({ ok: true, value: undefined });
    render(<Harness links={[NOA]} />);

    await user.click(screen.getByRole('button', { name: 'refund נועה' }));

    expect(mocks.changeProPlan).toHaveBeenCalledWith('cancelWithRefund', 's1', {});
    expect(onNotice).toHaveBeenCalledWith(expect.stringContaining('בתוך 14 יום'));
  });

  it('loads the cancellation quote, and shows the error when it fails', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: plan() };
    mocks.quoteProCancellation.mockResolvedValue({ ok: false, errorHe: 'אין חיבור' });
    render(<Harness links={[NOA]} />);

    await user.click(screen.getByRole('button', { name: 'quote נועה' }));

    expect(mocks.quoteProCancellation).toHaveBeenCalledWith('s1');
    expect(onError).toHaveBeenLastCalledWith('אין חיבור');
  });

  it('passes the server\'s error on to the parent', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: plan() };
    mocks.changeProPlan.mockResolvedValue({ ok: false, errorHe: 'לא ניתן לבטל' });
    render(<Harness links={[NOA]} />);

    await user.click(screen.getByRole('button', { name: 'cancel נועה' }));

    expect(onError).toHaveBeenLastCalledWith('לא ניתן לבטל');
    expect(onNotice).not.toHaveBeenCalled();
  });

  it('does nothing for a plan action on a child without a plan', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: null };
    render(<Harness links={[NOA]} />);

    await user.click(screen.getByRole('button', { name: 'cancel נועה' }));
    await user.click(screen.getByRole('button', { name: 'add נועה' }));
    await user.click(screen.getByRole('button', { name: 'remove נועה' }));

    expect(mocks.changeProPlan).not.toHaveBeenCalled();
  });
});

describe('useParentPro after payment', () => {
  it('waits for the plan to appear, then names the children who got Pro', () => {
    window.history.replaceState(null, '', paymentReturnUrl(CHECKOUT_ID));
    mocks.entitlements = { c1: null, c2: null };
    const { rerender } = render(<Harness links={[NOA, ITAY]} />);
    expect(screen.getByText('return:false:waiting')).toBeInTheDocument();

    mocks.entitlements = { c1: plan({ subscriptionId: CHECKOUT_ID }), c2: plan({ subscriptionId: CHECKOUT_ID }) };
    rerender(<Harness links={[NOA, ITAY]} />);

    expect(screen.getByText('return:false:נועה|איתי')).toBeInTheDocument();
  });

  it.each([
    ['full_refund', 'true'],
    ['yearly_prorata', 'false'],
  ])('asks the server once whether the family still has its full refund (%s)', async (mode, shown) => {
    window.history.replaceState(null, '', paymentReturnUrl(CHECKOUT_ID));
    mocks.quoteProCancellation.mockResolvedValue({ ok: true, value: { mode, refundAgorot: 34900, accessUntil: 0 } });
    mocks.entitlements = { c1: plan({ subscriptionId: CHECKOUT_ID, billingPeriod: 'yearly', seatLimit: 1 }) };
    const { rerender } = render(<Harness links={[NOA]} />);
    rerender(<Harness links={[NOA]} />);

    expect(await screen.findByText(`full-refund:${shown}`)).toBeInTheDocument();
    expect(mocks.quoteProCancellation).toHaveBeenCalledExactlyOnceWith(CHECKOUT_ID);
  });

  it('keeps the plain summary when the refund check fails', async () => {
    window.history.replaceState(null, '', paymentReturnUrl(CHECKOUT_ID));
    mocks.quoteProCancellation.mockResolvedValue({ ok: false, errorHe: 'אין חיבור' });
    mocks.entitlements = { c1: plan({ subscriptionId: CHECKOUT_ID, billingPeriod: 'yearly', seatLimit: 1 }) };
    render(<Harness links={[NOA]} />);

    await vi.waitFor(() => expect(mocks.quoteProCancellation).toHaveBeenCalled());
    expect(screen.getByText('full-refund:null')).toBeInTheDocument();
    expect(onError).not.toHaveBeenCalledWith('אין חיבור');
  });

  it('shows a canceled payment, and dismissing it clears the address', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', paymentReturnUrl(CHECKOUT_ID, true));
    mocks.entitlements = { c1: null };
    render(<Harness links={[NOA]} />);
    expect(screen.getByText('return:true:waiting')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'dismiss' }));

    expect(screen.queryByText(/return:/)).not.toBeInTheDocument();
    expect(window.location.search).toBe('?parent');
  });

  it('scrolls to the plans when a learner asked for Pro', () => {
    window.history.replaceState(null, '', '/?parent&pro=1');
    mocks.entitlements = { c1: null };
    render(<Harness links={[NOA]} />);

    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('scrolls to the plans once they appear, when the child is connected after the page loaded', () => {
    window.history.replaceState(null, '', '/?parent=ABCD2345&pro=1');
    mocks.entitlements = { c1: null };
    const { rerender } = render(<Harness links={[]} />);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

    rerender(<Harness links={[NOA]} />);
    expect(screen.getByText(/plans:/)).toBeInTheDocument();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);

    rerender(<Harness links={[NOA, ITAY]} />);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('does not scroll to the plans without a Pro ask', () => {
    mocks.entitlements = { c1: null };
    render(<Harness links={[NOA]} />);

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });
});
