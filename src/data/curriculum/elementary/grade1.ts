import { buildElementaryGrade } from './builder';
import { GRADE_1_PHONICS_UNITS } from './grade1Phonics';
import { GRADE_1_TOPIC_UNITS } from './grade1Topics';

/**
 * Grade 1 — Pre-Foundation, 10 units × 3 missions (the 3rd mission of each unit is a Boss):
 * the letters A–Z (units 1–4), blending them into words (units 5–6), then greetings, colors,
 * numbers, body, classroom, fruit and toys (units 7–10).
 */
export const grade1Curriculum = buildElementaryGrade('grade-1', [...GRADE_1_PHONICS_UNITS, ...GRADE_1_TOPIC_UNITS]);
