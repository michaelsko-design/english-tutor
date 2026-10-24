import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadExamBank } from '../../data/examBank';
import { buildExamPlan, buildMockExamSteps, buildSessionSteps, EXAM_SKILLS, getUnitOptions } from '../../data/examPrep';
import { answerCorrectly, answerWrongly } from '../../test/drillAnswers';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { ExamPlanDay } from '../../types/learner';
import { ExamSessionRunner } from './ExamSessionRunner';
import { preloadCurriculum } from '../../test/curriculum';

// These tests read the loaded grades (the app loads them per grade, see the loader)
await preloadCurriculum();

const profile = makeProfile({ gradeId: 'grade-5', preferredTier: 'challenger' });
const plan = buildExamPlan({
  gradeId: 'grade-5',
  examDateStr: '2026-10-25',
  unitNumbers: [getUnitOptions('grade-5')[0].unitNumber],
  skills: [...EXAM_SKILLS],
  todayStr: '2026-10-20',
  isShabbatObserver: false,
  createdAt: '2026-10-20T10:00:00.000Z',
});
const practiceDay = plan.days.find((d) => d.kind === 'practice')!;
const mockDay = plan.days.find((d) => d.kind === 'mock')!;

function renderSession(day: ExamPlanDay) {
  const handlers = { onFinish: vi.fn(), onClose: vi.fn() };
  render(
    <ExamSessionRunner plan={plan} day={day} profile={profile} theme={TEST_THEME} onSpeakEnglish={() => {}} {...handlers} />
  );
  return handlers;
}

describe('ExamSessionRunner', () => {
  beforeEach(() => {
    // The runner's per-run salt comes from Math.random: 0 lets the test build the same questions
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runs a practice session to the results and saves it', async () => {
    const user = userEvent.setup();
    const bank = await loadExamBank(plan.gradeId);
    const steps = buildSessionSteps(plan, practiceDay, profile.preferredTier, profile.gender, 0, bank);
    const { onFinish } = renderSession(practiceDay);
    await screen.findByRole('dialog', { name: 'תרגול למבחן' });

    for (const step of steps) {
      await answerCorrectly(user, step);
      await user.click(screen.getByRole('button', { name: /לשאלה הבאה|לתוצאות/ }));
    }
    await user.click(await screen.findByRole('button', { name: 'שמירה וחזרה לתוכנית' }));

    expect(onFinish).toHaveBeenCalledTimes(1);
    const [answers, next] = onFinish.mock.calls[0];
    expect(next).toBe('plan');
    expect(answers).toHaveLength(steps.length);
    expect(answers.every((a: { isCorrect: boolean }) => a.isCorrect)).toBe(true);
  });

  it('the mock exam locks a wrong answer and shows the right one', async () => {
    const user = userEvent.setup();
    const bank = await loadExamBank(plan.gradeId);
    const [first] = buildMockExamSteps(plan, profile.preferredTier, profile.gender, 0, bank);
    renderSession(mockDay);
    await screen.findByRole('dialog', { name: 'סימולציית מבחן' });

    await answerWrongly(user, first);

    expect(screen.getByRole('alert')).toHaveTextContent(/התשובה הנכונה/);
    expect(screen.getByRole('button', { name: /לשאלה הבאה/ })).toBeInTheDocument();
    for (const option of screen.getAllByRole('button', { name: /תשובה (נכונה|שגויה)/ })) {
      expect(option).toBeDisabled();
    }
  });

  it('closes from the close button', async () => {
    const user = userEvent.setup();
    const { onClose } = renderSession(practiceDay);

    await user.click(await screen.findByRole('button', { name: 'סגירה' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
