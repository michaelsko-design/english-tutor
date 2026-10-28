import { APP_NAME } from '../config/appInfo';
import type { LearnerGender } from '../types/learner';
import { PARENT_PARAM, buildParentUrl } from './parentLink';

/**
 * The kid-safe "ask a parent" step of EnglishVibe Pro (docs/feature-pro-tier.md): the learner sends a
 * parent a link to the parent portal. No prices or plans are ever shown to the learner.
 */

export const ASK_PARENT_LABEL_HE = 'לבקש מהורה 💬';

/** Tells the parent portal to open on the child's Pro card */
export const PRO_INTENT_PARAM = 'pro';

/** The link a parent opens: with a new pairing code, or just the portal when a parent is already paired. */
export function buildProAskUrl(origin: string, parentCode: string | null): string {
  const base = parentCode
    ? buildParentUrl(origin, parentCode)
    : `${origin.replace(/\/+$/, '')}/?${PARENT_PARAM}`;
  return `${base}&${PRO_INTENT_PARAM}=1`;
}

/** The message the learner sends. The parent's gender is unknown, so only the sender's is used. */
export function buildProAskMessageHe(childName: string, gender: LearnerGender, url: string): string {
  const isGirl = gender === 'girl';
  const name = childName.trim();
  const hello = name ? `היי! כאן ${name} 😊` : 'היי! 😊';
  const learns = isGirl ? 'לומדת' : 'לומד';
  return `${hello} אני ${learns} אנגלית ב-${APP_NAME} ורוצה לפתוח את כל המשימות. אפשר לשדרג כאן:\n${url}`;
}

const askKey = (uid: string) => `english_tutor_pro_ask_${uid}`;

/** One ask a day: kindness to parents, not security (the server needs no limit). */
export function hasAskedToday(uid: string, todayStr: string): boolean {
  try {
    return localStorage.getItem(askKey(uid)) === todayStr;
  } catch {
    return false;
  }
}

export function rememberAsk(uid: string, todayStr: string): void {
  try {
    localStorage.setItem(askKey(uid), todayStr);
  } catch {
    // Storage blocked: the learner may ask again today, which is harmless
  }
}
