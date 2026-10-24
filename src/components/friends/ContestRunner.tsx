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
  InstructionLine,
} from '../drills';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { isolateLtr } from '../../utils/bidi';
import { MagnetChange } from '../../utils/magnetOrder';
import { useStopSpeechOnLeave } from '../../hooks/useSpeech';
import { useGradeCurriculum } from '../../hooks/useGradeCurricula';
import { normalizeSentence, useDrillSession } from '../../hooks/useDrillSession';
import { Button } from '../ui/Button';

interface ContestRunnerProps {
  contest: ContestDoc;
  friendName: string;
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onFinish: (answers: boolean[], timeMs: number) => void;
  onClose: () => void;
}

const TICK_MS = 1000;

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
  const { status: curriculumStatus, pack: gradePack, retry: retryCurriculum } = useGradeCurriculum(profile.gradeId);
  const steps: ContestStep[] = useMemo(
    () => (gradePack ? buildContestSteps(gradePack, contest, profile.gender) : []),
    [gradePack, contest, profile.gender]
  );
  const startedAtRef = useRef(Date.now());
  // The clock starts when the questions do, not while the grade is still loading
  useEffect(() => {
    if (gradePack) startedAtRef.current = Date.now();
  }, [gradePack]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const session = useDrillSession<boolean>();
  const { stepIdx, answers, isResolved, feedback, selectedIdx, wordIndices } = session;
  const [finishedMs, setFinishedMs] = useState<number | null>(null);
  const [isConfirmingLeave, setIsConfirmingLeave] = useState(false);

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  useEffect(() => {
    if (finishedMs !== null) return;
    const timer = window.setInterval(() => setElapsedMs(Date.now() - startedAtRef.current), TICK_MS);
    return () => window.clearInterval(timer);
  }, [finishedMs]);

  /** One try per question; the last answer stops the clock. */
  const resolveStep = (isCorrect: boolean, text: string) => {
    session.resolve(isCorrect, { isCorrect, text });
    if (isLast) setFinishedMs(Date.now() - startedAtRef.current);
  };

  const handleSelectOption = (idx: number) => {
    if (isResolved || !step.options) return;
    session.selectOption(idx);
    const chosen = step.options[idx];
    if (/[A-Za-z]/.test(chosen.textEn)) onSpeakEnglish(chosen.textEn, 0.95);
    resolveStep(chosen.isCorrect, chosen.explanationHe);
  };

  const handleWordOrderChange = (nextIndices: number[], change: MagnetChange) => {
    if (isResolved || !step.scrambledWords) return;
    session.setWordIndices(nextIndices);
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
      session.next(steps.length);
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

  if (curriculumStatus !== 'ready') {
    return (
      <ExamModalShell theme={theme} labelHe="אתגר יומי" onClose={onClose}>
        <div className="p-6 text-center space-y-3" role="status">
          <p className="font-bold">
            {curriculumStatus === 'error' ? 'לא הצלחנו לטעון את השאלות. בדקו את החיבור ונסו שוב.' : 'טוענים את השאלות…'}
          </p>
          {curriculumStatus === 'error' && (
            <Button theme={theme} onClick={retryCurriculum}>
              נסו שוב
            </Button>
          )}
        </div>
      </ExamModalShell>
    );
  }

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
              <Button theme={theme} variant="danger" onClick={finishEarly}>
                לסיים עכשיו
              </Button>
              <Button theme={theme} variant="secondary" onClick={() => setIsConfirmingLeave(false)}>
                להמשיך לשחק
              </Button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>{step.badgeLabelHe}</span>
          <span className={`text-xs font-bold ${theme.mutedTextClass}`}>
            {stepIdx + 1}/{steps.length} · בלי רמזים, ניסיון אחד לכל שאלה
          </span>
        </div>

        <InstructionLine text={step.promptHe} />

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
            onSpeakEnglish={onSpeakEnglish}
          />
        )}

        {step.kind === 'sentence' && step.scrambledWords && (
          <SentenceBuilderDrill
            scrambledWords={step.scrambledWords}
            selectedIndices={wordIndices}
            isCompleted={isResolved}
            onChangeOrder={handleWordOrderChange}
            onReset={() => session.setWordIndices([])}
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
