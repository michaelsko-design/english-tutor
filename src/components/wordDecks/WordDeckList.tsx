import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { WordDeck, WordDeckItem } from '../../data/wordDecks/types';
import { countMasteredDeckItems, isDeckWordMastered, type DeckWordMasteryMap } from '../../data/wordDecks/deckMastery';
import { getDeckCopy, getDeckProgressHe } from '../../data/wordDecks/deckCopy';
import { getDeckItemReading } from '../../data/wordDecks/deckSession';
import type { LearnerGender } from '../../types/learner';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { useSpeechToggle } from '../../hooks/useSpeech';
import { isolateLtr } from '../../utils/bidi';
import { SpeakIcon, STOP_SPEECH_LABEL } from '../SpeakIcon';
import { Button } from '../ui/Button';

type SpeakFn = (text: string, rate?: number) => void;

/** The Vault reads a word with its example, like its mission words */
const WORD_LISTEN_RATE = 0.95;

interface WordDeckListProps {
  decks: readonly WordDeck[];
  mastery: DeckWordMasteryMap | undefined;
  gender: LearnerGender;
  theme: ThemeDefinition;
  canPlay: (deck: WordDeck) => boolean;
  onStart: (deck: WordDeck) => void;
  onAskPro: () => void;
  onSpeakEnglish: SpeakFn;
}

const DeckWordRow: React.FC<{ item: WordDeckItem; isMastered: boolean; onSpeakEnglish: SpeakFn }> = ({
  item,
  isMastered,
  onSpeakEnglish,
}) => {
  const speech = useSpeechToggle(onSpeakEnglish, getDeckItemReading(item), WORD_LISTEN_RATE);
  return (
    <li className="flex items-center gap-2 py-1.5">
      <button
        type="button"
        onClick={speech.toggle}
        aria-label={speech.isSpeaking ? STOP_SPEECH_LABEL : `הקשבה ל-${isolateLtr(item.wordEn)}`}
        className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl bg-black/5 dark:bg-white/10 shrink-0"
      >
        <SpeakIcon isSpeaking={speech.isSpeaking} className="w-3.5 h-3.5" />
      </button>
      <span className="font-extrabold text-sm" dir="ltr" lang="en">
        {item.emoji ? `${item.emoji} ` : ''}
        {item.wordEn}
      </span>
      <span className="text-xs font-bold opacity-80 min-w-0 truncate">{item.translationHe}</span>
      {isMastered && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-label="נשלטה" />}
    </li>
  );
};

const DeckCard: React.FC<Omit<WordDeckListProps, 'decks' | 'canPlay'> & { deck: WordDeck; isPlayable: boolean }> = ({
  deck,
  isPlayable,
  mastery,
  gender,
  theme,
  onStart,
  onAskPro,
  onSpeakEnglish,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const copy = getDeckCopy(gender);
  const masteredCount = countMasteredDeckItems(deck.items, mastery);
  const wordsId = `deck-words-${deck.id}`;
  return (
    <article className={`rounded-2xl p-4 ${theme.cardBgClass} space-y-2.5`} aria-label={deck.topicHe}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-base font-extrabold leading-tight">{deck.topicHe}</h4>
          <p className="text-xs font-bold opacity-75" dir="ltr" lang="en">
            {deck.topicEn}
          </p>
        </div>
        <span className={`shrink-0 text-xs px-2.5 py-1 rounded-lg font-bold ${theme.badgeClass}`}>
          {getDeckProgressHe(deck.items.length, masteredCount)}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="מילים שנשלטו"
        aria-valuemin={0}
        aria-valuemax={deck.items.length}
        aria-valuenow={masteredCount}
        className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden"
      >
        <div
          className="h-full bg-emerald-500 rounded-full"
          style={{ width: `${deck.items.length ? Math.round((masteredCount / deck.items.length) * 100) : 0}%` }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {isPlayable ? (
          <Button theme={theme} size="sm" onClick={() => onStart(deck)}>
            {copy.startHe}
          </Button>
        ) : (
          <Button theme={theme} variant="secondary" size="sm" onClick={onAskPro}>
            {copy.proLockedHe}
          </Button>
        )}
        <Button
          theme={theme}
          variant="secondary"
          size="sm"
          aria-expanded={isOpen}
          aria-controls={wordsId}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? copy.hideWordsHe : copy.showWordsHe}
        </Button>
      </div>
      {isOpen && (
        <ul id={wordsId} className="divide-y divide-black/5 dark:divide-white/10">
          {deck.items.map((item) => (
            <DeckWordRow
              key={item.wordEn}
              item={item}
              isMastered={isDeckWordMastered(mastery, item.wordEn)}
              onSpeakEnglish={onSpeakEnglish}
            />
          ))}
        </ul>
      )}
    </article>
  );
};

/** The Ministry word decks of the learner's grade in the Vocabulary Vault (docs/architecture.md §4.26.1). */
export const WordDeckList: React.FC<WordDeckListProps> = ({ decks, canPlay, ...rest }) => {
  if (decks.length === 0) return null;
  const copy = getDeckCopy(rest.gender);
  return (
    <section aria-labelledby="word-decks-title" className="space-y-3">
      <div>
        <h3 id="word-decks-title" className="text-base sm:text-lg font-extrabold">
          {copy.sectionTitleHe}
        </h3>
        <p className={`text-xs ${rest.theme.mutedTextClass}`}>{copy.sectionHintHe}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 wide:grid-cols-3 gap-3.5">
        {decks.map((deck) => (
          <DeckCard key={deck.id} deck={deck} isPlayable={canPlay(deck)} {...rest} />
        ))}
      </div>
    </section>
  );
};
