import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LearnerProfile, PlacementResult, SUPPORTED_GRADES } from '../types/learner';
import { ThemeDefinition } from '../themes/themeRegistry';
import {
  PLACEMENT_QUESTION_COUNT,
  PLACEMENT_REWARD_DIAMONDS,
  PLACEMENT_REWARD_XP,
  PlacementAnswer,
  computePlacementResult,
  getStartingDifficulty,
  gradeIdToNumber,
  nextDifficulty,
  pickNextQuestion,
} from '../data/placementTest';
import { isolateLtr } from '../utils/bidi';
import { inflectHebrew } from '../utils/hebrewGender';
import { PlacementResultCard } from './PlacementResultCard';
import { ArrowLeft, Target, X } from 'lucide-react';

interface PlacementTestProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  /** 'onboarding' is offered once after first-time setup and can be skipped. */
  mode: 'onboarding' | 'on-demand';
  onFinish: (result: PlacementResult, applyRecommendation: boolean) => void;
  onClose: () => void;
}

type Phase = 'intro' | 'question' | 'result';

/** Index of the picked option, or 'dont-know' when the learner chose "I don't know". */
type PendingPick = number | 'dont-know' | null;

export const PlacementTest: React.FC<PlacementTestProps> = ({
  profile,
  theme,
  mode,
  onFinish,
  onClose,
}) => {
  const isGirl = profile.gender === 'girl';
  const schoolGrade = gradeIdToNumber(profile.gradeId);
  const isFirstTest = !profile.placementResult;

  const [phase, setPhase] = useState<Phase>('intro');
  const [salt, setSalt] = useState(0);
  const [difficulty, setDifficulty] = useState(() => getStartingDifficulty(schoolGrade));
  const [answers, setAnswers] = useState<PlacementAnswer[]>([]);
  const [pendingPick, setPendingPick] = useState<PendingPick>(null);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const question = useMemo(
    () =>
      pickNextQuestion(
        difficulty,
        answers.length,
        answers.map((a) => a.questionId),
        profile.gender,
        salt
      ),
    [difficulty, answers, profile.gender, salt]
  );

  const previousGrade = profile.placementResult
    ? SUPPORTED_GRADES.find((g) => g.id === profile.placementResult?.estimatedGradeId)
    : undefined;
  const isAnswered = pendingPick !== null;
  const isLastQuestion = answers.length === PLACEMENT_QUESTION_COUNT - 1;
  const correctOption = question.options.find((o) => o.isCorrect);
  const isPendingCorrect =
    typeof pendingPick === 'number' && question.options[pendingPick].isCorrect;

  // Parents pass an inline onClose, so read the latest one through a ref.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Move focus into the dialog once, when it opens.
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Escape closes the test, except on the result screen, where closing would drop the result.
  useEffect(() => {
    if (phase === 'result') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  // Answering disables the option buttons, so hand keyboard focus to "Next".
  useEffect(() => {
    if (isAnswered) nextBtnRef.current?.focus();
  }, [isAnswered]);

  const handleStart = () => {
    setSalt(Date.now());
    setDifficulty(getStartingDifficulty(schoolGrade));
    setAnswers([]);
    setPendingPick(null);
    setPhase('question');
  };

  const handleNext = () => {
    if (pendingPick === null) return;
    const isCorrect = pendingPick !== 'dont-know' && question.options[pendingPick].isCorrect;
    const nextAnswers = [...answers, { questionId: question.id, difficulty, isCorrect }];

    setPendingPick(null);
    if (nextAnswers.length >= PLACEMENT_QUESTION_COUNT) {
      setAnswers(nextAnswers);
      setResult(computePlacementResult(nextAnswers, schoolGrade, new Date().toISOString()));
      setPhase('result');
      return;
    }
    setDifficulty(nextDifficulty(difficulty, isCorrect, answers.length));
    setAnswers(nextAnswers);
  };

  const optionClass = (idx: number): string => {
    if (!isAnswered) return `${theme.cardBgClass} hover:ring-2 hover:ring-purple-400`;
    if (question.options[idx].isCorrect) return 'bg-emerald-500/20 border-2 border-emerald-500';
    if (pendingPick === idx) return 'bg-rose-500/20 border-2 border-rose-500';
    return `${theme.cardBgClass} opacity-60`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="מבחן רמה"
        className={`outline-none w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-current/15 ${theme.pageBgClass}`}
      >
        {phase !== 'result' && (
          <div
            className={`px-3.5 sm:px-5 py-3 ${theme.hudBgClass} flex items-center gap-2.5`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
              title={mode === 'onboarding' ? 'דילוג' : 'סגירה'}
              aria-label={mode === 'onboarding' ? 'דילוג על מבחן הרמה' : 'סגירת מבחן הרמה'}
            >
              <X className="w-4 h-4" />
            </button>
            {phase === 'question' && (
              <>
                <div
                  role="progressbar"
                  aria-label="התקדמות במבחן"
                  aria-valuemin={0}
                  aria-valuemax={PLACEMENT_QUESTION_COUNT}
                  aria-valuenow={answers.length}
                  className="flex-1 h-2.5 rounded-full bg-black/15 dark:bg-white/15 overflow-hidden"
                >
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round((answers.length / PLACEMENT_QUESTION_COUNT) * 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-extrabold shrink-0" dir="ltr">
                  {answers.length + 1}/{PLACEMENT_QUESTION_COUNT}
                </span>
              </>
            )}
          </div>
        )}

        {phase === 'intro' && (
          <div className="p-5 sm:p-7 space-y-5 text-center">
            <div
              className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center ${theme.primaryBtnClass} animate-float`}
            >
              <Target className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold">מבחן רמה קצר 🎯</h2>
              <p className={`text-sm leading-relaxed ${theme.mutedTextClass}`}>
                {isGirl
                  ? `${PLACEMENT_QUESTION_COUNT} שאלות קצרות באוצר מילים ובדקדוק, כ-3 דקות. השאלות מתאימות את עצמן אלייך: כשקל הן נעשות קשות יותר, וכשקשה הן נעשות קלות יותר. זה לא מבחן בית ספר ואין לחץ. בסוף נמליץ לך על השכבה ורמת הקושי שהכי מתאימות לך.`
                  : `${PLACEMENT_QUESTION_COUNT} שאלות קצרות באוצר מילים ובדקדוק, כ-3 דקות. השאלות מתאימות את עצמן אליך: כשקל הן נעשות קשות יותר, וכשקשה הן נעשות קלות יותר. זה לא מבחן בית ספר ואין לחץ. בסוף נמליץ לך על השכבה ורמת הקושי שהכי מתאימות לך.`}
              </p>
              <p className={`text-xs ${theme.mutedTextClass}`}>
                {isGirl
                  ? 'לא בטוחה בתשובה? אפשר ללחוץ "לא יודעת". זה עוזר לנו לדייק.'
                  : 'לא בטוח בתשובה? אפשר ללחוץ "לא יודע". זה עוזר לנו לדייק.'}
              </p>
            </div>

            {isFirstTest ? (
              <div className="px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold">
                🎁 בסיום: <span dir="ltr">+{PLACEMENT_REWARD_XP} XP</span> ו-
                {PLACEMENT_REWARD_DIAMONDS} 💎
              </div>
            ) : (
              previousGrade && (
                <div className={`text-xs font-bold ${theme.mutedTextClass}`}>
                  בפעם הקודמת יצאה לך רמה של {previousGrade.labelHe}
                </div>
              )
            )}

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleStart}
                className={`flex-1 py-3.5 rounded-2xl font-extrabold text-base ${theme.primaryBtnClass}`}
              >
                {inflectHebrew('בואי נתחיל! 🚀', profile.gender)}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`py-3.5 px-4 rounded-2xl font-extrabold text-sm ${theme.secondaryBtnClass}`}
              >
                {mode === 'onboarding'
                  ? isGirl
                    ? 'דלגי, אעשה את זה אחר כך'
                    : 'דלג, אעשה את זה אחר כך'
                  : 'לא עכשיו'}
              </button>
            </div>
          </div>
        )}

        {phase === 'question' && (
          <div className="p-4 sm:p-6 space-y-4">
            <div className="space-y-2">
              <p className={`text-xs sm:text-sm font-bold ${theme.mutedTextClass}`}>
                {question.promptHe}
              </p>
              <h2 className="text-lg sm:text-xl font-extrabold leading-snug" dir="auto">
                {question.questionEn}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {question.options.map((opt, idx) => (
                <button
                  key={opt.text}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => setPendingPick(idx)}
                  className={`w-full p-4 rounded-2xl transition-all font-extrabold text-sm sm:text-base text-start flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${optionClass(idx)}`}
                  dir="auto"
                >
                  <span>{opt.text}</span>
                  {isAnswered && (opt.isCorrect || pendingPick === idx) && (
                    <span aria-hidden="true">{opt.isCorrect ? '✅' : '❌'}</span>
                  )}
                </button>
              ))}
            </div>

            <p role="status" aria-live="polite" className="text-sm font-bold min-h-[1.25rem]">
              {isAnswered &&
                (isPendingCorrect
                  ? 'נכון! 🎉'
                  : `התשובה הנכונה: ${isolateLtr(correctOption?.text ?? '')}`)}
            </p>

            <div className="flex items-center justify-between gap-2.5">
              <button
                type="button"
                disabled={isAnswered}
                onClick={() => setPendingPick('dont-know')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold ${theme.secondaryBtnClass} ${
                  pendingPick === 'dont-know' ? 'ring-2 ring-amber-400' : ''
                } disabled:opacity-60`}
              >
                {isGirl ? 'לא יודעת 🤷‍♀️' : 'לא יודע 🤷‍♂️'}
              </button>
              <button
                ref={nextBtnRef}
                type="button"
                disabled={!isAnswered}
                onClick={handleNext}
                className={`px-6 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-1.5 ${theme.primaryBtnClass} disabled:opacity-40`}
              >
                <span>{isLastQuestion ? 'לתוצאות 🎉' : 'הבא'}</span>
                {!isLastQuestion && <ArrowLeft className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {phase === 'result' && result && (
          <PlacementResultCard
            result={result}
            profile={profile}
            theme={theme}
            isFirstTest={isFirstTest}
            onFinish={(applyRecommendation) => onFinish(result, applyRecommendation)}
          />
        )}
      </div>
    </div>
  );
};
