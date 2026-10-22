/**
 * Hebrew read-aloud for young learners (Feature 47). Only grades 1–2 hear Hebrew: they can't read the
 * instructions yet, so the instruction, hint and feedback play by themselves and carry a 🔊. Later
 * grades get no Hebrew 🔊 and no Hebrew clips (the corpus is built for `HEBREW_AUDIO_GRADES` only).
 * The Hebrew they hear is rendered as clips (scripts/tts/hebrewCorpus.ts); text with the learner's
 * name or a speech transcript goes to the online Hebrew voice.
 */
import { createContext, useContext } from 'react';
import type { GradeId } from '../types/learner';

export const HEBREW_AUDIO_GRADES: readonly GradeId[] = ['grade-1', 'grade-2'];

/** Whether the Hebrew instructions play by themselves for this grade. */
export function playsHebrewAloud(gradeId: GradeId): boolean {
  return HEBREW_AUDIO_GRADES.includes(gradeId);
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
