/**
 * Every fixed English phrase the app reads aloud, built from the same data and generators the app
 * uses, so the clip keys match what the read-aloud service looks up. Text that isn't here (word
 * lists, sticker names, assembled dreams) is read by the online voice instead.
 */
import { getExercisesForMission } from '../../src/data/missionExercises';
// Every content pack is voiced before it ships, so the corpus reads the curriculum as if all had shipped
import {
  ALL_EXAM_BANKS_WITH_PACKS as ALL_EXAM_BANKS,
  ALL_LESSON_PACKS_WITH_PACKS as ALL_LESSON_PACKS,
  CURRICULUM_WITH_ALL_PACKS as CURRICULUM_BY_GRADE,
} from '../../src/data/curriculum/packs/all';
import { buildBankSteps } from '../../src/data/examBank';
import type { MissionExerciseStep } from '../../src/data/missionExercises';
import type { ExamSkill, GradeId } from '../../src/types/learner';
import { ROOM_ITEMS, ROOM_OBJECTS, SHOP_ROOM_ITEMS } from '../../src/data/room';
import { WARDROBE_ITEMS } from '../../src/data/wardrobe';
import { VOICE_MESSAGES } from '../../src/data/voiceMessages';
import { DREAM_FRAMES } from '../../src/data/dreamJournal';
import { DEMO_SENTENCE, DEMO_SENTENCE_RATE } from '../../src/services/tts/demoPhrases';
import {
  HEBREW_VOICE,
  isCloudSpeakable,
  letterToken,
  parseLetterToken,
  type ClipVoice,
} from '../../src/services/tts/ttsText';
import { ALPHABET } from '../../src/data/alphabet';
import { BLEND_WORDS, FIRST_SENTENCES } from '../../src/data/blendingWords';
import { CorpusBuilder, type CorpusPhrase } from './corpusBuilder';
import { buildHebrewCorpus } from './hebrewCorpus';

export type { CorpusPhrase } from './corpusBuilder';
import type { ProficiencyTier } from '../../src/types/learner';

const TIERS: ProficiencyTier[] = ['explorer', 'challenger', 'master'];

function addCurriculum(corpus: CorpusBuilder): void {
  for (const pack of Object.values(CURRICULUM_BY_GRADE)) {
    for (const unit of pack.units) {
      for (const mission of unit.missions) {
        corpus.add(mission.sampleSentenceEn);
        for (const word of mission.vocabulary) {
          corpus.addWord(word.wordEn);
          corpus.add(word.exampleEn);
          corpus.add(`${word.wordEn}. ${word.exampleEn}`);
        }
        for (const tier of TIERS) {
          corpus.add(mission.tierObjectives[tier]?.samplePromptEn.replace(/_+/g, ''));
          getExercisesForMission(mission, tier).forEach((step) => addStep(corpus, step));
        }
      }
    }
  }
}

function addStep(corpus: CorpusBuilder, step: MissionExerciseStep): void {
  corpus.add(step.questionEn);
  corpus.add(step.contextPassageEn);
  corpus.add(step.targetSentenceEn);
  corpus.addSentenceAndWords(step.speakTargetEn);
  corpus.addWord(step.focusWordEn);
  step.options?.forEach((option) => {
    corpus.add(option.textEn);
    corpus.add(option.speakEn);
  });
  step.scrambledWords?.forEach((chip) => corpus.add(chip));
}

const EXAM_SKILLS: ExamSkill[] = ['vocabulary', 'grammar', 'sentences', 'unseen'];

/** Exam question bank steps (Feature 43), practice and mock items, every tier. */
function addExamBanks(corpus: CorpusBuilder): void {
  for (const [grade, bank] of Object.entries(ALL_EXAM_BANKS)) {
    for (const [unitNumber, unitBank] of Object.entries(bank ?? {})) {
      for (const tier of TIERS) {
        for (const skill of EXAM_SKILLS) {
          for (const pool of ['practice', 'mock'] as const) {
            buildBankSteps(unitBank, {
              gradeId: `grade-${grade}` as GradeId,
              unitNumber: Number(unitNumber),
              skill,
              pool,
              tier,
              gender: 'girl',
              salt: 0,
              badgeLabelHe: '',
            }).forEach((step) => addStep(corpus, step));
          }
        }
      }
    }
  }
}

/** Mini-lesson examples and quick-try answers (Feature 42); Boss recaps reuse these examples. */
function addMiniLessons(corpus: CorpusBuilder): void {
  for (const pack of Object.values(ALL_LESSON_PACKS)) {
    for (const lesson of Object.values(pack)) {
      lesson.examples.forEach((example) => corpus.add(example.en));
      if (lesson.quickTry) {
        // Hebrew options (a word's meaning) are never read aloud
        [lesson.quickTry.correct, lesson.quickTry.wrong]
          .filter((option) => /[A-Za-z]/.test(option))
          .forEach((option) => corpus.add(option));
      }
    }
  }
}

/** Grade 1's letters and blending (Feature 48): every letter's name, tile and word, slow and normal. */
function addPhonics(corpus: CorpusBuilder): void {
  ALPHABET.forEach((letter) => {
    corpus.add(letterToken(letter.upper));
    letter.words.forEach((word) => corpus.addWord(word.en));
  });
  BLEND_WORDS.forEach((word) => {
    corpus.addWord(word.word);
    word.tiles.forEach((tile) => corpus.add(letterToken(tile)));
    word.lookAlikes.forEach((lookAlike) => corpus.addWord(lookAlike));
  });
  FIRST_SENTENCES.forEach((sentence) => corpus.addSentenceAndWords(sentence.en));
}

function addRoom(corpus: CorpusBuilder): void {
  [...ROOM_ITEMS, ...SHOP_ROOM_ITEMS, ...ROOM_OBJECTS, ...WARDROBE_ITEMS].forEach((item) => corpus.addWord(item.nameEn));
  Object.values(VOICE_MESSAGES)
    .flat()
    .forEach((message) => {
      corpus.add(message.incomingEn);
      corpus.addSentenceAndWords(message.replyEn);
    });
  Object.values(DREAM_FRAMES)
    .flat()
    .forEach((frame) => frame.blanks.flat().forEach((word) => corpus.add(word.en, 0.9)));
}

function buildEnglishCorpus(): CorpusBuilder {
  // Letter tokens ([letter:b]) are rendered with their own SSML
  const corpus = new CorpusBuilder((text, maxChars) => parseLetterToken(text) !== null || isCloudSpeakable(text, maxChars));
  addCurriculum(corpus);
  addMiniLessons(corpus);
  addExamBanks(corpus);
  addRoom(corpus);
  addPhonics(corpus);
  corpus.add(DEMO_SENTENCE, DEMO_SENTENCE_RATE);
  return corpus;
}

function buildCorpus(voice: ClipVoice): CorpusBuilder {
  return voice === HEBREW_VOICE ? buildHebrewCorpus() : buildEnglishCorpus();
}

/** The phrases a voice has clips for: the English corpus for female and male, the Hebrew one for he-female. */
export function collectCorpus(voice: ClipVoice = 'female'): CorpusPhrase[] {
  return buildCorpus(voice).list();
}

/** Fixed text the app reads aloud that gets no clip (not plain English), so the device voice reads it. */
export function collectSkippedPhrases(voice: ClipVoice = 'female'): string[] {
  return [...new Set(buildCorpus(voice).skipped)].sort();
}

/** 48 kbps MP3 is 6 KB a second; speech runs about 14 characters a second, plus the leading break and a tail. */
export function estimateClipBytes(phrase: CorpusPhrase): number {
  const charsPerSecond = phrase.speed === 'slow' ? 10 : 14;
  return Math.round((phrase.text.length / charsPerSecond + 0.5) * 6000);
}
