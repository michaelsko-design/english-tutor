import React, { useEffect, useState } from 'react';
import { canPlayDeck, loadGradeDecks } from '../../data/wordDecks';
import type { WordDeck } from '../../data/wordDecks/types';
import type { DeckWordMasteryMap } from '../../data/wordDecks/deckMastery';
import type { LearnerGender } from '../../types/learner';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { useProAccess } from '../../hooks/useProAccess';
import { useOpenProUpsell } from '../pro/proUpsellContext';
import { WordDeckList } from './WordDeckList';

interface VaultWordDecksProps {
  /** The learner's grade, 1–12 */
  grade: number;
  gender: LearnerGender;
  mastery: DeckWordMasteryMap | undefined;
  theme: ThemeDefinition;
  onStart: (deck: WordDeck) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

/** Loads the grade's released decks when the Vault opens and lists them; nothing while there are none. */
export const VaultWordDecks: React.FC<VaultWordDecksProps> = ({ grade, gender, mastery, theme, onStart, onSpeakEnglish }) => {
  const [decks, setDecks] = useState<WordDeck[]>([]);
  const proAccess = useProAccess();
  const openProUpsell = useOpenProUpsell();

  useEffect(() => {
    let isActive = true;
    loadGradeDecks(grade)
      .then((loaded) => isActive && setDecks(loaded))
      // Offline before the decks were cached: the Vault still works with its mission words
      .catch(() => isActive && setDecks([]));
    return () => {
      isActive = false;
    };
  }, [grade]);

  return (
    <WordDeckList
      decks={decks}
      mastery={mastery}
      gender={gender}
      theme={theme}
      canPlay={(deck) => canPlayDeck(deck, proAccess)}
      onStart={onStart}
      onAskPro={() => openProUpsell('missions')}
      onSpeakEnglish={onSpeakEnglish}
    />
  );
};
