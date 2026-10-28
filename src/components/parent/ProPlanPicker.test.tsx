import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { buildWhatsAppChatUrl, ProPlanPicker } from './ProPlanPicker';

const priceBox = () => screen.getByTestId('pro-price-box');
/** Intl puts direction marks and a no-break space around ₪; compare on plain text */
const plain = (text: string | null) => (text ?? '').replace(/[\u200e\u200f\u00a0]/g, ' ').replace(/\s+/g, ' ');

describe('ProPlanPicker', () => {
  it('starts on the yearly plan for one child', () => {
    render(<ProPlanPicker theme={TEST_THEME} />);

    expect(screen.getByRole('radio', { name: /שנתי/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('ילד אחד')).toBeInTheDocument();
    const box = plain(priceBox().textContent);
    expect(box).toContain('349 ₪ לשנה');
    expect(box).toContain('29.08 ₪ לחודש');
    expect(box).toContain('חוסכים 119 ₪ בשנה');
  });

  it('updates the price and the per-child rate with the counter', async () => {
    const user = userEvent.setup();
    render(<ProPlanPicker theme={TEST_THEME} />);

    await user.click(screen.getByRole('button', { name: 'עוד ילד' }));

    expect(screen.getByText('2 ילדים')).toBeInTheDocument();
    const box = plain(priceBox().textContent);
    expect(box).toContain('569 ₪ לשנה');
    expect(box).toContain('47.42 ₪ לחודש');
    expect(box).toContain('23.71 ₪ לחודש לכל ילד');
    expect(box).toContain('חוסכים 199 ₪ בשנה');
  });

  it('shows the monthly charge and what a yearly plan would save', async () => {
    const user = userEvent.setup();
    render(<ProPlanPicker theme={TEST_THEME} initialChildren={4} />);

    await user.click(screen.getByRole('radio', { name: 'חודשי' }));

    const box = plain(priceBox().textContent);
    expect(box).toContain('114 ₪ לחודש');
    expect(box).toContain('28.50 ₪ לחודש לכל ילד');
    expect(box).toContain('במנוי שנתי חוסכים 369 ₪ בשנה');
    expect(within(priceBox()).queryByText(/^כ-.*לחודש$/)).not.toBeInTheDocument();
  });

  it('stays within 1 to 4 children and points to WhatsApp past 4', async () => {
    const user = userEvent.setup();
    render(<ProPlanPicker theme={TEST_THEME} initialChildren={9} />);
    expect(screen.getByText('4 ילדים')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'עוד ילד' }));

    expect(screen.getByText('4 ילדים')).toBeInTheDocument();
    const whatsApp = screen.getByRole('link', { name: /יותר מ-4 ילדים/ });
    expect(whatsApp).toHaveFocus();
    expect(whatsApp).toHaveAttribute('target', '_blank');
    expect(decodeURIComponent(whatsApp.getAttribute('href') ?? '')).toContain('אשמח לקבל פרטים על חבילה מורחבת!');

    for (let i = 0; i < 4; i += 1) await user.click(screen.getByRole('button', { name: 'פחות ילדים' }));
    expect(screen.getByText('ילד אחד')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'פחות ילדים' })).toBeDisabled();
  });

  it('shows the reassurance line, and the continue button only when checkout is wired', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ProPlanPicker theme={TEST_THEME} />);
    expect(screen.getByText(/אפשר לבטל בכל עת/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'המשך לתשלום' })).not.toBeInTheDocument();

    const onContinue = vi.fn();
    rerender(<ProPlanPicker theme={TEST_THEME} initialChildren={3} onContinue={onContinue} />);
    await user.click(screen.getByRole('button', { name: 'המשך לתשלום' }));

    expect(onContinue).toHaveBeenCalledWith({ children: 1, period: 'yearly' });
  });
});

describe('buildWhatsAppChatUrl', () => {
  it('opens a chat with our number, or the chat picker without one', () => {
    expect(buildWhatsAppChatUrl('+972 50-123-4567', 'שלום')).toBe(`https://wa.me/972501234567?text=${encodeURIComponent('שלום')}`);
    expect(buildWhatsAppChatUrl('', 'hi')).toBe('https://wa.me/?text=hi');
  });
});
