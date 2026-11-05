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
}));
vi.mock('../../hooks/useChildEntitlements', () => ({ useChildEntitlements: () => mocks.entitlements }));
vi.mock('../../services/proBillingService', () => ({ changeProPlan: mocks.changeProPlan }));

// Stand-ins that expose the props the hook passes down as buttons and text
vi.mock('./ChildProSection', () => ({
  ChildProSection: (p: {
    childName: string;
    status: ChildProStatus | undefined;
    onUpgrade: () => void;
    onRenew: () => void;
    onCancelRenewal: () => void;
    onAddToPlan: () => void;
    onRemoveFromPlan: () => void;
  }) => (
    <div>
      <span>{`${p.childName}:${p.status?.kind ?? 'loading'}`}</span>
      <button type="button" onClick={p.onUpgrade}>{`upgrade ${p.childName}`}</button>
      <button type="button" onClick={p.onRenew}>{`renew ${p.childName}`}</button>
      <button type="button" onClick={p.onCancelRenewal}>{`cancel ${p.childName}`}</button>
      <button type="button" onClick={p.onAddToPlan}>{`add ${p.childName}`}</button>
      <button type="button" onClick={p.onRemoveFromPlan}>{`remove ${p.childName}`}</button>
    </div>
  ),
}));
vi.mock('./ProPlanPicker', () => ({
  ProPlanPicker: (p: { initialChildren: number; onContinue: (c: { period: 'monthly' | 'yearly'; children: number }) => void }) => (
    <div>
      <span>{`picker:${p.initialChildren}`}</span>
      <button type="button" onClick={() => p.onContinue({ period: 'yearly', children: 1 })}>continue one</button>
      <button type="button" onClick={() => p.onContinue({ period: 'monthly', children: 2 })}>continue two</button>
    </div>
  ),
}));
vi.mock('./ProCheckoutPanel', () => ({
  ProCheckoutPanel: (p: { period: string; initialChildUids: string[]; parentEmail: string | null; onBack: () => void }) => (
    <div>
      <span>{`checkout:${p.period}:${p.initialChildUids.join(',')}:${p.parentEmail}`}</span>
      <button type="button" onClick={p.onBack}>back</button>
    </div>
  ),
}));
vi.mock('./ProPaymentReturn', () => ({
  ProPaymentReturn: (p: { isCancelled: boolean; activatedNames: readonly string[] | null; onDismiss: () => void }) => (
    <div>
      <span>{`return:${p.isCancelled}:${p.activatedNames ? p.activatedNames.join('|') : 'waiting'}`}</span>
      <button type="button" onClick={p.onDismiss}>dismiss</button>
    </div>
  ),
}));
vi.mock('./MockPaymentPage', () => ({ MockPaymentPage: () => <div>mock payment</div> }));

const DAY_MS = 24 * 60 * 60 * 1000;
const CHECKOUT_ID = 'a'.repeat(32);
const USER = { uid: 'parent-1', email: 'parent@example.com' } as User;
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
    </div>
  );
}

beforeEach(() => {
  mocks.entitlements = {};
  mocks.changeProPlan.mockReset();
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
    expect(screen.queryByText(/picker:/)).not.toBeInTheDocument();
  });

  it('waits for every child\'s plan before offering the plans', () => {
    mocks.entitlements = { c1: null };
    render(<Harness links={[NOA, ITAY]} />);

    expect(screen.getByText('נועה:free')).toBeInTheDocument();
    expect(screen.getByText('איתי:loading')).toBeInTheDocument();
    expect(screen.queryByText(/picker:/)).not.toBeInTheDocument();
  });

  it('starts the plan picker at the number of children who can join', () => {
    mocks.entitlements = { c1: null, c2: null };
    render(<Harness links={[NOA, ITAY]} />);

    expect(screen.getByText('picker:2')).toBeInTheDocument();
  });

  it('offers no plans once every child has Pro', () => {
    mocks.entitlements = { c1: plan(), c2: plan() };
    render(<Harness links={[NOA, ITAY]} />);

    expect(screen.getByText('נועה:plan')).toBeInTheDocument();
    expect(screen.queryByText(/picker:/)).not.toBeInTheDocument();
  });

  it('offers no plans while the children are still loading', () => {
    render(<Harness links={null} />);

    expect(screen.queryByText(/picker:/)).not.toBeInTheDocument();
  });
});

describe('useParentPro checkout', () => {
  it('goes to checkout for the first children who can join, and back to the picker', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: null, c2: null };
    render(<Harness links={[NOA, ITAY]} />);

    await user.click(screen.getByRole('button', { name: 'continue one' }));
    expect(screen.getByText('checkout:yearly:c1:parent@example.com')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'back' }));
    expect(screen.getByText('picker:2')).toBeInTheDocument();
  });

  it('puts the child picked from a card first at checkout', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: null, c2: null };
    render(<Harness links={[NOA, ITAY]} />);

    await user.click(screen.getByRole('button', { name: 'upgrade איתי' }));
    expect(onError).toHaveBeenCalledWith(null);
    expect(screen.getByText('picker:1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'continue two' }));
    expect(screen.getByText('checkout:monthly:c2,c1:parent@example.com')).toBeInTheDocument();
  });

  it('opens a yearly renewal for everyone on the same plan', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: plan({ billingPeriod: 'yearly', periodEnd: Date.now() + 3 * DAY_MS }), c2: null };
    render(<Harness links={[NOA, ITAY]} />);

    await user.click(screen.getByRole('button', { name: 'renew נועה' }));

    expect(screen.getByText('checkout:yearly:c1:parent@example.com')).toBeInTheDocument();
  });

  it('ignores a renewal request from a child who is not on a plan', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: null };
    render(<Harness links={[NOA]} />);

    await user.click(screen.getByRole('button', { name: 'renew נועה' }));

    expect(screen.queryByText(/checkout:/)).not.toBeInTheDocument();
  });
});

describe('useParentPro plan changes', () => {
  it('cancels the renewal and tells the parent', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: plan() };
    mocks.changeProPlan.mockResolvedValue({ ok: true, value: undefined });
    render(<Harness links={[NOA]} />);

    await user.click(screen.getByRole('button', { name: 'cancel נועה' }));

    expect(mocks.changeProPlan).toHaveBeenCalledWith('cancel', 's1', undefined);
    expect(onNotice).toHaveBeenCalledWith(expect.stringContaining('החידוש בוטל'));
  });

  it('adds a free child to the paying parent\'s open plan', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: plan(), c2: null };
    mocks.changeProPlan.mockResolvedValue({ ok: true, value: undefined });
    render(<Harness links={[NOA, ITAY]} />);

    await user.click(screen.getByRole('button', { name: 'add איתי' }));

    expect(mocks.changeProPlan).toHaveBeenCalledWith('addChild', 's1', 'c2');
    expect(onNotice).toHaveBeenCalledWith(expect.stringContaining('נוסף/ה למנוי'));
  });

  it('removes a child from a plan that goes on for the others', async () => {
    const user = userEvent.setup();
    mocks.entitlements = { c1: plan(), c2: plan() };
    mocks.changeProPlan.mockResolvedValue({ ok: true, value: undefined });
    render(<Harness links={[NOA, ITAY]} />);

    await user.click(screen.getByRole('button', { name: 'remove איתי' }));

    expect(mocks.changeProPlan).toHaveBeenCalledWith('removeChild', 's1', 'c2');
    expect(onNotice).toHaveBeenCalledWith(expect.stringContaining('הוצא/ה מהמנוי'));
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

  it('shows a cancelled payment, and dismissing it clears the address', async () => {
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
});
