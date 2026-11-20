import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { ProPaymentReturn } from './ProPaymentReturn';
import type { PaidPlan } from './TransactionSummary';

const SLOW_CONFIRMATION_MS = 60_000;

function renderReturn(
  props: { isCancelled?: boolean; activatedNames?: readonly string[] | null; paidPlan?: PaidPlan | null; onDismiss?: () => void } = {}
) {
  const onDismiss = props.onDismiss ?? vi.fn();
  render(
    <ProPaymentReturn
      theme={TEST_THEME}
      isCancelled={props.isCancelled ?? false}
      activatedNames={props.activatedNames ?? null}
      paidPlan={props.paidPlan ?? null}
      onDismiss={onDismiss}
    />
  );
  return { onDismiss };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('ProPaymentReturn', () => {
  it('tells the parent a canceled payment charged nothing, and can be dismissed', async () => {
    const user = userEvent.setup();
    const { onDismiss } = renderReturn({ isCancelled: true });

    expect(screen.getByRole('status')).toHaveTextContent('התשלום בוטל ולא בוצע חיוב');
    await user.click(screen.getByRole('button', { name: 'סגירה' }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('shows that the payment is being confirmed, with no way to close it yet', () => {
    renderReturn();

    expect(screen.getByRole('status')).toHaveTextContent('מאשרים את התשלום');
    expect(screen.queryByRole('button', { name: 'סגירה' })).not.toBeInTheDocument();
  });

  it('says the payment is still being checked after a minute, and warns not to pay twice', () => {
    vi.useFakeTimers();
    renderReturn();

    act(() => {
      vi.advanceTimersByTime(SLOW_CONFIRMATION_MS - 1);
    });
    expect(screen.getByRole('status')).toHaveTextContent('מאשרים את התשלום');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole('status')).toHaveTextContent('אין צורך לשלם שוב');
    expect(screen.getByRole('button', { name: 'סגירה' })).toBeInTheDocument();
  });

  it.each([
    [['נועה'], 'עבור נועה.'],
    [['נועה', 'איתי'], 'עבור נועה ו-איתי.'],
    [['נועה', 'איתי', 'Dan'], 'עבור נועה, איתי ו-Dan.'],
  ])('thanks the parent and names who has Pro: %j', async (names, fragment) => {
    const user = userEvent.setup();
    const { onDismiss } = renderReturn({ activatedNames: names });

    expect(screen.getByRole('status')).toHaveTextContent('תודה!');
    expect(screen.getByRole('status')).toHaveTextContent(fragment);
    await user.click(screen.getByRole('button', { name: 'סגירה' }));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('stops waiting once the plan is active', () => {
    vi.useFakeTimers();
    renderReturn({ activatedNames: ['נועה'] });

    act(() => {
      vi.advanceTimersByTime(SLOW_CONFIRMATION_MS * 2);
    });

    expect(screen.getByRole('status')).not.toHaveTextContent('עדיין בבדיקה');
  });

  it('shows the transaction summary with the price, renewal and cancellation rights, to save or print', async () => {
    const user = userEvent.setup();
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    renderReturn({ activatedNames: ['נועה'], paidPlan: { period: 'monthly', seats: 1, periodEnd: Date.UTC(2026, 11, 19) } });

    const summary = screen.getByTestId('transaction-summary');
    expect(summary).toHaveTextContent('סיכום עסקה ופרטי ביטול');
    expect(summary).toHaveTextContent('39');
    expect(summary).toHaveTextContent('מתחדש כל חודש');
    expect(summary).toHaveTextContent('ביטול בתוך 14 יום מהיום: החזר מלא');
    expect(summary).toHaveTextContent('310720370');
    expect(screen.getByRole('link', { name: 'ביטול עסקה' })).toHaveAttribute('href', '/refunds/#cancel');
    await user.click(screen.getByRole('button', { name: 'שמירה או הדפסה' }));
    expect(print).toHaveBeenCalled();
    print.mockRestore();
  });

  it('shows no summary until the plan is known', () => {
    renderReturn({ activatedNames: ['נועה'] });
    expect(screen.queryByTestId('transaction-summary')).not.toBeInTheDocument();
  });
});
