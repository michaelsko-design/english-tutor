import React, { useEffect } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { playSfx } from '../../utils/sfx';
import { useAutoSpeakHebrew } from '../../hooks/useAutoSpeakHebrew';
import { HebrewSpeakButton } from './HebrewSpeakButton';
import { Button } from '../ui/Button';

interface FeedbackBannerProps {
  isCorrect: boolean;
  text: string;
  showNext: boolean;
  nextLabel: string;
  onNext: () => void;
  theme: ThemeDefinition;
  /** Grades 1–2 hear the feedback after its sound (Feature 47) */
  readsAloud?: boolean;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  isCorrect,
  text,
  showNext,
  nextLabel,
  onNext,
  theme,
  readsAloud = false,
}) => {
  // Every drill answer gets a sound (Feature 24); a new message is a new answer.
  useEffect(() => {
    playSfx(isCorrect ? 'correct' : 'wrong');
  }, [isCorrect, text]);
  useAutoSpeakHebrew(text, readsAloud);

  return (
    <div
      className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        isCorrect
          ? 'bg-emerald-500/15 border-emerald-500/50'
          : 'bg-rose-500/15 border-rose-500/50'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {isCorrect ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        )}
        {/* An alert is announced when it appears with the answer, unlike a status region added with its text */}
        <p className="text-xs md:text-sm font-extrabold" role="alert">
          <span className="sr-only">{isCorrect ? 'נכון! ' : 'לא נכון. '}</span>
          {text}
        </p>
        <HebrewSpeakButton text={text} label="הקשבה למשוב" />
      </div>

      {showNext && (
        <Button theme={theme} onClick={onNext} className="shrink-0">
          <span>{nextLabel}</span>
          <ArrowRight className="w-4 h-4 rotate-180" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
};
