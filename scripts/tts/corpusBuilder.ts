/** Collects corpus phrases under their clip keys, the same keys the read-aloud service looks up. */
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

  /** `isSpeakable` decides what the voice reads (plain English, or Hebrew for the Hebrew voice). */
  constructor(private readonly isSpeakable: (text: string, maxChars: number) => boolean) {}

  add(rawText: string | undefined, rate = NORMAL_RATE): void {
    if (!rawText) return;
    const text = getClipText(toSpeakableText(rawText));
    if (!text) return;
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
