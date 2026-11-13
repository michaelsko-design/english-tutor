import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getPictureCue } from './pictureCues';
import { getVocabPictureId, VOCAB_PICTURE_IDS } from '../components/art/vocabPictureIds';
import { getQuestionCardContent } from '../components/drills/questionCard';

describe('getPictureCue', () => {
  it('uses the picture drawn for the word, with its emoji as the fallback', () => {
    expect(getPictureCue({ wordEn: 'apple', translationHe: 'תפוח', emoji: '🍎' })).toEqual({
      emoji: '🍎',
      pictureId: 'vocab-apple',
      isEmojiFitting: true,
    });
  });

  it('draws a word whose emoji shows something else, and keeps that emoji out of text', () => {
    const cue = getPictureCue({ wordEn: 'doll', translationHe: 'בובה', emoji: '🪆' });
    expect(cue?.pictureId).toBe('vocab-doll');
    expect(cue?.isEmojiFitting).toBe(false);
  });

  it('has no picture for an abstract word', () => {
    expect(getPictureCue({ wordEn: 'always', emoji: '✅' })).toBeUndefined();
    expect(getPictureCue({ wordEn: 'next to', emoji: '👉' })).toBeUndefined();
  });

  it('has no picture for a word without an emoji', () => {
    expect(getPictureCue({ wordEn: 'apple' })).toBeUndefined();
  });

  it('gives each meaning of one word its own picture', () => {
    expect(getVocabPictureId('bat', 'מחבט')).toBe('vocab-bat');
    expect(getVocabPictureId('bat', 'עטלף')).toBe('vocab-bat-animal');
    expect(getVocabPictureId('Orange', 'כתום')).toBe('vocab-orange-color');
  });
});

describe('vocabulary pictures', () => {
  it('has a file for every listed picture', () => {
    const missing = Object.values(VOCAB_PICTURE_IDS).filter(
      (id) => !existsSync(join(process.cwd(), 'public', 'art', 'icons', `${id}.webp`))
    );
    expect(missing).toEqual([]);
  });

  it('puts the picture on the question card', () => {
    const card = getQuestionCardContent({ type: 'chat-reply', questionEn: 'What is this? 🪆', cardDisplay: '🪆', cardPictureId: 'vocab-doll' });
    expect(card).toEqual({ text: '🪆', lang: 'en', size: 'glyph', pictureId: 'vocab-doll' });
  });
});
