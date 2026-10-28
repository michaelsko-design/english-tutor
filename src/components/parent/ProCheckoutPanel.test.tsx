import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import type { ParentLink } from '../../data/parentLink';
import { ProCheckoutPanel } from './ProCheckoutPanel';

const billing = vi.hoisted(() => ({ startProCheckout: vi.fn() }));
vi.mock('../../services/proBillingService', () => billing);

const link = (childUid: string, childName: string): ParentLink => ({
  parentUid: 'p1',
  childUid,
  childName,
  childAvatar: '🐱',
  inviteCode: 'ABCD2345',
  linkedAt: '2026-10-01T00:00:00Z',
});
const CHILDREN = [link('kid1', 'נועה'), link('kid2', 'איתי')];

function renderPanel(initialChildUids = ['kid1']) {
  const onNavigate = vi.fn();
  render(
    <ProCheckoutPanel
      theme={TEST_THEME}
      period="monthly"
      eligibleChildren={CHILDREN}
      initialChildUids={initialChildUids}
      parentEmail="parent@example.com"
      onBack={vi.fn()}
      onNavigate={onNavigate}
    />
  );
  return { onNavigate, user: userEvent.setup() };
}

describe('ProCheckoutPanel', () => {
  it('prices the ticked children', async () => {
    const { user } = renderPanel();
    expect(screen.getByTestId('pro-checkout-total')).toHaveTextContent('39');
    await user.click(screen.getByRole('checkbox', { name: /איתי/ }));
    expect(screen.getByTestId('pro-checkout-total')).toHaveTextContent('64');
  });

  it('asks for a full name and an Israeli mobile before calling the server', async () => {
    const { user } = renderPanel();
    await user.type(screen.getByLabelText('שם מלא של המשלם/ת'), 'דנה');
    await user.click(screen.getByRole('button', { name: 'המשך לתשלום' }));
    expect(screen.getByRole('alert')).toHaveTextContent('שם פרטי ושם משפחה');
    await user.type(screen.getByLabelText('שם מלא של המשלם/ת'), ' כהן');
    await user.type(screen.getByLabelText('טלפון נייד'), '031234567');
    await user.click(screen.getByRole('button', { name: 'המשך לתשלום' }));
    expect(screen.getByRole('alert')).toHaveTextContent('מספר נייד');
    expect(billing.startProCheckout).not.toHaveBeenCalled();
  });

  it('sends the choice and opens the payment page', async () => {
    billing.startProCheckout.mockResolvedValue({ ok: true, value: 'https://pay.example/page' });
    const { user, onNavigate } = renderPanel();
    await user.type(screen.getByLabelText('שם מלא של המשלם/ת'), '  דנה   כהן ');
    await user.type(screen.getByLabelText('טלפון נייד'), '050-123 4567');
    await user.click(screen.getByRole('button', { name: 'המשך לתשלום' }));
    expect(billing.startProCheckout).toHaveBeenCalledWith({
      childUids: ['kid1'],
      period: 'monthly',
      payerName: 'דנה כהן',
      payerPhone: '0501234567',
      payerEmail: 'parent@example.com',
    });
    expect(onNavigate).toHaveBeenCalledWith('https://pay.example/page');
  });

  it('shows the server error and stays on the form', async () => {
    billing.startProCheckout.mockResolvedValue({ ok: false, errorHe: 'לאחד הילדים כבר יש Pro.' });
    const { user, onNavigate } = renderPanel();
    await user.type(screen.getByLabelText('שם מלא של המשלם/ת'), 'דנה כהן');
    await user.type(screen.getByLabelText('טלפון נייד'), '0501234567');
    await user.click(screen.getByRole('button', { name: 'המשך לתשלום' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('כבר יש Pro');
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('cannot continue with no child ticked', () => {
    renderPanel([]);
    expect(screen.getByRole('button', { name: 'המשך לתשלום' })).toBeDisabled();
  });
});
