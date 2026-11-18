import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import type { ParentLink } from '../../data/parentLink';
import type { ExamPitch } from '../../data/examPitch';
import { ProCheckoutPanel } from './ProCheckoutPanel';

const billing = vi.hoisted(() => ({ startProCheckout: vi.fn() }));
vi.mock('../../services/proBillingService', () => billing);
const funnel = vi.hoisted(() => ({ trackFunnel: vi.fn() }));
vi.mock('../../services/analytics/funnel', () => funnel);

const link = (childUid: string, childName: string): ParentLink => ({
  parentUid: 'p1',
  childUid,
  childName,
  childAvatar: '🐱',
  inviteCode: 'ABCD2345',
  linkedAt: '2026-10-01T00:00:00Z',
});
const CHILDREN = [link('kid1', 'נועה'), link('kid2', 'איתי')];

function renderPanel(
  initialChildUids = ['kid1'],
  period: 'monthly' | 'yearly' = 'monthly',
  examByChild?: Record<string, ExamPitch | null>,
  parentName: string | null = null
) {
  const onNavigate = vi.fn();
  render(
    <ProCheckoutPanel
      theme={TEST_THEME}
      period={period}
      eligibleChildren={CHILDREN}
      initialChildUids={initialChildUids}
      parentEmail="parent@example.com"
      parentName={parentName}
      examByChild={examByChild}
      onBack={vi.fn()}
      onNavigate={onNavigate}
    />
  );
  return { onNavigate, user: userEvent.setup() };
}

describe('ProCheckoutPanel', () => {
  beforeEach(() => {
    billing.startProCheckout.mockReset();
    funnel.trackFunnel.mockReset();
  });

  it('fills in the payer name from the Google account when it is a full name', () => {
    renderPanel(['kid1'], 'monthly', undefined, '  Dana   Cohen ');
    expect(screen.getByLabelText('שם מלא של המשלם/ת')).toHaveValue('Dana Cohen');
  });

  it.each([null, 'Dana', 'dana_c 123'])('leaves the payer name empty for the Google name %s', (parentName) => {
    renderPanel(['kid1'], 'monthly', undefined, parentName);
    expect(screen.getByLabelText('שם מלא של המשלם/ת')).toHaveValue('');
  });

  it('counts the submit step only once the details pass the checks', async () => {
    billing.startProCheckout.mockResolvedValue({ ok: true, value: 'https://pay.example/page' });
    const { user } = renderPanel(['kid1'], 'monthly', undefined, 'דנה כהן');
    await user.click(screen.getByRole('checkbox', { name: /תנאי השימוש/ }));
    await user.click(screen.getByRole('button', { name: 'המשך לתשלום' }));
    expect(funnel.trackFunnel).not.toHaveBeenCalled();
    await user.type(screen.getByLabelText('טלפון נייד'), '0501234567');
    await user.click(screen.getByRole('button', { name: 'המשך לתשלום' }));
    expect(funnel.trackFunnel).toHaveBeenCalledWith('pro_checkout_submit');
  });

  it('prices the ticked children', async () => {
    const { user } = renderPanel();
    expect(screen.getByTestId('pro-checkout-total')).toHaveTextContent('39');
    await user.click(screen.getByRole('checkbox', { name: /איתי/ }));
    expect(screen.getByTestId('pro-checkout-total')).toHaveTextContent('64');
  });

  it('tells the parent a monthly plan is paid by card only', () => {
    renderPanel();
    expect(screen.getByText('תשלום בכרטיס אשראי בלבד')).toBeInTheDocument();
  });

  it('asks for a full name and an Israeli mobile before calling the server', async () => {
    const { user } = renderPanel();
    await user.click(screen.getByRole('checkbox', { name: /תנאי השימוש/ }));
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
    await user.click(screen.getByRole('checkbox', { name: /תנאי השימוש/ }));
    await user.click(screen.getByRole('button', { name: 'המשך לתשלום' }));
    expect(billing.startProCheckout).toHaveBeenCalledWith({
      childUids: ['kid1'],
      period: 'monthly',
      payerName: 'דנה כהן',
      payerPhone: '0501234567',
      payerEmail: 'parent@example.com',
      acceptedTerms: true,
    });
    expect(onNavigate).toHaveBeenCalledWith('https://pay.example/page');
  });

  it('shows the server error and stays on the form', async () => {
    billing.startProCheckout.mockResolvedValue({ ok: false, errorHe: 'לאחד הילדים כבר יש Pro.' });
    const { user, onNavigate } = renderPanel();
    await user.type(screen.getByLabelText('שם מלא של המשלם/ת'), 'דנה כהן');
    await user.type(screen.getByLabelText('טלפון נייד'), '0501234567');
    await user.click(screen.getByRole('checkbox', { name: /תנאי השימוש/ }));
    await user.click(screen.getByRole('button', { name: 'המשך לתשלום' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('כבר יש Pro');
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('cannot continue until the parent accepts the terms, with links to the terms and privacy pages', async () => {
    const { user } = renderPanel();
    const consent = screen.getByRole('checkbox', { name: /תנאי השימוש/ });
    expect(consent).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'המשך לתשלום' })).toBeDisabled();
    expect(screen.getByRole('link', { name: 'תנאי השימוש והמנוי' })).toHaveAttribute('href', '/terms/');
    expect(screen.getByRole('link', { name: 'מדיניות הפרטיות' })).toHaveAttribute('href', '/privacy/');
    await user.click(consent);
    expect(screen.getByRole('button', { name: 'המשך לתשלום' })).toBeEnabled();
  });

  it('asks a monthly payer to agree to retries of a failed charge, and tells them how renewal works', () => {
    renderPanel();
    expect(screen.getByRole('checkbox', { name: /תנאי השימוש/ })).toHaveAccessibleName(expect.stringContaining('עד 10 ימים'));
    expect(screen.getByText(/מתחדש כל חודש עד שמבטלים/)).toBeInTheDocument();
  });

  it('tells a yearly payer the plan does not renew by itself, with no retry consent', () => {
    renderPanel(['kid1'], 'yearly');
    expect(screen.getByRole('checkbox', { name: /תנאי השימוש/ })).not.toHaveAccessibleName(expect.stringContaining('עד 10 ימים'));
    expect(screen.getByText(/לא מתחדש מעצמו/)).toBeInTheDocument();
  });

  it('cannot continue with no child ticked', () => {
    renderPanel([]);
    expect(screen.getByRole('button', { name: 'המשך לתשלום' })).toBeDisabled();
  });

  it('leads with the exam of a ticked child, and not of a child left out', async () => {
    const future = new Date(Date.now() + 9 * 86_400_000);
    const examDateStr = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}`;
    const { user } = renderPanel(['kid1'], 'monthly', { kid1: null, kid2: { examDateStr, listCount: 0 } });
    expect(screen.queryByText(/להתכונן למבחן/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: /איתי/ }));
    expect(screen.getByText(/להתכונן למבחן באנגלית של איתי/)).toBeInTheDocument();
  });

  it('keeps the plain headline with no exam', () => {
    renderPanel();
    expect(screen.queryByText(/📅/)).not.toBeInTheDocument();
  });
});
