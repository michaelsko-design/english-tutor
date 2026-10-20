/**
 * Hebrew read-aloud for young learners (Feature 47). Grades 1–2 can't read the Hebrew instructions
 * yet, so the instruction, hint and feedback play by themselves for them; everyone else gets a 🔊.
 * The Hebrew they hear is rendered as clips (scripts/tts/hebrewCorpus.ts); text with the learner's
 * name or a speech transcript goes to the online Hebrew voice.
 */
import type { GradeId } from '../types/learner';

export const HEBREW_AUDIO_GRADES: readonly GradeId[] = ['grade-1', 'grade-2'];

/** Whether the Hebrew instructions play by themselves for this grade. */
export function playsHebrewAloud(gradeId: GradeId): boolean {
  return HEBREW_AUDIO_GRADES.includes(gradeId);
}

/** One part of a spoken sequence: the Hebrew instruction, the English question, the feedback. */
export interface SpokenPart {
  text: string;
  lang: 'en' | 'he';
  rate?: number;
}
