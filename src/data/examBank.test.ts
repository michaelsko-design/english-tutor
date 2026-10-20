import { describe, expect, it } from 'vitest';
import { CURRICULUM_BY_GRADE } from './curriculum';
import { ALL_EXAM_BANKS } from './curriculum/examBank';
import { ALL_LESSON_PACKS } from './curriculum/lessons';
import {
  EXAM_BANK_BLANK,
  EXAM_BANK_ITEMS_PER_LIST,
  EXAM_MOCK_RESERVED_PER_LIST,
  type ExamBankPack,
} from './curriculum/examBank/types';
import { buildBankSteps, EXAM_BANK_LOADERS, loadExamBank, type BankStepInput } from './examBank';
import { getExercisesForMission } from './missionExercises';
import { VOICE_MESSAGES } from './voiceMessages';
import { findAnswerSentenceNumber } from '../utils/hints';
import { inflectHebrew } from '../utils/hebrewGender';
import { decidingWords, toTokens } from './testing/answerWords';
import type { ExamSkill, GradeId, ProficiencyTier } from '../types/learner';

const TIERS: ProficiencyTier[] = ['explorer', 'challenger', 'master'];
const SKILLS: ExamSkill[] = ['vocabulary', 'grammar', 'sentences', 'unseen'];
const BANKS = Object.entries(ALL_EXAM_BANKS).map(([grade, bank]) => ({
  grade: Number(grade),
  gradeId: `grade-${grade}` as GradeId,
  bank: bank as ExamBankPack,
}));

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function fillBlank(clozeEn: string, answer: string): string {
  return clozeEn.replace(EXAM_BANK_BLANK, answer);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Every English text a learner meets outside exam prep: missions (every tier), lessons, voice messages. */
function collectTextsOutsideExams(): Set<string> {
  const texts = new Set<string>();
  const add = (text: string | undefined) => {
    if (text && countWords(text) >= 3) texts.add(normalize(text.replace(/_+/g, ' ')));
  };
  for (const pack of Object.values(CURRICULUM_BY_GRADE)) {
    for (const mission of pack.units.flatMap((u) => u.missions)) {
      add(mission.sampleSentenceEn);
      mission.vocabulary.forEach((v) => add(v.exampleEn));
      for (const tier of TIERS) {
        for (const step of getExercisesForMission(mission, tier)) {
          [step.questionEn, step.contextPassageEn, step.targetSentenceEn, step.speakTargetEn].forEach(add);
          step.options?.forEach((o) => add(o.textEn));
        }
      }
    }
  }
  for (const pack of Object.values(ALL_LESSON_PACKS)) {
    for (const lesson of Object.values(pack)) {
      lesson.examples.forEach((e) => add(e.en));
      add(lesson.quickTry?.questionEn);
      if (lesson.quickTry?.questionEn) add(lesson.quickTry.questionEn.replace(/_+/g, lesson.quickTry.correct));
    }
  }
  Object.values(VOICE_MESSAGES)
    .flat()
    .forEach((m) => {
      add(m.incomingEn);
      add(m.replyEn);
    });
  return texts;
}

/** The English of a bank that has to be new: whole sentences, passages and their questions. */
function collectBankTexts(bank: ExamBankPack): { where: string; text: string }[] {
  return Object.entries(bank).flatMap(([unit, u]) => [
    ...u.vocabulary.map((v, i) => ({ where: `u${unit} vocabulary ${i}`, text: fillBlank(v.clozeEn, v.answer) })),
    ...u.grammar.flatMap((g, i) =>
      [g.correct, ...g.wrong]
        .filter((option) => countWords(option) >= 3)
        .map((option) => ({ where: `u${unit} grammar ${i}`, text: option }))
    ),
    ...u.sentences.map((s, i) => ({ where: `u${unit} sentence ${i}`, text: s.en })),
    ...u.passages.flatMap((p, i) => [
      { where: `u${unit} passage ${i}`, text: p.passageEn },
      ...p.questions.map((q, j) => ({ where: `u${unit} passage ${i} question ${j}`, text: q.questionEn })),
    ]),
  ]);
}

function hebrewInstructions(bank: ExamBankPack): string[] {
  return Object.values(bank).flatMap((u) => u.grammar.flatMap((g) => [g.hintHe, g.explainHe]));
}

describe('exam question bank (Feature 43)', () => {
  it('has a loader for every bank in the index, and an index entry for every loader', async () => {
    expect(Object.keys(EXAM_BANK_LOADERS).sort()).toEqual(Object.keys(ALL_EXAM_BANKS).sort());
    for (const { gradeId, bank } of BANKS) {
      expect(await loadExamBank(gradeId)).toBe(bank);
    }
    expect(await loadExamBank('grade-13' as GradeId)).toBeNull();
  });

  it.each(BANKS)('grade $grade has every unit with full lists and two passages', ({ grade, bank }) => {
    const units = CURRICULUM_BY_GRADE[`grade-${grade}` as GradeId].units.map((u) => u.unitNumber);
    expect(Object.keys(bank).map(Number).sort()).toEqual(units);
    for (const u of Object.values(bank)) {
      expect(u.vocabulary).toHaveLength(EXAM_BANK_ITEMS_PER_LIST);
      expect(u.grammar).toHaveLength(EXAM_BANK_ITEMS_PER_LIST);
      expect(u.sentences).toHaveLength(EXAM_BANK_ITEMS_PER_LIST);
      expect(u.passages).toHaveLength(2);
      u.passages.forEach((p) => expect(p.questions).toHaveLength(3));
    }
  });

  it.each(BANKS)('grade $grade vocabulary tests the unit words with one blank', ({ grade, bank }) => {
    const pack = CURRICULUM_BY_GRADE[`grade-${grade}` as GradeId];
    for (const [unitNumber, u] of Object.entries(bank)) {
      const unit = pack.units.find((x) => x.unitNumber === Number(unitNumber))!;
      const unitWords = new Set(unit.missions.flatMap((m) => m.vocabulary.map((v) => v.wordEn.toLowerCase())));
      u.vocabulary.forEach((v) => {
        const where = `g${grade} u${unitNumber}: ${v.clozeEn}`;
        expect(v.clozeEn.split(EXAM_BANK_BLANK), where).toHaveLength(2);
        expect(unitWords.has(v.answer.toLowerCase()), where).toBe(true);
        expect(new Set([v.answer, ...v.wrong]).size, where).toBe(3);
        expect(toTokens(v.clozeEn).has(v.answer.toLowerCase()), where).toBe(false);
        expect(v.clozeHe.trim(), where).not.toBe('');
      });
    }
  });

  it.each(BANKS)('grade $grade options are distinct and grammar hints never give the answer away', ({ grade, bank }) => {
    for (const [unitNumber, u] of Object.entries(bank)) {
      u.grammar.forEach((g) => {
        const where = `g${grade} u${unitNumber}: ${g.questionEn} (${g.hintHe})`;
        expect(new Set([g.correct, ...g.wrong]).size, where).toBe(3);
        expect(g.hintHe, where).not.toBe(g.explainHe);
        const hintTokens = toTokens(g.hintHe);
        expect(decidingWords(g.correct, g.wrong).filter((t) => hintTokens.has(t)), where).toEqual([]);
      });
      u.passages.flatMap((p) => p.questions).forEach((q) => {
        expect(new Set([q.correct, ...q.wrong]).size, `g${grade} u${unitNumber}: ${q.questionEn}`).toBe(3);
      });
    }
  });

  it.each(BANKS)('grade $grade sentences fit the magnets and answers can be found in the passage', ({ grade, bank }) => {
    for (const [unitNumber, u] of Object.entries(bank)) {
      u.sentences.forEach((s) => {
        const words = countWords(s.en);
        expect(words, `g${grade} u${unitNumber}: ${s.en}`).toBeGreaterThanOrEqual(4);
        expect(words, `g${grade} u${unitNumber}: ${s.en}`).toBeLessThanOrEqual(14);
      });
      u.passages.forEach((p) =>
        p.questions.forEach((q) => {
          expect(findAnswerSentenceNumber(p.passageEn, q.correct, q.questionEn), q.questionEn).not.toBeNull();
        })
      );
    }
  });

  it.each(BANKS)('grade $grade Hebrew hints and explanations are gender-neutral', ({ bank }) => {
    hebrewInstructions(bank).forEach((text) => {
      expect(inflectHebrew(text, 'boy')).toBe(text);
      expect(inflectHebrew(text, 'girl')).toBe(text);
    });
  });

  it('never repeats a mission, lesson or voice-message text, or another bank item', () => {
    const outside = collectTextsOutsideExams();
    const seen = new Map<string, string>();
    for (const { grade, bank } of BANKS) {
      for (const { where, text } of collectBankTexts(bank)) {
        const key = normalize(text);
        const label = `g${grade} ${where}: ${text}`;
        expect(outside.has(key), label).toBe(false);
        if (!where.includes('question') && !where.includes('grammar')) {
          expect(seen.get(key), label).toBeUndefined();
          seen.set(key, label);
        }
      }
    }
  });

  it('keeps grammar questions with the same answer out of the bank twice', () => {
    const seen = new Set<string>();
    for (const { bank } of BANKS) {
      for (const g of Object.values(bank).flatMap((u) => u.grammar)) {
        const key = normalize(`${g.questionEn}|${g.correct}`);
        expect(seen.has(key), g.questionEn).toBe(false);
        seen.add(key);
      }
    }
  });
});

describe('buildBankSteps', () => {
  const { gradeId, bank } = BANKS.find((b) => b.grade === 7)!;
  const input = (overrides: Partial<BankStepInput>): BankStepInput => ({
    gradeId,
    unitNumber: 1,
    skill: 'grammar',
    pool: 'practice',
    tier: 'challenger',
    gender: 'girl',
    salt: 7,
    badgeLabelHe: 'badge',
    ...overrides,
  });

  it('splits each list into practice items and the reserved mock items', () => {
    const practiceCount = EXAM_BANK_ITEMS_PER_LIST - EXAM_MOCK_RESERVED_PER_LIST;
    for (const skill of ['vocabulary', 'grammar', 'sentences'] as ExamSkill[]) {
      const practice = buildBankSteps(bank[1], input({ skill, pool: 'practice' }));
      const mock = buildBankSteps(bank[1], input({ skill, pool: 'mock' }));
      expect(practice.map((s) => s.id)).toEqual(
        Array.from({ length: practiceCount }, (_, i) => `exam-g7-u1-${skill}-${i}`)
      );
      expect(mock.map((s) => s.id)).toEqual([`exam-g7-u1-${skill}-4`, `exam-g7-u1-${skill}-5`]);
    }
    expect(buildBankSteps(bank[1], input({ skill: 'unseen' })).map((s) => s.id)).toEqual([
      'exam-g7-u1-unseen-0.0',
      'exam-g7-u1-unseen-0.1',
      'exam-g7-u1-unseen-0.2',
    ]);
    expect(buildBankSteps(bank[1], input({ skill: 'unseen', pool: 'mock' }))[0].contextPassageEn).toBe(
      bank[1].passages[1].passageEn
    );
  });

  it('scales the options and the passage translation with the tier', () => {
    for (const tier of TIERS) {
      for (const skill of SKILLS) {
        for (const step of buildBankSteps(bank[2], input({ skill, tier, unitNumber: 2 }))) {
          if (step.options) {
            expect(step.options).toHaveLength(tier === 'explorer' ? 2 : 3);
            expect(step.options.filter((o) => o.isCorrect)).toHaveLength(1);
          }
          if (skill === 'unseen') expect(Boolean(step.contextPassageHe)).toBe(tier !== 'master');
          expect(step.skill).toBe(skill);
          expect(step.unitNumber).toBe(2);
          expect(step.hintHe.trim()).not.toBe('');
        }
      }
    }
  });

  it('gives sentence chips out of order, and wrong vocabulary feedback never names the answer', () => {
    for (const step of buildBankSteps(bank[3], input({ skill: 'sentences', unitNumber: 3 }))) {
      expect(step.scrambledWords!.join(' ')).not.toBe(step.targetSentenceEn!.replace(/[.!?",]/g, ''));
    }
    for (const step of buildBankSteps(bank[3], input({ skill: 'vocabulary', unitNumber: 3, gender: 'boy' }))) {
      const answer = step.options!.find((o) => o.isCorrect)!.textEn;
      step.options!.filter((o) => !o.isCorrect).forEach((o) => expect(o.explanationHe).not.toContain(answer));
      expect(step.promptHe).toContain('בחר:');
    }
  });

  it('is stable for the same salt and reorders options for another', () => {
    const a = buildBankSteps(bank[4], input({ unitNumber: 4, salt: 1 }));
    expect(buildBankSteps(bank[4], input({ unitNumber: 4, salt: 1 }))).toEqual(a);
    const orders = new Set(
      [1, 2, 3, 4, 5, 6].map((salt) =>
        buildBankSteps(bank[4], input({ unitNumber: 4, salt }))
          .map((s) => s.options!.map((o) => o.textEn).join('|'))
          .join('/')
      )
    );
    expect(orders.size).toBeGreaterThan(1);
  });
});
