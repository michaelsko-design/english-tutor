import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import type { ChildProStatus, OpenPlan } from '../../data/proPlanStatus';
import type { CancelQuote } from '../../services/proBillingService';
import { ChildProSection } from './ChildProSection';

const PERIOD_END = Date.UTC(2026, 10, 28, 12);

type PlanStatus = Extract<ChildProStatus, { kind: 'plan' }>;

const MONTHLY_END: CancelQuote = { mode: 'monthly_end', refundAgorot: 0, accessUntil: PERIOD_END };

const monthly = (overrides: Partial<PlanStatus> = {}): ChildProStatus => ({
  kind: 'plan',
  subscriptionId: 'sub1',
  period: 'monthly',
  periodEnd: PERIOD_END,
  isRenewing: true,
  isPastDue: false,
  hasSeat: true,
  hasLeftPlan: false,
  isPayer: true,
  shouldOfferRenewal: false,
  canRemove: false,
  ...overrides,
});

function renderSection(status: ChildProStatus | undefined, openPlan: OpenPlan | null = null, quote: CancelQuote | null = MONTHLY_END, canStartTrial = false) {
  const handlers = {
    onUpgrade: vi.fn(),
    onStartTrial: vi.fn(),
    onRenew: vi.fn(),
    onCancelRenewal: vi.fn(),
    onLoadCancelQuote: vi.fn(async (): Promise<CancelQuote | null> => quote),
    onCancelWithRefund: vi.fn(),
    onAddToPlan: vi.fn(),
    onRemoveFromPlan: vi.fn(),
  };
  render(<ChildProSection childName="נועה" status={status} openPlan={openPlan} theme={TEST_THEME} isBusy={false} canStartTrial={canStartTrial} {...handlers} />);
  return { ...handlers, user: userEvent.setup() };
}

describe('ChildProSection', () => {
  it('offers a child who never had Pro a free week, and starts it', async () => {
    const { user, onStartTrial } = renderSection({ kind: 'free' }, null, MONTHLY_END, true);
    expect(screen.getByText(/בלי כרטיס אשראי ובלי התחייבות/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'שבוע Pro חינם לנועה' }));
    expect(onStartTrial).toHaveBeenCalled();
  });

  it('offers no free week to a child who had Pro', () => {
    renderSection({ kind: 'free' });
    expect(screen.queryByRole('button', { name: /שבוע Pro חינם/ })).toBeNull();
  });

  it('shows a running free week with its end, and the upgrade', async () => {
    const { user, onUpgrade } = renderSection({ kind: 'trial', endsAt: PERIOD_END, hasEnded: false });
    expect(screen.getByTestId('child-pro-status')).toHaveTextContent('שבוע חינם, עד');
    expect(screen.getByTestId('child-pro-status')).toHaveTextContent('בלי חיוב');
    await user.click(screen.getByRole('button', { name: /שדרוג ל-/ }));
    expect(onUpgrade).toHaveBeenCalled();
  });

  it('tells the parent, not the child, that the week ended, with the upgrade', () => {
    renderSection({ kind: 'trial', endsAt: PERIOD_END, hasEnded: true });
    expect(screen.getByTestId('child-pro-status')).toHaveTextContent('החינמי הסתיים');
    expect(screen.getByRole('button', { name: /שדרוג ל-/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /שבוע Pro חינם/ })).toBeNull();
  });

  it('offers a free child an upgrade', async () => {
    const { user, onUpgrade } = renderSection({ kind: 'free' });
    await user.click(screen.getByRole('button', { name: /שדרוג ל-/ }));
    expect(onUpgrade).toHaveBeenCalled();
  });

  it('adds a free child to the open monthly plan only after the parent confirms the new monthly charge', async () => {
    const { user, onAddToPlan } = renderSection({ kind: 'free' }, { subscriptionId: 'sub1', period: 'monthly', nextMonthlyAgorot: 6400 });
    await user.click(screen.getByRole('button', { name: /הוספה למנוי שלי \(.*64/ }));
    expect(onAddToPlan).not.toHaveBeenCalled();
    expect(screen.getByText(/החיוב החודשי בהוראת הקבע יהיה .*64/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /כן, להוסיף/ }));
    expect(onAddToPlan).toHaveBeenCalled();
  });

  it('fills a paid yearly seat without a price step', async () => {
    const { user, onAddToPlan } = renderSection({ kind: 'free' }, { subscriptionId: 'sub1', period: 'yearly', nextMonthlyAgorot: null });
    await user.click(screen.getByRole('button', { name: 'הוספה למנוי השנתי שלי' }));
    expect(onAddToPlan).toHaveBeenCalled();
  });

  it('cancels a monthly renewal only after the quote and a confirmation', async () => {
    const { user, onCancelRenewal, onLoadCancelQuote } = renderSection(monthly());
    expect(screen.getByTestId('child-pro-status')).toHaveTextContent('מנוי חודשי, מתחדש ב-28 בנובמבר 2026');
    await user.click(screen.getByRole('button', { name: 'ביטול החידוש או המנוי' }));
    expect(onLoadCancelQuote).toHaveBeenCalled();
    expect(onCancelRenewal).not.toHaveBeenCalled();
    expect(await screen.findByText(/לא יהיו חיובים נוספים/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'כן, לבטל את החידוש' }));
    expect(onCancelRenewal).toHaveBeenCalled();
  });

  it('offers the full refund within 14 days, or stopping the renewal only', async () => {
    const quote: CancelQuote = { mode: 'full_refund', refundAgorot: 3900, accessUntil: Date.now() };
    const { user, onCancelWithRefund } = renderSection(monthly(), null, quote);
    await user.click(screen.getByRole('button', { name: 'ביטול החידוש או המנוי' }));
    expect(await screen.findByText(/יוחזר לכם כל הסכום, .*39/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'רק לבטל את החידוש, בלי החזר' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'ביטול והחזר מלא' }));
    expect(onCancelWithRefund).toHaveBeenCalled();
  });

  it('lets the payer cancel a yearly plan, showing the refund by the formula', async () => {
    const quote: CancelQuote = { mode: 'yearly_prorata', refundAgorot: 19300, accessUntil: PERIOD_END };
    const { user, onCancelWithRefund } = renderSection(monthly({ period: 'yearly', isRenewing: false }), null, quote);
    await user.click(screen.getByRole('button', { name: 'ביטול המנוי' }));
    expect(await screen.findByText(/יוחזרו לכם .*193/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /לבטל את החידוש/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /ביטול והחזר של .*193/ }));
    expect(onCancelWithRefund).toHaveBeenCalled();
  });

  it('explains that a yearly plan with nothing left to refund gets no refund, with no cancel button', async () => {
    const quote: CancelQuote = { mode: 'yearly_prorata', refundAgorot: 0, accessUntil: PERIOD_END };
    const { user } = renderSection(monthly({ period: 'yearly', isRenewing: false }), null, quote);
    await user.click(screen.getByRole('button', { name: 'ביטול המנוי' }));
    expect(await screen.findByText(/אין סכום להחזר/)).toBeInTheDocument();
    expect(screen.queryByText(/התשיעי/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /ביטול והחזר/ })).not.toBeInTheDocument();
  });

  it('shows a yearly plan cancelled mid-year as cancelled, until its end', () => {
    renderSection(monthly({ period: 'yearly', isRenewing: false, hasSeat: false }));
    expect(screen.getByTestId('child-pro-status')).toHaveTextContent('המנוי השנתי בוטל, בתוקף עד');
  });

  it('tells a parent who cancels again that the refund was already requested', async () => {
    const quote: CancelQuote = { mode: 'none', refundAgorot: 0, accessUntil: PERIOD_END, reason: 'already_requested' };
    const { user } = renderSection(monthly({ period: 'yearly', isRenewing: false, hasSeat: false }), null, quote);
    await user.click(screen.getByRole('button', { name: 'ביטול המנוי' }));
    expect(await screen.findByText(/המנוי כבר בוטל, וביקשתם החזר/)).toBeInTheDocument();
    expect(screen.queryByText(/אין במנוי הזה מה לבטל/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /ביטול והחזר/ })).not.toBeInTheDocument();
  });

  it('closes the cancel panel when the quote cannot be loaded', async () => {
    const { user } = renderSection(monthly(), null, null);
    await user.click(screen.getByRole('button', { name: 'ביטול החידוש או המנוי' }));
    expect(screen.queryByTestId('cancel-plan-panel')).not.toBeInTheDocument();
  });

  it('removes a child from a shared plan only after confirming', async () => {
    const { user, onRemoveFromPlan } = renderSection(monthly({ canRemove: true }));
    await user.click(screen.getByRole('button', { name: 'הוצאה מהמנוי' }));
    expect(screen.getByText(/להוציא את נועה מהמנוי/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'כן, להוציא' }));
    expect(onRemoveFromPlan).toHaveBeenCalled();
  });

  it('gives a parent who does not pay no controls', () => {
    renderSection(monthly({ isPayer: false }));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText(/ההורה ששילם/)).toBeInTheDocument();
  });

  it('shows the yearly renew notice', async () => {
    const { user, onRenew } = renderSection(monthly({ period: 'yearly', isRenewing: false, shouldOfferRenewal: true }));
    expect(screen.getByText(/ולא מתחדש לבד/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'חידוש לשנה נוספת' }));
    expect(onRenew).toHaveBeenCalled();
  });

  it('warns about a failed charge', () => {
    renderSection(monthly({ isPastDue: true }));
    expect(screen.getByRole('alert')).toHaveTextContent('החיוב האחרון לא עבר');
  });
});
