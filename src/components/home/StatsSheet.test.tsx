import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import type { LearnerProfile } from '../../types/learner';
import { StatsSheet } from './StatsSheet';

const fns = {
  onChangeGrade: vi.fn(),
  onOpenShop: vi.fn(),
  onOpenVault: vi.fn(),
  onOpenPlacement: vi.fn(),
  onOpenTour: vi.fn(),
  onEditProfile: vi.fn(),
  onClose: vi.fn(),
};

function setup(profile: LearnerProfile = makeProfile({ gender: 'girl' })) {
  render(<StatsSheet profile={profile} theme={TEST_THEME} avatarEmoji="🦊" missionsCompleted={7} masteredWords={31} {...fns} />);
  return userEvent.setup();
}

beforeEach(() => Object.values(fns).forEach((fn) => fn.mockClear()));

describe('StatsSheet', () => {
  it('shows the learner’s name, level and the stat tiles', () => {
    setup(makeProfile({ name: 'נועה', stats: { stars: 12 } as never }));
    expect(screen.getByRole('dialog', { name: 'הנתונים שלי' })).toBeInTheDocument();
    expect(screen.getByText('נועה')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText(/31 מילים/)).toBeInTheDocument();
  });

  it('opens the shop from the diamonds tile and the vault from the words tile', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: new RegExp(TEST_THEME.currencyNameHe) }));
    await user.click(screen.getByRole('button', { name: /מאגר המילים/ }));
    expect(fns.onOpenShop).toHaveBeenCalledTimes(1);
    expect(fns.onOpenVault).toHaveBeenCalledTimes(1);
  });

  it('changes the grade, with every grade offered', async () => {
    const user = setup(makeProfile({ gradeId: 'grade-1' }));
    const select = screen.getByRole('combobox');
    expect(select.querySelectorAll('option')).toHaveLength(12);
    await user.selectOptions(select, 'grade-5');
    expect(fns.onChangeGrade).toHaveBeenCalledWith('grade-5');
  });

  it('shows the Shabbat shield unless the learner turned it off', () => {
    setup();
    expect(screen.getByText(/מגן שבת פעיל/)).toBeInTheDocument();
  });

  it('hides the Shabbat shield for a learner who does not observe Shabbat', () => {
    setup(makeProfile({ isShabbatObserver: false }));
    expect(screen.queryByText(/מגן שבת פעיל/)).not.toBeInTheDocument();
  });

  it('offers the placement test, the tour and the settings', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /לא בטוחה באיזו רמה/ }));
    await user.click(screen.getByRole('button', { name: /סיור באפליקציה/ }));
    await user.click(screen.getByRole('button', { name: /פרופיל, עיצוב והגדרות/ }));
    expect(fns.onOpenPlacement).toHaveBeenCalledTimes(1);
    expect(fns.onOpenTour).toHaveBeenCalledTimes(1);
    expect(fns.onEditProfile).toHaveBeenCalledTimes(1);
  });

  it('offers a repeat placement test after one was taken', () => {
    setup(
      makeProfile({
        placementResult: { recommendedGradeId: 'grade-1', recommendedTier: 'explorer', correctCount: 5, totalCount: 10, completedAt: '2026-11-01T00:00:00.000Z' } as never,
      })
    );
    expect(screen.getByRole('button', { name: /מבחן רמה חוזר/ })).toBeInTheDocument();
  });

  it('uses masculine copy for a boy', () => {
    setup(makeProfile({ gender: 'boy' }));
    expect(screen.getByRole('button', { name: /לא בטוח באיזו רמה/ })).toBeInTheDocument();
  });

  it('closes', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /סגירה|סגור/ }));
    expect(fns.onClose).toHaveBeenCalledTimes(1);
  });
});
