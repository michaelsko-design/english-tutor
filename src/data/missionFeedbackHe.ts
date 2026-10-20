/**
 * Fixed Hebrew feedback lines of the mission runner. They live here so the Hebrew clip corpus
 * (scripts/tts/hebrewCorpus.ts) renders exactly the text the runner shows (Feature 47).
 */
import type { LearnerGender } from '../types/learner';

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
