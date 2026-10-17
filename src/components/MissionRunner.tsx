import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { MissionNode } from '../data/curriculum';
import { RoomItem } from '../data/room';
import {
  getExercisesForMission,
  MissionExerciseStep,
} from '../data/missionExercises';
import { LearnerGender, ProficiencyTier } from '../types/learner';
import { ThemeDefinition, TIER_CONFIG } from '../themes/themeRegistry';
import { SpeechEvaluationResult } from '../utils/speechSimilarity';
import { getSpeechErrorTextHe, useSpeechRecognition } from '../hooks/useSpeechRecognition';
import {
  X,
  Flame,
  Star,
  Gem,
  Zap,
  Lightbulb,
  Trophy,
} from 'lucide-react';
import {
  FeedbackBanner,
  MultipleChoiceOptions,
  PassageBox,
  QuestionBubble,
  SentenceBuilderDrill,
  VoiceSpeakDrill,
} from './drills';

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
  roomRewardPreview?: RoomItem | null;
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
}) => {
  const isGirl = gender === 'girl';
  // Random salt per mission attempt: shuffles answer options differently on every attempt,
  // but keeps them stable across re-renders while a question is being answered.
  const [shuffleSalt] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const steps = useMemo(
    () => getExercisesForMission(mission, tier, gender, shuffleSalt),
    [mission, tier, gender, shuffleSalt]
  );
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
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);
    if (!attemptedCurrentStep) {
      setFirstTryCorrectCount((prev) => prev + 1);
    }
    setStepCompleted(true);
    setFeedbackHe({ isCorrect: true, text: explanationHe });
  };

  const registerWrongAttempt = (explanationHe: string) => {
    setAttemptedCurrentStep(true);
    setCombo(0);
    setFeedbackHe({ isCorrect: false, text: explanationHe });
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
      onError: (kind) => setFeedbackHe({ isCorrect: false, text: getSpeechErrorTextHe(kind, gender) }),
    });
  };

  const handleNextStep = () => {
    if (currentStepIdx + 1 < steps.length) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      setIsMissionFinished(true);
      confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    }
  };

  // Calculate final rewards
  const accuracyRatio = firstTryCorrectCount / steps.length;
  const starsEarned: 1 | 2 | 3 =
    accuracyRatio >= 0.8 ? 3 : accuracyRatio >= 0.5 ? 2 : 1;
  const comboBonusXp = maxCombo * 5;
  const totalXpEarned =
    Math.round(mission.baseXp * tierMeta.xpMultiplier) + comboBonusXp;
  const totalDiamondsEarned =
    mission.baseDiamonds +
    tierMeta.diamondBonus +
    (starsEarned === 3 ? 5 : 0);

  if (isMissionFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div
          className={`w-full max-w-lg rounded-3xl p-6 md:p-8 ${theme.cardBgClass} ${theme.pageBgClass} text-center space-y-6 shadow-2xl border-2 border-amber-400`}
        >
          <div className="w-20 h-20 rounded-3xl mx-auto bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-4xl animate-float">
            🏆
          </div>

          <div className="space-y-1.5" dir="rtl">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-extrabold">
              MISSION COMPLETE · משימה הושלמה!
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold">
              {isGirl
                ? `כל הכבוד, ${learnerName}! את אלופה! 🎉`
                : `כל הכבוד, ${learnerName}! אתה אלוף! 🎉`}
            </h2>
            <p className={`text-sm ${theme.mutedTextClass}`}>
              סיימת את משימה {mission.unitNumber}.{mission.missionNumber}:{' '}
              <b>{mission.titleHe}</b> ברמת {tierMeta.labelEn}
            </p>
          </div>

          {/* 1-3 Stars Display */}
          <div className="flex items-center justify-center gap-3 py-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`p-3 rounded-2xl border ${
                  starsEarned >= s
                    ? 'bg-amber-400/20 border-amber-400 scale-110'
                    : 'bg-black/10 border-current/10 opacity-40'
                } transition-all`}
              >
                <Star
                  className={`w-9 h-9 ${
                    starsEarned >= s
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-400'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Earned Currencies Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10">
              <Zap className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
              <div className="text-lg font-extrabold">+{totalXpEarned} XP</div>
              <div className="text-xs opacity-75" dir="rtl">
                כולל בונוס {maxCombo}x רצף
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10">
              <Gem className="w-5 h-5 text-fuchsia-500 mx-auto mb-1" />
              <div className="text-lg font-extrabold">+{totalDiamondsEarned} 💎</div>
              <div className="text-xs opacity-75" dir="rtl">
                {theme.currencyNameHe}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10">
              <Trophy className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <div className="text-lg font-extrabold">
                +{mission.vocabulary.length} מילים
              </div>
              <div className="text-xs opacity-75" dir="rtl">
                נוספו לאוצר המילים
              </div>
            </div>
          </div>

          {starsEarned === 3 && roomRewardPreview && (
            <div
              className="p-3.5 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-400/50 flex items-center justify-center gap-3"
              dir="rtl"
            >
              <span className="text-3xl leading-none" aria-hidden="true">
                {roomRewardPreview.emoji}
              </span>
              <div className="text-right">
                <div className="text-sm font-extrabold">🎁 פריט חדש לחדר האנגלי: {roomRewardPreview.nameHe}</div>
                <div className="text-xs opacity-80">
                  {isGirl ? 'אמרי או אייתי' : 'אמור או איית'} &ldquo;<span dir="ltr">{roomRewardPreview.nameEn}</span>&rdquo; כדי
                  להניח אותו בחדר
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              onCompleteMission({
                missionId: mission.id,
                starsEarned,
                xpEarned: totalXpEarned,
                diamondsEarned: totalDiamondsEarned,
                wordsLearnedCount: mission.vocabulary.length,
              })
            }
            className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 ${theme.primaryBtnClass}`}
          >
            <span dir="rtl">איסוף פרסים וחזרה לדשבורד 🚀</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div
        className={`w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-current/15 ${theme.pageBgClass}`}
      >
        {/* Top Mission HUD Bar */}
        <div
          className={`px-3.5 sm:px-5 py-3 sm:py-4 ${theme.hudBgClass} flex items-center justify-between gap-2.5`}
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
              title="Exit Mission"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Step Progress Bar */}
            <div className="flex-1 h-2.5 sm:h-3 rounded-full bg-black/15 dark:bg-white/15 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round(((currentStepIdx + 1) / steps.length) * 100)}%`,
                }}
              />
            </div>

            <span className="text-xs font-extrabold shrink-0" dir="ltr">
              {currentStepIdx + 1}/{steps.length}
            </span>
          </div>

          {/* Combo Meter + Live Tier Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            {combo >= 2 && (
              <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-extrabold flex items-center gap-1 animate-bounce">
                <Flame className="w-3 h-3 fill-slate-950" />
                <span>{combo}x</span>
              </span>
            )}

            <div className="flex items-center gap-1">
              {(['explorer', 'challenger', 'master'] as ProficiencyTier[]).map((tk) => (
                <button
                  key={tk}
                  type="button"
                  onClick={() => onChangeTier(tk)}
                  title={TIER_CONFIG[tk].labelEn}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
                    tier === tk ? theme.primaryBtnClass : theme.secondaryBtnClass
                  }`}
                >
                  <span>{TIER_CONFIG[tk].badgeEmoji}</span>
                  <span className="hidden sm:inline">{TIER_CONFIG[tk].labelEn}</span>
                </button>
              ))}
            </div>
          </div>
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

          {/* Question Bubble */}
          <QuestionBubble
            questionEn={currentStep.questionEn}
            readAloudText={currentStep.speakTargetEn}
            speakerAvatar={currentStep.speakerAvatar}
            speakerName={currentStep.speakerName}
            theme={theme}
            onSpeakEnglish={onSpeakEnglish}
          />

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

          {/* Instant Hebrew Feedback Banner + Next Step Button */}
          {feedbackHe && (
            <FeedbackBanner
              isCorrect={feedbackHe.isCorrect}
              text={feedbackHe.text}
              showNext={stepCompleted}
              nextLabel={
                currentStepIdx + 1 < steps.length
                  ? 'לשלב הבא'
                  : 'סיום משימה וקבלת פרסים 🏆'
              }
              onNext={handleNextStep}
              theme={theme}
            />
          )}
        </div>
      </div>
    </div>
  );
};
