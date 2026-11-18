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
const FIVE_CHILDREN = [...CHILDREN, link('kid3', 'מאיה'), link('kid4', 'יואב'), link('kid5', 'שירה')];

interface PanelOptions {
  initialChildUids?: string[];
  period?: 'monthly' | 'yearly';
  examByChild?: Record<string, ExamPitch | null>;
  parentName?: string | null;
  children?: ParentLink[];
}

function renderPanel({ initialChildUids = ['kid1'], period = 'yearly', examByChild, parentName = null, children = CHILDREN }: PanelOptions = {}) {
  const onNavigate = vi.fn();
  render(
    <ProCheckoutPanel
      theme={TEST_THEME}
      initialPeriod={period}
      eligibleChildren={children}
      initialChildUids={initialChildUids}
      parentEmail="parent@example.com"
      parentName={parentName}
      examByChild={examByChild}
      onNavigate={onNavigate}
    />
  );
  return { onNavigate, user: userEvent.setup() };
}

const priceBox = () => screen.getByTestId('pro-price-box');
/** Intl puts direction marks and a no-break space around ₪; compare on plain text */
const plain = (text: string | null) => (text ?? '').replace(/[\u200e\u200f\u00a0]/g, ' ').replace(/\s+/g, ' ');
const PAYER_NAME_LABEL = /שם מלא של המשלם\/ת/;
const PHONE_LABEL = /טלפון נייד/;
const payButton = () => screen.getByRole('button', { name: 'המשך לתשלום' });

async function fillAndPay(user: ReturnType<typeof userEvent.setup>, name = 'דנה כהן', phone = '0501234567') {
  if (name) await user.type(screen.getByLabelText(PAYER_NAME_LABEL), name);
  await user.type(screen.getByLabelText(PHONE_LABEL), phone);
  await user.click(screen.getByRole('checkbox', { name: /תנאי השימוש/ }));
  await user.click(payButton());
}

describe('ProCheckoutPanel plan and price', () => {
  beforeEach(() => {
    billing.startProCheckout.mockReset();
    funnel.trackFunnel.mockReset();
  });

  it('starts on the yearly plan with the children it was given ticked', () => {
    renderPanel();
    expect(screen.getByRole('radio', { name: /שנתי/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('checkbox', { name: /נועה/ })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: /איתי/ })).not.toBeChecked();
    const box = plain(priceBox().textContent);
    expect(box).toContain('סה״כ לילד אחד');
    expect(box).toContain('349 ₪ לשנה');
    expect(box).toContain('29.08 ₪ לחודש');
    expect(box).toContain('חוסכים 119 ₪ בשנה');
  });

  it('prices the ticked children, with the per-child rate', async () => {
    const { user } = renderPanel();
    await user.click(screen.getByRole('checkbox', { name: /איתי/ }));
    const box = plain(priceBox().textContent);
    expect(box).toContain('סה״כ ל-2 ילדים');
    expect(box).toContain('569 ₪ לשנה');
    expect(box).toContain('23.71 ₪ לחודש לכל ילד');
  });

  it('shows the monthly charge and what a yearly plan would save', async () => {
    const { user } = renderPanel({ initialChildUids: ['kid1', 'kid2', 'kid3', 'kid4'], children: FIVE_CHILDREN });
    await user.click(screen.getByRole('radio', { name: 'חודשי' }));
    const box = plain(priceBox().textContent);
    expect(box).toContain('114 ₪ לחודש');
    expect(box).toContain('28.50 ₪ לחודש לכל ילד');
    expect(box).toContain('במנוי שנתי חוסכים 369 ₪ בשנה');
  });

  it('says which payment methods each plan takes: card only for monthly, Bit and wallets first on yearly', async () => {
    const { user } = renderPanel();
    expect(priceBox()).toHaveTextContent('תשלום ב-Bit, Apple Pay, Google Pay או בכרטיס אשראי');
    await user.click(screen.getByRole('radio', { name: 'חודשי' }));
    expect(priceBox()).toHaveTextContent('תשלום בכרטיס אשראי בלבד');
    expect(priceBox()).not.toHaveTextContent('Bit');
  });

  it('tells how each plan renews', async () => {
    const { user } = renderPanel();
    expect(priceBox()).toHaveTextContent('לא מתחדש מעצמו');
    await user.click(screen.getByRole('radio', { name: 'חודשי' }));
    expect(priceBox()).toHaveTextContent('מתחדש כל חודש עד שמבטלים');
  });

  it('allows up to 4 children and offers WhatsApp to a parent with more', async () => {
    const { user } = renderPanel({ initialChildUids: ['kid1', 'kid2', 'kid3', 'kid4', 'kid5'], children: FIVE_CHILDREN });
    expect(screen.getByRole('checkbox', { name: /שירה/ })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: /שירה/ })).toBeDisabled();
    const whatsApp = screen.getByRole('link', { name: /יותר מ-4 ילדים/ });
    expect(decodeURIComponent(whatsApp.getAttribute('href') ?? '')).toContain('אשמח לקבל פרטים על חבילה מורחבת!');

    await user.click(screen.getByRole('checkbox', { name: /נועה/ }));
    expect(screen.getByRole('checkbox', { name: /שירה/ })).toBeEnabled();
  });

  it('has no WhatsApp offer for up to 4 children', () => {
    renderPanel();
    expect(screen.queryByRole('link', { name: /יותר מ-4 ילדים/ })).not.toBeInTheDocument();
  });

  it('cannot pay with no child ticked', () => {
    renderPanel({ initialChildUids: [] });
    expect(screen.getByTestId('pro-checkout-total')).toHaveTextContent('בחרו לפחות ילד אחד');
    expect(payButton()).toBeDisabled();
  });
});

describe('ProCheckoutPanel payer and payment', () => {
  beforeEach(() => {
    billing.startProCheckout.mockReset();
    funnel.trackFunnel.mockReset();
  });

  it('marks the name and phone as required, and not the email', () => {
    renderPanel();
    for (const label of [PAYER_NAME_LABEL, PHONE_LABEL]) {
      const input = screen.getByLabelText(label);
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input.closest('label')).toHaveTextContent('*');
    }
    const email = screen.getByLabelText(/אימייל לקבלה/);
    expect(email).not.toHaveAttribute('aria-required');
    expect(email.closest('label')).not.toHaveTextContent('*');
  });

  it('fills in the payer name from the Google account when it is a full name', () => {
    renderPanel({ parentName: '  Dana   Cohen ' });
    expect(screen.getByLabelText(PAYER_NAME_LABEL)).toHaveValue('Dana Cohen');
  });

  it.each([null, 'Dana', 'dana_c 123'])('leaves the payer name empty for the Google name %s', (parentName) => {
    renderPanel({ parentName });
    expect(screen.getByLabelText(PAYER_NAME_LABEL)).toHaveValue('');
  });

  it('asks for a full name and an Israeli mobile before calling the server', async () => {
    const { user } = renderPanel();
    await fillAndPay(user, 'דנה', '0501234567');
    expect(screen.getByRole('alert')).toHaveTextContent('שם פרטי ושם משפחה');
    await user.type(screen.getByLabelText(PAYER_NAME_LABEL), ' כהן');
    await user.clear(screen.getByLabelText(PHONE_LABEL));
    await user.type(screen.getByLabelText(PHONE_LABEL), '031234567');
    await user.click(payButton());
    expect(screen.getByRole('alert')).toHaveTextContent('מספר נייד');
    expect(billing.startProCheckout).not.toHaveBeenCalled();
    expect(funnel.trackFunnel).not.toHaveBeenCalled();
  });

  it('sends the chosen plan, children and payer, counts the step and opens the payment page', async () => {
    billing.startProCheckout.mockResolvedValue({ ok: true, value: 'https://pay.example/page' });
    const { user, onNavigate } = renderPanel();
    await user.click(screen.getByRole('radio', { name: 'חודשי' }));
    await user.click(screen.getByRole('checkbox', { name: /איתי/ }));
    await fillAndPay(user, '  דנה   כהן ', '050-123 4567');
    expect(billing.startProCheckout).toHaveBeenCalledWith({
      childUids: ['kid1', 'kid2'],
      period: 'monthly',
      payerName: 'דנה כהן',
      payerPhone: '0501234567',
      payerEmail: 'parent@example.com',
      acceptedTerms: true,
    });
    expect(funnel.trackFunnel).toHaveBeenCalledWith('pro_checkout_submit');
    expect(onNavigate).toHaveBeenCalledWith('https://pay.example/page');
  });

  it('shows the server error and stays on the form', async () => {
    billing.startProCheckout.mockResolvedValue({ ok: false, errorHe: 'לאחד הילדים כבר יש Pro.' });
    const { user, onNavigate } = renderPanel();
    await fillAndPay(user);
    expect(await screen.findByRole('alert')).toHaveTextContent('כבר יש Pro');
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('cannot pay until the parent accepts the terms, with links to the terms and privacy pages', async () => {
    const { user } = renderPanel();
    const consent = screen.getByRole('checkbox', { name: /תנאי השימוש/ });
    expect(consent).not.toBeChecked();
    expect(payButton()).toBeDisabled();
    expect(screen.getByRole('link', { name: 'תנאי השימוש והמנוי' })).toHaveAttribute('href', '/terms/');
    expect(screen.getByRole('link', { name: 'מדיניות הפרטיות' })).toHaveAttribute('href', '/privacy/');
    await user.click(consent);
    expect(payButton()).toBeEnabled();
  });

  it('asks a monthly payer, and only a monthly payer, to agree to retries of a failed charge', async () => {
    const { user } = renderPanel();
    expect(screen.getByRole('checkbox', { name: /תנאי השימוש/ })).not.toHaveAccessibleName(expect.stringContaining('עד 10 ימים'));
    await user.click(screen.getByRole('radio', { name: 'חודשי' }));
    expect(screen.getByRole('checkbox', { name: /תנאי השימוש/ })).toHaveAccessibleName(expect.stringContaining('עד 10 ימים'));
  });

  it('leads with the exam of a ticked child, and not of a child left out', async () => {
    const future = new Date(Date.now() + 9 * 86_400_000);
    const examDateStr = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}`;
    const { user } = renderPanel({ examByChild: { kid1: null, kid2: { examDateStr, listCount: 0 } } });
    expect(screen.queryByText(/להתכונן למבחן/)).not.toBeInTheDocument();
    await user.click(screen.getByRole('checkbox', { name: /איתי/ }));
    expect(screen.getByText(/להתכונן למבחן באנגלית של איתי/)).toBeInTheDocument();
  });

  it('keeps the plain headline with no exam', () => {
    renderPanel();
    expect(screen.queryByText(/📅/)).not.toBeInTheDocument();
  });
});
