import type { LearnerGender } from '../../types/learner';
import { isolateLtr } from '../../utils/bidi';
import { hebrewTemplate } from '../../utils/hebrewGender';

/** The Vault's deck list and the deck session: Hebrew written for a girl, inflected for a boy. */
export interface DeckCopy {
  sectionTitleHe: string;
  sectionHintHe: string;
  startHe: string;
  showWordsHe: string;
  hideWordsHe: string;
  proLockedHe: string;
}

export function getDeckCopy(gender: LearnerGender): DeckCopy {
  const he = hebrewTemplate(gender);
  return {
    sectionTitleHe: '📘 ערכות המילים של משרד החינוך',
    sectionHintHe: he`בחרי ערכה ותרגלי: מילה שעונים עליה נכון בניסיון הראשון ביומיים שונים נחשבת מילה שנשלטה.`,
    startHe: he`תרגלי את הערכה`,
    showWordsHe: 'הצגת המילים',
    hideWordsHe: 'הסתרת המילים',
    proLockedHe: `🔒 ערכה של ${isolateLtr('Pro')}`,
  };
}

/** "12 מילים · 3 נשלטו": Hebrew puts the number after the noun for one word */
export function getDeckProgressHe(wordCount: number, masteredCount: number): string {
  const words = wordCount === 1 ? 'מילה אחת' : `${wordCount} מילים`;
  return `${words} · ${masteredCount} נשלטו`;
}

/** Shown on the result screen when the deck already paid in full today */
export const DECK_REPEAT_REWARD_NOTE_HE = 'הפרס המלא ניתן פעם ביום לכל ערכה';
