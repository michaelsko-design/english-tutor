import { describe, expect, it } from 'vitest';
import { WORD_LIST_REPEAT_XP, WORD_LIST_REWARD_XP, type WordListAnswer } from '../customWordLists';
import { makeProfile } from '../../test/fixtures';
import { deckWordKey } from './deckMastery';
import {
  applyDeckResultToProfile,
  buildDeckSteps,
  deckToWordList,
  getDeckItemReading,
  getDeckReward,
  getDeckSaltCount,
  pickDeckSalt,
} from './deckSession';
import { FIXTURE_DECK } from './fixtures';

const NOW = new Date('2026-11-09T10:00:00');
const TODAY = '2026-11-09';

/** Every step of the session answered right on the first try */
function allRight(salt = 0): WordListAnswer[] {
  return buildDeckSteps(FIXTURE_DECK, 'girl', salt).map((step) => ({
    type: step.type,
    itemId: step.itemId,
    isCorrect: true,
    isSkipped: false,
  }));
}

describe('deckToWordList', () => {
  it('keys each item by its deck word key, and phrases of 3+ words are sentences', () => {
    const list = deckToWordList(FIXTURE_DECK);
    expect(list.title).toBe('אוכל');
    expect(list.items.map((item) => item.id)).toContain('ice_cream');
    expect(list.items.find((item) => item.id === 'ice_cream')?.kind).toBe('word');
    expect(list.items.find((item) => item.textEn === 'all the time')?.kind).toBe('sentence');
  });
});

describe('getDeckItemReading', () => {
  it('reads the word, then its example, with no extra full stop after a phrase that ends a sentence', () => {
    expect(getDeckItemReading({ wordEn: 'hotel', exampleEn: 'The hotel is near the beach.' })).toBe('hotel. The hotel is near the beach.');
    expect(getDeckItemReading({ wordEn: 'How old are you?', exampleEn: 'I am six.' })).toBe('How old are you? I am six.');
    expect(getDeckItemReading({ wordEn: 'Well done!', exampleEn: 'Well done, Dan!' })).toBe('Well done! Well done, Dan!');
  });
});

describe('buildDeckSteps', () => {
  it('runs the word-list engine: meaning match, then magnets, then voice', () => {
    const steps = buildDeckSteps(FIXTURE_DECK, 'boy', 3);
    const firstMagnet = steps.findIndex((s) => s.type === 'spelling-magnet' || s.type === 'sentence-builder');
    const firstVoice = steps.findIndex((s) => s.type === 'voice-speak');
    expect(steps[0].type).toBe('meaning-match');
    expect(firstMagnet).toBeGreaterThan(0);
    expect(firstVoice).toBeGreaterThan(firstMagnet);
    expect(steps.every((s) => FIXTURE_DECK.items.some((item) => deckWordKey(item.wordEn) === s.itemId))).toBe(true);
  });

  it("asks to order a phrase's words without the school list's \"from the teacher's page\"", () => {
    const builders = (gender: 'girl' | 'boy') =>
      buildDeckSteps(FIXTURE_DECK, gender, 0).filter((s) => s.type === 'sentence-builder');
    expect(builders('girl').length).toBeGreaterThan(0);
    expect(builders('girl').every((s) => s.promptHe === 'סדרי את המילים למשפט.')).toBe(true);
    expect(builders('boy').every((s) => s.promptHe === 'סדר את המילים למשפט.')).toBe(true);
  });

  it('is the same session for the same salt', () => {
    expect(buildDeckSteps(FIXTURE_DECK, 'girl', 2)).toEqual(buildDeckSteps(FIXTURE_DECK, 'girl', 2));
  });
});

describe('pickDeckSalt', () => {
  it('stays below the deck size, so the corpus can voice every session', () => {
    expect(getDeckSaltCount(FIXTURE_DECK)).toBe(FIXTURE_DECK.items.length);
    expect(pickDeckSalt(FIXTURE_DECK, () => 0)).toBe(0);
    expect(pickDeckSalt(FIXTURE_DECK, () => 0.9999)).toBe(FIXTURE_DECK.items.length - 1);
  });
});

describe('getDeckReward', () => {
  it('pays in full once per deck per day', () => {
    const profile = makeProfile();
    expect(getDeckReward(profile, FIXTURE_DECK.id, 100, TODAY).isFullReward).toBe(true);
    const rewarded = makeProfile({ deckRewardDates: { [FIXTURE_DECK.id]: TODAY } });
    expect(getDeckReward(rewarded, FIXTURE_DECK.id, 100, TODAY)).toEqual({ xp: WORD_LIST_REPEAT_XP, diamonds: 0, isFullReward: false });
    expect(getDeckReward(rewarded, 'other-deck', 100, TODAY).isFullReward).toBe(true);
  });
});

describe('applyDeckResultToProfile', () => {
  it('rewards, counts the session for the quests and streak, and records first-try words', () => {
    const profile = makeProfile();
    const { profile: next, reward } = applyDeckResultToProfile(profile, FIXTURE_DECK, allRight(), NOW);

    expect(reward.isFullReward).toBe(true);
    expect(next.stats.xp).toBe(profile.stats.xp + WORD_LIST_REWARD_XP);
    expect(next.stats.diamonds).toBe(profile.stats.diamonds + reward.diamonds);
    expect(next.dailyCounters.dateStr).toBe(TODAY);
    expect(next.dailyCounters.missionsCompletedToday).toBe(1);
    expect(next.stats.streakLastDateStr).toBe(TODAY);
    expect(next.deckRewardDates).toEqual({ [FIXTURE_DECK.id]: TODAY });
    const practised = new Set(allRight().map((a) => a.itemId));
    expect(Object.keys(next.deckWordMastery ?? {}).sort()).toEqual([...practised].sort());
    expect(Object.values(next.deckWordMastery ?? {}).every((r) => r.firstTryDays[0] === TODAY && !r.masteredOn)).toBe(true);
    expect(profile.deckWordMastery).toBeUndefined();
  });

  it('a repeat the same day still counts as a session but pays a little XP only', () => {
    const first = applyDeckResultToProfile(makeProfile(), FIXTURE_DECK, allRight(), NOW).profile;
    const second = applyDeckResultToProfile(first, FIXTURE_DECK, allRight(), NOW);
    expect(second.reward.isFullReward).toBe(false);
    expect(second.profile.stats.diamonds).toBe(first.stats.diamonds);
    expect(second.profile.dailyCounters.missionsCompletedToday).toBe(2);
  });

  it('masters a word on the second day', () => {
    const day1 = applyDeckResultToProfile(makeProfile(), FIXTURE_DECK, allRight(), NOW).profile;
    const day2 = applyDeckResultToProfile(day1, FIXTURE_DECK, allRight(), new Date('2026-11-10T09:00:00')).profile;
    const mastered = Object.values(day2.deckWordMastery ?? {}).filter((r) => r.masteredOn === '2026-11-10');
    expect(mastered.length).toBeGreaterThan(0);
  });
});
