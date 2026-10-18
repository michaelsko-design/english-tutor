import React, { useState, useEffect, useMemo } from 'react';
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
import { X, Lightbulb } from 'lucide-react';
import {
  FEEDBACK_COMPANION_SIZE,
  FeedbackSheet,
  MultipleChoiceOptions,
  PassageBox,
  QuestionBubble,
  SentenceBuilderDrill,
  StoryArt,
  VoiceSpeakDrill,
} from './drills';
import { MissionVictory, VICTORY_COMPANION_SIZE } from './victory/MissionVictory';
import { Companion, preloadCompanion } from './companion/Companion';
import { MissionIntro, INTRO_COMPANION_SIZE } from './mission/MissionIntro';
import { TrailProgress } from './mission/TrailProgress';
import { getStoryArt } from '../themes/themeArt';
import { preloadArt } from '../utils/artStatus';
import { celebrate } from '../utils/celebrate';
import {
  COMBO_BONUS_XP_PER_STEP,
  getComboFlameLevel,
  getPeekCompanionPose,
  getStepXpGain,
} from '../utils/missionFeedback';

/** The companion peeking over the question card */
const PEEK_COMPANION_SIZE = 64;
/** How much of the peeking companion shows above the card */
const PEEK_VISIBLE_SHARE = 0.72;

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
  }) => void;
  onClose: () => void;
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
}) => {
  const isGirl = gender === 'girl';
  // Random salt per mission attempt: shuffles answer options differently on every attempt,
  // but keeps them stable across re-renders while a question is being answered.
  const [shuffleSalt] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const steps = useMemo(
    () => getExercisesForMission(mission, tier, gender, shuffleSalt),
    [mission, tier, gender, shuffleSalt]
  );
  // The tier is chosen on the intro screen before the first step (Feature 25).
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Gamification state inside the mission
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [firstTryCorrectCount, setFirstTryCorrectCount] = useState(0);
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
    preloadArt(getStoryArt(mission.id));
  }, [theme, mission.id]);

  // Reset step state when step or tier changes
  useEffect(() => {
    setShowHint(tier === 'explorer'); // Explorer shows hints automatically!
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
  const handleToggleWordTile = (wordIdx: number) => {
    if (stepCompleted || !currentStep.scrambledWords) return;
    if (selectedWordIndices.includes(wordIdx)) {
      setSelectedWordIndices(selectedWordIndices.filter((i) => i !== wordIdx));
    } else {
      const nextIndices = [...selectedWordIndices, wordIdx];
      setSelectedWordIndices(nextIndices);
      onSpeakEnglish(currentStep.scrambledWords[wordIdx], 0.95);
    }
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

  // Calculate final rewards
  const accuracyRatio = firstTryCorrectCount / steps.length;
  const starsEarned: 1 | 2 | 3 =
    accuracyRatio >= 0.8 ? 3 : accuracyRatio >= 0.5 ? 2 : 1;
  const comboBonusXp = maxCombo * COMBO_BONUS_XP_PER_STEP;
  const totalXpEarned = baseXpTotal + comboBonusXp;
  const totalDiamondsEarned =
    mission.baseDiamonds +
    tierMeta.diamondBonus +
    (starsEarned === 3 ? 5 : 0);

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
          })
        }
      />
    );
  }

  const peekPose = getPeekCompanionPose(showHint, feedbackHe !== null);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        <div
          className={`w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-current/15 ${theme.pageBgClass}`}
        >
          {!hasStarted ? (
            <MissionIntro
              mission={mission}
              stepCount={steps.length}
              tier={tier}
              onChangeTier={onChangeTier}
              gender={gender}
              theme={theme}
              onStart={() => setHasStarted(true)}
              onClose={onClose}
            />
          ) : (
            <>
              {/* Top Mission HUD Bar: exit, the trail progress and the combo flame */}
              <div className={`px-3.5 sm:px-5 py-2 ${theme.hudBgClass} flex items-center gap-2.5`}>
                <button
                  type="button"
                  onClick={onClose}
                  className={`p-2 rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
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
              </div>

              {/* Main Exercise Body */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
                {/* Badge & Hebrew Prompt */}
                <div className="flex flex-wrap items-center justify-between gap-2" dir="rtl">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>
                    {currentStep.badgeLabelHe}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>{showHint ? 'הסתר רמז' : 'רמז בעברית 💡'}</span>
                  </button>
                </div>

                <p className="text-base md:text-lg font-extrabold" dir="rtl">
                  {currentStep.promptHe}
                </p>

                {showHint && (
                  <div
                    className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-xs md:text-sm font-bold"
                    dir="rtl"
                  >
                    {currentStep.hintHe}
                  </div>
                )}

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

                {/* Question Bubble, with the companion peeking over its corner */}
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
                  <QuestionBubble
                    questionEn={currentStep.questionEn}
                    readAloudText={currentStep.speakTargetEn}
                    speakerAvatar={currentStep.speakerAvatar}
                    speakerName={currentStep.speakerName}
                    theme={theme}
                    onSpeakEnglish={onSpeakEnglish}
                  />
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
                    targetSentenceHe={currentStep.targetSentenceHe}
                    selectedIndices={selectedWordIndices}
                    isCompleted={stepCompleted}
                    onToggleWord={handleToggleWordTile}
                    onReset={() => setSelectedWordIndices([])}
                    onCheck={handleCheckSentence}
                    theme={theme}
                  />
                )}

                {/* DRILL TYPE 3: TWO-WAY VOICE SPEAKING & PRONUNCIATION MATCHER */}
                {currentStep.type === 'voice-speak' && currentStep.speakTargetEn && (
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
                      registerCorrectAnswer(
                        isGirl
                          ? 'דילגת על מיקרופון במצב שקט — ממשיכות לשלב הבא!'
                          : 'דילגת על מיקרופון במצב שקט — ממשיכים לשלב הבא!'
                      )
                    }
                  />
                )}

                {/* Room to scroll everything up above the feedback sheet */}
                {feedbackHe && <div className="h-[55vh]" aria-hidden="true" />}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Instant Hebrew feedback sheet + next step button. Outside the overlay: its backdrop
          blur would make the sheet's fixed position scroll with the drill. */}
      {hasStarted && feedbackHe && (
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
    </>
  );
};
