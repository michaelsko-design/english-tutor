import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildDeckSteps } from '../../data/wordDecks/deckSession';
import { FIXTURE_DECK } from '../../data/wordDecks/fixtures';
import { DECK_REPEAT_REWARD_NOTE_HE } from '../../data/wordDecks/deckCopy';
import { toLocalDateStr } from '../../utils/dates';
import { answerCorrectly } from '../../test/drillAnswers';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { WordDeckSession } from './WordDeckSession';

const profile = makeProfile({ gradeId: 'grade-4', preferredTier: 'challenger' });
// Math.random is pinned to 0 below, so the session's salt is 0
const steps = buildDeckSteps(FIXTURE_DECK, profile.gender, 0);
/** A whole session played click by click: slow when many test files run at once */
const SESSION_TEST_TIMEOUT_MS = 20_000;

function renderSession(learner = profile) {
  const handlers = { onUpdateProfile: vi.fn(), onRetry: vi.fn(), onClose: vi.fn() };
  render(
    <WordDeckSession deck={FIXTURE_DECK} profile={learner} theme={TEST_THEME} onSpeakEnglish={() => {}} {...handlers} />
  );
  return handlers;
}

async function playToResult(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  for (const step of steps) {
    await answerCorrectly(user, step);
    await user.click(screen.getByRole('button', { name: /לשלב הבא|לתוצאות/ }));
  }
}

describe('WordDeckSession', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('plays the deck on the word-list engine and saves mastery, rewards and the session', async () => {
    const user = userEvent.setup();
    const { onUpdateProfile, onClose } = renderSession();
    expect(screen.getByText(new RegExp(FIXTURE_DECK.topicHe))).toBeInTheDocument();

    await playToResult(user);
    await user.click(screen.getByRole('button', { name: 'שמירה וחזרה לדשבורד' }));

    expect(onClose).toHaveBeenCalled();
    const saved = onUpdateProfile.mock.calls[0][0];
    const today = toLocalDateStr(new Date());
    const practised = [...new Set(steps.map((s) => s.itemId))];
    expect(Object.keys(saved.deckWordMastery).sort()).toEqual(practised.sort());
    expect(saved.deckRewardDates).toEqual({ [FIXTURE_DECK.id]: today });
    expect(saved.dailyCounters.missionsCompletedToday).toBe(1);
  }, SESSION_TEST_TIMEOUT_MS);

  it('shows the deck’s repeat-reward note once the deck paid today, and can run again', async () => {
    const user = userEvent.setup();
    const paid = makeProfile({ ...profile, deckRewardDates: { [FIXTURE_DECK.id]: toLocalDateStr(new Date()) } });
    const { onRetry } = renderSession(paid);

    await playToResult(user);
    expect(screen.getByText(new RegExp(DECK_REPEAT_REWARD_NOTE_HE))).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /תרגלי שוב/ }));
    expect(onRetry).toHaveBeenCalled();
  }, SESSION_TEST_TIMEOUT_MS);
});
