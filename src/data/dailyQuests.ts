import type { DailyActivityCounters, DailyActivityKind, LearnerProfile } from '../types/learner';
import { inflectHebrew } from '../utils/hebrewGender';
import { seededShuffle } from '../utils/shuffle';
import { getQuickReviewWords } from './missedWords';

/**
 * Rotating daily quests (retention audit): every day the play-a-mission quest plus
 * ROTATING_QUESTS_PER_DAY quests picked by the date alone, so every learner gets the same quests on
 * the same day. A quest is offered only when the learner can do it today. The day's list is frozen
 * in the counters at the first session (data/progressRewards.ts), so a quest never disappears
 * mid-day once its activity is done (the 1-minute review, say).
 */

export interface DailyQuestDefinition {
  id: string;
  icon: string;
  titleEn: string;
  /** Addressed to a girl; inflected for a boy */
  titleHe: string;
  targetCount: number;
  rewardDiamonds: number;
  rewardXp: number;
  getCurrentCount: (counters: DailyActivityCounters) => number;
}

interface RotatingQuest extends DailyQuestDefinition {
  /** Whether the learner can do it today; missing means always */
  isAvailable?: (profile: LearnerProfile, todayStr: string) => boolean;
}

export const ROTATING_QUESTS_PER_DAY = 2;

const countKind =
  (kind: DailyActivityKind) =>
  (counters: DailyActivityCounters): number =>
    counters.kindCounts?.[kind] ?? 0;

export const ANCHOR_QUEST: DailyQuestDefinition = {
  id: 'quest-daily-mission',
  icon: '🎯',
  titleEn: 'Complete 1 Mission Today',
  titleHe: 'השלימי משימה אחת היום',
  targetCount: 1,
  rewardDiamonds: 20,
  rewardXp: 30,
  getCurrentCount: (c) => c.missionsCompletedToday,
};

export const ROTATING_QUESTS: readonly RotatingQuest[] = [
  {
    id: 'quest-voice-words',
    icon: '🎙️',
    titleEn: 'Practice Speaking 2 Words or Sentences',
    titleHe: 'תרגלי הגייה של 2 מילים או משפטים במיקרופון',
    targetCount: 2,
    rewardDiamonds: 15,
    rewardXp: 25,
    getCurrentCount: (c) => c.voiceWordsPracticedToday,
  },
  {
    id: 'quest-three-stars',
    icon: '⭐',
    titleEn: 'Finish a Mission with 3 Stars',
    titleHe: 'סיימי משימה עם 3 כוכבים מלאים',
    targetCount: 1,
    rewardDiamonds: 25,
    rewardXp: 40,
    getCurrentCount: (c) => c.threeStarMissionsToday,
  },
  {
    id: 'quest-map-missions',
    icon: '🗺️',
    titleEn: 'Complete 2 Missions on the Map',
    titleHe: 'השלימי 2 משימות במפה',
    targetCount: 2,
    rewardDiamonds: 20,
    rewardXp: 35,
    getCurrentCount: countKind('map-mission'),
  },
  {
    id: 'quest-voice-five',
    icon: '🎤',
    titleEn: 'Say 5 Words or Sentences Aloud',
    titleHe: 'אמרי 5 מילים או משפטים במיקרופון',
    targetCount: 5,
    rewardDiamonds: 20,
    rewardXp: 35,
    getCurrentCount: (c) => c.voiceWordsPracticedToday,
  },
  {
    id: 'quest-quick-review',
    icon: '⏱️',
    titleEn: 'Finish the 1-Minute Review',
    titleHe: 'סיימי את החזרה של דקה',
    targetCount: 1,
    rewardDiamonds: 15,
    rewardXp: 25,
    getCurrentCount: countKind('quick-review'),
    isAvailable: (p, today) => getQuickReviewWords(p.missedWords, p.quickReviewDoneOn, today).length > 0,
  },
  {
    id: 'quest-word-game',
    icon: '🧩',
    titleEn: 'Finish a Word Game in Your Room',
    titleHe: 'סיימי משחק מילים בחדר',
    targetCount: 1,
    rewardDiamonds: 15,
    rewardXp: 25,
    getCurrentCount: countKind('word-game'),
  },
  {
    id: 'quest-word-list',
    icon: '📚',
    titleEn: 'Practice a Word List',
    titleHe: 'תרגלי רשימת מילים',
    targetCount: 1,
    rewardDiamonds: 15,
    rewardXp: 25,
    getCurrentCount: countKind('word-list'),
  },
  {
    id: 'quest-dress-up',
    icon: '👕',
    titleEn: "Win Today's Dress-Up Prize in the Wardrobe",
    titleHe: 'השיגי את פרס ההלבשה היומי בארון',
    targetCount: 1,
    rewardDiamonds: 15,
    rewardXp: 25,
    getCurrentCount: countKind('dress-up'),
  },
  {
    id: 'quest-contest',
    icon: '⚔️',
    titleEn: 'Finish a Contest with a Friend',
    titleHe: 'סיימי תחרות עם חבר או חברה',
    targetCount: 1,
    rewardDiamonds: 20,
    rewardXp: 30,
    getCurrentCount: countKind('contest'),
    // Friends live on the server; a learner who has played a contest before has someone to play
    isAvailable: (p) => p.friendsHub?.isEnabled === true && (p.friendsHub.contestHistory?.length ?? 0) > 0,
  },
  {
    id: 'quest-exam-prep',
    icon: '📝',
    titleEn: 'Practice for Your Exam',
    titleHe: 'תרגלי למבחן לפי התוכנית',
    targetCount: 1,
    rewardDiamonds: 20,
    rewardXp: 35,
    getCurrentCount: countKind('exam-prep'),
    isAvailable: (p, today) => Boolean(p.examPrep && p.examPrep.examDateStr >= today),
  },
];

const ALL_QUESTS: readonly DailyQuestDefinition[] = [ANCHOR_QUEST, ...ROTATING_QUESTS];

/** The ids of the day's quests: the anchor, then the first open rotating quests in the day's order. */
export function pickDailyQuestIds(profile: LearnerProfile, todayStr: string): string[] {
  const rotating = seededShuffle(ROTATING_QUESTS, `daily-quests:${todayStr}`)
    .filter((quest) => quest.isAvailable?.(profile, todayStr) ?? true)
    .slice(0, ROTATING_QUESTS_PER_DAY)
    .map((quest) => quest.id);
  return [ANCHOR_QUEST.id, ...rotating];
}

/** Today's quests in the learner's gender: the list frozen today, or today's pick before any session. */
export function getDailyQuests(profile: LearnerProfile, todayStr: string): DailyQuestDefinition[] {
  const counters = profile.dailyCounters;
  const frozen = counters?.dateStr === todayStr ? counters.questIds : undefined;
  const ids = frozen && frozen.length > 0 ? frozen : pickDailyQuestIds(profile, todayStr);
  return ids
    .map((id) => ALL_QUESTS.find((quest) => quest.id === id))
    .filter((quest): quest is DailyQuestDefinition => quest !== undefined)
    .map((quest) => ({ ...quest, titleHe: inflectHebrew(quest.titleHe, profile.gender) }));
}
