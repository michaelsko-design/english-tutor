import React, { useState } from 'react';
import { ScrambleRound, scorePercent } from '../../../data/wordGames';
import { LearnerGender } from '../../../types/learner';
import { ThemeDefinition } from '../../../themes/themeRegistry';
import { spellSlots } from '../../../utils/letterSlots';
import { FeedbackBanner, SpellingMagnetDrill } from '../../drills';

interface ScrambleGameProps {
  rounds: ScrambleRound[];
  gender: LearnerGender;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onFinish: (score: number) => void;
}

/** Word Scramble: put the mixed-up letters back in order, with the Hebrew meaning as the clue. */
export const ScrambleGame: React.FC<ScrambleGameProps> = ({ rounds, gender, theme, onSpeakEnglish, onFinish }) => {
  const isGirl = gender === 'girl';
  const [idx, setIdx] = useState(0);
  const [slots, setSlots] = useState<(number | null)[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [hasMissed, setHasMissed] = useState(false);
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const round = rounds[idx];
  const isLast = idx === rounds.length - 1;

  const handleSlotsChange = (nextSlots: (number | null)[]) => {
    if (isSolved) return;
    setSlots(nextSlots);
  };

  const handleCheck = () => {
    const built = spellSlots(slots, round.letterTiles);
    if (built === round.word.word) {
      onSpeakEnglish(round.word.word.toLowerCase(), 0.9);
      setIsSolved(true);
      if (!hasMissed) setFirstTryCount(firstTryCount + 1);
      setFeedback({ isCorrect: true, text: `נכון! ${round.word.word} = ${round.word.he}` });
    } else {
      setHasMissed(true);
      setFeedback({ isCorrect: false, text: isGirl ? 'עוד לא — נסי סדר אחר 🔀' : 'עוד לא — נסה סדר אחר 🔀' });
    }
  };

  const handleNext = () => {
    if (isLast) {
      onFinish(scorePercent(firstTryCount, rounds.length));
      return;
    }
    setIdx(idx + 1);
    setSlots([]);
    setIsSolved(false);
    setHasMissed(false);
    setFeedback(null);
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold">
        מילה {idx + 1} מתוך {rounds.length} · {round.word.emoji} {round.word.he}
      </p>
      <SpellingMagnetDrill
        key={idx}
        targetEn={round.word.word}
        letterTiles={round.letterTiles}
        translationHe={round.word.he}
        slots={slots}
        isCompleted={isSolved}
        onChangeSlots={handleSlotsChange}
        onReset={() => setSlots([])}
        onCheck={handleCheck}
        listenEn={round.word.word.toLowerCase()}
        listenRate={0.8}
        onSpeakEnglish={onSpeakEnglish}
        theme={theme}
      />
      {feedback && (
        <FeedbackBanner
          isCorrect={feedback.isCorrect}
          text={feedback.text}
          showNext={isSolved}
          nextLabel={isLast ? 'סיום 🎉' : 'למילה הבאה'}
          onNext={handleNext}
          theme={theme}
        />
      )}
    </div>
  );
};
