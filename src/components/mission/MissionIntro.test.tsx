import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { MissionNode } from '../../data/curriculum';
import { getLoadedGrade, loadGradeCurriculum } from '../../data/curriculum/loader';
import { HebrewAudioContext } from '../../data/hebrewAudio';
import { TEST_THEME } from '../../test/fixtures';
import { TIER_CONFIG } from '../../themes/themeRegistry';
import { MissionIntro, type LessonOffer } from './MissionIntro';

vi.mock('../companion/Companion', () => ({ Companion: () => <span>companion</span> }));

let mission: MissionNode;
const fns = { onChangeTier: vi.fn(), onOpenLesson: vi.fn(), onStart: vi.fn(), onClose: vi.fn() };

beforeAll(async () => {
  await loadGradeCurriculum('grade-3');
  mission = getLoadedGrade('grade-3')!.units[0].missions[0];
});

beforeEach(() => Object.values(fns).forEach((fn) => fn.mockClear()));

function setup(props: { lessonOffer?: LessonOffer; gender?: 'girl' | 'boy'; readsHebrew?: boolean; boss?: boolean } = {}) {
  render(
    <HebrewAudioContext.Provider value={props.readsHebrew ?? false}>
      <MissionIntro
        mission={props.boss ? { ...mission, isBoss: true } : mission}
        stepCount={5}
        tier="explorer"
        gender={props.gender ?? 'girl'}
        theme={TEST_THEME}
        lessonOffer={props.lessonOffer ?? 'none'}
        {...fns}
      />
    </HebrewAudioContext.Provider>
  );
  return userEvent.setup();
}

describe('MissionIntro', () => {
  it('introduces the mission with its unit, number, title and length', () => {
    setup();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`יחידה ${mission.unitNumber} · משימה ${mission.missionNumber}`))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`5 שלבים · כ-${mission.estimatedMinutes} דקות`))).toBeInTheDocument();
  });

  it('marks a boss mission', () => {
    setup({ boss: true });
    expect(screen.getByText(/משימת בוס/)).toBeInTheDocument();
  });

  it('adds a minute and a note when the lesson opens by itself', () => {
    setup({ lessonOffer: 'auto' });
    expect(screen.getByText(/שיעור קצרצר \+/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`כ-${mission.estimatedMinutes + 1} דקות`))).toBeInTheDocument();
  });

  it('offers the lesson as a reminder on a replay', async () => {
    const user = setup({ lessonOffer: 'optional' });
    await user.click(screen.getByRole('button', { name: /תזכורת קצרה לפני שמתחילים/ }));
    expect(fns.onOpenLesson).toHaveBeenCalledTimes(1);
  });

  it('offers no lesson button otherwise', () => {
    setup({ lessonOffer: 'none' });
    expect(screen.queryByRole('button', { name: /תזכורת קצרה/ })).not.toBeInTheDocument();
  });

  it('starts the mission, in the learner’s gender', async () => {
    const user = setup({ gender: 'boy' });
    await user.click(screen.getByRole('button', { name: /בוא נתחיל/ }));
    expect(fns.onStart).toHaveBeenCalledTimes(1);
  });

  it('lets the learner pick another tier', async () => {
    const user = setup();
    await user.click(screen.getAllByRole('button', { name: new RegExp(TIER_CONFIG.master.labelHe) })[0]);
    expect(fns.onChangeTier).toHaveBeenCalledWith('master');
  });

  it('reads the title and story aloud in the early grades', () => {
    setup({ readsHebrew: true });
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('closes the mission', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'יציאה מהמשימה' }));
    expect(fns.onClose).toHaveBeenCalledTimes(1);
  });
});
