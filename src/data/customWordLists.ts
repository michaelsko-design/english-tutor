import { areAllGradesLoaded, getLoadedGrades } from './curriculum/loader';
import { MultipleChoiceOption } from './missionExercises';
import { levelForXp, recordDailyActivity } from './progressRewards';
import { toLocalDateStr } from './examPrep';
import {
  CustomItemKind,
  CustomWordItem,
  CustomWordList,
  LearnerGender,
  LearnerProfile,
} from '../types/learner';
import { seededShuffle, seededShuffleNotIdentity } from '../utils/shuffle';
import {
  getPronunciationTipHe,
  getSentenceOrderHintHe,
  getSpellingHintHe,
  getWordShapeHintHe,
} from '../utils/hints';

/**
 * School word-list importer (Feature 10).
 *
 * The learner pastes a word list from a school worksheet: one word, phrase or sentence per
 * line, optionally with a Hebrew translation. Words are practised with a meaning match, letter
 * magnets and a voice drill; sentences with word magnets and a voice drill.
 */

export const MAX_ACTIVE_LISTS = 10;
export const MAX_ITEMS_PER_LIST = 30;
export const MIN_ITEMS_PER_LIST = 3;
export const MAX_SENTENCE_WORDS = 15;
export const MAX_WORD_LENGTH = 40;
export const MAX_TITLE_LENGTH = 40;
/** Items practised in one session (each gives up to 3 steps). */
export const SESSION_ITEM_COUNT = 5;
/** Lines of up to this many words are words/phrases; longer lines are sentences. */
const MAX_PHRASE_WORDS = 2;

export const WORD_LIST_REWARD_XP = 15;
export const WORD_LIST_REWARD_DIAMONDS = 2;
export const WORD_LIST_HIGH_SCORE = 80;
export const WORD_LIST_HIGH_SCORE_BONUS_DIAMONDS = 3;
/** Repeating a list on the same day (or after the daily limit) gives a little XP only. */
export const WORD_LIST_REPEAT_XP = 3;
/** Full rewards per day across all lists, so tiny self-made lists can't be farmed. */
export const WORD_LIST_DAILY_REWARD_LIMIT = 3;

const HEBREW_CHAR = /[֐-׿]/;
/** A Hebrew run: Hebrew letters plus the spaces and punctuation between them. */
const HEBREW_RUN = /[֐-׿][֐-׿\s'"׳״().,/-]*/;
const LATIN_CHAR = /[A-Za-z]/;
const ALLOWED_ENGLISH = /^[A-Za-z0-9\s'.,!?;:"()-]+$/;
/** Numbering or bullets at the start of a worksheet line: "1.", "2)", "-", "•" ... */
const LINE_PREFIX = /^\s*(?:\(\d{1,3}\)|\d{1,3}\s*[.):-]|\d{1,3}\s+(?=[A-Za-z֐-׿])|[-•*·–—▪●◦])\s*/;
/** Part-of-speech tags such as "(n)" or "(adj.)" that worksheets add after a word. */
const PART_OF_SPEECH_TAG = /\s*\((?:n|v|adj|adv|prep|conj|pron|phr\.? ?v)\.?\)/gi;
/** Separators left over between a word and its translation. */
const EDGE_SEPARATORS = /^[\s\-–—=:|()]+|[\s\-–—=:|()]+$/g;
const SPELLING_CHAR = /[A-Za-z0-9]/;

export const SKIP_REASONS_HE = {
  noEnglish: 'אין בשורה מילה באנגלית',
  badCharacters: 'יש בשורה סימנים שאינם אותיות באנגלית',
  severalTranslations: 'בשורה יש כמה תרגומים — כדאי לשים כל מילה בשורה משלה',
  tooLong: `ארוך מדי (עד ${MAX_SENTENCE_WORDS} מילים במשפט)`,
  duplicate: 'מופיע כבר ברשימה',
  listFull: `הרשימה מלאה (עד ${MAX_ITEMS_PER_LIST} פריטים)`,
} as const;

export interface ParsedWordItem {
  textEn: string;
  translationHe?: string;
  kind: CustomItemKind;
  /** True when the translation was filled in from the curriculum word bank */
  isTranslationFromBank?: boolean;
}

export interface SkippedLine {
  line: string;
  reasonHe: string;
}

export interface ParsedWordList {
  items: ParsedWordItem[];
  skipped: SkippedLine[];
}

// ---- Curriculum word bank lookup ------------------------------------------------------

let wordBank: Map<string, string> | null = null;

/**
 * Built from the grades loaded so far, and kept once all of them are (`loadAllGrades`): the
 * importer waits for that before it parses, so a translation is never missed.
 */
function getWordBank(): Map<string, string> {
  if (wordBank) return wordBank;
  const bank = new Map<string, string>();
  getLoadedGrades().forEach((pack) =>
    pack.units.forEach((unit) =>
      unit.missions.forEach((mission) =>
        mission.vocabulary.forEach((v) => {
          const key = v.wordEn.trim().toLowerCase();
          if (key && v.translationHe && !bank.has(key)) bank.set(key, v.translationHe);
        })
      )
    )
  );
  if (areAllGradesLoaded()) wordBank = bank;
  return bank;
}

/** Hebrew translation of a word from the Ministry curriculum vocabulary, if it is there. */
export function lookupTranslationHe(wordEn: string): string | undefined {
  return getWordBank().get(wordEn.trim().toLowerCase());
}

// ---- Parsing ---------------------------------------------------------------------------

function collapseSpaces(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function countWords(text: string): number {
  return text.split(' ').filter(Boolean).length;
}

/** Splits "apple - תפוח" or "תפוח = apple" into its English and Hebrew parts. */
function splitTranslation(line: string): { en: string; he?: string } {
  const heMatch = line.match(HEBREW_RUN);
  if (!heMatch) return { en: collapseSpaces(line.replace(EDGE_SEPARATORS, '')) };
  const he = collapseSpaces(heMatch[0].replace(EDGE_SEPARATORS, '').replace(/[.,;]+$/, ''));
  const en = collapseSpaces(line.replace(heMatch[0], ' ').replace(EDGE_SEPARATORS, ''));
  return { en, he };
}

/** "apple, banana; cat" holds several words; a sentence with commas stays one item. */
function splitWordSeries(line: string): string[] {
  if (HEBREW_CHAR.test(line)) return [line];
  const parts = line.replace(/\.$/, '').split(/[,;]/).map(collapseSpaces).filter(Boolean);
  const isSeries =
    parts.length > 1 &&
    parts.every((p) => countWords(p) <= MAX_PHRASE_WORDS && !/[.!?]$/.test(p));
  return isSeries ? parts : [line];
}

function toItem(en: string, he: string | undefined): ParsedWordItem | SkippedLine['reasonHe'] {
  if (!LATIN_CHAR.test(en)) return SKIP_REASONS_HE.noEnglish;
  if (HEBREW_CHAR.test(en)) return SKIP_REASONS_HE.severalTranslations;
  if (!ALLOWED_ENGLISH.test(en)) return SKIP_REASONS_HE.badCharacters;

  const words = countWords(en);
  if (words <= MAX_PHRASE_WORDS) {
    const textEn = en.replace(/[.!?;:,"]+$/, '').replace(/^["(]+|[")]+$/g, '').trim();
    if (!LATIN_CHAR.test(textEn)) return SKIP_REASONS_HE.noEnglish;
    if (textEn.length > MAX_WORD_LENGTH) return SKIP_REASONS_HE.tooLong;
    const bankHe = he ? undefined : lookupTranslationHe(textEn);
    return {
      textEn,
      kind: 'word',
      ...(he ? { translationHe: he } : {}),
      ...(bankHe ? { translationHe: bankHe, isTranslationFromBank: true } : {}),
    };
  }
  if (words > MAX_SENTENCE_WORDS) return SKIP_REASONS_HE.tooLong;
  return { textEn: en, kind: 'sentence', ...(he ? { translationHe: he } : {}) };
}

/** Parses pasted worksheet text into list items, reporting every line that was left out. */
export function parseWordListText(raw: string): ParsedWordList {
  const items: ParsedWordItem[] = [];
  const skipped: SkippedLine[] = [];
  const seen = new Set<string>();

  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.replace(/’|‘/g, "'").replace(/“|”/g, '"'))
    .map((l) => collapseSpaces(l.replace(/\t/g, ' - ').replace(LINE_PREFIX, '').replace(PART_OF_SPEECH_TAG, '')))
    .filter(Boolean);

  lines.forEach((line) => {
    splitWordSeries(line).forEach((part) => {
      const { en, he } = splitTranslation(part);
      const result = toItem(en, he);
      if (typeof result === 'string') {
        skipped.push({ line: part, reasonHe: result });
        return;
      }
      const key = result.textEn.toLowerCase();
      if (seen.has(key)) {
        skipped.push({ line: part, reasonHe: SKIP_REASONS_HE.duplicate });
        return;
      }
      if (items.length >= MAX_ITEMS_PER_LIST) {
        skipped.push({ line: part, reasonHe: SKIP_REASONS_HE.listFull });
        return;
      }
      seen.add(key);
      items.push(result);
    });
  });

  return { items, skipped };
}

// ---- Lists on the profile --------------------------------------------------------------

export function defaultListTitle(now: Date): string {
  return `רשימה מ-${now.getDate()}.${now.getMonth() + 1}`;
}

export function createWordList(
  title: string,
  items: readonly ParsedWordItem[],
  now: Date,
  id = `list-${now.getTime().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
): CustomWordList {
  const cleanTitle = collapseSpaces(title).slice(0, MAX_TITLE_LENGTH) || defaultListTitle(now);
  return {
    id,
    title: cleanTitle,
    createdAt: now.toISOString(),
    items: items.slice(0, MAX_ITEMS_PER_LIST).map(
      (item, idx): CustomWordItem => ({
        id: `w${idx + 1}`,
        textEn: item.textEn,
        kind: item.kind,
        ...(item.translationHe ? { translationHe: item.translationHe } : {}),
      })
    ),
  };
}

/** Lists that are not deleted, newest first. */
export function getActiveLists(profile: LearnerProfile): CustomWordList[] {
  return (profile.customWordLists || [])
    .filter((l) => !l.archivedAt)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export function canAddList(profile: LearnerProfile): boolean {
  return getActiveLists(profile).length < MAX_ACTIVE_LISTS;
}

export function addWordList(profile: LearnerProfile, list: CustomWordList): LearnerProfile {
  if (!canAddList(profile) || list.items.length < MIN_ITEMS_PER_LIST) return profile;
  return { ...profile, customWordLists: [...(profile.customWordLists || []), list] };
}

/** Deletes a list by archiving it and dropping its items, so another device can't revive it. */
export function archiveWordList(profile: LearnerProfile, listId: string, now: Date): LearnerProfile {
  return {
    ...profile,
    customWordLists: (profile.customWordLists || []).map((l) =>
      l.id === listId && !l.archivedAt ? { ...l, items: [], archivedAt: now.toISOString() } : l
    ),
  };
}

// ---- Session steps ---------------------------------------------------------------------

export type WordListStepType = 'meaning-match' | 'spelling-magnet' | 'sentence-builder' | 'voice-speak';

export interface WordListStep {
  id: string;
  type: WordListStepType;
  itemId: string;
  textEn: string;
  translationHe?: string;
  badgeLabelHe: string;
  promptHe: string;
  hintHe: string;
  /** meaning-match: English options for the Hebrew meaning */
  options?: MultipleChoiceOption[];
  /** spelling-magnet: the word's letters, shuffled */
  letterTiles?: string[];
  /** sentence-builder: the sentence's words, shuffled */
  scrambledWords?: string[];
}

function byGender(gender: LearnerGender, girl: string, boy: string): string {
  return gender === 'girl' ? girl : boy;
}

export function getSpellingLetters(textEn: string): string[] {
  return textEn.split('').filter((ch) => SPELLING_CHAR.test(ch));
}

function buildMeaningStep(
  item: CustomWordItem,
  list: CustomWordList,
  gender: LearnerGender,
  seed: string
): WordListStep | null {
  if (item.kind !== 'word' || !item.translationHe) return null;
  // A word with the same meaning (a synonym on the worksheet) would also be a right answer.
  const sameMeaning = item.translationHe.trim();
  const others = list.items.filter((o) => o.id !== item.id && o.translationHe?.trim() !== sameMeaning);
  // Prefer other words as distractors; sentences only top up very short lists.
  const distractors = [
    ...seededShuffle(others.filter((o) => o.kind === 'word'), `${seed}|words`),
    ...seededShuffle(others.filter((o) => o.kind !== 'word'), `${seed}|sentences`),
  ].slice(0, 2);
  if (distractors.length < 2) return null;

  const options: MultipleChoiceOption[] = seededShuffle(
    [
      { textEn: item.textEn, isCorrect: true, explanationHe: `נכון! ${item.textEn} = ${item.translationHe} ✅` },
      ...distractors.map((d) => ({
        textEn: d.textEn,
        isCorrect: false,
        explanationHe: `${d.textEn} היא מילה אחרת מהרשימה. ${byGender(gender, 'נסי שוב!', 'נסה שוב!')}`,
      })),
    ],
    `${seed}|options`
  );
  return {
    id: `${item.id}-meaning`,
    type: 'meaning-match',
    itemId: item.id,
    textEn: item.textEn,
    translationHe: item.translationHe,
    badgeLabelHe: '🔤 מה הפירוש?',
    promptHe: `איזו מילה באנגלית פירושה "${item.translationHe}"?`,
    hintHe: getWordShapeHintHe(item.textEn, distractors.map((d) => d.textEn)),
    options,
  };
}

function buildMagnetStep(item: CustomWordItem, gender: LearnerGender, seed: string): WordListStep | null {
  if (item.kind === 'word') {
    const letters = getSpellingLetters(item.textEn);
    if (letters.length < 2) return null;
    return {
      id: `${item.id}-spelling`,
      type: 'spelling-magnet',
      itemId: item.id,
      textEn: item.textEn,
      translationHe: item.translationHe,
      badgeLabelHe: '🧲 מגנטי אותיות',
      promptHe: byGender(gender, 'האזיני למילה וסדרי את האותיות לפי הסדר.', 'האזן למילה וסדר את האותיות לפי הסדר.'),
      hintHe: getSpellingHintHe(letters),
      letterTiles: seededShuffleNotIdentity(letters, `${seed}|letters`),
    };
  }
  const words = item.textEn.split(' ').filter(Boolean);
  return {
    id: `${item.id}-builder`,
    type: 'sentence-builder',
    itemId: item.id,
    textEn: item.textEn,
    translationHe: item.translationHe,
    badgeLabelHe: '🧩 מגנטי מילים',
    promptHe: byGender(gender, 'סדרי את המילים למשפט מהדף של המורה.', 'סדר את המילים למשפט מהדף של המורה.'),
    hintHe: getSentenceOrderHintHe(words),
    scrambledWords: seededShuffleNotIdentity(words, `${seed}|words`),
  };
}

function buildVoiceStep(item: CustomWordItem, gender: LearnerGender): WordListStep {
  const isWord = item.kind === 'word';
  return {
    id: `${item.id}-voice`,
    type: 'voice-speak',
    itemId: item.id,
    textEn: item.textEn,
    translationHe: item.translationHe,
    badgeLabelHe: '🎙️ אולפן הקול',
    promptHe: isWord
      ? byGender(gender, 'אמרי את המילה בקול באנגלית.', 'אמור את המילה בקול באנגלית.')
      : byGender(gender, 'קראי את המשפט בקול באנגלית.', 'קרא את המשפט בקול באנגלית.'),
    hintHe: getPronunciationTipHe(item.textEn),
  };
}

/**
 * Builds one practice session: up to SESSION_ITEM_COUNT items, in three rounds (meaning, then
 * magnets, then voice), so a word is not shown right before the learner has to spell it.
 */
export function buildWordListSteps(list: CustomWordList, gender: LearnerGender, salt: number): WordListStep[] {
  const seedKey = `${list.id}|${salt}`;
  const picked = seededShuffle(list.items, seedKey).slice(0, SESSION_ITEM_COUNT);
  const meaning = picked.map((item) => buildMeaningStep(item, list, gender, `${seedKey}|${item.id}`));
  const magnets = picked.map((item) => buildMagnetStep(item, gender, `${seedKey}|${item.id}`));
  const voice = picked.map((item) => buildVoiceStep(item, gender));
  return [...meaning, ...magnets, ...voice].filter((s): s is WordListStep => s !== null);
}

/** Case and punctuation insensitive comparison for the built word or sentence. */
export function normalizeForCompare(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s']/g, '').replace(/\s+/g, ' ').trim();
}

// ---- Scoring & rewards -----------------------------------------------------------------

export interface WordListAnswer {
  type: WordListStepType;
  /** Correct on the first try */
  isCorrect: boolean;
  /** Voice step skipped ("quiet place"); not counted in the score */
  isSkipped: boolean;
}

export interface WordListScore {
  correctCount: number;
  scoredCount: number;
  scorePercent: number;
}

export function scoreWordListAnswers(answers: readonly WordListAnswer[]): WordListScore {
  const scored = answers.filter((a) => !a.isSkipped);
  const correctCount = scored.filter((a) => a.isCorrect).length;
  return {
    correctCount,
    scoredCount: scored.length,
    scorePercent: scored.length ? Math.round((correctCount / scored.length) * 100) : 0,
  };
}

export interface WordListReward {
  xp: number;
  diamonds: number;
  isFullReward: boolean;
}

/** Full reward once per list per day, for up to WORD_LIST_DAILY_REWARD_LIMIT lists a day. */
export function getWordListReward(
  profile: LearnerProfile,
  listId: string,
  scorePercent: number,
  todayStr: string
): WordListReward {
  const lists = profile.customWordLists || [];
  const list = lists.find((l) => l.id === listId);
  const rewardedToday = lists.filter((l) => l.id !== listId && l.lastRewardedDateStr === todayStr).length;
  const isFullReward =
    Boolean(list) && list?.lastRewardedDateStr !== todayStr && rewardedToday < WORD_LIST_DAILY_REWARD_LIMIT;
  if (!isFullReward) return { xp: WORD_LIST_REPEAT_XP, diamonds: 0, isFullReward: false };
  return {
    xp: WORD_LIST_REWARD_XP,
    diamonds:
      WORD_LIST_REWARD_DIAMONDS + (scorePercent >= WORD_LIST_HIGH_SCORE ? WORD_LIST_HIGH_SCORE_BONUS_DIAMONDS : 0),
    isFullReward: true,
  };
}

export interface WordListSessionOutcome {
  profile: LearnerProfile;
  reward: WordListReward;
  score: WordListScore;
}

/** Saves a finished session on the list, records the daily activity and grants the reward. */
export function applyWordListResultToProfile(
  profile: LearnerProfile,
  listId: string,
  answers: readonly WordListAnswer[],
  now: Date
): WordListSessionOutcome {
  const score = scoreWordListAnswers(answers);
  const list = (profile.customWordLists || []).find((l) => l.id === listId);
  if (!list) return { profile, reward: { xp: 0, diamonds: 0, isFullReward: false }, score };

  const nowIso = now.toISOString();
  const todayStr = toLocalDateStr(now);
  const reward = getWordListReward(profile, listId, score.scorePercent, todayStr);
  const updatedList: CustomWordList = {
    ...list,
    bestScore: Math.max(list.bestScore ?? 0, score.scorePercent),
    lastPracticedAt: nowIso,
    ...(reward.isFullReward ? { lastRewardedDateStr: todayStr } : {}),
  };

  const withActivity = recordDailyActivity(
    profile,
    {
      missions: 1,
      // Voice and 3-star quest credit only from rewarded sessions, so a tiny list can't farm quests.
      voiceWords: reward.isFullReward ? answers.filter((a) => a.type === 'voice-speak' && !a.isSkipped).length : 0,
      threeStarMissions: reward.isFullReward && score.scorePercent >= WORD_LIST_HIGH_SCORE ? 1 : 0,
    },
    toLocalDateStr(now)
  );
  const xp = withActivity.stats.xp + reward.xp;

  return {
    reward,
    score,
    profile: {
      ...withActivity,
      customWordLists: (profile.customWordLists || []).map((l) => (l.id === listId ? updatedList : l)),
      stats: {
        ...withActivity.stats,
        xp,
        level: levelForXp(xp, withActivity.stats.level),
        diamonds: withActivity.stats.diamonds + reward.diamonds,
      },
    },
  };
}
