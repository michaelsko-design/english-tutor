import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { MissionNode } from '../data/curriculum';
import {
  getExercisesForMission,
  MissionExerciseStep,
} from '../data/missionExercises';
import { LearnerGender, ProficiencyTier } from '../types/learner';
import { ThemeDefinition, TIER_CONFIG } from '../themes/themeRegistry';
import {
  evaluateSpokenSentence,
  SpeechEvaluationResult,
} from '../utils/speechSimilarity';
import {
  X,
  Flame,
  Star,
  Gem,
  Zap,
  Volume2,
  Mic,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
} from 'lucide-react';

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
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
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
    setIsListening(false);
    setSpokenText('');
    setSpeechEval(null);
  }, [currentStepIdx, tier]);

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
    const target = currentStep.speakTargetEn;

    const SpeechRecognitionApi =
      (window as unknown as {
        SpeechRecognition?: unknown;
        webkitSpeechRecognition?: unknown;
      }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      setIsListening(false);
      setFeedbackHe({
        isCorrect: false,
        text: isGirl
          ? 'הדפדפן שלך אינו תומך בזיהוי דיבור קולי. אנא השתמשי בדפדפן Chrome או Edge, או לחצי על כפתור הדילוג למטה.'
          : 'הדפדפן שלך אינו תומך בזיהוי דיבור קולי. אנא השתמש בדפדפן Chrome או Edge, או לחץ על כפתור הדילוג למטה.',
      });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognitionApi as any)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setFeedbackHe(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      setIsListening(false);
      const transcript: string = event.results?.[0]?.[0]?.transcript || '';
      setSpokenText(transcript);
      const evaluation = evaluateSpokenSentence(target, transcript);
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
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      setIsListening(false);
      const errCode = event?.error || '';
      if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
        setFeedbackHe({
          isCorrect: false,
          text: isGirl
            ? 'הגישה למיקרופון חסומה בדפדפן. אשרי גישה למיקרופון בשורת הכתובת ונסי שוב!'
            : 'הגישה למיקרופון חסומה בדפדפן. אשר גישה למיקרופון בשורת הכתובת ונסה שוב!',
        });
      } else {
        setFeedbackHe({
          isCorrect: false,
          text: isGirl
            ? 'לא הצלחנו לשמוע אותך בבירור במיקרופון. לחצי שוב על הכפתור וקראי את המשפט בקול רם וברור!'
            : 'לא הצלחנו לשמוע אותך בבירור במיקרופון. לחץ שוב על הכפתור וקרא את המשפט בקול רם וברור!',
        });
      }
    };

    recognition.start();
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
            <div className={`p-4 md:p-5 rounded-2xl ${theme.cardBgClass} space-y-2.5`}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider opacity-75">
                  📖 Reading Passage · קטע קריאה
                </span>
                <button
                  type="button"
                  onClick={() => onSpeakEnglish(currentStep.contextPassageEn!, 0.92)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to Story 🔊</span>
                </button>
              </div>
              <p className="text-sm md:text-base font-bold leading-relaxed" dir="ltr">
                {currentStep.contextPassageEn}
              </p>
              {tier === 'explorer' && currentStep.contextPassageHe && (
                <p className={`text-xs ${theme.mutedTextClass} pt-1 border-t border-current/10`} dir="rtl">
                  {currentStep.contextPassageHe}
                </p>
              )}
            </div>
          )}

          {/* Question Bubble */}
          <div className={`p-4 md:p-5 rounded-2xl ${theme.cardBgClass} flex items-start justify-between gap-3`}>
            <div className="flex items-start gap-3">
              {currentStep.speakerAvatar && (
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${theme.primaryBtnClass}`}>
                  {currentStep.speakerAvatar}
                </div>
              )}
              <div>
                {currentStep.speakerName && (
                  <div className="text-xs font-bold opacity-75 mb-0.5">
                    {currentStep.speakerName}
                  </div>
                )}
                <p className="text-base md:text-xl font-extrabold leading-snug" dir="ltr">
                  {currentStep.questionEn}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onSpeakEnglish(
                  (currentStep.speakTargetEn || currentStep.questionEn)
                    .replace(/_______/g, 'blank')
                    .replace(/\p{Extended_Pictographic}/gu, '')
                    .trim(),
                  0.92
                )
              }
              className={`p-2.5 rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
              title="Read aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* DRILL TYPE 1, 4, 5: MULTIPLE CHOICE OPTIONS */}
          {currentStep.options && (
            <div className="grid grid-cols-1 gap-2.5">
              {currentStep.options.map((opt, idx) => {
                const isPicked = selectedOptionIdx === idx;
                let borderStyle = theme.cardBgClass;
                if (isPicked) {
                  borderStyle = opt.isCorrect
                    ? 'bg-emerald-500/20 border-2 border-emerald-500'
                    : 'bg-rose-500/20 border-2 border-rose-500';
                }

                return (
                  <button
                    key={opt.textEn}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between gap-3 ${borderStyle}`}
                  >
                    <span className="font-extrabold text-sm md:text-base" dir="ltr">
                      {opt.textEn}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-black/10 dark:bg-white/10 shrink-0">
                      {isPicked
                        ? opt.isCorrect
                          ? '✅ Correct'
                          : '❌ Try Again'
                        : 'Select'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* DRILL TYPE 2: SENTENCE MAGNET BUILDER */}
          {currentStep.type === 'sentence-builder' && currentStep.scrambledWords && (
            <div className="space-y-4">
              {currentStep.targetSentenceHe && (
                <div className="text-sm font-bold opacity-85" dir="rtl">
                  משפט היעד לתרגום: &ldquo;{currentStep.targetSentenceHe}&rdquo;
                </div>
              )}

              {/* Assembled Sentence Tray */}
              <div
                className={`min-h-[68px] p-4 rounded-2xl border-2 border-dashed border-purple-400/60 bg-black/5 dark:bg-white/5 flex flex-wrap items-center gap-2`}
                dir="ltr"
              >
                {selectedWordIndices.length === 0 ? (
                  <span className="text-xs opacity-60">
                    Tap the English words below in the correct order...
                  </span>
                ) : (
                  selectedWordIndices.map((wordIdx) => (
                    <button
                      key={`picked-${wordIdx}`}
                      type="button"
                      onClick={() => handleToggleWordTile(wordIdx)}
                      className={`px-3.5 py-2 rounded-xl text-sm font-extrabold ${theme.primaryBtnClass}`}
                    >
                      {currentStep.scrambledWords![wordIdx]}
                    </button>
                  ))
                )}
              </div>

              {/* Word Bank Tiles */}
              <div className="flex flex-wrap items-center gap-2" dir="ltr">
                {currentStep.scrambledWords.map((word, idx) => {
                  const isUsed = selectedWordIndices.includes(idx);
                  return (
                    <button
                      key={`bank-${idx}-${word}`}
                      type="button"
                      disabled={isUsed || stepCompleted}
                      onClick={() => handleToggleWordTile(idx)}
                      className={`px-3.5 py-2 rounded-xl text-sm font-extrabold transition-all ${
                        isUsed
                          ? 'opacity-30 scale-95 cursor-not-allowed bg-slate-400/20'
                          : theme.secondaryBtnClass
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              {!stepCompleted && (
                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedWordIndices([])}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span dir="rtl">איפוס מילים</span>
                  </button>
                  <button
                    type="button"
                    disabled={selectedWordIndices.length === 0}
                    onClick={handleCheckSentence}
                    className={`px-6 py-2.5 rounded-xl text-xs md:text-sm font-extrabold ${theme.primaryBtnClass} disabled:opacity-40`}
                  >
                    <span dir="rtl">בדיקת משפט ✓</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* DRILL TYPE 3: TWO-WAY VOICE SPEAKING & PRONUNCIATION MATCHER */}
          {currentStep.type === 'voice-speak' && currentStep.speakTargetEn && (
            <div className={`p-5 rounded-3xl ${theme.cardBgClass} space-y-4 text-center`}>
              <p className="text-xs font-bold opacity-80" dir="rtl">
                תרגום: &ldquo;{currentStep.speakTargetHe}&rdquo;
              </p>

              {/* Word-by-word interactive display (highlights green after speaking!) */}
              <div className="flex flex-wrap items-center justify-center gap-2 py-2" dir="ltr">
                {(speechEval
                  ? speechEval.wordResults
                  : currentStep.speakTargetEn.split(/\s+/).map((w) => ({
                      targetWord: w,
                      cleanWord: w,
                      matched: false,
                    }))
                ).map((item, idx) => (
                  <button
                    key={`${item.targetWord}-${idx}`}
                    type="button"
                    onClick={() => onSpeakEnglish(item.targetWord, 0.85)}
                    className={`px-3 py-1.5 rounded-xl text-base md:text-lg font-extrabold border transition-all ${
                      speechEval
                        ? item.matched
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-500/20 border-amber-500'
                        : 'bg-black/5 dark:bg-white/5 border-current/15 hover:border-purple-400'
                    }`}
                    title="Tap any word to hear it pronounced"
                  >
                    {item.targetWord}
                  </button>
                ))}
              </div>

              {/* Listen Normal / Listen Slow / Speak Aloud Controls */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onSpeakEnglish(currentStep.speakTargetEn!, 0.95)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>🔊 Listen (רגיל)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSpeakEnglish(currentStep.speakTargetEn!, 0.7)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>🐢 Listen Slow (איטי)</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartSpeechRecognition}
                  className={`px-6 py-3 rounded-2xl text-xs md:text-sm font-extrabold flex items-center gap-2 ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : theme.primaryBtnClass
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span dir="rtl">
                    {isListening
                      ? isGirl
                        ? 'מקשיב לך... קראי את המשפט באנגלית!'
                        : 'מקשיב לך... קרא את המשפט באנגלית!'
                      : isGirl
                      ? '🎙️ לחצי והקליטי בקול (Speak Aloud)'
                      : '🎙️ לחץ והקלט בקול (Speak Aloud)'}
                  </span>
                </button>
              </div>

              {!stepCompleted && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      registerCorrectAnswer(
                        isGirl
                          ? 'דילגת על מיקרופון במצב שקט — ממשיכות לשלב הבא!'
                          : 'דילגת על מיקרופון במצב שקט — ממשיכים לשלב הבא!'
                      )
                    }
                    className="text-xs underline opacity-70 hover:opacity-100"
                    dir="rtl"
                  >
                    {isGirl
                      ? 'אני במקום שקט ולא יכולה לדבר כרגע (מעבר להאזנה בלבד)'
                      : 'אני במקום שקט ולא יכול לדבר כרגע (מעבר להאזנה בלבד)'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Instant Hebrew Feedback Banner + Next Step Button */}
          {feedbackHe && (
            <div
              className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                feedbackHe.isCorrect
                  ? 'bg-emerald-500/15 border-emerald-500/50'
                  : 'bg-rose-500/15 border-rose-500/50'
              }`}
              dir="rtl"
            >
              <div className="flex items-start gap-2.5">
                {feedbackHe.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                )}
                <p className="text-xs md:text-sm font-extrabold">{feedbackHe.text}</p>
              </div>

              {stepCompleted && (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-extrabold flex items-center justify-center gap-1.5 shrink-0 ${theme.primaryBtnClass}`}
                >
                  <span>
                    {currentStepIdx + 1 < steps.length
                      ? 'לשלב הבא'
                      : 'סיום משימה וקבלת פרסים 🏆'}
                  </span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
