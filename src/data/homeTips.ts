import { LearnerProfile } from '../types/learner';

/**
 * First-use tips on the home screen, one at a time, in place of the app tour at first launch (the
 * tour itself stays on demand from the ❓ button). Each tip appears when it becomes useful, is closed
 * for good on this device, and never blocks anything. Hebrew is gender-neutral plural.
 */
export type HomeTipId = 'stars' | 'placement' | 'shop' | 'streak';

export interface HomeTip {
  id: HomeTipId;
  titleHe: string;
  bodyHe: string;
  /** A button that opens something; without one the tip only has its close button */
  action?: { kind: 'placement'; labelHe: string };
}

/** In the order they are offered */
export const HOME_TIPS: readonly HomeTip[] = [
  {
    id: 'stars',
    titleHe: 'כוכבים 🌟',
    bodyHe: 'כל משימה נותנת עד 3 כוכבים. אפשר לחזור ולשפר את התוצאה.',
  },
  {
    id: 'placement',
    titleHe: 'רוצים שנתאים את הרמה? 🎯',
    bodyHe: 'עשר שאלות קצרות, ואנחנו מציעים את הרמה שמתאימה. אפשר לדלג.',
    action: { kind: 'placement', labelHe: 'למבחן קצר' },
  },
  {
    id: 'shop',
    titleHe: 'יש לכם יהלומים 💎',
    bodyHe: 'בחנות אפשר להשתמש בהם לאווטארים, למדבקות ולקישוטים לחדר.',
  },
  {
    id: 'streak',
    titleHe: 'הרצף שלכם 🔥',
    bodyHe: 'הרצף גדל בכל יום שמתרגלים. חוזרים מחר כדי להמשיך אותו!',
  },
];

const SHOP_TIP_MIN_DIAMONDS = 50;

function isTipRelevant(id: HomeTipId, profile: LearnerProfile): boolean {
  const { missionsCompleted, diamonds, streakDays } = profile.stats;
  switch (id) {
    case 'stars':
      return missionsCompleted >= 1;
    case 'placement':
      return missionsCompleted >= 1 && !profile.placementResult;
    case 'shop':
      return missionsCompleted >= 1 && diamonds >= SHOP_TIP_MIN_DIAMONDS;
    case 'streak':
      return streakDays >= 1;
    default:
      return false;
  }
}

/** The one tip to show now: the first relevant tip that was not closed, or null */
export function getActiveHomeTip(profile: LearnerProfile, isDismissed: (id: HomeTipId) => boolean): HomeTip | null {
  return HOME_TIPS.find((tip) => !isDismissed(tip.id) && isTipRelevant(tip.id, profile)) ?? null;
}

const keyFor = (uid: string, id: HomeTipId) => `english_tutor_home_tip_${id}_${uid}`;

/** Device only, not synced: a tip is a hint, so seeing one twice on another device is harmless */
export function isHomeTipDismissed(uid: string, id: HomeTipId): boolean {
  try {
    return window.localStorage.getItem(keyFor(uid, id)) === '1';
  } catch {
    return false;
  }
}

export function dismissHomeTip(uid: string, id: HomeTipId): void {
  try {
    window.localStorage.setItem(keyFor(uid, id), '1');
  } catch {
    // Storage blocked (private mode): the tip may show again next visit, which is harmless
  }
}
