import React from 'react';
import { Mic } from 'lucide-react';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { SpeechEvaluationResult } from '../../utils/speechSimilarity';
import { useSpeechToggle } from '../../hooks/useSpeech';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { SpeakIcon, STOP_SPEECH_TEXT } from '../SpeakIcon';

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

const NORMAL_RATE = 0.95;
const SLOW_RATE = 0.7;
const WORD_RATE = 0.85;

function getWordClass(isScored: boolean, isMatched: boolean): string {
  if (!isScored) return 'hover:bg-purple-400/15';
  return isMatched
    ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
    : 'bg-amber-500/25';
}

/**
 * The voice studio: the sentence to say is the card (tap a word to hear it), with normal and slow
 * listening inside it, and one big record button under it. Scored word by word.
 */
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const normalSpeech = useSpeechToggle(onSpeakEnglish, targetEn, NORMAL_RATE);
  const slowSpeech = useSpeechToggle(onSpeakEnglish, targetEn, SLOW_RATE);
  const words = speechEval
    ? speechEval.wordResults
    : targetEn.split(/\s+/).map((w) => ({ targetWord: w, cleanWord: w, matched: false }));

  const listenButtonClass = `min-h-11 px-4 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.secondaryBtnClass}`;
  const micStateClass = isListening
    ? `bg-rose-500 text-white ${prefersReducedMotion ? '' : 'animate-pulse'}`
    : theme.primaryBtnClass;
  const micLabel = isListening
    ? isGirl
      ? 'מקשיב לך… קראי את המשפט באנגלית!'
      : 'מקשיב לך… קרא את המשפט באנגלית!'
    : isGirl
    ? 'לחצי ודברי'
    : 'לחץ ודבר';

  return (
    <div className="space-y-3 sm:space-y-5">
      <div className={`p-4 sm:p-5 md:p-6 rounded-3xl border-2 border-current/15 ${theme.cardBgClass} space-y-3 sm:space-y-4 text-center`}>
        <p className="text-fluid-speak sm:text-fluid-speak-sm md:text-fluid-speak-lg font-black leading-snug" dir="ltr" lang="en">
          {words.map((item, idx) => (
            <React.Fragment key={`${item.targetWord}-${idx}`}>
              {idx > 0 && ' '}
              <button
                type="button"
                onClick={() => onSpeakEnglish(item.targetWord, WORD_RATE)}
                className={`inline rounded-lg px-0.5 transition-colors ${getWordClass(speechEval !== null, item.matched)}`}
                title="Tap any word to hear it pronounced"
              >
                {item.targetWord}
              </button>
            </React.Fragment>
          ))}
        </p>

        {targetHe && (
          <p className={`text-sm md:text-base font-semibold ${theme.mutedTextClass}`} dir="rtl" lang="he">
            {targetHe}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button type="button" onClick={slowSpeech.toggle} className={listenButtonClass}>
            <SpeakIcon isSpeaking={slowSpeech.isSpeaking} />
            <span>{slowSpeech.isSpeaking ? STOP_SPEECH_TEXT : '🐢 איטי'}</span>
          </button>
          <button type="button" onClick={normalSpeech.toggle} className={listenButtonClass}>
            <SpeakIcon isSpeaking={normalSpeech.isSpeaking} />
            <span>{normalSpeech.isSpeaking ? STOP_SPEECH_TEXT : 'רגיל'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onStartListening}
          disabled={isCompleted}
          aria-label={micLabel}
          className={`w-fluid-mic h-fluid-mic md:w-fluid-mic-lg md:h-fluid-mic-lg rounded-full flex items-center justify-center disabled:opacity-40 ${micStateClass}`}
        >
          <Mic className="w-8 h-8 md:w-10 md:h-10" aria-hidden="true" />
        </button>
        <span className="text-base md:text-lg short:text-sm font-extrabold" aria-hidden="true">
          {micLabel}
        </span>
      </div>

      {!isCompleted && (
        <div className="text-center">
          <button type="button" onClick={onSkip} className="min-h-11 text-xs underline opacity-75 hover:opacity-100">
            {isGirl
              ? 'אני במקום שקט ולא יכולה לדבר כרגע (מעבר להאזנה בלבד)'
              : 'אני במקום שקט ולא יכול לדבר כרגע (מעבר להאזנה בלבד)'}
          </button>
        </div>
      )}
    </div>
  );
};
