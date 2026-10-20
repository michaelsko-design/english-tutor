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
  PassageBox,
  QuestionBubble,
  getQuestionCardContent,
  SentenceBuilderDrill,
  StoryArt,
  VoiceSpeakDrill,
} from './drills';
import { MissionVictory, VICTORY_COMPANION_SIZE } from './victory/MissionVictory';
import { Companion, preloadCompanion } from './companion/Companion';
import { MissionIntro, INTRO_COMPANION_SIZE, LessonOffer } from './mission/MissionIntro';
import { MiniLesson, LESSON_COMPANION_SIZE } from './mission/MiniLesson';
import { useMiniLesson } from '../hooks/useMiniLesson';
import { shouldAutoShowLesson } from '../data/miniLessons';
import { TrailProgress } from './mission/TrailProgress';
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
  /** The mission's stars and last full-reward date before this attempt, to size the reward */
  previousStars: number;
  lastRewardDateStr?: string;
  /** Room item a first 3-star result would earn (Feature 12) */
  roomRewardPreview?: RoomRewardItem | null;
  /** The learner's XP and level before this mission, for the victory XP bar (Feature 24) */
  startXp: number;
  startLevel: number;
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
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Gamification state inside the mission
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0);
  // Steps skipped without an answer (the voice step in a quiet place) are left out of the score
  const [skippedStepCount, setSkippedStepCount] = useState(0);
  const [attemptedCurrentStep, setAttemptedCurrentStep] = useState(false);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [feedbackHe, setFeedbackHe] = useState<{
    isCorrect: boolean;
    text: string;
    /** XP this answer adds to the end-of-mission total, floated off the feedback sheet */
    xpGain: number;
  } | null>(null);

  // State for Multiple Choice steps
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);

  // State for Sentence Builder step
  const [selectedWordIndices, setSelectedWordIndices] = useState<number[]>([]);

  // State for Voice Speaking step
  const speech = useSpeechRecognition();
  const cancelListening = speech.cancel;
  const [speechEval, setSpeechEval] = useState<SpeechEvaluationResult | null>(
    null
  );

  // Victory modal state
  const [isMissionFinished, setIsMissionFinished] = useState(false);

  const currentStep: MissionExerciseStep = steps[currentStepIdx] || steps[0];
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
    if (!readsQuestionsAloud || !isInSteps) return;
    const step = steps[currentStepIdx];
    const text = step?.speakTargetEn || step?.questionEn;
    if (text) onSpeakEnglish(toSpeakableText(text), 0.92);
    // Only when a new step opens, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIdx, isInSteps, readsQuestionsAloud]);

  // Reset step state when step or tier changes
  useEffect(() => {
    setShowHint(false);
    setAttemptedCurrentStep(false);
    setStepCompleted(false);
    setFeedbackHe(null);
    setSelectedOptionIdx(null);
    setSelectedWordIndices([]);
    cancelListening();
    setSpeechEval(null);
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
    setStepCompleted(true);
    setFeedbackHe({ isCorrect: true, text: explanationHe, xpGain });
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
    setStepCompleted(true);
    setFeedbackHe({ isCorrect: true, text: explanationHe, xpGain });
  };

  const registerWrongAttempt = (explanationHe: string) => {
    setAttemptedCurrentStep(true);
    setCombo(0);
    setFeedbackHe({ isCorrect: false, text: explanationHe, xpGain: 0 });
  };

  // Handler for Multiple Choice (chat-reply, grammar-detective, story-unseen)
  const handleSelectOption = (idx: number) => {
    if (stepCompleted || !currentStep.options) return;
    setSelectedOptionIdx(idx);
    const chosen = currentStep.options[idx];
    if (/[A-Za-z]/.test(chosen.textEn)) {
      onSpeakEnglish(chosen.textEn, 0.95);
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
    setSelectedWordIndices(nextIndices);
    if (change.kind === 'add') onSpeakEnglish(currentStep.scrambledWords[change.idx], 0.95);
  };

  const handleCheckSentence = () => {
    if (!currentStep.scrambledWords || !currentStep.targetSentenceEn) return;
    const builtSentence = selectedWordIndices
      .map((i) => currentStep.scrambledWords![i])
      .join(' ');

    const cleanBuilt = builtSentence.toLowerCase().replace(/[^a-z0-9\s']/g, '').trim();
    const cleanTarget = currentStep.targetSentenceEn
      .toLowerCase()
      .replace(/[^a-z0-9\s']/g, '')
      .trim();

    if (cleanBuilt === cleanTarget) {
      onSpeakEnglish(currentStep.targetSentenceEn, 0.95);
      registerCorrectAnswer(
        isGirl
          ? `מעולה ${learnerName}! הרכבת את המשפט בסדר דקדוקי מושלם!`
          : `מעולה ${learnerName}! הרכבת את המשפט בסדר דקדוקי מושלם!`
      );
    } else {
      registerWrongAttempt(
        isGirl
          ? 'עדיין לא בסדר הנכון — בדקי את מיקום הפועל או היעזרי ברמז 💡'
          : 'עדיין לא בסדר הנכון — בדוק את מיקום הפועל או היעזר ברמז 💡'
      );
    }
  };

  // Handler for Voice Speaking Recognition (STT)
  const handleStartSpeechRecognition = () => {
    if (!currentStep.speakTargetEn) return;
    setFeedbackHe(null);
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
      onError: (kind) => setFeedbackHe({ isCorrect: false, text: getSpeechErrorTextHe(kind, gender), xpGain: 0 }),
    });
  };

  const handleNextStep = () => {
    if (currentStepIdx + 1 < steps.length) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      setIsMissionFinished(true);
    }
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
  const questionCard = currentStep ? getQuestionCardContent(currentStep) : null;

  return (
    <ModalPortal>
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={`משימה: ${mission.titleHe}`} className="contents">
      <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        <div
          ref={cardRef}
          tabIndex={-1}
          className={`outline-none w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-current/15 ${theme.pageBgClass}`}
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
              <div className={`px-3.5 sm:px-5 py-2 ${theme.hudBgClass} flex items-center gap-2.5`}>
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
                      setFeedbackHe(null);
                      setIsLessonReviewOpen(true);
                    }}
                    className={`min-w-11 min-h-11 flex items-center justify-center rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
                    aria-label="השיעור הקצר"
                    title="השיעור הקצר"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                )}
                <HintPopover hintHe={currentStep.hintHe} isOpen={showHint} onToggle={setShowHint} theme={theme} />
              </div>

              {/* Main Exercise Body */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
                {/* Step badge & the one-line instruction */}
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>
                  {currentStep.badgeLabelHe}
                </span>

                <p className="text-lg md:text-xl font-extrabold">{currentStep.promptHe}</p>

                {/* Story step: the mission's spot illustration, only when the file exists */}
                {currentStep.type === 'story-unseen' && <StoryArt missionId={mission.id} />}

                {/* Optional Story / Unseen Passage Box */}
                {currentStep.contextPassageEn && (
                  <PassageBox
                    passageEn={currentStep.contextPassageEn}
                    passageHe={currentStep.contextPassageHe}
                    showHebrew={tier === 'explorer'}
                    theme={theme}
                    onSpeakEnglish={onSpeakEnglish}
                  />
                )}

                {/* The question card (or the voice studio card), with the companion peeking over its corner */}
                <div>
                  <div
                    key={currentStepIdx}
                    className="overflow-hidden ms-4"
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
                  {questionCard ? (
                    <QuestionBubble
                      content={questionCard}
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
                        onSkip={() =>
                          registerSkippedStep(
                            isGirl
                              ? 'דילגת על מיקרופון במצב שקט — ממשיכות לשלב הבא!'
                              : 'דילגת על מיקרופון במצב שקט — ממשיכים לשלב הבא!'
                          )
                        }
                      />
                    )
                  )}
                </div>

                {/* DRILL TYPE 1, 4, 5: MULTIPLE CHOICE OPTIONS */}
                {currentStep.options && (
                  <MultipleChoiceOptions
                    options={currentStep.options}
                    selectedIdx={selectedOptionIdx}
                    onSelect={handleSelectOption}
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
                    onReset={() => setSelectedWordIndices([])}
                    onCheck={handleCheckSentence}
                    theme={theme}
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
          onTryAgain={() => setFeedbackHe(null)}
          tryAgainLabel={isGirl ? 'נסי שוב' : 'נסה שוב'}
          xpGain={feedbackHe.xpGain}
          theme={theme}
        />
      )}
    </div>
    </ModalPortal>
  );
};
