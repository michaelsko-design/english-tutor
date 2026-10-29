import React from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { getAlphabetLetter } from '../../data/alphabet';
import { getBlendWord } from '../../data/blendingWords';
import { letterToken } from '../../services/tts/ttsText';
import { SoundTiles } from '../drills';

interface PhonicsCardsProps {
  theme: ThemeDefinition;
  headingRef: React.RefObject<HTMLHeadingElement>;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

/** Word pictures are read a little slowly, like the vault's words */
const WORD_RATE = 0.8;

/**
 * Feature 48: the examples card of a grade 1 letters lesson. One card per letter: its capital and
 * small form very large (tap to hear its name) and three pictures that start with it (tap to hear
 * the word).
 */
export const LetterCards: React.FC<PhonicsCardsProps & { letters: string[] }> = ({
  letters,
  theme,
  headingRef,
  onSpeakEnglish,
}) => (
  <>
    <h2 ref={headingRef} tabIndex={-1} className="text-lg font-extrabold text-center outline-none">
      לחצו על אות או על תמונה כדי לשמוע
    </h2>
    <ul className="space-y-3">
      {letters.map((upper) => {
        const letter = getAlphabetLetter(upper);
        return (
          <li key={upper} className={`p-3 rounded-3xl ${theme.cardBgClass} flex flex-col min-[360px]:flex-row items-center gap-3`}>
            <button
              type="button"
              onClick={() => onSpeakEnglish(letterToken(upper))}
              aria-label={`השם של האות ${upper}`}
              dir="ltr"
              lang="en"
              className={`btn-chunky shrink-0 w-24 h-24 rounded-2xl text-5xl font-black flex items-center justify-center ${theme.primaryBtnClass}`}
            >
              {letter.upper}
              {letter.lower}
            </button>
            <div className="w-full min-[360px]:w-auto min-[360px]:flex-1 grid grid-cols-3 gap-2">
              {letter.words.map((word) => (
                <button
                  key={word.en}
                  type="button"
                  onClick={() => onSpeakEnglish(word.en, WORD_RATE)}
                  aria-label={`${word.en}, ${word.he}`}
                  className="btn-chunky min-h-20 rounded-2xl bg-black/5 dark:bg-white/10 flex flex-col items-center justify-center gap-0.5 p-1"
                >
                  <span className="text-3xl" aria-hidden="true">
                    {word.emoji}
                  </span>
                  <span className="text-xs font-extrabold" dir="ltr" lang="en">
                    {word.en}
                  </span>
                </button>
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  </>
);

/**
 * Feature 48: the examples card of a grade 1 blending lesson: each word as tiles that light up
 * one by one when ➡️ slides them into the word.
 */
export const BlendCards: React.FC<PhonicsCardsProps & { words: string[] }> = ({
  words,
  theme,
  headingRef,
  onSpeakEnglish,
}) => (
  <>
    <h2 ref={headingRef} tabIndex={-1} className="text-lg font-extrabold text-center outline-none">
      לחצו על ➡️ ותראו איך האותיות מתחברות למילה
    </h2>
    <ul className="space-y-3">
      {words.map((text) => {
        const word = getBlendWord(text);
        return (
          <li key={text} className="space-y-1">
            <div className="text-center text-3xl" aria-hidden="true">
              {word.emoji}
            </div>
            <SoundTiles tiles={word.tiles} word={word.word} canSlide onSpeakEnglish={onSpeakEnglish} theme={theme} />
          </li>
        );
      })}
    </ul>
  </>
);
