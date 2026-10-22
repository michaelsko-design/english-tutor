/**
 * The Hebrew the young grades hear (Feature 47): every instruction, hint, explanation and Hebrew
 * option of the grade 1–2 missions, lessons and exam banks, for both genders and every tier, built
 * with the app's own generators so the clip keys match the screen.
 */
import { getExercisesForMission, type MissionExerciseStep } from '../../src/data/missionExercises';
// Every content pack is voiced before it ships, so the corpus reads the curriculum as if all had shipped
import {
  ALL_EXAM_BANKS_WITH_PACKS as ALL_EXAM_BANKS,
  ALL_LESSON_PACKS_WITH_PACKS as ALL_LESSON_PACKS,
  CURRICULUM_WITH_ALL_PACKS as CURRICULUM_BY_GRADE,
} from '../../src/data/curriculum/packs/all';
import { buildBossRecap } from '../../src/data/miniLessons';
import { buildBankSteps } from '../../src/data/examBank';
import { HEBREW_AUDIO_GRADES } from '../../src/data/hebrewAudio';
import { getReadGateCopy, gradeIdToNumber, NON_READER_RESULT_HE } from '../../src/data/placementTest';
import { isHebrewSpeakable } from '../../src/services/tts/ttsText';
import type { ExamSkill, LearnerGender, ProficiencyTier } from '../../src/types/learner';
import {
  getSentenceOrderWrongHe,
  getVoiceSkippedHe,
  getWordBuildWrongHe,
  getWordBuiltHe,
} from '../../src/data/missionFeedbackHe';
import { getHebrewCopy } from '../../src/utils/hebrewGender';
import { BLEND_WORDS } from '../../src/data/blendingWords';
import { getSpeechErrorTextHe, type SpeechErrorKind } from '../../src/hooks/useSpeechRecognition';
import { CONTENT_PACKS } from '../../src/data/curriculum/packs/registry';
import { getNewPackCopy } from '../../src/data/contentPacks';
import { CorpusBuilder } from './corpusBuilder';

const TIERS: ProficiencyTier[] = ['explorer', 'challenger', 'master'];
const GENDERS: LearnerGender[] = ['girl', 'boy'];
const EXAM_SKILLS: ExamSkill[] = ['vocabulary', 'grammar', 'sentences', 'unseen'];
const HEBREW_LETTER = /[\u05d0-\u05ea]/;

function addHebrew(corpus: CorpusBuilder, text: string | undefined): void {
  if (text && HEBREW_LETTER.test(text)) corpus.add(text);
}

/** The Hebrew a step shows: instruction, hint, card, explanations and Hebrew options. */
export function getStepHebrew(step: MissionExerciseStep): string[] {
  return [
    step.promptHe,
    step.hintHe,
    step.cardTextHe,
    step.targetSentenceHe,
    step.speakTargetHe,
    ...(step.options ?? []).flatMap((option) => [option.textEn, option.explanationHe]),
  ].filter((text): text is string => Boolean(text) && HEBREW_LETTER.test(text as string));
}

function addMissions(corpus: CorpusBuilder): void {
  for (const gradeId of HEBREW_AUDIO_GRADES) {
    for (const unit of CURRICULUM_BY_GRADE[gradeId].units) {
      for (const mission of unit.missions) {
        for (const tier of TIERS) {
          for (const gender of GENDERS) {
            getExercisesForMission(mission, tier, gender).forEach((step) =>
              getStepHebrew(step).forEach((text) => corpus.add(text)),
            );
          }
        }
      }
    }
  }
}

function addLessons(corpus: CorpusBuilder): void {
  for (const gradeId of HEBREW_AUDIO_GRADES) {
    const pack = ALL_LESSON_PACKS[gradeIdToNumber(gradeId)] ?? {};
    // The Boss recap is built at run time; its fixed intro is read aloud, the rest comes from the lessons
    addHebrew(corpus, buildBossRecap(Object.values(pack).slice(0, 1))?.ideaHe);
    for (const lesson of Object.values(pack)) {
      [lesson.titleHe, lesson.ideaHe, lesson.tipHe, lesson.quickTry?.promptHe, lesson.quickTry?.explainHe].forEach(
        (text) => addHebrew(corpus, text),
      );
      [lesson.quickTry?.correct, lesson.quickTry?.wrong].forEach((text) => addHebrew(corpus, text));
      lesson.examples.forEach((example) => addHebrew(corpus, example.he));
    }
  }
}

function addExamBanks(corpus: CorpusBuilder): void {
  for (const gradeId of HEBREW_AUDIO_GRADES) {
    const bank = ALL_EXAM_BANKS[gradeIdToNumber(gradeId)] ?? {};
    for (const [unitNumber, unitBank] of Object.entries(bank)) {
      for (const tier of TIERS) {
        for (const gender of GENDERS) {
          for (const skill of EXAM_SKILLS) {
            for (const pool of ['practice', 'mock'] as const) {
              buildBankSteps(unitBank, {
                gradeId,
                unitNumber: Number(unitNumber),
                skill,
                pool,
                tier,
                gender,
                salt: 0,
                badgeLabelHe: '',
              }).forEach((step) => getStepHebrew(step).forEach((text) => corpus.add(text)));
            }
          }
        }
      }
    }
  }
}

const SPEECH_ERRORS: SpeechErrorKind[] = ['unsupported', 'not-allowed', 'no-speech'];

/** The runners' fixed feedback lines (text with the learner's name goes to the online voice). */
function addFixedFeedback(corpus: CorpusBuilder): void {
  for (const gender of GENDERS) {
    corpus.add(getSentenceOrderWrongHe(gender));
    corpus.add(getVoiceSkippedHe(gender));
    corpus.add(getWordBuildWrongHe(gender));
    SPEECH_ERRORS.forEach((kind) => corpus.add(getSpeechErrorTextHe(kind, gender)));
    Object.values(getReadGateCopy(gender)).forEach((text) => corpus.add(text));
    corpus.add(getHebrewCopy(gender, '').stickersLockedTitle);
    corpus.add(getHebrewCopy(gender, '').stickersLockedBody);
  }
  corpus.add(NON_READER_RESULT_HE);
  // The home card of a newly released content pack (2 units in every grade)
  for (const pack of Object.values(CONTENT_PACKS)) {
    GENDERS.forEach((gender) => corpus.add(getNewPackCopy(pack, 2, gender).spokenHe));
  }
  BLEND_WORDS.forEach((word) => corpus.add(getWordBuiltHe(word.word)));
}

/** Hebrew clips exist for grades 1–2 only (Feature 47): refuse to build for any other grade. */
function assertYoungGradesOnly(): void {
  const grades = HEBREW_AUDIO_GRADES.map((gradeId) => gradeIdToNumber(gradeId));
  if (grades.some((grade) => grade > 2)) {
    throw new Error('HEBREW_AUDIO_GRADES must hold only grades 1–2: no Hebrew clips for later grades');
  }
}

export function buildHebrewCorpus(): CorpusBuilder {
  assertYoungGradesOnly();
  const corpus = new CorpusBuilder(isHebrewSpeakable, true);
  addFixedFeedback(corpus);
  addMissions(corpus);
  addLessons(corpus);
  addExamBanks(corpus);
  return corpus;
}
