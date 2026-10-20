/** Collects corpus phrases under their clip keys, the same keys the read-aloud service looks up. */
import { voiceForListener } from '../../src/services/tts/hebrewListener';
import {
  getClipKey,
  getClipSpeed,
  getClipText,
  getSpeedBucket,
  MAX_CLIP_CHARS,
  toSpeakableText,
  type TtsSpeed,
} from '../../src/services/tts/ttsText';

export interface CorpusPhrase {
  key: string;
  text: string;
  speed: TtsSpeed;
}

/** Single words are read slowly in the vault, voice drills and games, so they get a slow clip too. */
export const SLOW_RATE = 0.7;
export const NORMAL_RATE = 0.95;

export class CorpusBuilder {
  private readonly phrases = new Map<string, CorpusPhrase>();
  readonly skipped: string[] = [];

  /**
   * `isSpeakable` decides what the voice reads (plain English, or Hebrew for the Hebrew voice).
   * `isAddressed`: the Hebrew voice, whose lines with a word that reads by gender ("בנית") or a
   * boy/girl pair ("משחק/ת") get a girl and a boy clip, the text the app asks for with the
   * learner's gender (voiceForListener).
   */
  constructor(
    private readonly isSpeakable: (text: string, maxChars: number) => boolean,
    private readonly isAddressed = false,
  ) {}

  add(rawText: string | undefined, rate = NORMAL_RATE): void {
    if (!rawText) return;
    const text = getClipText(toSpeakableText(rawText));
    if (!text) return;
    const girl = this.isAddressed ? voiceForListener(text, 'girl') : text;
    const boy = this.isAddressed ? voiceForListener(text, 'boy') : text;
    if (girl !== text || boy !== text) {
      this.addClip(girl, rate);
      this.addClip(boy, rate);
      return;
    }
    this.addClip(text, rate);
  }

  private addClip(text: string, rate: number): void {
    if (!this.isSpeakable(text, MAX_CLIP_CHARS)) {
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
