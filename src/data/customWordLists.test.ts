import { describe, expect, it } from 'vitest';
import { CURRICULUM_BY_GRADE } from '../test/curriculum';
import {
  MAX_ACTIVE_LISTS,
  MAX_ITEMS_PER_LIST,
  SESSION_ITEM_COUNT,
  SKIP_REASONS_HE,
  WORD_LIST_DAILY_REWARD_LIMIT,
  WORD_LIST_HIGH_SCORE_BONUS_DIAMONDS,
  WORD_LIST_REPEAT_XP,
  WORD_LIST_REWARD_DIAMONDS,
  WORD_LIST_REWARD_XP,
  WordListAnswer,
  addWordList,
  applyWordListResultToProfile,
  archiveWordList,
  buildWordListSteps,
  canAddList,
  createWordList,
  getActiveLists,
  getSpellingLetters,
  lookupTranslationHe,
  normalizeForCompare,
  parseWordListText,
  scoreWordListAnswers,
} from './customWordLists';
import { toLocalDateStr } from './examPrep';
import { CustomWordList, LearnerProfile } from '../types/learner';
import { preloadCurriculum } from '../test/curriculum';

// These tests read the loaded grades (the app loads them per grade, see the loader)
await preloadCurriculum();

const NOW = new Date(2026, 9, 18, 10, 0);
const TODAY = toLocalDateStr(NOW);

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Noa',
  age: 12,
  gender: 'girl',
  gradeId: 'grade-7',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  stats: {
    xp: 100,
    level: 1,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: 50,
    streakDays: 4,
    streakLastDateStr: '2026-10-17',
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-17',
    missionsCompletedToday: 2,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
};

function makeList(text: string, id = 'list-a', now = NOW): CustomWordList {
  return createWordList('Unit 3 words', parseWordListText(text).items, now, id);
}

const SAMPLE = ['window - חלון', 'blanket - שמיכה', 'pillow - כרית', 'I sleep in my bed every night.'].join('\n');

function withLists(...lists: CustomWordList[]): LearnerProfile {
  return { ...baseProfile, customWordLists: lists };
}

function answersOf(correct: number, total: number, skipped = 0): WordListAnswer[] {
  return [
    ...Array.from({ length: total }, (_, i) => ({ type: 'spelling-magnet' as const, isCorrect: i < correct, isSkipped: false })),
    ...Array.from({ length: skipped }, () => ({ type: 'voice-speak' as const, isCorrect: true, isSkipped: true })),
  ];
}

describe('parseWordListText', () => {
  it('reads a word with its translation and strips numbering and bullets', () => {
    const { items, skipped } = parseWordListText('1. window - חלון\n2) blanket = שמיכה\n• pillow: כרית');
    expect(skipped).toEqual([]);
    expect(items).toEqual([
      { textEn: 'window', translationHe: 'חלון', kind: 'word' },
      { textEn: 'blanket', translationHe: 'שמיכה', kind: 'word' },
      { textEn: 'pillow', translationHe: 'כרית', kind: 'word' },
    ]);
  });

  it('accepts the translation before the English word, tabs and dashes', () => {
    const { items } = parseWordListText('חלון - window\nblanket\tשמיכה\npillow – כרית\ncarpet (שטיח)');
    expect(items.map((i) => [i.textEn, i.translationHe])).toEqual([
      ['window', 'חלון'],
      ['blanket', 'שמיכה'],
      ['pillow', 'כרית'],
      ['carpet', 'שטיח'],
    ]);
  });

  it('splits a comma list of words but keeps a sentence with commas whole', () => {
    const { items } = parseWordListText('cat, ice cream; horse\nHello, how are you?');
    expect(items.map((i) => [i.textEn, i.kind])).toEqual([
      ['cat', 'word'],
      ['ice cream', 'word'],
      ['horse', 'word'],
      ['Hello, how are you?', 'sentence'],
    ]);
  });

  it('treats lines of 3+ words as sentences and keeps their translation', () => {
    const { items } = parseWordListText('I like to read books. - אני אוהבת לקרוא ספרים');
    expect(items).toEqual([
      { textEn: 'I like to read books.', translationHe: 'אני אוהבת לקרוא ספרים', kind: 'sentence' },
    ]);
  });

  it('drops end punctuation from a single word and normalizes curly quotes', () => {
    const { items } = parseWordListText('Hello!\ndon’t');
    expect(items.map((i) => i.textEn)).toEqual(['Hello', "don't"]);
  });

  it('reports Hebrew-only, mixed, duplicate and too-long lines with a reason', () => {
    const longSentence = Array.from({ length: 16 }, (_, i) => `word${i}`).join(' ');
    const { items, skipped } = parseWordListText(
      ['שלום לכולם', 'apple תפוח banana בננה', 'window', 'Window', longSentence, 'caf$e'].join('\n')
    );
    expect(items.map((i) => i.textEn)).toEqual(['window']);
    expect(skipped.map((s) => s.reasonHe)).toEqual([
      SKIP_REASONS_HE.noEnglish,
      SKIP_REASONS_HE.severalTranslations,
      SKIP_REASONS_HE.duplicate,
      SKIP_REASONS_HE.tooLong,
      SKIP_REASONS_HE.badCharacters,
    ]);
  });

  it('handles more worksheet numbering forms, part-of-speech tags and punctuation', () => {
    const { items } = parseWordListText(
      ['1 window', '(3) bed', 'pencil (n) - עיפרון', 'quickly (adv.) = מהר', 'ice cream - גלידה.', 'Monday, Tuesday, Wednesday.'].join('\n')
    );
    expect(items.map((i) => i.textEn)).toEqual([
      'window',
      'bed',
      'pencil',
      'quickly',
      'ice cream',
      'Monday',
      'Tuesday',
      'Wednesday',
    ]);
    expect(items.slice(2, 5).map((i) => i.translationHe)).toEqual(['עיפרון', 'מהר', 'גלידה']);
  });

  it('ignores empty lines and caps the list size', () => {
    const text = Array.from({ length: MAX_ITEMS_PER_LIST + 2 }, (_, i) => `word${i}\n\n`).join('');
    const { items, skipped } = parseWordListText(text);
    expect(items).toHaveLength(MAX_ITEMS_PER_LIST);
    expect(skipped).toHaveLength(2);
    expect(skipped[0].reasonHe).toBe(SKIP_REASONS_HE.listFull);
  });

  it('fills a missing translation from the curriculum word bank', () => {
    const vocab = CURRICULUM_BY_GRADE['grade-7'].units[0].missions[0].vocabulary.find(
      (v) => v.wordEn.split(' ').length === 1
    )!;
    expect(lookupTranslationHe(vocab.wordEn.toUpperCase())).toBeTruthy();
    const { items } = parseWordListText(vocab.wordEn);
    expect(items[0].translationHe).toBe(lookupTranslationHe(vocab.wordEn));
    expect(items[0].isTranslationFromBank).toBe(true);
  });

  it('keeps the typed translation instead of the word bank one', () => {
    const vocab = CURRICULUM_BY_GRADE['grade-7'].units[0].missions[0].vocabulary[0];
    const { items } = parseWordListText(`${vocab.wordEn} - תרגום שלי`);
    expect(items[0].translationHe).toBe('תרגום שלי');
    expect(items[0].isTranslationFromBank).toBeUndefined();
  });
});

describe('lists on the profile', () => {
  it('creates a list with item ids, a trimmed title and a default title', () => {
    const list = makeList(SAMPLE);
    expect(list.items.map((i) => i.id)).toEqual(['w1', 'w2', 'w3', 'w4']);
    expect(list.title).toBe('Unit 3 words');
    expect(createWordList('   ', list.items, NOW, 'x').title).toBe('רשימה מ-18.10');
    expect(createWordList('a'.repeat(60), list.items, NOW, 'x').title).toHaveLength(40);
  });

  it('adds lists up to the limit and refuses lists with too few items', () => {
    const tiny = makeList('cat\ndog', 'tiny');
    expect(addWordList(baseProfile, tiny)).toBe(baseProfile);

    let profile = baseProfile;
    for (let i = 0; i < MAX_ACTIVE_LISTS; i++) profile = addWordList(profile, makeList(SAMPLE, `l${i}`));
    expect(getActiveLists(profile)).toHaveLength(MAX_ACTIVE_LISTS);
    expect(canAddList(profile)).toBe(false);
    expect(addWordList(profile, makeList(SAMPLE, 'extra'))).toBe(profile);
  });

  it('archives a deleted list without its items, freeing a slot', () => {
    const profile = withLists(makeList(SAMPLE, 'a'), makeList(SAMPLE, 'b'));
    const archived = archiveWordList(profile, 'a', NOW);
    expect(getActiveLists(archived).map((l) => l.id)).toEqual(['b']);
    const tombstone = archived.customWordLists!.find((l) => l.id === 'a')!;
    expect(tombstone.items).toEqual([]);
    expect(tombstone.archivedAt).toBe(NOW.toISOString());
  });

  it('lists the newest lists first', () => {
    const older = makeList(SAMPLE, 'old', new Date(2026, 9, 1));
    const newer = makeList(SAMPLE, 'new', new Date(2026, 9, 10));
    expect(getActiveLists(withLists(older, newer)).map((l) => l.id)).toEqual(['new', 'old']);
  });
});

describe('buildWordListSteps', () => {
  const list = makeList(SAMPLE);

  it('orders the rounds meaning → magnets → voice and covers every item', () => {
    const steps = buildWordListSteps(list, 'girl', 7);
    const types = steps.map((s) => s.type);
    expect(types.filter((t) => t === 'meaning-match')).toHaveLength(3);
    expect(types.filter((t) => t === 'spelling-magnet')).toHaveLength(3);
    expect(types.filter((t) => t === 'sentence-builder')).toHaveLength(1);
    expect(types.filter((t) => t === 'voice-speak')).toHaveLength(4);
    const lastMeaning = types.lastIndexOf('meaning-match');
    const firstVoice = types.indexOf('voice-speak');
    expect(types.slice(lastMeaning + 1, firstVoice).every((t) => t === 'spelling-magnet' || t === 'sentence-builder')).toBe(true);
    expect(types.slice(firstVoice).every((t) => t === 'voice-speak')).toBe(true);
  });

  it('builds meaning options from other list words with one correct answer', () => {
    const step = buildWordListSteps(list, 'girl', 7).find((s) => s.type === 'meaning-match')!;
    expect(step.options).toHaveLength(3);
    expect(step.options!.filter((o) => o.isCorrect).map((o) => o.textEn)).toEqual([step.textEn]);
    expect(step.promptHe).toContain(step.translationHe!);
  });

  it('never offers a synonym with the same meaning as a wrong option', () => {
    const synonyms = makeList('big - גדול\nlarge - גדול\nsmall - קטן\ntiny - זעיר\nhuge - ענק');
    const bigStep = Array.from({ length: 20 }, (_, salt) => buildWordListSteps(synonyms, 'girl', salt))
      .flat()
      .filter((s) => s.type === 'meaning-match' && s.textEn === 'big');
    expect(bigStep.length).toBeGreaterThan(0);
    bigStep.forEach((s) => expect(s.options!.map((o) => o.textEn)).not.toContain('large'));
  });

  it('skips the meaning step when a word has no translation', () => {
    const noHebrew = makeList('qwerty\nzxcvb\nasdfg');
    expect(buildWordListSteps(noHebrew, 'boy', 1).some((s) => s.type === 'meaning-match')).toBe(false);
  });

  it('shuffles the letters and sentence words but keeps them complete', () => {
    const steps = buildWordListSteps(list, 'boy', 3);
    steps
      .filter((s) => s.type === 'spelling-magnet')
      .forEach((s) => {
        expect([...s.letterTiles!].sort()).toEqual([...getSpellingLetters(s.textEn)].sort());
        expect(s.letterTiles!.join('')).not.toBe(getSpellingLetters(s.textEn).join(''));
      });
    const builder = steps.find((s) => s.type === 'sentence-builder')!;
    expect([...builder.scrambledWords!].sort()).toEqual(builder.textEn.split(' ').sort());
  });

  it('is stable for the same salt and limits the session size', () => {
    const big = makeList(Array.from({ length: 12 }, (_, i) => `word${String.fromCharCode(97 + i)}`).join('\n'));
    const a = buildWordListSteps(big, 'girl', 42);
    expect(buildWordListSteps(big, 'girl', 42)).toEqual(a);
    expect(new Set(a.map((s) => s.itemId)).size).toBe(SESSION_ITEM_COUNT);
  });

  it('uses the gendered Hebrew prompt', () => {
    const girl = buildWordListSteps(list, 'girl', 1).find((s) => s.type === 'voice-speak')!;
    const boy = buildWordListSteps(list, 'boy', 1).find((s) => s.type === 'voice-speak')!;
    expect(girl.promptHe).toMatch(/אמרי|קראי/);
    expect(boy.promptHe).toMatch(/אמור|קרא /);
  });

  it('gives hints that help without naming the answer or repeating the prompt', () => {
    const steps = buildWordListSteps(list, 'girl', 7);
    for (const step of steps) {
      expect(step.hintHe).not.toBe('');
      expect(step.promptHe).not.toContain(step.hintHe);
    }
    for (const step of steps.filter((s) => s.type === 'meaning-match')) {
      expect(step.hintHe).not.toMatch(new RegExp(`\\b${step.textEn}\\b`, 'i'));
      expect(step.hintHe).toContain(`${getSpellingLetters(step.textEn).length} אותיות`);
    }
    const builder = steps.find((s) => s.type === 'sentence-builder')!;
    const words = builder.textEn.split(' ');
    expect(builder.hintHe).toContain(words[words.length - 1].replace(/[^A-Za-z0-9']+$/, ''));
    expect(builder.hintHe).toContain(`${words.length} מילים`);
    for (const step of steps.filter((s) => s.type === 'voice-speak')) {
      expect(step.hintHe.startsWith('טיפ:')).toBe(true);
    }
  });

  it('spells only letters and digits of a phrase', () => {
    expect(getSpellingLetters("ice-cream don't")).toEqual('icecreamdont'.split(''));
  });

  it('compares built answers ignoring case and punctuation', () => {
    expect(normalizeForCompare('I  sleep in my bed!')).toBe(normalizeForCompare('i sleep in my bed'));
  });
});

describe('scoring and rewards', () => {
  it('scores first-try answers and leaves skipped voice steps out', () => {
    expect(scoreWordListAnswers(answersOf(3, 4, 2))).toEqual({ correctCount: 3, scoredCount: 4, scorePercent: 75 });
    expect(scoreWordListAnswers([]).scorePercent).toBe(0);
  });

  it('gives the full reward on the first session of the day and counts the activity', () => {
    const profile = withLists(makeList(SAMPLE));
    const voice: WordListAnswer[] = [
      { type: 'voice-speak', isCorrect: true, isSkipped: false },
      { type: 'voice-speak', isCorrect: true, isSkipped: true },
    ];
    const { profile: updated, reward, score } = applyWordListResultToProfile(
      profile,
      'list-a',
      [...answersOf(4, 4), ...voice],
      NOW
    );
    expect(score.scorePercent).toBe(100);
    expect(reward).toEqual({
      xp: WORD_LIST_REWARD_XP,
      diamonds: WORD_LIST_REWARD_DIAMONDS + WORD_LIST_HIGH_SCORE_BONUS_DIAMONDS,
      isFullReward: true,
    });
    expect(updated.stats.xp).toBe(100 + WORD_LIST_REWARD_XP);
    expect(updated.stats.diamonds).toBe(50 + reward.diamonds);
    expect(updated.stats.streakDays).toBe(5);
    expect(updated.dailyCounters.missionsCompletedToday).toBe(1);
    expect(updated.dailyCounters.voiceWordsPracticedToday).toBe(1);
    expect(updated.dailyCounters.threeStarMissionsToday).toBe(1);
    const saved = updated.customWordLists![0];
    expect(saved.bestScore).toBe(100);
    expect(saved.lastRewardedDateStr).toBe(TODAY);
    expect(saved.lastPracticedAt).toBe(NOW.toISOString());
  });

  it('gives only repeat XP for the same list again today and keeps the best score', () => {
    const first = applyWordListResultToProfile(withLists(makeList(SAMPLE)), 'list-a', answersOf(4, 4), NOW);
    const second = applyWordListResultToProfile(first.profile, 'list-a', answersOf(1, 4), NOW);
    expect(second.reward).toEqual({ xp: WORD_LIST_REPEAT_XP, diamonds: 0, isFullReward: false });
    expect(second.profile.customWordLists![0].bestScore).toBe(100);
    expect(second.profile.stats.diamonds).toBe(first.profile.stats.diamonds);
  });

  it('gives voice and 3-star quest credit only from rewarded sessions', () => {
    const voice: WordListAnswer = { type: 'voice-speak', isCorrect: true, isSkipped: false };
    const first = applyWordListResultToProfile(withLists(makeList(SAMPLE)), 'list-a', [...answersOf(4, 4), voice], NOW);
    const second = applyWordListResultToProfile(first.profile, 'list-a', [...answersOf(4, 4), voice], NOW);
    expect(second.profile.dailyCounters.voiceWordsPracticedToday).toBe(1);
    expect(second.profile.dailyCounters.threeStarMissionsToday).toBe(1);
    expect(second.profile.dailyCounters.missionsCompletedToday).toBe(2);
  });

  it('gives no high-score bonus below 80%', () => {
    const { reward } = applyWordListResultToProfile(withLists(makeList(SAMPLE)), 'list-a', answersOf(1, 4), NOW);
    expect(reward.diamonds).toBe(WORD_LIST_REWARD_DIAMONDS);
  });

  it('stops full rewards after the daily limit across lists', () => {
    const lists = Array.from({ length: WORD_LIST_DAILY_REWARD_LIMIT + 1 }, (_, i) => makeList(SAMPLE, `l${i}`));
    let profile = withLists(...lists);
    const rewards = lists.map((l) => {
      const outcome = applyWordListResultToProfile(profile, l.id, answersOf(4, 4), NOW);
      profile = outcome.profile;
      return outcome.reward.isFullReward;
    });
    expect(rewards).toEqual([...Array(WORD_LIST_DAILY_REWARD_LIMIT).fill(true), false]);
  });

  it('rewards the same list again on the next day', () => {
    const list = { ...makeList(SAMPLE), lastRewardedDateStr: '2026-10-17' };
    expect(applyWordListResultToProfile(withLists(list), 'list-a', answersOf(4, 4), NOW).reward.isFullReward).toBe(true);
  });

  it('leaves the profile unchanged for an unknown list', () => {
    const profile = withLists(makeList(SAMPLE));
    expect(applyWordListResultToProfile(profile, 'missing', answersOf(4, 4), NOW).profile).toBe(profile);
  });
});
