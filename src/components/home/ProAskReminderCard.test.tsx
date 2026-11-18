import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { ASK_RESEND_AFTER_MS, readLastAsk, rememberAsk } from '../../data/proAsk';
import { toLocalDateStr } from '../../utils/dates';
import { ProAskReminderCard } from './ProAskReminderCard';

const onResend = vi.fn();
const TWO_DAYS_AGO = Date.now() - ASK_RESEND_AFTER_MS - 60_000;

beforeEach(() => {
  window.localStorage.clear();
  onResend.mockReset();
});

function renderCard(hasPro = false) {
  render(<ProAskReminderCard uid="child-1" theme={TEST_THEME} hasPro={hasPro} onResend={onResend} />);
  return userEvent.setup();
}

describe('ProAskReminderCard', () => {
  it('offers to send an unanswered ask again, with its focus', async () => {
    rememberAsk('child-1', toLocalDateStr(new Date(TWO_DAYS_AGO)), { focus: 'exam', nowMs: TWO_DAYS_AGO });
    const user = renderCard();
    await user.click(screen.getByRole('button', { name: 'לשלוח שוב' }));
    expect(onResend).toHaveBeenCalledWith('exam');
    expect(screen.queryByRole('region', { name: 'לשלוח שוב להורים' })).not.toBeInTheDocument();
  });

  it('stays away once closed', async () => {
    rememberAsk('child-1', toLocalDateStr(new Date(TWO_DAYS_AGO)), { nowMs: TWO_DAYS_AGO });
    const user = renderCard();
    await user.click(screen.getByRole('button', { name: 'סגירה' }));
    expect(screen.queryByRole('region', { name: 'לשלוח שוב להורים' })).not.toBeInTheDocument();
    expect(readLastAsk('child-1')?.dismissedAtMs).toBeDefined();
  });

  it('does not show with Pro on, for a fresh ask, or with no ask', () => {
    rememberAsk('child-1', toLocalDateStr(new Date(TWO_DAYS_AGO)), { nowMs: TWO_DAYS_AGO });
    renderCard(true);
    expect(screen.queryByRole('region', { name: 'לשלוח שוב להורים' })).not.toBeInTheDocument();

    window.localStorage.clear();
    renderCard();
    rememberAsk('child-1', toLocalDateStr(new Date()));
    renderCard();
    expect(screen.queryByRole('region', { name: 'לשלוח שוב להורים' })).not.toBeInTheDocument();
  });
});
