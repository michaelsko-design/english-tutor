import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { QuestRing } from '../../data/homeBase';
import { TEST_THEME } from '../../test/fixtures';
import { QuestRings } from './QuestRings';

const ring = (over: Partial<QuestRing>): QuestRing =>
  ({ id: 'q', titleHe: 'משימה', icon: '🎯', current: 0, target: 3, ratio: 0, state: 'progress', ...over }) as QuestRing;
const onOpen = vi.fn();

function setup(rings: QuestRing[]) {
  render(<QuestRings rings={rings} theme={TEST_THEME} onOpen={onOpen} />);
  return userEvent.setup();
}

describe('QuestRings', () => {
  it('describes each ring for a screen reader and counts the finished ones', () => {
    setup([
      ring({ id: 'a', titleHe: 'ראשון', current: 1, target: 3, ratio: 0.33 }),
      ring({ id: 'b', titleHe: 'שני', current: 3, target: 3, ratio: 1, state: 'ready' }),
      ring({ id: 'c', titleHe: 'שלישי', current: 3, target: 3, ratio: 1, state: 'claimed' }),
    ]);
    const label = screen.getByRole('button').getAttribute('aria-label')!;
    expect(label).toContain('2 מתוך 3 הושלמו');
    expect(label).toContain('ראשון: 1 מתוך 3');
    expect(label).toContain('שני: הושלם, הפרס מחכה');
    expect(label).toContain('שלישי: הושלם והפרס נאסף');
  });

  it('shows how many are done when no reward is waiting', () => {
    setup([ring({ id: 'a', state: 'claimed', ratio: 1, current: 3 }), ring({ id: 'b' })]);
    expect(screen.getByText('1/2 הושלמו היום')).toBeInTheDocument();
  });

  it('announces one waiting reward', () => {
    setup([ring({ id: 'a', state: 'ready', ratio: 1, current: 3 })]);
    expect(screen.getByText(/פרס מחכה לכם – לחצו לאיסוף/)).toBeInTheDocument();
  });

  it('announces several waiting rewards', () => {
    setup([ring({ id: 'a', state: 'ready', ratio: 1, current: 3 }), ring({ id: 'b', state: 'ready', ratio: 1, current: 3 })]);
    expect(screen.getByText(/2 פרסים מחכים/)).toBeInTheDocument();
  });

  it('opens the quests card when tapped', async () => {
    const user = setup([ring({})]);
    await user.click(screen.getByRole('button'));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
