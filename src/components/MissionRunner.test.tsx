import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CURRICULUM_BY_GRADE, MissionNode } from '../data/curriculum';
import { getExercisesForMission } from '../data/missionExercises';
import { GradeId } from '../types/learner';
import { answerCorrectly, answerWrongly } from '../test/drillAnswers';
import { TEST_THEME } from '../test/fixtures';
import { MissionRunner } from './MissionRunner';

const firstMission = (gradeId: GradeId): MissionNode => CURRICULUM_BY_GRADE[gradeId].units[0].missions[0];

function renderRunner(mission: MissionNode) {
  const handlers = { onCompleteMission: vi.fn(), onClose: vi.fn(), onChangeTier: vi.fn() };
  render(
    <MissionRunner
      mission={mission}
      tier="challenger"
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

  it('leaves the mission from the exit button and with Escape', async () => {
    const user = userEvent.setup();
    const { onClose, onCompleteMission } = renderRunner(firstMission('grade-1'));

    await user.click(screen.getByRole('button', { name: 'יציאה מהמשימה' }));
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(2);
    expect(onCompleteMission).not.toHaveBeenCalled();
  });
});
