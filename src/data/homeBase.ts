import { CurriculumUnit } from './curriculum/types';
import { DailyQuestDefinition } from './rewardShop';
import { BossGate } from './milestones';
import { DailyActivityCounters, LearnerGender } from '../types/learner';

/**
 * Home Base dashboard (Feature 27): pure helpers for the quest rings, the companion's
 * greeting, the Play button, the map peek and the first-launch sequence.
 */

export type QuestRingState = 'progress' | 'ready' | 'claimed';

export interface QuestRing {
  id: string;
  icon: string;
  titleHe: string;
  current: number;
  target: number;
  /** Ring fill, 0..1 */
  ratio: number;
  state: QuestRingState;
  rewardDiamonds: number;
}

/** One ring per daily quest: its progress and whether its reward is ready or already taken. */
export function getQuestRings(
  quests: DailyQuestDefinition[],
  counters: DailyActivityCounters,
  claimedQuestIds: string[]
): QuestRing[] {
  return quests.map((quest) => {
    const current = Math.min(quest.targetCount, Math.max(0, quest.getCurrentCount(counters)));
    const isClaimed = claimedQuestIds.includes(quest.id);
    const isComplete = current >= quest.targetCount;
    return {
      id: quest.id,
      icon: quest.icon,
      titleHe: quest.titleHe,
      current,
      target: quest.targetCount,
      ratio: quest.targetCount > 0 ? current / quest.targetCount : 1,
      state: isClaimed ? 'claimed' : isComplete ? 'ready' : 'progress',
      rewardDiamonds: quest.rewardDiamonds,
    };
  });
}

export interface RingDash {
  circumference: number;
  /** stroke-dashoffset that leaves `ratio` of the ring drawn */
  offset: number;
}

/** Stroke dash values for an SVG progress ring of this radius. */
export function getRingDash(ratio: number, radius: number): RingDash {
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, ratio));
  return { circumference, offset: circumference * (1 - clamped) };
}

export interface HomeGreetingInput {
  gender: LearnerGender;
  name: string;
  /** The suggested mission is a replay to open a star-gated Boss */
  bossGate: BossGate | null;
  /** Missions finished today (from the daily counters) */
  missionsToday: number;
  /** No mission of any grade has a star yet */
  isFirstMission: boolean;
}

/** The companion's speech bubble on the home scene, in gendered Hebrew. */
export function getHomeGreetingHe({
  gender,
  name,
  bossGate,
  missionsToday,
  isFirstMission,
}: HomeGreetingInput): string {
  const isGirl = gender === 'girl';
  const cleanName = name.trim() || (isGirl ? 'אלופה' : 'אלוף');
  if (isFirstMission) {
    return isGirl
      ? `היי ${cleanName}! בואי נתחיל את ההרפתקה הראשונה שלנו 🚀`
      : `היי ${cleanName}! בוא נתחיל את ההרפתקה הראשונה שלנו 🚀`;
  }
  if (bossGate) {
    return isGirl
      ? `${cleanName}, עוד ${bossGate.missing} ⭐ והבוס נפתח! ננסה לשפר משימה?`
      : `${cleanName}, עוד ${bossGate.missing} ⭐ והבוס נפתח! ננסה לשפר משימה?`;
  }
  if (missionsToday > 0) {
    return isGirl
      ? `כל הכבוד ${cleanName}! עוד משימה אחת? 🌟`
      : `כל הכבוד ${cleanName}! עוד משימה אחת? 🌟`;
  }
  return isGirl
    ? `היי ${cleanName}! מוכנה למשימה של היום?`
    : `היי ${cleanName}! מוכן למשימה של היום?`;
}

/** The big Play button's label: play the next mission, or replay one for the Boss stars. */
export function getPlayLabelHe(gender: LearnerGender, isReplay: boolean): string {
  const isGirl = gender === 'girl';
  if (isReplay) return isGirl ? 'שפרי כוכבים' : 'שפר כוכבים';
  return isGirl ? 'בואי נשחק!' : 'בוא נשחק!';
}

export interface MapPeek {
  /** The unit of the first mission without stars (the last unit once everything has stars) */
  unitNumber: number;
  unitTitleHe: string;
  unitEmoji: string;
  starsEarned: number;
  starsPossible: number;
  missionsCompleted: number;
  missionsTotal: number;
}

const MAX_STARS_PER_MISSION = 3;

/** The small strip above the full map: where the learner is and the grade's star total. */
export function getMapPeek(units: CurriculumUnit[], progress: Record<string, number>): MapPeek | null {
  if (units.length === 0) return null;
  const missions = units.flatMap((u) => u.missions);
  const starsOf = (id: string) => Math.min(MAX_STARS_PER_MISSION, progress[id] || 0);
  const currentUnit =
    units.find((u) => u.missions.some((m) => starsOf(m.id) === 0)) ?? units[units.length - 1];
  return {
    unitNumber: currentUnit.unitNumber,
    unitTitleHe: currentUnit.titleHe,
    unitEmoji: currentUnit.badgeEmoji,
    starsEarned: missions.reduce((acc, m) => acc + starsOf(m.id), 0),
    starsPossible: missions.length * MAX_STARS_PER_MISSION,
    missionsCompleted: missions.filter((m) => starsOf(m.id) > 0).length,
    missionsTotal: missions.length,
  };
}

export type FirstLaunchStep = 'greeting' | 'placement';

/**
 * The first-launch sequence, one screen after another: the companion's greeting with the
 * welcome chest (once per profile), then the placement test offer (right after first-time
 * onboarding only).
 */
export function getFirstLaunchSteps(input: {
  hasSeenWelcomeGift: boolean;
  isOfferingPlacement: boolean;
}): FirstLaunchStep[] {
  const steps: FirstLaunchStep[] = [];
  if (!input.hasSeenWelcomeGift) steps.push('greeting');
  if (input.isOfferingPlacement) steps.push('placement');
  return steps;
}
