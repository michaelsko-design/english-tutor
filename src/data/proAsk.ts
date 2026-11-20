import { APP_NAME } from '../config/appInfo';
import { PARENT_PARAM, buildParentUrl } from './parentLink';

/**
 * The learner's side of EnglishVibe Pro (docs/feature-pro-tier.md, "The learner's side"): a neutral
 * "for parents" hand-off. The law on marketing to minors (Consumer Protection regulations, 1991,
 * s.3(4)-(6)) bars urging a child to buy or to persuade a parent, so the learner only sees that a part
 * is in the full plan and can share a link to the parent area. Prices, perks and offers are for parents.
 */

/** How the Hebrew voice says "Pro" (niqqud keeps it from reading פרו as "paru") */
export const PRO_SPOKEN_HE = 'פְּרוֹ';

/** The button on a locked part: opens the parents' info */
export const PARENTS_AREA_LABEL_HE = 'לאזור ההורים';
/** The parents' info button that makes the link to share */
export const SHARE_PARENTS_AREA_LABEL_HE = 'שיתוף קישור לאזור ההורים';

/** Tells the parent portal to open on the plans */
export const PRO_INTENT_PARAM = 'pro';

/** What a locked part opened the parents' info with: the locked thing the learner tapped */
export const PRO_ASK_FOCUSES = ['missions', 'exam', 'lists', 'themes'] as const;
export type ProAskFocus = (typeof PRO_ASK_FOCUSES)[number];

/** The link a parent opens: with a new pairing code, or just the portal when a parent is already paired. */
export function buildProAskUrl(origin: string, parentCode: string | null): string {
  const base = parentCode
    ? buildParentUrl(origin, parentCode)
    : `${origin.replace(/\/+$/, '')}/?${PARENT_PARAM}`;
  return `${base}&${PRO_INTENT_PARAM}=1`;
}

/** The shared message: an informational hand-off, not the child's voice and not a request to buy */
export function buildParentsAreaMessageHe(url: string): string {
  return `קישור לאזור ההורים ב-${APP_NAME} (דוח שבועי ומידע על המסלול המלא):\n${url}`;
}

export const PARENT_INFO_TITLE_HE = 'תוכן במסלול המלא — מידע להורים';
const PARENT_INFO_BODY = (pro: string) =>
  `החלק הזה כלול במסלול ${pro}. אפשר להמשיך לתרגל בחלקים הפתוחים, והורים יכולים להיכנס לאזור ההורים למידע נוסף.`;
/** The parents' info line as shown ("Pro" is set apart as English by the screen) */
export const PARENT_INFO_BODY_HE = PARENT_INFO_BODY('Pro');
/** What its 🔊 reads to grades 1–2 (one clip, gender-neutral, in the Hebrew corpus) */
export const PARENT_INFO_SPOKEN_HE = PARENT_INFO_BODY(PRO_SPOKEN_HE);
