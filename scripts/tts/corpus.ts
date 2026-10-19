/**
 * Every fixed English phrase the app reads aloud, built from the same data and generators the app
 * uses, so the clip keys match what the read-aloud service looks up. Text that isn't here (word
 * lists, sticker names, assembled dreams) is read by the online voice instead.
 */
import { CURRICULUM_BY_GRADE } from '../../src/data/curriculum';
import { getExercisesForMission } from '../../src/data/missionExercises';
import { ALL_LESSON_PACKS } from '../../src/data/curriculum/lessons';
import { ROOM_ITEMS, ROOM_OBJECTS, SHOP_ROOM_ITEMS } from '../../src/data/room';
import { WARDROBE_ITEMS } from '../../src/data/wardrobe';
import { VOICE_MESSAGES } from '../../src/data/voiceMessages';
import { DREAM_FRAMES } from '../../src/data/dreamJournal';
import { DEMO_SENTENCE, DEMO_SENTENCE_RATE } from '../../src/services/tts/demoPhrases';
import {
  getClipKey,
  getClipSpeed,
  getClipText,
  getSpeedBucket,
  isCloudSpeakable,
  MAX_CLIP_CHARS,
  toSpeakableText,
  type TtsSpeed,
} from '../../src/services/tts/ttsText';
import type { ProficiencyTier } from '../../src/types/learner';

export interface CorpusPhrase {
  key: string;
  text: string;
  speed: TtsSpeed;
}

const TIERS: ProficiencyTier[] = ['explorer', 'challenger', 'master'];
/** Single words are read slowly in the vault, voice drills and games, so they get a slow clip too. */
const SLOW_RATE = 0.7;
const NORMAL_RATE = 0.95;

class CorpusBuilder {
  private readonly phrases = new Map<string, CorpusPhrase>();
  readonly skipped: string[] = [];

  add(rawText: string | undefined, rate = NORMAL_RATE): void {
    if (!rawText) return;
    const text = getClipText(toSpeakableText(rawText));
    if (!isCloudSpeakable(text, MAX_CLIP_CHARS)) {
      this.skipped.push(text);
      return;
    }
    const speed = getClipSpeed(text, getSpeedBucket(rate));
    const key = getClipKey(text, speed);
    if (!this.phrases.has(key)) this.phrases.set(key, { key, text, speed });
  }

  /** A sentence plus each of its words (voice drill words are tapped one by one). */
  addSentenceAndWords(sentence: string | undefined): void {
    if (!sentence) return;
    this.add(sentence);
    sentence.split(/\s+/).forEach((word) => this.addWord(word));
  }

  /** A word at normal speed and slowly. */
  addWord(word: string | undefined): void {
    this.add(word, NORMAL_RATE);
    this.add(word, SLOW_RATE);
  }

  list(): CorpusPhrase[] {
    return [...this.phrases.values()].sort((a, b) => a.key.localeCompare(b.key));
  }
}

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
          for (const step of getExercisesForMission(mission, tier)) {
            corpus.add(step.questionEn);
            corpus.add(step.contextPassageEn);
            corpus.add(step.targetSentenceEn);
            corpus.addSentenceAndWords(step.speakTargetEn);
            corpus.addWord(step.focusWordEn);
            step.options?.forEach((option) => corpus.add(option.textEn));
            step.scrambledWords?.forEach((chip) => corpus.add(chip));
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

export function collectCorpus(): CorpusPhrase[] {
  const corpus = new CorpusBuilder();
  addCurriculum(corpus);
  addMiniLessons(corpus);
  addRoom(corpus);
  corpus.add(DEMO_SENTENCE, DEMO_SENTENCE_RATE);
  return corpus.list();
}

/** 48 kbps MP3 is 6 KB a second; speech runs about 14 characters a second, plus the leading break and a tail. */
export function estimateClipBytes(phrase: CorpusPhrase): number {
  const charsPerSecond = phrase.speed === 'slow' ? 10 : 14;
  return Math.round((phrase.text.length / charsPerSecond + 0.5) * 6000);
}
