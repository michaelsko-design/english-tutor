import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MissionNode } from '../data/curriculum';
import { CURRICULUM_BY_GRADE } from '../test/curriculum';
import { getExercisesForMission } from '../data/missionExercises';
import { GradeId, ProficiencyTier } from '../types/learner';
import { TIER_FIXTURE_MISSION } from '../data/testing/tierFixture';
import { answerCorrectly, answerWrongly } from '../test/drillAnswers';
import { TEST_THEME } from '../test/fixtures';
import { MissionRunner } from './MissionRunner';

const firstMission = (gradeId: GradeId): MissionNode => CURRICULUM_BY_GRADE[gradeId].units[0].missions[0];

function renderRunner(mission: MissionNode, tier: ProficiencyTier = 'challenger') {
  const handlers = { onCompleteMission: vi.fn(), onClose: vi.fn(), onChangeTier: vi.fn() };
  render(
    <MissionRunner
      mission={mission}
      tier={tier}
      gender="girl"
      learnerName="נועה"
      theme={TEST_THEME}
      onSpeakEnglish={() => {}}
      isTierChosen
      // A replay: no mini-lesson first
      previousStars={1}
      startXp={0}
      startLevel={1}
      {...handlers}
    />
  );
  return handlers;
}

describe('MissionRunner', () => {
  beforeEach(() => {
    // The per-attempt shuffle salt comes from Math.random: 0 makes it match getExercisesForMission(..., 0)
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each(['grade-1', 'grade-3'] as const)('plays a %s mission through to 3 stars', async (gradeId) => {
    const user = userEvent.setup();
    const mission = firstMission(gradeId);
    const steps = getExercisesForMission(mission, 'challenger', 'girl', 0);
    const { onCompleteMission } = renderRunner(mission);

    for (const step of steps) {
      await answerCorrectly(user, step);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: /לשלב הבא|סיום משימה/ }));
    }
    await user.click(await screen.findByRole('button', { name: /איסוף פרסים/ }));

    expect(onCompleteMission).toHaveBeenCalledTimes(1);
    expect(onCompleteMission).toHaveBeenCalledWith(
      expect.objectContaining({ missionId: mission.id, starsEarned: 3, isVoiceSkipped: true })
    );
  });

  it('a mission with a missed first try finishes with fewer than 3 stars', async () => {
    const user = userEvent.setup();
    const mission = firstMission('grade-1');
    const steps = getExercisesForMission(mission, 'challenger', 'girl', 0);
    const { onCompleteMission } = renderRunner(mission);

    await answerWrongly(user, steps[0]);
    await user.click(screen.getByRole('button', { name: 'נסי שוב' }));
    for (const [index, step] of steps.entries()) {
      await answerCorrectly(user, step);
      await user.click(screen.getByRole('button', { name: index === steps.length - 1 ? /סיום משימה/ : /לשלב הבא/ }));
    }
    await user.click(await screen.findByRole('button', { name: /איסוף פרסים/ }));

    const [result] = onCompleteMission.mock.calls[0] as [{ starsEarned: number }];
    expect(result.starsEarned).toBeLessThan(3);
  });

  it('a wrong answer shows the try-again sheet, and the step can be answered again', async () => {
    const user = userEvent.setup();
    const mission = firstMission('grade-1');
    const [step] = getExercisesForMission(mission, 'challenger', 'girl', 0);
    renderRunner(mission);

    await answerWrongly(user, step);
    expect(screen.getByRole('alert')).toHaveTextContent('לא נכון.');
    await user.click(screen.getByRole('button', { name: 'נסי שוב' }));
    await answerCorrectly(user, step);

    expect(screen.getByRole('alert')).toHaveTextContent('נכון!');
    expect(screen.getByRole('button', { name: 'לשלב הבא' })).toBeInTheDocument();
  });

  it('Master: the comma is a chip, and it has to be in the right place', async () => {
    const user = userEvent.setup();
    const tiers = TIER_FIXTURE_MISSION.drillSeed!.tiers!;
    const mission: MissionNode = {
      ...TIER_FIXTURE_MISSION,
      drillSeed: {
        ...TIER_FIXTURE_MISSION.drillSeed!,
        tiers: { ...tiers, master: { ...tiers.master, sentenceEn: 'If it rains, we stay at home.' } },
      },
    };
    const [spell, sentence] = getExercisesForMission(mission, 'master', 'girl', 0);
    renderRunner(mission, 'master');

    await answerCorrectly(user, spell);
    await user.click(screen.getByRole('button', { name: /לשלב הבא/ }));

    // The right words without the comma are not enough
    const bank = () => within(screen.getByLabelText('בנק המילים'));
    for (const word of ['If', 'it', 'rains', 'we', 'stay', 'at', 'home']) {
      await user.click(bank().getByRole('button', { name: new RegExp(`^${word}$`) }));
    }
    await user.click(screen.getByRole('button', { name: /בדיקת משפט/ }));
    expect(screen.getByRole('alert')).toHaveTextContent('לא נכון.');
    await user.click(screen.getByRole('button', { name: 'נסי שוב' }));

    // Cleared and built again with the comma after "rains"
    await user.click(screen.getByRole('button', { name: /איפוס/ }));
    await answerCorrectly(user, sentence);
    expect(screen.getByRole('alert')).toHaveTextContent('נכון!');
  });

  it('Challenger: the Hebrew sentence hint opens itself after the first wrong answer', async () => {
    const user = userEvent.setup();
    const mission = firstMission('grade-3');
    const [step] = getExercisesForMission(mission, 'challenger', 'girl', 0);
    renderRunner(mission);
    expect(step.hintAfterWrongHe).toBeTruthy();
    expect(screen.queryByRole('note', { name: 'רמז' })).not.toBeInTheDocument();

    await answerWrongly(user, step);
    await user.click(screen.getByRole('button', { name: 'נסי שוב' }));

    expect(screen.getByRole('note', { name: 'רמז' })).toHaveTextContent((step.hintAfterWrongHe ?? '').replace('💡 ', ''));
  });

  it('leaves the mission from the exit button and with Escape', async () => {
    const user = userEvent.setup();
    const { onClose, onCompleteMission } = renderRunner(firstMission('grade-1'));

    await user.click(screen.getByRole('button', { name: 'יציאה מהמשימה' }));
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onCompleteMission).not.toHaveBeenCalled();
  });
});
