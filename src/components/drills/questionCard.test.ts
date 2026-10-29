import { describe, expect, it } from 'vitest';
import { getCardReadAloudText, getQuestionCardContent, splitBlanks } from './questionCard';

describe('getCardReadAloudText', () => {
  it('lets a shown sentence be heard on request when nothing plays by itself', () => {
    expect(getCardReadAloudText({ type: 'blend-read', questionEn: '', cardDisplay: 'I see a red hen.' })).toBe(
      'I see a red hen.'
    );
  });

  it('keeps an empty read-aloud for a lone letter or word card', () => {
    expect(getCardReadAloudText({ type: 'blend-read', questionEn: '', cardDisplay: 'hen' })).toBe('');
  });

  it('uses the question text when the step has one', () => {
    expect(getCardReadAloudText({ type: 'letter', questionEn: 'a', cardDisplay: 'A' })).toBe('a');
  });

  it('leaves the card text to be read when there is no card display', () => {
    expect(getCardReadAloudText({ type: 'mc', questionEn: 'Hello' })).toBeUndefined();
  });
});

describe('getQuestionCardContent', () => {
  it('shows the Hebrew sentence to translate in the sentence builder', () => {
    const content = getQuestionCardContent({
      type: 'sentence-builder',
      questionEn: 'Tap the words in the right order:',
      targetSentenceHe: 'אני אוהבת תפוחים.',
    });
    expect(content).toEqual({ text: 'אני אוהבת תפוחים.', lang: 'he', size: 'sentence' });
  });

  it('shows no card for a sentence builder without a translation', () => {
    expect(getQuestionCardContent({ type: 'sentence-builder', questionEn: 'Build the sentence.' })).toBeNull();
  });

  it('leaves the voice step to its own card', () => {
    expect(getQuestionCardContent({ type: 'voice-speak', questionEn: 'Speak this sentence aloud:' })).toBeNull();
  });

  it('shows the Hebrew word to put into English instead of the English question', () => {
    expect(
      getQuestionCardContent({ type: 'chat-reply', questionEn: 'Which English word is right?', cardTextHe: 'בדרך כלל' })
    ).toEqual({ text: 'בדרך כלל', lang: 'he', size: 'word' });
  });

  it('shows a single English word large', () => {
    expect(getQuestionCardContent({ type: 'chat-reply', questionEn: 'usually' })).toEqual({
      text: 'usually',
      lang: 'en',
      size: 'word',
    });
  });

  it('shows a question as a sentence', () => {
    expect(getQuestionCardContent({ type: 'grammar-detective', questionEn: 'Which sentence is right?' })?.size).toBe(
      'sentence'
    );
  });
});

describe('splitBlanks', () => {
  it('splits out each blank', () => {
    expect(splitBlanks('I have known him _______ 2021.')).toEqual([
      { text: 'I have known him ', isBlank: false },
      { text: '_______', isBlank: true },
      { text: ' 2021.', isBlank: false },
    ]);
  });

  it('keeps a question without blanks whole', () => {
    expect(splitBlanks('Who is it?')).toEqual([{ text: 'Who is it?', isBlank: false }]);
  });
});
