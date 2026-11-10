import React, { useMemo, useState } from 'react';
import type { WordListAnswer } from '../../data/customWordLists';
import { applyDeckResultToProfile, deckToWordList, getDeckReward, pickDeckSalt } from '../../data/wordDecks/deckSession';
import { DECK_REPEAT_REWARD_NOTE_HE } from '../../data/wordDecks/deckCopy';
import type { WordDeck } from '../../data/wordDecks/types';
import type { LearnerProfile } from '../../types/learner';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { toLocalDateStr } from '../../utils/dates';
import { WordListSessionRunner, type WordListSessionNext } from '../wordLists/WordListSessionRunner';

interface WordDeckSessionProps {
  deck: WordDeck;
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  /** `App.handleUpdateProfile`, which also records the activity log and the diamond ledger */
  onUpdateProfile: (updated: LearnerProfile) => void;
  onRetry: () => void;
  onClose: () => void;
}

/** One Ministry deck session on the word-list engine (meaning match → magnets → voice). */
export const WordDeckSession: React.FC<WordDeckSessionProps> = ({
  deck,
  profile,
  theme,
  onSpeakEnglish,
  onUpdateProfile,
  onRetry,
  onClose,
}) => {
  const [salt] = useState(() => pickDeckSalt(deck));
  const list = useMemo(() => deckToWordList(deck), [deck]);

  const handleFinish = (answers: WordListAnswer[], next: WordListSessionNext) => {
    onUpdateProfile(applyDeckResultToProfile(profile, deck, answers, new Date()).profile);
    if (next === 'retry') onRetry();
    else onClose();
  };

  return (
    <WordListSessionRunner
      list={list}
      profile={profile}
      theme={theme}
      salt={salt}
      getReward={(scorePercent) => getDeckReward(profile, deck.id, scorePercent, toLocalDateStr(new Date()))}
      repeatRewardNoteHe={DECK_REPEAT_REWARD_NOTE_HE}
      onSpeakEnglish={onSpeakEnglish}
      onFinish={handleFinish}
      onClose={onClose}
    />
  );
};
