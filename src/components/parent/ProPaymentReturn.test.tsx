import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { ProPaymentReturn } from './ProPaymentReturn';

const SLOW_CONFIRMATION_MS = 60_000;

function renderReturn(props: { isCancelled?: boolean; activatedNames?: readonly string[] | null; onDismiss?: () => void } = {}) {
  const onDismiss = props.onDismiss ?? vi.fn();
  render(
    <ProPaymentReturn
      theme={TEST_THEME}
      isCancelled={props.isCancelled ?? false}
      activatedNames={props.activatedNames ?? null}
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
});
