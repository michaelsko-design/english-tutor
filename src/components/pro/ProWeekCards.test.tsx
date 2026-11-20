import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { ProWeekCard } from './ProWeekCards';

const NOW = Date.UTC(2026, 10, 20, 12);

describe('ProWeekCard', () => {
  beforeEach(() => localStorage.clear());

  it('shows a calm line with the end date while the week runs, and no ask or offer', () => {
    render(<ProWeekCard uid="kid1" state={{ kind: 'on', endsAt: NOW }} theme={TEST_THEME} readsHebrewAloud={false} />);
    const card = screen.getByRole('region', { name: 'שבוע Pro' });
    expect(card).toHaveTextContent('במתנה מההורים');
    expect(card).toHaveTextContent('(עד');
    expect(card.textContent).not.toMatch(/לבקש|לשדרג|נשארו/);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('says once that the week ended and progress is kept', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<ProWeekCard uid="kid1" state={{ kind: 'ended', endsAt: NOW }} theme={TEST_THEME} readsHebrewAloud={false} />);
    expect(screen.getByRole('region', { name: 'שבוע Pro הסתיים' })).toHaveTextContent('כל ההתקדמות שלך נשמרה');

    await user.click(screen.getByRole('button', { name: 'הבנתי' }));
    expect(screen.queryByRole('region', { name: 'שבוע Pro הסתיים' })).toBeNull();
    unmount();

    render(<ProWeekCard uid="kid1" state={{ kind: 'ended', endsAt: NOW }} theme={TEST_THEME} readsHebrewAloud={false} />);
    expect(screen.queryByRole('region', { name: 'שבוע Pro הסתיים' })).toBeNull();
  });

  it('reads aloud for grades 1–2', () => {
    render(<ProWeekCard uid="kid1" state={{ kind: 'on', endsAt: NOW }} theme={TEST_THEME} readsHebrewAloud />);
    expect(screen.getByRole('button', { name: 'הקשבה' })).toBeInTheDocument();
  });
});
