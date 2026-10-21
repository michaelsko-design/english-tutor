import React from 'react';

interface VibeAmountProps {
  amount: number;
  /** Shows "+" in front of the number (a gain) */
  hasPlus?: boolean;
}

/**
 * A Vibe amount in a Hebrew screen: the word sits to the left of its number, so the number comes
 * first when read right to left. The number and the word are isolated so the plus sign stays in front.
 */
export const VibeAmount: React.FC<VibeAmountProps> = ({ amount, hasPlus = false }) => (
  <bdi dir="rtl">
    <bdi dir="ltr">
      {hasPlus ? '+' : ''}
      {amount}
    </bdi>{' '}
    <bdi dir="ltr" lang="en">
      Vibe
    </bdi>
  </bdi>
);
