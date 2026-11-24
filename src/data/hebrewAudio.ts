/**
 * Hebrew read-aloud for young learners (Feature 47). Only grades 1–2 hear Hebrew, and only under age 8:
 * they can't read the instructions yet, so the instruction, hint and feedback play by themselves and
 * carry a 🔊. An older child who starts English at grade 1 reads Hebrew already (age 8 is 3rd grade at
 * school) and gets none. Later grades get no Hebrew 🔊 and no Hebrew clips (the corpus is built for
 * `HEBREW_AUDIO_GRADES` only).
 * The Hebrew they hear is rendered as clips (scripts/tts/hebrewCorpus.ts); text with the learner's
 * name or a speech transcript goes to the online Hebrew voice.
 */
import { createContext, useContext } from 'react';
import type { GradeId, LearnerProfile } from '../types/learner';

export const HEBREW_AUDIO_GRADES: readonly GradeId[] = ['grade-1', 'grade-2'];

/** From this age a child reads Hebrew (3rd grade at school), whatever their English level. */
export const HEBREW_READER_AGE = 8;

/**
 * Whether the learner's English level starts at the beginning: grades 1–2 are not expected to know the
 * English letters, so they start with the letters lesson. English level only, whatever the age.
 */
export function startsWithLettersLesson(gradeId: GradeId): boolean {
  return HEBREW_AUDIO_GRADES.includes(gradeId);
}

/** Whether the Hebrew instructions play by themselves: English grades 1–2, for a child too young to read Hebrew. */
export function playsHebrewAloud(learner: Pick<LearnerProfile, 'gradeId' | 'age'>): boolean {
  const isReader = Number.isFinite(learner.age) && learner.age >= HEBREW_READER_AGE;
  return startsWithLettersLesson(learner.gradeId) && !isReader;
}

/**
 * Whether the Hebrew 🔊 buttons and the Hebrew autoplay show for the current learner. Provided once by
 * App from `playsHebrewAloud`; off by default so a screen outside it never voices Hebrew.
 */
export const HebrewAudioContext = createContext(false);

export function useReadsHebrewAloud(): boolean {
  return useContext(HebrewAudioContext);
}

/** One part of a spoken sequence: the Hebrew instruction, the English question, the feedback. */
export interface SpokenPart {
  text: string;
  lang: 'en' | 'he';
  rate?: number;
}
