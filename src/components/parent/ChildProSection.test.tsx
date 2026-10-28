import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import type { ChildProStatus, OpenPlan } from '../../data/proPlanStatus';
import { ChildProSection } from './ChildProSection';

const PERIOD_END = Date.UTC(2026, 10, 28, 12);

type PlanStatus = Extract<ChildProStatus, { kind: 'plan' }>;

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

function renderSection(status: ChildProStatus | undefined, openPlan: OpenPlan | null = null) {
  const handlers = { onUpgrade: vi.fn(), onRenew: vi.fn(), onCancelRenewal: vi.fn(), onAddToPlan: vi.fn(), onRemoveFromPlan: vi.fn() };
  render(<ChildProSection childName="נועה" status={status} openPlan={openPlan} theme={TEST_THEME} isBusy={false} {...handlers} />);
  return { ...handlers, user: userEvent.setup() };
}

describe('ChildProSection', () => {
  it('offers a free child an upgrade', async () => {
    const { user, onUpgrade } = renderSection({ kind: 'free' });
    await user.click(screen.getByRole('button', { name: /שדרוג ל-/ }));
    expect(onUpgrade).toHaveBeenCalled();
  });

  it('adds a free child to the open monthly plan, showing its new price', async () => {
    const { user, onAddToPlan } = renderSection({ kind: 'free' }, { subscriptionId: 'sub1', period: 'monthly', nextMonthlyAgorot: 6400 });
    await user.click(screen.getByRole('button', { name: /הוספה למנוי שלי \(.*64/ }));
    expect(onAddToPlan).toHaveBeenCalled();
  });

  it('cancels a monthly renewal only after confirming', async () => {
    const { user, onCancelRenewal } = renderSection(monthly());
    expect(screen.getByTestId('child-pro-status')).toHaveTextContent('מנוי חודשי, מתחדש ב-28 בנובמבר 2026');
    await user.click(screen.getByRole('button', { name: 'ביטול החידוש' }));
    expect(onCancelRenewal).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'כן, לבטל את החידוש' }));
    expect(onCancelRenewal).toHaveBeenCalled();
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
