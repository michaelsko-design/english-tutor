import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildWordListSteps, createWordList } from '../../data/customWordLists';
import { answerCorrectly, answerWrongly } from '../../test/drillAnswers';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { WordListSessionRunner } from './WordListSessionRunner';

const profile = makeProfile({ gradeId: 'grade-4', preferredTier: 'challenger' });
const list = createWordList(
  'Unit 3 words',
  [
    { textEn: 'apple', translationHe: 'תפוח', kind: 'word' },
    { textEn: 'school', translationHe: 'בית ספר', kind: 'word' },
    { textEn: 'happy', translationHe: 'שמח', kind: 'word' },
    { textEn: 'I like my school.', translationHe: 'אני אוהבת את בית הספר שלי.', kind: 'sentence' },
  ],
  new Date('2026-10-20T10:00:00'),
  'list-test'
);
// Math.random is pinned to 0 below, so the runner's salt is 0
const steps = buildWordListSteps(list, profile.gender, 0);

function renderSession() {
  const handlers = { onFinish: vi.fn(), onClose: vi.fn() };
  render(
    <WordListSessionRunner list={list} profile={profile} theme={TEST_THEME} onSpeakEnglish={() => {}} {...handlers} />
  );
  return handlers;
}

/** These play a whole session click by click: slow when many test files run at once */
const SESSION_TEST_TIMEOUT_MS = 20_000;

describe('WordListSessionRunner', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('has meaning, spelling, sentence and voice steps', () => {
    expect(new Set(steps.map((s) => s.type))).toEqual(
      new Set(['meaning-match', 'spelling-magnet', 'sentence-builder', 'voice-speak'])
    );
  });

  it('practises the whole list and saves the result', async () => {
    const user = userEvent.setup();
    const { onFinish } = renderSession();

    for (const step of steps) {
      await answerCorrectly(user, step);
      await user.click(screen.getByRole('button', { name: /לשלב הבא|לתוצאות/ }));
    }
    await user.click(screen.getByRole('button', { name: 'שמירה וחזרה לדשבורד' }));

    expect(onFinish).toHaveBeenCalledTimes(1);
    const [answers, next] = onFinish.mock.calls[0];
    expect(next).toBe('lists');
    expect(answers).toHaveLength(steps.length);
    expect(answers.filter((a: { isSkipped: boolean }) => !a.isSkipped).every((a: { isCorrect: boolean }) => a.isCorrect)).toBe(true);
    expect(answers.filter((a: { isSkipped: boolean }) => a.isSkipped)).toHaveLength(
      steps.filter((s) => s.type === 'voice-speak').length
    );
  }, SESSION_TEST_TIMEOUT_MS);

  it('a wrong first try is not scored as correct even after fixing it', async () => {
    const user = userEvent.setup();
    const { onFinish } = renderSession();
    const [first, ...rest] = steps;

    await answerWrongly(user, first);
    await answerCorrectly(user, first);
    await user.click(screen.getByRole('button', { name: 'לשלב הבא' }));
    for (const step of rest) {
      await answerCorrectly(user, step);
      await user.click(screen.getByRole('button', { name: /לשלב הבא|לתוצאות/ }));
    }
    await user.click(screen.getByRole('button', { name: 'שמירה וחזרה לדשבורד' }));

    expect(onFinish.mock.calls[0][0][0]).toMatchObject({ type: first.type, isCorrect: false });
  });
});
