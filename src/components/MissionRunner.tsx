import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ModalPortal } from './ModalPortal';
import { useDialog } from '../hooks/useDialog';
import { toSpeakableText } from '../services/tts/ttsText';
import { MissionNode } from '../data/curriculum';
import { RoomRewardItem } from '../data/roomRewards';
import {
  getExercisesForMission,
  MissionExerciseStep,
} from '../data/missionExercises';
import { LearnerGender, ProficiencyTier } from '../types/learner';
import { ThemeDefinition, TIER_CONFIG } from '../themes/themeRegistry';
import { SpeechEvaluationResult } from '../utils/speechSimilarity';
import { getSpeechErrorTextHe, useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { X, BookOpen } from 'lucide-react';
import {
  FEEDBACK_COMPANION_SIZE,
  FeedbackSheet,
  MultipleChoiceOptions,
  HintPopover,
  InstructionLine,
  SoundTiles,
  SpellingMagnetDrill,
  QuestionBubble,
  getCardReadAloudText,
  getQuestionCardContent,
  SentenceBuilderDrill,
  VoiceSpeakDrill,
} from './drills';
import { MissionVictory, VICTORY_COMPANION_SIZE } from './victory/MissionVictory';
import { Companion, preloadCompanion } from './companion/Companion';
import { MissionIntro, INTRO_COMPANION_SIZE, LessonOffer } from './mission/MissionIntro';
import { MiniLesson, LESSON_COMPANION_SIZE } from './mission/MiniLesson';
import { useMiniLesson } from '../hooks/useMiniLesson';
import { useWordReveal } from '../hooks/useWordReveal';
import { shouldAutoShowLesson } from '../data/miniLessons';
import { TrailProgress } from './mission/TrailProgress';
import { StoryPassage } from './mission/StoryPassage';
import { getStoryArt } from '../themes/themeArt';
import { preloadArt } from '../utils/artStatus';
import { celebrate } from '../utils/celebrate';
import { getMissionReward, isFullMissionReward } from '../data/missionRewards';
import { toLocalDateStr } from '../utils/dates';
import { MagnetChange } from '../utils/magnetOrder';
import {
  COMBO_BONUS_XP_PER_STEP,
  getComboFlameLevel,
  getPeekCompanionPose,
  getStepXpGain,
} from '../utils/missionFeedback';
import { useStopSpeechOnLeave } from '../hooks/useSpeech';
import { DrillFeedback, normalizeSentence, useDrillSession } from '../hooks/useDrillSession';
import type { SpokenPart } from '../data/hebrewAudio';
import {
  getSentenceOrderWrongHe,
  getVoiceSkippedHe,
  getWordBuildWrongHe,
  getWordBuiltHe,
} from '../data/missionFeedbackHe';
import { spellSlots } from '../utils/letterSlots';

/** The companion peeking over the question card */
const PEEK_COMPANION_SIZE = 64;
/** How much of the peeking companion shows above the card */
const PEEK_VISIBLE_SHARE = 0.72;

/** The intro (tier choice), the mini-lesson (Feature 42), then the steps */
type MissionPhase = 'intro' | 'lesson' | 'steps';

interface MissionRunnerProps {
  mission: MissionNode;
  tier: ProficiencyTier;
  onChangeTier: (newTier: ProficiencyTier) => void;
  gender: LearnerGender;
  learnerName: string;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onCompleteMission: (result: {
    missionId: string;
    starsEarned: 1 | 2 | 3;
    xpEarned: number;
    diamondsEarned: number;
    wordsLearnedCount: number;
    /** False for a replay that only earns the repeat XP (data/missionRewards.ts) */
    isFullReward: boolean;
    /** The learner skipped the voice step ("quiet place") */
    isVoiceSkipped: boolean;
  }) => void;
  onClose: () => void;
  /** The tier was already chosen (on the map's mission sheet): start without the intro */
  isTierChosen?: boolean;
  /** Read each question aloud when it opens (grades 1–3, who may not read yet) */
  readsQuestionsAloud?: boolean;
  /** Grades 1–2 also hear the Hebrew instruction, hint and feedback (Feature 47) */
  readsHebrewAloud?: boolean;
  /** Reads Hebrew and English parts one after another (the instruction, then the question) */
  onSpeakParts?: (parts: SpokenPart[]) => void;
  /** The mission's stars and last full-reward date before this attempt, to size the reward */
  previousStars: number;
  lastRewardDateStr?: string;
  /** Room item a first 3-star result would earn (Feature 12) */
  roomRewardPreview?: RoomRewardItem | null;
  /** The learner's XP and level before this mission, for the victory XP bar (Feature 24) */
  startXp: number;
  startLevel: number;
}

interface MissionFeedback extends DrillFeedback {
  /** XP this answer adds to the end-of-mission total, floated off the feedback sheet */
  xpGain: number;
}

export const MissionRunner: React.FC<MissionRunnerProps> = ({
  mission,
  tier,
  onChangeTier,
  gender,
  learnerName,
  theme,
  onSpeakEnglish,
  onCompleteMission,
  onClose,
  roomRewardPreview,
  startXp,
  startLevel,
  previousStars,
  lastRewardDateStr,
  isTierChosen = false,
  readsQuestionsAloud = false,
  readsHebrewAloud = false,
  onSpeakParts,
}) => {
  const isGirl = gender === 'girl';
  // Random salt per mission attempt: shuffles answer options differently on every attempt,
  // but keeps them stable across re-renders while a question is being answered.
  const [shuffleSalt] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const steps = useMemo(
    () => getExercisesForMission(mission, tier, gender, shuffleSalt),
    [mission, tier, gender, shuffleSalt]
  );
  // The tier is chosen on the intro screen (Feature 25); a first play then opens the mini-lesson (Feature 42).
  const isLessonFirst = shouldAutoShowLesson(previousStars);
  const startPhase: MissionPhase = isLessonFirst ? 'lesson' : 'steps';
  const [phase, setPhase] = useState<MissionPhase>(isTierChosen ? startPhase : 'intro');
  const lessonState = useMiniLesson(mission);
  const lesson = lessonState.lesson;
  // A mission without a lesson (its grade has none yet, or it didn't load) goes straight to the steps
  const shownPhase: MissionPhase = phase === 'lesson' && lessonState.status === 'ready' && !lesson ? 'steps' : phase;
  const isInSteps = shownPhase === 'steps';
  const lessonOffer: LessonOffer = !lesson ? 'none' : isLessonFirst ? 'auto' : 'optional';
  // The lesson opened again from the steps' header; the step keeps its state underneath
  const [isLessonReviewOpen, setIsLessonReviewOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  /** Phones read a step's passage on its own screen first, then answer (StoryPassage) */
  const [isReadingPassage, setIsReadingPassage] = useState(true);

  // Gamification state inside the mission
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0);
  // Steps skipped without an answer (the voice step in a quiet place) are left out of the score
  const [skippedStepCount, setSkippedStepCount] = useState(0);
  const session = useDrillSession<true, MissionFeedback>();
  const {
    stepIdx: currentStepIdx,
    hasMissed: attemptedCurrentStep,
    isResolved: stepCompleted,
    feedback: feedbackHe,
    selectedIdx: selectedOptionIdx,
    wordIndices: selectedWordIndices,
    isFinished: isMissionFinished,
  } = session;

  // State for Sentence Builder step
  /** Grade 1's blending build step: the letter tile in each slot of the word */
  const [letterSlots, setLetterSlots] = useState<(number | null)[]>([]);

  // State for Voice Speaking step
  const speech = useSpeechRecognition();
  const cancelListening = speech.cancel;
  const [speechEval, setSpeechEval] = useState<SpeechEvaluationResult | null>(
    null
  );

  const currentStep: MissionExerciseStep = steps[currentStepIdx] || steps[0];
  const wordReveal = useWordReveal(currentStep.id, currentStep.hintWords, currentStep.scrambledWords?.length ?? 0);
  const hasWordHelp = (currentStep.hintWords?.length ?? 0) > 0;
  const tierMeta = TIER_CONFIG[tier];
  const baseXpTotal = Math.round(mission.baseXp * tierMeta.xpMultiplier);

  // Load the companion poses and the story picture before they are needed, so nothing flashes.
  useEffect(() => {
    preloadCompanion(theme, ['wave'], INTRO_COMPANION_SIZE);
    preloadCompanion(theme, ['idle', 'think'], PEEK_COMPANION_SIZE);
    preloadCompanion(theme, ['cheer', 'oops'], FEEDBACK_COMPANION_SIZE);
    preloadCompanion(theme, ['cheer'], VICTORY_COMPANION_SIZE);
    preloadCompanion(theme, ['think', 'idle', 'wave', 'cheer', 'oops'], LESSON_COMPANION_SIZE);
    preloadArt(getStoryArt(mission.id));
  }, [theme, mission.id]);

  // Early readers hear each question as it opens (the start tap already unlocked the audio)
  useEffect(() => {
    if (!isInSteps || (!readsQuestionsAloud && !readsHebrewAloud)) return;
    const step = steps[currentStepIdx];
    const englishText = step?.speakTargetEn || step?.questionEn;
    const questionEn = readsQuestionsAloud && englishText ? toSpeakableText(englishText) : undefined;
    if (readsHebrewAloud && step?.promptHe && onSpeakParts) {
      onSpeakParts([
        { text: step.promptHe, lang: 'he' },
        ...(questionEn ? [{ text: questionEn, lang: 'en' as const, rate: 0.92 }] : []),
      ]);
    }
    else if (questionEn) onSpeakEnglish(questionEn, 0.92);
    // Only when a new step opens, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIdx, isInSteps, readsQuestionsAloud, readsHebrewAloud]);

  // Grades 1–2 hear the answer's English (an option, the built sentence), then the Hebrew feedback
  const answerEnglishRef = useRef<string | undefined>(undefined);
  const isHebrewVoiced = readsHebrewAloud && Boolean(onSpeakParts);
  const speakAnswerEnglish = (text: string) => {
    if (isHebrewVoiced) answerEnglishRef.current = text;
    else onSpeakEnglish(text, 0.95);
  };
  useEffect(() => {
    if (!feedbackHe || !isHebrewVoiced || !onSpeakParts) return;
    const answerEn = answerEnglishRef.current;
    answerEnglishRef.current = undefined;
    onSpeakParts([
      ...(answerEn ? [{ text: answerEn, lang: 'en' as const, rate: 0.95 }] : []),
      { text: feedbackHe.text, lang: 'he' },
    ]);
    // Only when new feedback appears
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackHe]);

  // Reset step state when step or tier changes
  useEffect(() => {
    setShowHint(false);
    setIsReadingPassage(true);
    session.resetStep();
    setLetterSlots([]);
    cancelListening();
    setSpeechEval(null);
    // session.resetStep is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIdx, tier, cancelListening]);

  const registerCorrectAnswer = (explanationHe: string) => {
    const newCombo = attemptedCurrentStep ? 1 : combo + 1;
    const xpGain = getStepXpGain({
      baseXpTotal,
      stepCount: steps.length,
      stepIdx: currentStepIdx,
      newCombo,
      previousMaxCombo: maxCombo,
    });
    // The flame grows at 3x and 5x: a little confetti (the right-answer sound already plays).
    if (newCombo >= 3 && getComboFlameLevel(newCombo) > getComboFlameLevel(combo)) {
      celebrate('small', { isSilent: true });
    }
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);
    if (!attemptedCurrentStep) {
      setFirstTryCorrectCount((prev) => prev + 1);
    }
    session.resolve(true, { isCorrect: true, text: explanationHe, xpGain });
  };

  /** A skipped step: no first-try credit and no combo change, and it doesn't count toward the stars. */
  const registerSkippedStep = (explanationHe: string) => {
    const xpGain = getStepXpGain({
      baseXpTotal,
      stepCount: steps.length,
      stepIdx: currentStepIdx,
      newCombo: combo,
      previousMaxCombo: maxCombo,
    });
    setSkippedStepCount((prev) => prev + 1);
    session.resolve(true, { isCorrect: true, text: explanationHe, xpGain });
  };

  const registerWrongAttempt = (explanationHe: string) => {
    setCombo(0);
    session.miss({ isCorrect: false, text: explanationHe, xpGain: 0 });
  };

  // Handler for Multiple Choice (chat-reply, grammar-detective, story-unseen)
  const handleSelectOption = (idx: number) => {
    if (stepCompleted || !currentStep.options) return;
    session.selectOption(idx);
    const chosen = currentStep.options[idx];
    // Grades 1–2: the spoken feedback already says the option's English, so don't read it first.
    // Later grades hear the option at once (a letter reads its name via speakEn)
    if (!isHebrewVoiced && /[A-Za-z]/.test(chosen.textEn)) {
      speakAnswerEnglish(chosen.speakEn || chosen.textEn);
    }

    if (chosen.isCorrect) {
      registerCorrectAnswer(chosen.explanationHe);
    } else {
      registerWrongAttempt(chosen.explanationHe);
    }
  };

  // Handler for Sentence Magnet Builder
  const handleWordOrderChange = (nextIndices: number[], change: MagnetChange) => {
    if (stepCompleted || !currentStep.scrambledWords) return;
    session.setWordIndices(nextIndices);
    if (change.kind === 'add') onSpeakEnglish(currentStep.scrambledWords[change.idx], 0.95);
  };

  const handleCheckWord = () => {
    if (!currentStep.letterTiles || !currentStep.targetSentenceEn) return;
    const word = currentStep.targetSentenceEn;
    if (spellSlots(letterSlots, currentStep.letterTiles).toLowerCase() === word.toLowerCase()) {
      speakAnswerEnglish(word);
      registerCorrectAnswer(getWordBuiltHe(word));
    } else {
      registerWrongAttempt(getWordBuildWrongHe(gender));
    }
  };

  const handleCheckSentence = () => {
    if (!currentStep.scrambledWords || !currentStep.targetSentenceEn) return;
    const builtSentence = selectedWordIndices
      .map((i) => currentStep.scrambledWords![i])
      .join(' ');

    if (normalizeSentence(builtSentence) === normalizeSentence(currentStep.targetSentenceEn)) {
      speakAnswerEnglish(currentStep.targetSentenceEn);
      registerCorrectAnswer(
        isGirl
          ? `מעולה ${learnerName}! הרכבת את המשפט בסדר דקדוקי מושלם!`
          : `מעולה ${learnerName}! הרכבת את המשפט בסדר דקדוקי מושלם!`
      );
    } else {
      registerWrongAttempt(getSentenceOrderWrongHe(gender));
    }
  };

  // Handler for Voice Speaking Recognition (STT)
  const handleStartSpeechRecognition = () => {
    if (!currentStep.speakTargetEn) return;
    session.setFeedback(null);
    speech.start(currentStep.speakTargetEn, {
      onResult: (transcript, evaluation) => {
        setSpeechEval(evaluation);
        if (evaluation.passed) {
          registerCorrectAnswer(
            isGirl
              ? `אלופה! דיוק הגייה של ${evaluation.scorePercent}% (שמענו: "${transcript}") — המילים המסומנות בירוק נהגו מצוין!`
              : `אלוף! דיוק הגייה של ${evaluation.scorePercent}% (שמענו: "${transcript}") — המילים המסומנות בירוק נהגו מצוין!`
          );
        } else {
          registerWrongAttempt(
            isGirl
              ? `שמענו "${transcript || '...'}" (דיוק ${evaluation.scorePercent}%). המילים בכתום לא זוהו כראוי — האזיני להשמעה האיטית 🐢 ונסי שוב!`
              : `שמענו "${transcript || '...'}" (דיוק ${evaluation.scorePercent}%). המילים בכתום לא זוהו כראוי — האזן להשמעה האיטית 🐢 ונסה שוב!`
          );
        }
      },
      onError: (kind) => session.setFeedback({ isCorrect: false, text: getSpeechErrorTextHe(kind, gender), xpGain: 0 }),
    });
  };

  /** Phones: between the passage and the question; the new screen starts at its top */
  const showPassageScreen = (isReading: boolean) => {
    setIsReadingPassage(isReading);
    cardRef.current?.focus({ preventScroll: true });
    cardRef.current?.scrollIntoView({ block: 'start' });
  };

  const handleNextStep = () => {
    session.next(steps.length);
  };

  // The overlay and the feedback sheet beside it are one dialog (useDialog); Escape leaves the mission
  const dialogRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useDialog(dialogRef, { onClose, initialFocusRef: cardRef });
  // Leaving the mission mid-sentence stops the reading (Feature 41)
  useStopSpeechOnLeave();

  // Calculate final rewards
  const scoredStepCount = Math.max(1, steps.length - skippedStepCount);
  const accuracyRatio = firstTryCorrectCount / scoredStepCount;
  const starsEarned: 1 | 2 | 3 =
    accuracyRatio >= 0.8 ? 3 : accuracyRatio >= 0.5 ? 2 : 1;
  const comboBonusXp = maxCombo * COMBO_BONUS_XP_PER_STEP;
  // A replay of a mastered mission, or a second replay today, earns only the repeat XP
  const isFullReward = isFullMissionReward({
    previousStars,
    starsEarned,
    lastRewardDateStr,
    todayStr: toLocalDateStr(new Date()),
  });
  const { xp: totalXpEarned, diamonds: totalDiamondsEarned } = getMissionReward(
    baseXpTotal + comboBonusXp,
    mission.baseDiamonds + tierMeta.diamondBonus + (starsEarned === 3 ? 5 : 0),
    isFullReward
  );

  if (isMissionFinished) {
    return (
      <MissionVictory
        mission={mission}
        tierLabelEn={tierMeta.labelEn}
        starsEarned={starsEarned}
        xpEarned={totalXpEarned}
        maxCombo={maxCombo}
        diamondsEarned={totalDiamondsEarned}
        wordsLearned={mission.vocabulary.length}
        startXp={startXp}
        startLevel={startLevel}
        roomReward={starsEarned === 3 ? roomRewardPreview ?? null : null}
        isGirl={isGirl}
        learnerName={learnerName}
        currencyNameHe={theme.currencyNameHe}
        theme={theme}
        onCollect={() =>
          onCompleteMission({
            missionId: mission.id,
            starsEarned,
            xpEarned: totalXpEarned,
            diamondsEarned: totalDiamondsEarned,
            wordsLearnedCount: mission.vocabulary.length,
            isFullReward,
            isVoiceSkipped: skippedStepCount > 0,
          })
        }
      />
    );
  }

  const peekPose = getPeekCompanionPose(showHint, feedbackHe !== null);
  const hasPassage = Boolean(currentStep?.contextPassageEn);
  // Phones show a passage step's question only after the passage was read
  const questionPartClass = hasPassage && isReadingPassage ? 'hidden sm:block' : '';
  const questionCard = currentStep ? getQuestionCardContent(currentStep) : null;
  // On phones the mission fills the screen (no gutters or rounded inset); the intro stays a card
  const isIntro = shownPhase === 'intro';
  const overlayPaddingClass = isIntro ? 'p-2' : 'p-0';
  const cardShapeClass = isIntro
    ? 'rounded-3xl border'
    : 'min-h-[100dvh] sm:min-h-0 rounded-none sm:rounded-3xl border-0 sm:border';

  return (
    <ModalPortal>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={`משימה: ${mission.titleHe}`} className="contents">
      <div className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-start sm:items-center justify-center ${overlayPaddingClass} sm:p-4 md:p-6 overflow-y-auto`}>
        <div
          ref={cardRef}
          tabIndex={-1}
          className={`outline-none w-full max-w-3xl overflow-clip shadow-2xl border-current/15 ${cardShapeClass} ${theme.pageBgClass}`}
        >
          {shownPhase === 'intro' ? (
            <MissionIntro
              mission={mission}
              stepCount={steps.length}
              tier={tier}
              onChangeTier={onChangeTier}
              gender={gender}
              theme={theme}
              lessonOffer={lessonOffer}
              onOpenLesson={() => setPhase('lesson')}
              onStart={() => setPhase(startPhase)}
              onClose={onClose}
            />
          ) : shownPhase === 'lesson' ? (
            lesson ? (
              <MiniLesson
                lesson={lesson}
                seed={`${mission.id}-${shuffleSalt}`}
                theme={theme}
                onSpeakEnglish={onSpeakEnglish}
                readsAloud={readsQuestionsAloud}
                readsHebrewAloud={readsHebrewAloud}
                doneLabel="יאללה לתרגול! 🚀"
                onDone={() => setPhase('steps')}
                onClose={onClose}
                closeLabel="יציאה מהמשימה"
              />
            ) : (
              <div className="flex items-center justify-center py-24" role="status" aria-label="טוען את השיעור…">
                <div className="w-10 h-10 rounded-full border-4 border-current/25 border-t-current animate-spin" />
              </div>
            )
          ) : isLessonReviewOpen && lesson ? (
            <MiniLesson
              lesson={lesson}
              seed={`${mission.id}-${shuffleSalt}`}
              theme={theme}
              onSpeakEnglish={onSpeakEnglish}
              doneLabel="חזרה לשאלה ↩"
              isReview
              onDone={() => setIsLessonReviewOpen(false)}
              onClose={() => setIsLessonReviewOpen(false)}
              closeLabel="סגירת השיעור"
            />
          ) : (
            <>
              {/* Top Mission HUD Bar: exit, the trail progress and the combo flame */}
              <div className={`relative z-20 px-3.5 sm:px-5 py-2 ${theme.hudBgClass} flex items-center gap-2.5`}>
                <button
                  type="button"
                  onClick={onClose}
                  className={`min-w-11 min-h-11 flex items-center justify-center rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
                  aria-label="יציאה מהמשימה"
                >
                  <X className="w-4 h-4" />
                </button>
                <TrailProgress
                  stepCount={steps.length}
                  currentStepIdx={currentStepIdx}
                  isCurrentStepCompleted={stepCompleted}
                  combo={combo}
                />
                {lesson && !stepCompleted && (
                  <button
                    type="button"
                    onClick={() => {
                      // Like "try again": the wrong-answer sheet closes, and the learner comes back to retry
                      cancelListening();
                      session.setFeedback(null);
                      setIsLessonReviewOpen(true);
                    }}
                    className={`min-w-11 min-h-11 flex items-center justify-center rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
                    aria-label="השיעור הקצר"
                    title="השיעור הקצר"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                )}
                <HintPopover
                  hintHe={currentStep.hintHe}
                  isOpen={showHint}
                  onToggle={setShowHint}
                  theme={theme}
                  readsAloud={readsHebrewAloud}
                  translationsLeft={hasWordHelp ? wordReveal.left : undefined}
                />
              </div>

              {/* Main Exercise Body */}
              <div className="px-3 py-3 sm:p-6 md:p-8 space-y-3 sm:space-y-5 short:space-y-2.5">
                {/* Step badge & the one-line instruction; the instruction leaves room at its end for
                    the companion peeking over the card's corner */}
                <div className="space-y-1">
                  <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>
                    {currentStep.badgeLabelHe}
                  </span>
                  <InstructionLine text={currentStep.promptHe} className="pe-16" />
                </div>

                {/* A story / unseen passage (phones: on its own screen before the question) */}
                {currentStep.contextPassageEn && (
                  <StoryPassage
                    missionId={mission.id}
                    hasArt={currentStep.type === 'story-unseen'}
                    passageEn={currentStep.contextPassageEn}
                    passageHe={currentStep.contextPassageHe}
                    canRevealHebrew={tier === 'explorer'}
                    isReading={isReadingPassage}
                    onDoneReading={() => showPassageScreen(false)}
                    theme={theme}
                    onSpeakEnglish={onSpeakEnglish}
                  />
                )}

                {/* Wide screens: room between the passage and the card for the peeking companion */}
                {hasPassage && <div className="hidden sm:block h-8" aria-hidden="true" />}

                {/* The question card (or the voice studio card), with the companion peeking over its corner */}
                <div className={`relative ${questionPartClass}`}>
                  <div
                    key={currentStepIdx}
                    className="absolute bottom-full end-4 overflow-hidden pointer-events-none"
                    style={{ width: PEEK_COMPANION_SIZE, height: Math.round(PEEK_COMPANION_SIZE * PEEK_VISIBLE_SHARE) }}
                  >
                    <div
                      className={`transition-transform duration-300 ${
                        peekPose ? 'animate-companion-peek' : 'translate-y-full'
                      }`}
                    >
                      <Companion theme={theme} pose={peekPose ?? 'idle'} size={PEEK_COMPANION_SIZE} hasShadow={false} />
                    </div>
                  </div>
                  {currentStep.soundTiles ? (
                    <SoundTiles
                      tiles={currentStep.soundTiles}
                      word={currentStep.soundTiles.join('')}
                      canSlide={Boolean(currentStep.canSlide)}
                      onSpeakEnglish={onSpeakEnglish}
                      theme={theme}
                    />
                  ) : questionCard ? (
                    <QuestionBubble
                      content={questionCard}
                      readAloudText={getCardReadAloudText(currentStep)}
                      speakerAvatar={currentStep.speakerAvatar}
                      speakerName={currentStep.speakerName}
                      theme={theme}
                      onSpeakEnglish={onSpeakEnglish}
                    />
                  ) : (
                    currentStep.type === 'voice-speak' &&
                    currentStep.speakTargetEn && (
                      <VoiceSpeakDrill
                        targetEn={currentStep.speakTargetEn}
                        targetHe={currentStep.speakTargetHe}
                        speechEval={speechEval}
                        isListening={speech.isListening}
                        isCompleted={stepCompleted}
                        gender={gender}
                        theme={theme}
                        onSpeakEnglish={onSpeakEnglish}
                        onStartListening={handleStartSpeechRecognition}
                        onSkip={() => registerSkippedStep(getVoiceSkippedHe(gender))}
                      />
                    )
                  )}
                </div>

                {/* DRILL TYPE 1, 4, 5: MULTIPLE CHOICE OPTIONS */}
                {currentStep.options && (
                  <div className={questionPartClass}>
                    <MultipleChoiceOptions
                      options={currentStep.options}
                      selectedIdx={selectedOptionIdx}
                      onSelect={handleSelectOption}
                      theme={theme}
                      onSpeakEnglish={onSpeakEnglish}
                    />
                  </div>
                )}

                {/* Phones: back to a passage step's passage, to read it again */}
                {hasPassage && !isReadingPassage && (
                  <div className="sm:hidden flex justify-center">
                    <button
                      type="button"
                      onClick={() => showPassageScreen(true)}
                      className={`min-h-11 px-4 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
                    >
                      <BookOpen className="w-4 h-4" aria-hidden="true" />
                      <span>חזרה לקטע</span>
                    </button>
                  </div>
                )}

                {/* Grade 1 blending: build the word with letter magnets */}
                {currentStep.type === 'blend-build' && currentStep.letterTiles && currentStep.targetSentenceEn && (
                  <SpellingMagnetDrill
                    targetEn={currentStep.targetSentenceEn}
                    letterTiles={currentStep.letterTiles}
                    slots={letterSlots}
                    isCompleted={stepCompleted}
                    onChangeSlots={(next) => {
                      if (!stepCompleted) setLetterSlots(next);
                    }}
                    onReset={() => setLetterSlots([])}
                    onCheck={handleCheckWord}
                    listenEn={currentStep.targetSentenceEn}
                    listenRate={0.7}
                    onSpeakEnglish={onSpeakEnglish}
                    speaksLetters
                    hasListenButton={false}
                    theme={theme}
                  />
                )}

                {/* DRILL TYPE 2: SENTENCE MAGNET BUILDER */}
                {currentStep.type === 'sentence-builder' && currentStep.scrambledWords && (
                  <SentenceBuilderDrill
                    scrambledWords={currentStep.scrambledWords}
                    selectedIndices={selectedWordIndices}
                    isCompleted={stepCompleted}
                    onChangeOrder={handleWordOrderChange}
                    onReset={() => session.setWordIndices([])}
                    onCheck={handleCheckSentence}
                    theme={theme}
                    wordHelp={
                      hasWordHelp
                        ? {
                            isActive: showHint,
                            canReveal: wordReveal.canReveal,
                            revealedGlossFor: wordReveal.revealedGlossFor,
                            onReveal: wordReveal.reveal,
                          }
                        : undefined
                    }
                  />
                )}

                {/* Room to scroll everything up above the feedback sheet */}
                {feedbackHe && <div className="h-[55dvh]" aria-hidden="true" />}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Instant Hebrew feedback sheet + next step button. Outside the overlay: its backdrop
          blur would make the sheet's fixed position scroll with the drill. */}
      {isInSteps && !isLessonReviewOpen && feedbackHe && (
        <FeedbackSheet
          isCorrect={feedbackHe.isCorrect}
          text={feedbackHe.text}
          showNext={stepCompleted}
          nextLabel={currentStepIdx + 1 < steps.length ? 'לשלב הבא' : 'סיום משימה וקבלת פרסים 🏆'}
          onNext={handleNextStep}
          onTryAgain={() => session.setFeedback(null)}
          tryAgainLabel={isGirl ? 'נסי שוב' : 'נסה שוב'}
          xpGain={feedbackHe.xpGain}
          theme={theme}
        />
      )}
    </div>
    </ModalPortal>
  );
};
