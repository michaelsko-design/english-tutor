import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { quoteProPrice } from '../../config/proTier';
import { TEST_THEME } from '../../test/fixtures';
import { ProPriceTeaser } from './ProPriceTeaser';

describe('ProPriceTeaser', () => {
  it('shows the one-child yearly and monthly prices from the price table', () => {
    render(<ProPriceTeaser theme={TEST_THEME} />);
    const teaser = screen.getByTestId('pro-price-teaser');
    const shekels = (period: 'monthly' | 'yearly') => String(quoteProPrice(1, period)!.chargeAgorot / 100);
    expect(teaser).toHaveTextContent(new RegExp(`${shekels('yearly')}\\D+לשנה`));
    expect(teaser).toHaveTextContent(new RegExp(`${shekels('monthly')}\\D+בתשלום חודשי`));
  });

  it('states how each plan renews and is cancelled', () => {
    render(<ProPriceTeaser theme={TEST_THEME} />);
    expect(screen.getByText(/לא מתחדש מעצמו/)).toBeInTheDocument();
    expect(screen.getByText(/אפשר לבטל בכל עת/)).toBeInTheDocument();
  });

  it('lists Bit first among the yearly payment methods', () => {
    render(<ProPriceTeaser theme={TEST_THEME} />);
    expect(screen.getByTestId('pro-price-teaser')).toHaveTextContent('תשלום ב-Bit, Apple Pay, Google Pay או בכרטיס אשראי');
  });
});
