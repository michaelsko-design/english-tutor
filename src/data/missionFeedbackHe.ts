/**
 * Fixed Hebrew feedback lines of the mission runner. They live here so the Hebrew clip corpus
 * (scripts/tts/hebrewCorpus.ts) renders exactly the text the runner shows (Feature 47).
 */
import type { LearnerGender } from '../types/learner';
import { isolateLtr } from '../utils/hints';

export function getSentenceOrderWrongHe(gender: LearnerGender): string {
  return gender === 'girl'
    ? 'עדיין לא בסדר הנכון — בדקי את מיקום הפועל או היעזרי ברמז 💡'
    : 'עדיין לא בסדר הנכון — בדוק את מיקום הפועל או היעזר ברמז 💡';
}

export function getVoiceSkippedHe(gender: LearnerGender): string {
  return gender === 'girl'
    ? 'דילגת על מיקרופון במצב שקט — ממשיכות לשלב הבא!'
    : 'דילגת על מיקרופון במצב שקט — ממשיכים לשלב הבא!';
}

/** Grade 1's blending build step (Feature 48): the word is right. */
export function getWordBuiltHe(word: string): string {
  return `מעולה! בנית את המילה ${isolateLtr(word)} 🧲`;
}

export function getWordBuildWrongHe(gender: LearnerGender): string {
  return gender === 'girl'
    ? 'עדיין לא. הקשיבי שוב למילה 🔊 ונסי שוב!'
    : 'עדיין לא. הקשב שוב למילה 🔊 ונסה שוב!';
}
