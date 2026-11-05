import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { paymentReturnUrl } from '../../data/parentProRoute';
import { TEST_THEME } from '../../test/fixtures';
import { MockPaymentPage } from './MockPaymentPage';

const { payMockCheckout } = vi.hoisted(() => ({ payMockCheckout: vi.fn() }));
vi.mock('../../services/proBillingService', () => ({ payMockCheckout }));

const CHECKOUT_ID = 'checkout-123';

function renderPage() {
  const onNavigate = vi.fn();
  render(<MockPaymentPage checkoutId={CHECKOUT_ID} theme={TEST_THEME} onNavigate={onNavigate} />);
  return { onNavigate };
}

beforeEach(() => {
  payMockCheckout.mockReset();
});

describe('MockPaymentPage', () => {
  it('says plainly that nothing is charged', () => {
    renderPage();

    expect(screen.getByRole('region', { name: 'דף תשלום לבדיקה' })).toHaveTextContent('אין כאן חיוב');
  });

  it('pays the mock checkout and returns to the portal', async () => {
    const user = userEvent.setup();
    payMockCheckout.mockResolvedValue({ ok: true, value: undefined });
    const { onNavigate } = renderPage();

    await user.click(screen.getByRole('button', { name: 'תשלום לבדיקה' }));

    expect(payMockCheckout).toHaveBeenCalledWith(CHECKOUT_ID);
    expect(onNavigate).toHaveBeenCalledExactlyOnceWith(paymentReturnUrl(CHECKOUT_ID));
  });

  it('shows the error and lets the parent try again when paying fails', async () => {
    const user = userEvent.setup();
    payMockCheckout.mockResolvedValue({ ok: false, errorHe: 'התשלום נכשל' });
    const { onNavigate } = renderPage();

    await user.click(screen.getByRole('button', { name: 'תשלום לבדיקה' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('התשלום נכשל');
    expect(screen.getByRole('button', { name: 'תשלום לבדיקה' })).toBeEnabled();
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('returns to the portal as cancelled without paying', async () => {
    const user = userEvent.setup();
    const { onNavigate } = renderPage();

    await user.click(screen.getByRole('button', { name: 'ביטול' }));

    expect(payMockCheckout).not.toHaveBeenCalled();
    expect(onNavigate).toHaveBeenCalledExactlyOnceWith(paymentReturnUrl(CHECKOUT_ID, true));
  });
});
