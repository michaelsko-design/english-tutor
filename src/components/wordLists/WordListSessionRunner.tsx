import React, { useEffect, useMemo, useState } from 'react';
import { celebrate } from '../../utils/celebrate';
import { spellSlots } from '../../utils/letterSlots';
import { MagnetChange } from '../../utils/magnetOrder';
import {
  WordListAnswer,
  WordListStep,
  buildWordListSteps,
  getSpellingLetters,
  normalizeForCompare,
} from '../../data/customWordLists';
import { CustomWordList, LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { SpeechEvaluationResult } from '../../utils/speechSimilarity';
import { getSpeechErrorTextHe, useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import {
  FeedbackBanner,
  HintPopover,
  MultipleChoiceOptions,
  QuestionBubble,
  QuestionCardContent,
  SentenceBuilderDrill,
  SpellingMagnetDrill,
  VoiceSpeakDrill,
  getQuestionCardContent,
  InstructionLine,
} from '../drills';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { WordListSessionResult } from './WordListSessionResult';
import { useStopSpeechOnLeave } from '../../hooks/useSpeech';
import { useDrillSession } from '../../hooks/useDrillSession';

export type WordListSessionNext = 'lists' | 'retry';

interface WordListSessionRunnerProps {
  list: CustomWordList;
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onFinish: (answers: WordListAnswer[], next: WordListSessionNext) => void;
  onClose: () => void;
}

/** The question card: the Hebrew meaning to match, or the sentence's translation. Spelling and voice have their own. */
function getWordListCard(step: WordListStep): QuestionCardContent | null {
  if (step.type === 'meaning-match' && step.translationHe) {
    return { text: step.translationHe, lang: 'he', size: 'word' };
  }
  if (step.type === 'sentence-builder') {
    return getQuestionCardContent({ type: step.type, questionEn: '', targetSentenceHe: step.translationHe });
  }
  return null;
}

/** Practises a school word list: meaning match, letter/word magnets and voice, first try scored. */
export const WordListSessionRunner: React.FC<WordListSessionRunnerProps> = ({
  list,
  profile,
  theme,
  onSpeakEnglish,
  onFinish,
  onClose,
}) => {
  useStopSpeechOnLeave();
  const gender = profile.gender;
  const isGirl = gender === 'girl';
  // A new salt per run picks other items and a new tile order, stable across re-renders.
  const [salt] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const steps = useMemo(() => buildWordListSteps(list, gender, salt), [list, gender, salt]);

  const session = useDrillSession<WordListAnswer>();
  const { stepIdx, answers, hasMissed, isResolved, feedback, selectedIdx, isFinished } = session;
  const tileIndices = session.wordIndices;
  const [letterSlots, setLetterSlots] = useState<(number | null)[]>([]);
  const [speechEval, setSpeechEval] = useState<SpeechEvaluationResult | null>(null);
  const [showHint, setShowHint] = useState(false);
  const speech = useSpeechRecognition();
  const cancelListening = speech.cancel;

  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  useEffect(() => {
    setLetterSlots([]);
    setSpeechEval(null);
    setShowHint(profile.preferredTier === 'explorer');
    cancelListening();
  }, [stepIdx, profile.preferredTier, cancelListening]);

  // Spelling starts by hearing the word.
  useEffect(() => {
    if (step?.type === 'spelling-magnet') onSpeakEnglish(step.textEn, 0.85);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx]);

  /** Records the step once; only a first-try answer counts as correct. */
  const resolveStep = (isCorrect: boolean, text: string, isSkipped = false) => {
    const answer: WordListAnswer = { type: step.type, isCorrect: isCorrect && !hasMissed, isSkipped };
    // A late speech result must not overwrite the recorded answer.
    cancelListening();
    session.resolve(answer, { isCorrect, text });
  };

  const handleWrong = (text: string) => {
    session.miss({ isCorrect: false, text });
  };

  const handleSelectOption = (idx: number) => {
    if (isResolved || !step.options) return;
    session.selectOption(idx);
    const chosen = step.options[idx];
    onSpeakEnglish(chosen.textEn, 0.95);
    if (chosen.isCorrect) resolveStep(true, chosen.explanationHe);
    else handleWrong(chosen.explanationHe);
  };

  const handleLetterSlotsChange = (nextSlots: (number | null)[]) => {
    if (isResolved) return;
    setLetterSlots(nextSlots);
  };

  const handleWordOrderChange = (nextIndices: number[], change: MagnetChange) => {
    if (isResolved || !step.scrambledWords) return;
    session.setWordIndices(nextIndices);
    if (change.kind === 'add') onSpeakEnglish(step.scrambledWords[change.idx], 0.95);
  };

  const handleCheckSpelling = () => {
    const built = spellSlots(letterSlots, step.letterTiles ?? []);
    if (built.toLowerCase() === getSpellingLetters(step.textEn).join('').toLowerCase()) {
      onSpeakEnglish(step.textEn, 0.95);
      resolveStep(true, `מעולה! ${step.textEn} מאוית נכון 🧲`);
    } else {
      handleWrong(
        isGirl ? 'עדיין לא מדויק — האזיני שוב למילה 🔊 ונסי שוב!' : 'עדיין לא מדויק — האזן שוב למילה 🔊 ונסה שוב!'
      );
    }
  };

  const handleCheckSentence = () => {
    const built = tileIndices.map((i) => step.scrambledWords![i]).join(' ');
    if (normalizeForCompare(built) === normalizeForCompare(step.textEn)) {
      onSpeakEnglish(step.textEn, 0.95);
      resolveStep(true, 'מעולה! המשפט בנוי בסדר הנכון 🧩');
    } else {
      handleWrong(isGirl ? 'עדיין לא בסדר הנכון — נסי שוב!' : 'עדיין לא בסדר הנכון — נסה שוב!');
    }
  };

  const handleStartListening = () => {
    if (isResolved) return;
    session.setFeedback(null);
    speech.start(step.textEn, {
      onResult: (transcript, evaluation) => {
        setSpeechEval(evaluation);
        if (evaluation.passed) {
          resolveStep(true, `${isGirl ? 'אלופה' : 'אלוף'}! דיוק הגייה של ${evaluation.scorePercent}% 🎙️`);
        } else {
          handleWrong(
            isGirl
              ? `שמענו "${transcript || '...'}". האזיני להשמעה האיטית 🐢 ונסי שוב!`
              : `שמענו "${transcript || '...'}". האזן להשמעה האיטית 🐢 ונסה שוב!`
          );
        }
      },
      onError: (kind) => session.setFeedback({ isCorrect: false, text: getSpeechErrorTextHe(kind, gender) }),
    });
  };

  const handleNext = () => {
    session.next(steps.length);
    if (isLast) celebrate('big');
  };

  if (isFinished) {
    return (
      <ExamModalShell theme={theme} labelHe="תוצאות" maxWidthClass="max-w-xl">
        <WordListSessionResult
          list={list}
          profile={profile}
          answers={answers}
          theme={theme}
          onSave={() => onFinish(answers, 'lists')}
          onSaveAndRetry={() => onFinish(answers, 'retry')}
        />
      </ExamModalShell>
    );
  }

  if (!step) {
    return (
      <ExamModalShell theme={theme} labelHe={list.title} onClose={onClose}>
        <p className="p-6 text-center font-bold">
          אין ברשימה הזאת פריטים לתרגול.
        </p>
      </ExamModalShell>
    );
  }

  const progressHeader = (
    <div className="flex-1 min-w-0 space-y-1.5">
      <p className="text-xs font-extrabold leading-tight line-clamp-2 break-words" dir="auto" title={list.title}>
        📋 {list.title}
      </p>
      <div className="flex items-center gap-2">
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
          style={{ width: `${Math.round((answers.length / steps.length) * 100)}%` }}
        />
      </div>
      <span className="text-xs font-extrabold shrink-0" dir="ltr" lang="en">
        {stepIdx + 1}/{steps.length}
      </span>
      {step.hintHe && <HintPopover hintHe={step.hintHe} isOpen={showHint} onToggle={setShowHint} theme={theme} />}
      </div>
    </div>
  );

  const questionCard = getWordListCard(step);

  return (
    <ExamModalShell theme={theme} labelHe="תרגול רשימת מילים" onClose={onClose} maxWidthClass="max-w-3xl" header={progressHeader}>
      <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>
          {step.badgeLabelHe}
        </span>

        <InstructionLine text={step.promptHe} />

        {questionCard && <QuestionBubble content={questionCard} theme={theme} onSpeakEnglish={onSpeakEnglish} />}

        {step.options && (
          <MultipleChoiceOptions
            options={step.options}
            selectedIdx={selectedIdx}
            onSelect={handleSelectOption}
            theme={theme}
            onSpeakEnglish={onSpeakEnglish}
          />
        )}

        {step.type === 'spelling-magnet' && step.letterTiles && (
          <SpellingMagnetDrill
            targetEn={step.textEn}
            letterTiles={step.letterTiles}
            translationHe={step.translationHe}
            slots={letterSlots}
            isCompleted={isResolved}
            onChangeSlots={handleLetterSlotsChange}
            onReset={() => setLetterSlots([])}
            onCheck={handleCheckSpelling}
            listenEn={step.textEn}
            listenRate={0.85}
            onSpeakEnglish={onSpeakEnglish}
            theme={theme}
          />
        )}

        {step.type === 'sentence-builder' && step.scrambledWords && (
          <SentenceBuilderDrill
            scrambledWords={step.scrambledWords}
            selectedIndices={tileIndices}
            isCompleted={isResolved}
            onChangeOrder={handleWordOrderChange}
            onReset={() => session.setWordIndices([])}
            onCheck={handleCheckSentence}
            theme={theme}
          />
        )}

        {step.type === 'voice-speak' && (
          <VoiceSpeakDrill
            targetEn={step.textEn}
            targetHe={step.translationHe}
            speechEval={speechEval}
            isListening={speech.isListening}
            isCompleted={isResolved}
            gender={gender}
            theme={theme}
            onSpeakEnglish={onSpeakEnglish}
            onStartListening={handleStartListening}
            onSkip={() =>
              resolveStep(true, isGirl ? 'דילגת על המיקרופון — ממשיכות!' : 'דילגת על המיקרופון — ממשיכים!', true)
            }
          />
        )}

        {feedback && (
          <FeedbackBanner
            isCorrect={feedback.isCorrect}
            text={feedback.text}
            showNext={isResolved}
            nextLabel={isLast ? 'לתוצאות 🎉' : 'לשלב הבא'}
            onNext={handleNext}
            theme={theme}
          />
        )}
      </div>
    </ExamModalShell>
  );
};
