import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { buildContestSteps, ContestDoc, createContest } from '../../data/contests';
import { answerCorrectly, TestUser } from '../../test/drillAnswers';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { ContestRunner } from './ContestRunner';

const NOW = new Date('2026-10-20T10:00:00');
const profile = makeProfile({ gradeId: 'grade-3' });
const contest: ContestDoc = createContest(
  { uid: 'me', displayName: 'Noa' },
  { uid: 'friend', displayName: 'Dana' },
  NOW,
  () => 0.42
);
const steps = buildContestSteps(profile.gradeId, contest, profile.gender);

function renderContest() {
  const handlers = { onFinish: vi.fn(), onClose: vi.fn() };
  render(
    <ContestRunner
      contest={contest}
      friendName="Dana"
      profile={profile}
      theme={TEST_THEME}
      onSpeakEnglish={() => {}}
      {...handlers}
    />
  );
  return handlers;
}

async function answerAndContinue(user: TestUser, stepIdx: number) {
  await answerCorrectly(user, steps[stepIdx]);
  await user.click(screen.getByRole('button', { name: /לשאלה הבאה|סיום האתגר/ }));
}

describe('ContestRunner', () => {
  it('has both meaning and sentence questions', () => {
    expect(steps.some((s) => s.kind === 'meaning')).toBe(true);
    expect(steps.some((s) => s.kind === 'sentence')).toBe(true);
  });

  it('plays every question and finishes with all answers right and the time', async () => {
    const user = userEvent.setup();
    const { onFinish } = renderContest();

    for (let i = 0; i < steps.length; i++) await answerAndContinue(user, i);

    expect(onFinish).toHaveBeenCalledTimes(1);
    const [answers, timeMs] = onFinish.mock.calls[0];
    expect(answers).toEqual(steps.map(() => true));
    expect(timeMs).toBeGreaterThanOrEqual(0);
  });

  it('leaving before the first answer just closes', async () => {
    const user = userEvent.setup();
    const { onClose, onFinish } = renderContest();

    await user.click(screen.getByRole('button', { name: 'סגירה' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onFinish).not.toHaveBeenCalled();
  });

  it('leaving after an answer ends the contest, the rest counted wrong', async () => {
    const user = userEvent.setup();
    const { onClose, onFinish } = renderContest();
    await answerAndContinue(user, 0);

    await user.click(screen.getByRole('button', { name: 'סגירה' }));
    expect(screen.getByRole('alert')).toHaveTextContent('האתגר יסתיים');
    await user.click(screen.getByRole('button', { name: 'לסיים עכשיו' }));

    expect(onClose).not.toHaveBeenCalled();
    expect(onFinish.mock.calls[0][0]).toEqual(steps.map((_, i) => i === 0));
  });
});
