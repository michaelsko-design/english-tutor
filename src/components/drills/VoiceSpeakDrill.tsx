import React from 'react';
import { Mic, Volume2 } from 'lucide-react';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { SpeechEvaluationResult } from '../../utils/speechSimilarity';

interface VoiceSpeakDrillProps {
  targetEn: string;
  targetHe?: string;
  /** Word-by-word result of the latest attempt (green = heard, orange = missed) */
  speechEval: SpeechEvaluationResult | null;
  isListening: boolean;
  isCompleted: boolean;
  gender: LearnerGender;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onStartListening: () => void;
  /** "I'm in a quiet place" — moves on without speaking */
  onSkip: () => void;
}

/** Listen / Listen slow / Speak aloud pronunciation drill, scored word by word. */
export const VoiceSpeakDrill: React.FC<VoiceSpeakDrillProps> = ({
  targetEn,
  targetHe,
  speechEval,
  isListening,
  isCompleted,
  gender,
  theme,
  onSpeakEnglish,
  onStartListening,
  onSkip,
}) => {
  const isGirl = gender === 'girl';
  const words = speechEval
    ? speechEval.wordResults
    : targetEn.split(/\s+/).map((w) => ({ targetWord: w, cleanWord: w, matched: false }));

  return (
    <div className={`p-5 rounded-3xl ${theme.cardBgClass} space-y-4 text-center`}>
      {targetHe && (
        <p className="text-xs font-bold opacity-80">
          תרגום: &ldquo;{targetHe}&rdquo;
        </p>
      )}

      {/* Word-by-word interactive display (highlights green after speaking!) */}
      <div className="flex flex-wrap items-center justify-center gap-2 py-2" dir="ltr">
        {words.map((item, idx) => (
          <button
            key={`${item.targetWord}-${idx}`}
            type="button"
            onClick={() => onSpeakEnglish(item.targetWord, 0.85)}
            className={`px-3 py-1.5 rounded-xl text-base md:text-lg font-extrabold border transition-all ${
              speechEval
                ? item.matched
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-500/20 border-amber-500'
                : 'bg-black/5 dark:bg-white/5 border-current/15 hover:border-purple-400'
            }`}
            title="Tap any word to hear it pronounced"
          >
            {item.targetWord}
          </button>
        ))}
      </div>

      {/* Listen Normal / Listen Slow / Speak Aloud Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => onSpeakEnglish(targetEn, 0.95)}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
        >
          <Volume2 className="w-4 h-4" />
          <span>🔊 <bdi>Listen</bdi> (רגיל)</span>
        </button>
        <button
          type="button"
          onClick={() => onSpeakEnglish(targetEn, 0.7)}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
        >
          <Volume2 className="w-4 h-4" />
          <span>🐢 <bdi>Listen Slow</bdi> (איטי)</span>
        </button>
        <button
          type="button"
          onClick={onStartListening}
          disabled={isCompleted}
          className={`px-6 py-3 rounded-2xl text-xs md:text-sm font-extrabold flex items-center gap-2 disabled:opacity-40 ${
            isListening ? 'bg-rose-500 text-white animate-pulse' : theme.primaryBtnClass
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>
            {isListening
              ? isGirl
                ? 'מקשיב לך... קראי את המשפט באנגלית!'
                : 'מקשיב לך... קרא את המשפט באנגלית!'
              : (
                <>
                  {isGirl ? '🎙️ לחצי והקליטי בקול' : '🎙️ לחץ והקלט בקול'} <bdi>(Speak Aloud)</bdi>
                </>
              )}
          </span>
        </button>
      </div>

      {!isCompleted && (
        <div className="pt-1">
          <button type="button" onClick={onSkip} className="text-xs underline opacity-70 hover:opacity-100">
            {isGirl
              ? 'אני במקום שקט ולא יכולה לדבר כרגע (מעבר להאזנה בלבד)'
              : 'אני במקום שקט ולא יכול לדבר כרגע (מעבר להאזנה בלבד)'}
          </button>
        </div>
      )}
    </div>
  );
};
