/**
 * Exam question bank (Feature 43): loading a grade's bank on demand and turning its items into
 * exam session steps. Exam prep uses the bank for every unit that has one, and the units'
 * mission questions for the rest (see `getBlockSteps` in examPrep.ts).
 *
 * The banks live in `curriculum/examBank/grade<N>.ts` and load only when a session opens, so
 * they never add to the first download.
 */
import type { ExamSkill, GradeId, LearnerGender, ProficiencyTier } from '../types/learner';
import type { ExamSessionStep } from './examPrep';
import type { MultipleChoiceOption } from './missionExercises';
import { shuffleStepChoices } from './missionExercises';
import { getStoryHintHe } from './elementaryExercises';
import {
  EXAM_BANK_BLANK,
  EXAM_MOCK_RESERVED_PER_LIST,
  type ExamBankPack,
  type ExamUnitBank,
} from './curriculum/examBank/types';
import { getSentenceOrderHintHe, isolateLtr } from '../utils/hints';
import { hebrewTemplate } from '../utils/hebrewGender';

export type {
  ExamBankPack,
  ExamGrammarItem,
  ExamPassage,
  ExamPassageQuestion,
  ExamSentenceItem,
  ExamUnitBank,
  ExamVocabItem,
} from './curriculum/examBank/types';

/** Grades with a bank; the others practise with their missions' questions. */
export const EXAM_BANK_LOADERS: Partial<Record<number, () => Promise<ExamBankPack>>> = {
  7: () => import('./curriculum/examBank/grade7').then((m) => m.GRADE_7_EXAM_BANK),
  8: () => import('./curriculum/examBank/grade8').then((m) => m.GRADE_8_EXAM_BANK),
  9: () => import('./curriculum/examBank/grade9').then((m) => m.GRADE_9_EXAM_BANK),
  10: () => import('./curriculum/examBank/grade10').then((m) => m.GRADE_10_EXAM_BANK),
  11: () => import('./curriculum/examBank/grade11').then((m) => m.GRADE_11_EXAM_BANK),
  12: () => import('./curriculum/examBank/grade12').then((m) => m.GRADE_12_EXAM_BANK),
};

function getGradeNumber(gradeId: GradeId): number {
  return Number(gradeId.replace('grade-', ''));
}

/** The grade's bank. Null when it has none yet, or when loading fails (offline). */
export async function loadExamBank(gradeId: GradeId): Promise<ExamBankPack | null> {
  const load = EXAM_BANK_LOADERS[getGradeNumber(gradeId)];
  if (!load) return null;
  try {
    return await load();
  } catch {
    // A missing chunk (offline, or a new release) only means the session uses the mission questions.
    return null;
  }
}

/** Practice sessions use the first items of each list; the mock exam only the reserved ones. */
export type ExamBankPool = 'practice' | 'mock';

export interface BankStepInput {
  gradeId: GradeId;
  unitNumber: number;
  skill: ExamSkill;
  pool: ExamBankPool;
  tier: ProficiencyTier;
  gender: LearnerGender;
  salt: number;
  badgeLabelHe: string;
}

/** The items of a list that belong to the pool, with their index in the list. */
function pickPool<T>(items: readonly T[], pool: ExamBankPool): { item: T; index: number }[] {
  const firstReserved = Math.max(0, items.length - EXAM_MOCK_RESERVED_PER_LIST);
  return items
    .map((item, index) => ({ item, index }))
    .filter(({ index }) => (pool === 'mock' ? index >= firstReserved : index < firstReserved));
}

/** Explorer chooses between two options, the other tiers between three. */
function toOptions(
  correct: string,
  wrong: readonly [string, string],
  tier: ProficiencyTier,
  explain: { correct: string; wrong: string }
): MultipleChoiceOption[] {
  const wrongs = tier === 'explorer' ? wrong.slice(0, 1) : wrong;
  return [
    { textEn: correct, isCorrect: true, explanationHe: explain.correct },
    ...wrongs.map((textEn) => ({ textEn, isCorrect: false, explanationHe: explain.wrong })),
  ];
}

function toWords(sentenceEn: string): string[] {
  return sentenceEn.replace(/[.!?",]/g, '').split(/\s+/).filter(Boolean);
}

/**
 * The bank items of one (unit × skill) block as exam steps, options and chips shuffled per
 * session. Ids are `exam-g<grade>-u<unit>-<skill>-<index>`; an unseen question's index is
 * `<passage>.<question>`.
 */
export function buildBankSteps(unitBank: ExamUnitBank, input: BankStepInput): ExamSessionStep[] {
  const { skill, tier, pool, unitNumber, badgeLabelHe } = input;
  const he = hebrewTemplate(input.gender);
  const idPrefix = `exam-g${getGradeNumber(input.gradeId)}-u${unitNumber}-${skill}`;
  const base = { skill, unitNumber, badgeLabelHe, stepNumber: 1 };
  let steps: ExamSessionStep[];

  if (skill === 'vocabulary') {
    steps = pickPool(unitBank.vocabulary, pool).map(({ item, index }) => ({
      ...base,
      id: `${idPrefix}-${index}`,
      type: 'chat-reply',
      promptHe: he`איזו מילה משלימה את המשפט? בחרי:`,
      hintHe: `💡 המשפט בעברית: "${item.clozeHe}"`,
      questionEn: item.clozeEn,
      options: toOptions(item.answer, item.wrong, tier, {
        correct: he`מעולה! "${isolateLtr(item.clozeEn.replace(EXAM_BANK_BLANK, item.answer))}"`,
        wrong: he`לא בדיוק — המילה הזאת לא מתאימה למשפט. נסי שוב!`,
      }),
    }));
  } else if (skill === 'grammar') {
    steps = pickPool(unitBank.grammar, pool).map(({ item, index }) => ({
      ...base,
      id: `${idPrefix}-${index}`,
      type: 'grammar-detective',
      promptHe: he`בחרי את התשובה הנכונה:`,
      hintHe: `💡 ${item.hintHe}`,
      questionEn: item.questionEn,
      options: toOptions(item.correct, item.wrong, tier, {
        correct: he`כל הכבוד! ${item.explainHe}`,
        wrong: he`לא בדיוק. ${item.explainHe}`,
      }),
    }));
  } else if (skill === 'sentences') {
    steps = pickPool(unitBank.sentences, pool).map(({ item, index }) => {
      const words = toWords(item.en);
      return {
        ...base,
        id: `${idPrefix}-${index}`,
        type: 'sentence-builder',
        promptHe: he`לחצי על המילים לפי הסדר הנכון כדי להרכיב את המשפט:`,
        hintHe: `💡 ${getSentenceOrderHintHe(words)}`,
        questionEn: 'Tap the words in the right order:',
        targetSentenceEn: item.en,
        targetSentenceHe: item.he,
        scrambledWords: words,
      };
    });
  } else {
    const passageIndex = pool === 'mock' ? 1 : 0;
    const passage = unitBank.passages[passageIndex];
    steps = passage.questions.map((question, index) => ({
      ...base,
      id: `${idPrefix}-${passageIndex}.${index}`,
      type: 'story-unseen',
      promptHe: he`קראי את הקטע ובחרי את התשובה הנכונה:`,
      hintHe: getStoryHintHe({ passageEn: passage.passageEn, ...question }, tier === 'explorer'),
      contextPassageEn: passage.passageEn,
      contextPassageHe: tier === 'master' ? undefined : passage.passageHe,
      questionEn: question.questionEn,
      options: toOptions(question.correct, question.wrong, tier, {
        correct: 'מעולה! זו התשובה הנכונה לפי הקטע 🎯',
        wrong: he`נסי שוב — חפשי את התשובה בקטע 🔍`,
      }),
    }));
  }

  return steps.map((step) => shuffleStepChoices(step, `${step.id}|${tier}|${input.salt}`));
}
