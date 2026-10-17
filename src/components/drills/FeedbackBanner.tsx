import React from 'react';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface FeedbackBannerProps {
  isCorrect: boolean;
  text: string;
  showNext: boolean;
  nextLabel: string;
  onNext: () => void;
  theme: ThemeDefinition;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  isCorrect,
  text,
  showNext,
  nextLabel,
  onNext,
  theme,
}) => (
  <div
    className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
      isCorrect
        ? 'bg-emerald-500/15 border-emerald-500/50'
        : 'bg-rose-500/15 border-rose-500/50'
    }`}
    dir="rtl"
  >
    <div className="flex items-start gap-2.5">
      {isCorrect ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      )}
      <p className="text-xs md:text-sm font-extrabold">{text}</p>
    </div>

    {showNext && (
      <button
        type="button"
        onClick={onNext}
        className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-extrabold flex items-center justify-center gap-1.5 shrink-0 ${theme.primaryBtnClass}`}
      >
        <span>{nextLabel}</span>
        <ArrowRight className="w-4 h-4 rotate-180" />
      </button>
    )}
  </div>
);
