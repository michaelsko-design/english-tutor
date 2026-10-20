import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Timer } from 'lucide-react';
import { ContestDoc, ContestStep, buildContestSteps } from '../../data/contests';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import {
  FeedbackBanner,
  MultipleChoiceOptions,
  QuestionBubble,
  SentenceBuilderDrill,
  getQuestionCardContent,
} from '../drills';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { isolateLtr } from '../../utils/bidi';
import { MagnetChange } from '../../utils/magnetOrder';
import { useStopSpeechOnLeave } from '../../hooks/useSpeech';

interface ContestRunnerProps {
  contest: ContestDoc;
  friendName: string;
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onFinish: (answers: boolean[], timeMs: number) => void;
  onClose: () => void;
}

interface Feedback {
  isCorrect: boolean;
  text: string;
}

const TICK_MS = 1000;

function normalizeSentence(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s']/g, '').replace(/\s+/g, ' ').trim();
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;
}

/**
 * Feature 19: plays a daily contest. Like the mock exam there are no hints and each answer is
 * locked after one try; the clock runs from the first question to the last answer.
 */
export const ContestRunner: React.FC<ContestRunnerProps> = ({
  contest,
  friendName,
  profile,
  theme,
  onSpeakEnglish,
  onFinish,
  onClose,
}) => {
  useStopSpeechOnLeave();
  const isGirl = profile.gender === 'girl';
  const steps: ContestStep[] = useMemo(
    () => buildContestSteps(profile.gradeId, contest, profile.gender),
    [profile.gradeId, contest, profile.gender]
  );
  const startedAtRef = useRef(Date.now());
  const [elapsedMs, setElapsedMs] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isResolved, setIsResolved] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [wordIndices, setWordIndices] = useState<number[]>([]);
  const [finishedMs, setFinishedMs] = useState<number | null>(null);
  const [isConfirmingLeave, setIsConfirmingLeave] = useState(false);

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  useEffect(() => {
    if (finishedMs !== null) return;
    const timer = window.setInterval(() => setElapsedMs(Date.now() - startedAtRef.current), TICK_MS);
    return () => window.clearInterval(timer);
  }, [finishedMs]);

  useEffect(() => {
    setIsResolved(false);
    setFeedback(null);
    setSelectedIdx(null);
    setWordIndices([]);
  }, [stepIdx]);

  /** One try per question; the last answer stops the clock. */
  const resolveStep = (isCorrect: boolean, text: string) => {
    setAnswers((prev) => [...prev.slice(0, stepIdx), isCorrect]);
    setIsResolved(true);
    setFeedback({ isCorrect, text });
    if (isLast) setFinishedMs(Date.now() - startedAtRef.current);
  };

  const handleSelectOption = (idx: number) => {
    if (isResolved || !step.options) return;
    setSelectedIdx(idx);
    const chosen = step.options[idx];
    if (/[A-Za-z]/.test(chosen.textEn)) onSpeakEnglish(chosen.textEn, 0.95);
    resolveStep(chosen.isCorrect, chosen.explanationHe);
  };

  const handleWordOrderChange = (nextIndices: number[], change: MagnetChange) => {
    if (isResolved || !step.scrambledWords) return;
    setWordIndices(nextIndices);
    if (change.kind === 'add') onSpeakEnglish(step.scrambledWords[change.idx], 0.95);
  };

  const handleCheckSentence = () => {
    if (!step.scrambledWords || !step.targetSentenceEn) return;
    const built = wordIndices.map((i) => step.scrambledWords![i]).join(' ');
    const isCorrect = normalizeSentence(built) === normalizeSentence(step.targetSentenceEn);
    if (isCorrect) onSpeakEnglish(step.targetSentenceEn, 0.95);
    resolveStep(isCorrect, isCorrect ? 'מעולה! המשפט בנוי בסדר הנכון 🧩' : `המשפט הנכון: ${isolateLtr(step.targetSentenceEn)}`);
  };

  const handleNext = () => {
    if (!isLast) {
      setStepIdx(stepIdx + 1);
      return;
    }
    onFinish(answers, finishedMs ?? Date.now() - startedAtRef.current);
  };

  /**
   * Leaving after the first answer ends the contest with the answers so far (the rest count as
   * wrong), so a learner can't peek at the questions and start again.
   */
  const handleLeave = () => {
    if (answers.length === 0) {
      onClose();
      return;
    }
    setIsConfirmingLeave(true);
  };

  const finishEarly = () => {
    const padded = steps.map((_, i) => answers[i] ?? false);
    onFinish(padded, finishedMs ?? Date.now() - startedAtRef.current);
  };

  const shownMs = finishedMs ?? elapsedMs;
  const header = (
    <div className="flex items-center gap-2">
      <span className="text-xs font-extrabold shrink-0 truncate">⚔️ מול {friendName}</span>
      <div
        role="progressbar"
        aria-label="התקדמות"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={answers.length}
        className="flex-1 h-2.5 rounded-full bg-black/15 dark:bg-white/15 overflow-hidden"
      >
        <div
          className="h-full bg-gradient-to-l from-sky-500 via-fuchsia-500 to-amber-400 rounded-full transition-all duration-300"
          style={{ width: `${Math.round((answers.length / Math.max(1, steps.length)) * 100)}%` }}
        />
      </div>
      <span className="text-xs font-extrabold shrink-0 flex items-center gap-1" dir="ltr" lang="en" role="timer" aria-label={`זמן: ${formatDuration(shownMs)}`}>
        <Timer className="w-3.5 h-3.5" />
        {formatDuration(shownMs)}
      </span>
    </div>
  );

  if (!step) {
    return (
      <ExamModalShell theme={theme} labelHe="אתגר יומי" onClose={onClose}>
        <p className="p-6 text-center font-bold">
          לא נמצאו שאלות לאתגר הזה.
        </p>
      </ExamModalShell>
    );
  }

  const questionCard = getQuestionCardContent(step);

  return (
    <ExamModalShell theme={theme} labelHe="אתגר יומי" onClose={handleLeave} maxWidthClass="max-w-3xl" header={header}>
      <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
        {isConfirmingLeave && (
          <div className="rounded-2xl p-3.5 bg-amber-500/15 border border-amber-400/40 space-y-2" role="alert">
            <p className="text-xs sm:text-sm font-bold">
              {isGirl ? 'בטוחה' : 'בטוח'} שרוצים לצאת? האתגר יסתיים עם התשובות עד עכשיו, ואי אפשר לשחק בו שוב.
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={finishEarly} className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-amber-500 text-white">
                לסיים עכשיו
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingLeave(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold ${theme.secondaryBtnClass}`}
              >
                להמשיך לשחק
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>{step.badgeLabelHe}</span>
          <span className={`text-xs font-bold ${theme.mutedTextClass}`}>
            {stepIdx + 1}/{steps.length} · בלי רמזים, ניסיון אחד לכל שאלה
          </span>
        </div>

        <p className="text-lg md:text-xl font-extrabold">{step.promptHe}</p>

        {questionCard && (
          <QuestionBubble
            content={questionCard}
            speakerAvatar={step.speakerAvatar}
            speakerName={step.speakerName}
            theme={theme}
            onSpeakEnglish={onSpeakEnglish}
          />
        )}

        {step.options && (
          <MultipleChoiceOptions
            options={step.options}
            selectedIdx={selectedIdx}
            onSelect={handleSelectOption}
            theme={theme}
            revealCorrect
          />
        )}

        {step.kind === 'sentence' && step.scrambledWords && (
          <SentenceBuilderDrill
            scrambledWords={step.scrambledWords}
            selectedIndices={wordIndices}
            isCompleted={isResolved}
            onChangeOrder={handleWordOrderChange}
            onReset={() => setWordIndices([])}
            onCheck={handleCheckSentence}
            theme={theme}
          />
        )}

        {feedback && (
          <FeedbackBanner
            isCorrect={feedback.isCorrect}
            text={feedback.text}
            showNext={isResolved}
            nextLabel={isLast ? 'סיום האתגר 🏁' : 'לשאלה הבאה'}
            onNext={handleNext}
            theme={theme}
          />
        )}
      </div>
    </ExamModalShell>
  );
};
