import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { AnalyticsOptOutCard } from './AnalyticsOptOutCard';

describe('AnalyticsOptOutCard', () => {
  it('is on by default and switches the counters off', async () => {
    const onProfileChange = vi.fn();
    render(<AnalyticsOptOutCard profile={makeProfile()} theme={TEST_THEME} onProfileChange={onProfileChange} />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'true');

    await userEvent.setup().click(toggle);

    expect(onProfileChange).toHaveBeenCalledWith(expect.objectContaining({ isAnalyticsOptedOut: true }));
  });

  it('shows off after an opt-out and switches back on', async () => {
    const onProfileChange = vi.fn();
    render(
      <AnalyticsOptOutCard
        profile={makeProfile({ isAnalyticsOptedOut: true })}
        theme={TEST_THEME}
        onProfileChange={onProfileChange}
      />
    );
    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    await userEvent.setup().click(toggle);

    expect(onProfileChange).toHaveBeenCalledWith(expect.objectContaining({ isAnalyticsOptedOut: false }));
  });
});
