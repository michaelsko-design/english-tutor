import React from 'react';
import { EmojiIcon } from './EmojiIcon';
import { getVocabPictureId } from './vocabPictureIds';

interface WordPictureProps {
  /** The English word (any case) */
  wordEn: string;
  /** Picks the meaning for words drawn twice (bat, orange) */
  translationHe?: string;
  /** Shown while the drawing loads, if it is missing, and for words with no drawing */
  emoji?: string;
  /** CSS size of the picture box, relative to the text around it */
  size?: string;
}

const DEFAULT_SIZE = '1.6em';

/**
 * A vocabulary word's own drawn picture (the same one its "What is this?" card shows), in a line of
 * text. Words with no drawing show their emoji's icon, as before; nothing when they have neither.
 */
export const WordPicture: React.FC<WordPictureProps> = ({ wordEn, translationHe, emoji, size = DEFAULT_SIZE }) => {
  const pictureId = getVocabPictureId(wordEn, translationHe);
  if (!pictureId && !emoji) return null;
  return <EmojiIcon emoji={emoji ?? ''} pictureId={pictureId} size={size} isInline />;
};
