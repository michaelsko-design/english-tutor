import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { LESSON_PACK_LOADERS, type MiniLesson as MiniLessonData } from '../../data/miniLessons';
import { TEST_THEME } from '../../test/fixtures';
import { MiniLesson } from './MiniLesson';

vi.mock('../companion/Companion', () => ({ Companion: ({ pose }: { pose: string }) => <span>{`pose:${pose}`}</span> }));

const LESSON: MiniLessonData = {
  titleHe: 'זמן הווה פשוט',
  ideaHe: 'מוסיפים s לפועל בגוף שלישי יחיד.',
  pattern: 'He plays',
  tipHe: 'לא אומרים he play.',
  examples: [
    { en: 'She runs fast.', he: 'היא רצה מהר.', highlight: 'runs', emoji: '🏃' },
    { en: 'He plays chess.', he: 'הוא משחק שחמט.', highlight: 'plays' },
  ],
  quickTry: { promptHe: 'מה נכון?', questionEn: 'She ___ to school.', correct: 'goes', wrong: 'go', explainHe: 'עם she מוסיפים es.' },
} as MiniLessonData;

const fns = { onSpeakEnglish: vi.fn(), onDone: vi.fn(), onClose: vi.fn() };

function setup(props: { lesson?: MiniLessonData; isReview?: boolean; readsAloud?: boolean; readsHebrewAloud?: boolean } = {}) {
  render(
    <MiniLesson
      lesson={props.lesson ?? LESSON}
      seed="seed-1"
      theme={TEST_THEME}
      isReview={props.isReview}
      readsAloud={props.readsAloud}
      readsHebrewAloud={props.readsHebrewAloud}
      doneLabel="מתחילים לתרגל"
      closeLabel="סגירת השיעור"
      {...fns}
    />
  );
  return userEvent.setup();
}

const next = () => screen.getByRole('button', { name: 'הבא' });

beforeEach(() => Object.values(fns).forEach((fn) => fn.mockClear()));

describe('MiniLesson', () => {
  it('starts with the idea: title, explanation, pattern and the common mistake', () => {
    setup();
    expect(screen.getByRole('heading', { name: 'זמן הווה פשוט' })).toBeInTheDocument();
    expect(screen.getByText('He plays')).toBeInTheDocument();
    expect(screen.getByText(/לא אומרים/)).toBeInTheDocument();
    expect(screen.getByText('pose:think')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'כרטיס 1 מתוך 3' })).toBeInTheDocument();
  });

  it('goes to the examples, reads one aloud on a tap and goes back', async () => {
    const user = setup();
    await user.click(next());
    expect(screen.getByRole('heading', { name: /לחצו על משפט/ })).toBeInTheDocument();
    expect(screen.getByText('pose:idle')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /She runs fast/ }));
    expect(fns.onSpeakEnglish).toHaveBeenCalledWith('She runs fast.', 0.95);
    await user.click(screen.getByRole('button', { name: 'הקודם' }));
    expect(screen.getByRole('heading', { name: 'זמן הווה פשוט' })).toBeInTheDocument();
  });

  it('reads the first example by itself for early readers', async () => {
    const user = setup({ readsAloud: true });
    await user.click(next());
    expect(fns.onSpeakEnglish).toHaveBeenCalledWith('She runs fast.', 0.95);
  });

  it('runs the quick try: a right pick cheers, a wrong one says oops', async () => {
    const user = setup();
    await user.click(next());
    await user.click(next());
    expect(screen.getByText('She ___ to school.')).toBeInTheDocument();
    expect(screen.getByText('pose:wave')).toBeInTheDocument();
    await user.click(screen.getByText('goes'));
    expect(screen.getByText('pose:cheer')).toBeInTheDocument();
    expect(screen.getByText(/מוסיפים/)).toBeInTheDocument();
    expect(fns.onSpeakEnglish).toHaveBeenCalledWith('goes', 0.95);
    await user.click(screen.getByText('go'));
    expect(screen.getByText('pose:oops')).toBeInTheDocument();
  });

  it('finishes from the last card with the given label', async () => {
    const user = setup();
    await user.click(next());
    await user.click(next());
    await user.click(screen.getByRole('button', { name: 'מתחילים לתרגל' }));
    expect(fns.onDone).toHaveBeenCalledTimes(1);
  });

  it('has only two cards when there is no quick try', async () => {
    const user = setup({ lesson: { ...LESSON, quickTry: undefined } });
    expect(screen.getByRole('img', { name: 'כרטיס 1 מתוך 2' })).toBeInTheDocument();
    await user.click(next());
    expect(screen.getByRole('button', { name: 'מתחילים לתרגל' })).toBeInTheDocument();
  });

  it('can be skipped on a first play', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /דילוג/ }));
    expect(fns.onDone).toHaveBeenCalledTimes(1);
  });

  it('has no skip link in review, and closes with the X', async () => {
    const user = setup({ isReview: true });
    expect(screen.queryByRole('button', { name: /דילוג/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'סגירת השיעור' }));
    expect(fns.onClose).toHaveBeenCalledTimes(1);
  });

  it('reads the Hebrew idea and the quick-try question aloud in grades 1–2', async () => {
    const user = setup({ readsHebrewAloud: true });
    await user.click(next());
    await user.click(next());
    await user.click(screen.getByText('goes'));
    expect(screen.getByText('pose:cheer')).toBeInTheDocument();
  });

  it('shows a Boss recap with its parts', () => {
    setup({
      lesson: {
        ...LESSON,
        quickTry: undefined,
        recapParts: [{ titleHe: 'הווה פשוט', pattern: 'He plays' }, { titleHe: 'שמות עצם' }],
      } as MiniLessonData,
    });
    expect(screen.getByText('הווה פשוט')).toBeInTheDocument();
    expect(screen.getByText('שמות עצם')).toBeInTheDocument();
  });

  describe('phonics lessons of grade 1', () => {
    let letters: MiniLessonData | undefined;
    let blends: MiniLessonData | undefined;

    beforeAll(async () => {
      const pack = await LESSON_PACK_LOADERS[1]!();
      const all = Object.values(pack);
      letters = all.find((lesson) => lesson.letters && lesson.letters.length > 0);
      blends = all.find((lesson) => lesson.blendWords && lesson.blendWords.length > 0);
    });

    it('shows letter cards on the examples card', async () => {
      expect(letters).toBeDefined();
      const user = setup({ lesson: letters });
      await user.click(next());
      expect(screen.getAllByRole('button').length).toBeGreaterThan(2);
    });

    it('shows blending cards on the examples card', async () => {
      expect(blends).toBeDefined();
      const user = setup({ lesson: blends });
      await user.click(next());
      expect(screen.getAllByRole('button').length).toBeGreaterThan(2);
    });
  });
});
