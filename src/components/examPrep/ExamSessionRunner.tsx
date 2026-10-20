import React, { useEffect, useMemo, useState } from 'react';
import { isolateLtr } from '../../utils/bidi';
import { celebrate } from '../../utils/celebrate';
import { MagnetChange } from '../../utils/magnetOrder';
import { Lightbulb } from 'lucide-react';
import {
  ExamAnswer,
  ExamSessionStep,
  buildMockExamSteps,
  buildSessionSteps,
} from '../../data/examPrep';
import { ExamPlanDay, ExamPrepPlan, LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import {
  FeedbackBanner,
  MultipleChoiceOptions,
  PassageBox,
  QuestionBubble,
  SentenceBuilderDrill,
} from '../drills';
import { ExamModalShell } from './ExamModalShell';
import { ExamSessionResult } from './ExamSessionResult';
import { useStopSpeechOnLeave } from '../../hooks/useSpeech';

export type ExamSessionNext = 'plan' | 'retry';

interface ExamSessionRunnerProps {
  plan: ExamPrepPlan;
  day: ExamPlanDay;
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onFinish: (answers: ExamAnswer[], next: ExamSessionNext) => void;
  onClose: () => void;
}

interface Feedback {
  isCorrect: boolean;
  text: string;
}

/** Mock answers can't be retried, so drop the drills' "try again" wording. */
const TRY_AGAIN_PATTERN = /\s*נס(י|ה) שוב!?/g;

function normalizeSentence(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s']/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Runs a practice session or the mock exam. Practice allows hints and retries and scores the
 * first try; the mock exam has no hints and locks each answer after one attempt.
 */
export const ExamSessionRunner: React.FC<ExamSessionRunnerProps> = ({
  plan,
  day,
  profile,
  theme,
  onSpeakEnglish,
  onFinish,
  onClose,
}) => {
  useStopSpeechOnLeave();
  const isGirl = profile.gender === 'girl';
  const isMock = day.kind === 'mock';
  const tier = profile.preferredTier;
  // A new salt per run gives new questions and option order, stable across re-renders.
  const [salt] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const steps: ExamSessionStep[] = useMemo(
    () =>
      isMock
        ? buildMockExamSteps(plan, tier, profile.gender, salt)
        : buildSessionSteps(plan, day, tier, profile.gender, salt),
    [isMock, plan, day, tier, profile.gender, salt]
  );

  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [hasMissed, setHasMissed] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [wordIndices, setWordIndices] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  useEffect(() => {
    setHasMissed(false);
    setIsResolved(false);
    setFeedback(null);
    setSelectedIdx(null);
    setWordIndices([]);
    setShowHint(!isMock && tier === 'explorer');
  }, [stepIdx, isMock, tier]);

  /** Records the answer once: practice scores the first try, the mock exam the only try. */
  const resolveStep = (isCorrect: boolean, text: string) => {
    // Written by step index, so a step can never be counted twice.
    const answer: ExamAnswer = { skill: step.skill, isCorrect: isCorrect && !hasMissed };
    setAnswers((prev) => [...prev.slice(0, stepIdx), answer]);
    setIsResolved(true);
    setFeedback({ isCorrect, text });
  };

  const handleWrong = (text: string, correctAnswerHe: string) => {
    if (isMock) {
      const lockedText = step.skill === 'unseen' ? 'לא נכון.' : text.replace(TRY_AGAIN_PATTERN, '').trim();
      resolveStep(false, `${lockedText} ${correctAnswerHe}`);
      return;
    }
    setHasMissed(true);
    setFeedback({ isCorrect: false, text });
  };

  const handleSelectOption = (idx: number) => {
    if (isResolved || !step.options) return;
    setSelectedIdx(idx);
    const chosen = step.options[idx];
    if (/[A-Za-z]/.test(chosen.textEn)) onSpeakEnglish(chosen.textEn, 0.95);
    const correct = step.options.find((o) => o.isCorrect);
    if (chosen.isCorrect) resolveStep(true, chosen.explanationHe);
    else handleWrong(chosen.explanationHe, `התשובה הנכונה: ${isolateLtr(correct?.textEn ?? '')}`);
  };

  const handleWordOrderChange = (nextIndices: number[], change: MagnetChange) => {
    if (isResolved || !step.scrambledWords) return;
    setWordIndices(nextIndices);
    if (change.kind === 'add') onSpeakEnglish(step.scrambledWords[change.idx], 0.95);
  };

  const handleCheckSentence = () => {
    if (!step.scrambledWords || !step.targetSentenceEn) return;
    const built = wordIndices.map((i) => step.scrambledWords![i]).join(' ');
    if (normalizeSentence(built) === normalizeSentence(step.targetSentenceEn)) {
      onSpeakEnglish(step.targetSentenceEn, 0.95);
      resolveStep(true, 'מעולה! המשפט בנוי בסדר הנכון 🧩');
    } else {
      handleWrong(
        isGirl ? 'עדיין לא בסדר הנכון — בדקי את מיקום הפועל.' : 'עדיין לא בסדר הנכון — בדוק את מיקום הפועל.',
        `המשפט הנכון: ${isolateLtr(step.targetSentenceEn)}`
      );
    }
  };

  const handleNext = () => {
    if (!isLast) {
      setStepIdx(stepIdx + 1);
      return;
    }
    setIsFinished(true);
    celebrate('big');
  };

  const progressHeader = (
    <div className="flex items-center gap-2">
      <span className="text-xs font-extrabold shrink-0">{isMock ? '🎓 סימולציה' : '📅 תרגול'}</span>
      <div
        role="progressbar"
        aria-label="התקדמות"
        aria-valuemin={0}
        aria-valuemax={steps.length}
        aria-valuenow={answers.length}
        className="flex-1 h-2.5 rounded-full bg-black/15 dark:bg-white/15 overflow-hidden"
      >
        <div
          className="h-full bg-gradient-to-l from-purple-500 via-pink-500 to-amber-400 rounded-full transition-all duration-300"
          style={{ width: `${Math.round((answers.length / Math.max(1, steps.length)) * 100)}%` }}
        />
      </div>
      <span className="text-xs font-extrabold shrink-0" dir="ltr" lang="en">
        {Math.min(stepIdx + 1, steps.length)}/{steps.length}
      </span>
    </div>
  );

  if (isFinished) {
    return (
      <ExamModalShell theme={theme} labelHe="תוצאות" maxWidthClass="max-w-xl">
        <ExamSessionResult
          plan={plan}
          day={day}
          answers={answers}
          gender={profile.gender}
          learnerName={profile.name}
          theme={theme}
          onSave={() => onFinish(answers, 'plan')}
          onSaveAndRetry={() => onFinish(answers, 'retry')}
        />
      </ExamModalShell>
    );
  }

  if (!step) {
    return (
      <ExamModalShell theme={theme} labelHe="תרגול" onClose={onClose}>
        <p className="p-6 text-center font-bold">
          לא נמצאו תרגילים לנושאים שנבחרו.
        </p>
      </ExamModalShell>
    );
  }

  return (
    <ExamModalShell theme={theme} labelHe={isMock ? 'סימולציית מבחן' : 'תרגול למבחן'} onClose={onClose} maxWidthClass="max-w-3xl" header={progressHeader}>
      <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>{step.badgeLabelHe}</span>
          {!isMock && (
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHint ? 'הסתר רמז' : 'רמז בעברית 💡'}</span>
            </button>
          )}
        </div>

        <p className="text-base md:text-lg font-extrabold">
          {step.promptHe}
        </p>

        {showHint && !isMock && (
          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-xs md:text-sm font-bold">
            {step.hintHe}
          </div>
        )}

        {step.contextPassageEn && (
          <PassageBox
            passageEn={step.contextPassageEn}
            passageHe={step.contextPassageHe}
            showHebrew={!isMock && tier === 'explorer'}
            theme={theme}
            onSpeakEnglish={onSpeakEnglish}
          />
        )}

        <QuestionBubble
          questionEn={step.questionEn}
          speakerAvatar={step.speakerAvatar}
          speakerName={step.speakerName}
          theme={theme}
          onSpeakEnglish={onSpeakEnglish}
        />

        {step.options && (
          <MultipleChoiceOptions
            options={step.options}
            selectedIdx={selectedIdx}
            onSelect={handleSelectOption}
            theme={theme}
            revealCorrect={isMock}
          />
        )}

        {step.type === 'sentence-builder' && step.scrambledWords && (
          <SentenceBuilderDrill
            scrambledWords={step.scrambledWords}
            targetSentenceHe={step.targetSentenceHe}
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
            nextLabel={isLast ? 'לתוצאות 🎉' : 'לשאלה הבאה'}
            onNext={handleNext}
            theme={theme}
          />
        )}
      </div>
    </ExamModalShell>
  );
};
