import React, { useState } from 'react';
import {
  CurriculumUnit,
  MissionNode,
} from '../data/curriculum';
import {
  LearnerGender,
  ProficiencyTier,
} from '../types/learner';
import {
  ThemeDefinition,
  TIER_CONFIG,
} from '../themes/themeRegistry';
import { inflectHebrew } from '../utils/hebrewGender';
import {
  Star,
  Lock,
  Play,
  Volume2,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Crown,
} from 'lucide-react';

interface MissionMapProps {
  units: CurriculumUnit[];
  missionProgress: Record<string, number>;
  selectedTier: ProficiencyTier;
  onSelectTier?: (tier: ProficiencyTier) => void;
  theme: ThemeDefinition;
  gender: LearnerGender;
  onStartMission: (mission: MissionNode) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

export const MissionMap: React.FC<MissionMapProps> = ({
  units,
  missionProgress,
  selectedTier,
  theme,
  gender,
  onStartMission,
  onSpeakEnglish,
}) => {
  const allMissions = units.flatMap((u) => u.missions);
  const firstUncompletedIdx = allMissions.findIndex(
    (m) => (missionProgress[m.id] || 0) === 0
  );
  const activeMissionIndex =
    firstUncompletedIdx === -1 ? 0 : firstUncompletedIdx;

  const [selectedMission, setSelectedMission] = useState<MissionNode>(
    allMissions[activeMissionIndex] || allMissions[0]
  );

  // Keep selectedMission synced if grade changes
  React.useEffect(() => {
    const updatedList = units.flatMap((u) => u.missions);
    const nextIdx = updatedList.findIndex(
      (m) => (missionProgress[m.id] || 0) === 0
    );
    setSelectedMission(updatedList[nextIdx === -1 ? 0 : nextIdx] || updatedList[0]);
  }, [units, missionProgress]);

  const isGirl = gender === 'girl';
  const tierMeta = TIER_CONFIG[selectedTier];
  const currentTierObj = selectedMission?.tierObjectives[selectedTier];

  const isMissionUnlocked = (missionId: string): boolean => {
    const idx = allMissions.findIndex((m) => m.id === missionId);
    if (idx <= 0) return true;
    const prevMission = allMissions[idx - 1];
    return (
      (missionProgress[missionId] || 0) > 0 ||
      (missionProgress[prevMission.id] || 0) > 0 ||
      idx <= activeMissionIndex
    );
  };

  return (
    <section aria-label="Interactive Story World and Mission Map" className="space-y-4 md:space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-3 px-1" dir="rtl">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold flex items-center gap-2">
            <span>🗺️ מפת העולמות והמשימות</span>
          </h2>
          <p className={`text-xs ${theme.mutedTextClass}`}>
            {isGirl
              ? 'בחרי משימה פתוחה כדי להאזין לאוצר המילים ולהתחיל לתרגל'
              : 'בחר משימה פתוחה כדי להאזין לאוצר המילים ולהתחיל לתרגל'}
          </p>
        </div>
      </div>

      {/* Two-Column Layout on Desktop, Inline Expandable on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
        {/* Left 7 Columns: Units & Mission Nodes */}
        <div className="lg:col-span-7 space-y-4">
          {units.map((unit) => {
            const unitStars = unit.missions.reduce(
              (acc, m) => acc + (missionProgress[m.id] || 0),
              0
            );
            const maxUnitStars = unit.missions.length * 3;

            return (
              <div
                key={unit.unitNumber}
                className={`rounded-3xl p-4 sm:p-5 md:p-6 ${theme.cardBgClass} space-y-3.5`}
              >
                {/* Unit Banner */}
                <div className="flex items-center justify-between gap-3 border-b border-current/10 pb-3" dir="rtl">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-xl md:text-2xl ${theme.primaryBtnClass} shrink-0`}
                    >
                      {unit.badgeEmoji}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-sm md:text-base truncate" dir="ltr">
                        {unit.titleEn}
                      </h3>
                      <p className="text-xs font-bold truncate">
                        {unit.titleHe}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 shrink-0 ${theme.badgeClass}`}
                    dir="ltr"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>
                      {unitStars}/{maxUnitStars}
                    </span>
                  </div>
                </div>

                {/* Mission Nodes List */}
                <div className="space-y-2.5">
                  {unit.missions.map((mission) => {
                    const starsEarned = missionProgress[mission.id] || 0;
                    const unlocked = isMissionUnlocked(mission.id);
                    const isSelected = selectedMission?.id === mission.id;
                    const isCurrentNext =
                      allMissions[activeMissionIndex]?.id === mission.id;

                    return (
                      <div
                        key={mission.id}
                        onClick={() => unlocked && setSelectedMission(mission)}
                        role="button"
                        tabIndex={unlocked ? 0 : -1}
                        onKeyDown={(e) => {
                          if (unlocked && (e.key === 'Enter' || e.key === ' ')) {
                            setSelectedMission(mission);
                          }
                        }}
                        className={`rounded-2xl p-3 sm:p-4 transition-all ${
                          unlocked ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                        } ${
                          isSelected
                            ? 'ring-2 ring-purple-500 bg-purple-500/10'
                            : 'bg-black/5 dark:bg-white/5 hover:bg-purple-500/5'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2.5">
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                            <div
                              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                                unlocked
                                  ? theme.primaryBtnClass
                                  : 'bg-slate-400/20 text-slate-400'
                              }`}
                            >
                              {unlocked ? mission.icon : <Lock className="w-4 h-4" />}
                            </div>

                            <div className="min-w-0 space-y-0.5">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="font-extrabold text-xs sm:text-sm md:text-base truncate">
                                  {mission.unitNumber}.{mission.missionNumber}{' '}
                                  {mission.titleEn}
                                </span>
                                {mission.isBoss && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-amber-400/25 border border-amber-400 text-amber-600 dark:text-amber-300 text-[10px] font-extrabold flex items-center gap-0.5">
                                    <Crown className="w-2.5 h-2.5" /> BOSS
                                  </span>
                                )}
                                {isCurrentNext && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold" dir="rtl">
                                    הבא בתור
                                  </span>
                                )}
                              </div>

                              <p className="text-xs font-bold truncate" dir="rtl">
                                {inflectHebrew(mission.titleHe, gender)}
                              </p>
                            </div>
                          </div>

                          {/* Stars & Play Action Button */}
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <div
                              className="flex items-center gap-0.5"
                              title={`${starsEarned} of 3 Stars Earned`}
                            >
                              {[1, 2, 3].map((starNum) => (
                                <Star
                                  key={starNum}
                                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                    starsEarned >= starNum
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-400/40'
                                  }`}
                                />
                              ))}
                            </div>

                            {unlocked ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMission(mission);
                                  onStartMission(mission);
                                }}
                                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-extrabold flex items-center gap-1 ${
                                  isSelected
                                    ? theme.primaryBtnClass
                                    : theme.secondaryBtnClass
                                }`}
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span dir="rtl" className="hidden xs:inline sm:inline">
                                  {starsEarned > 0
                                    ? isGirl
                                      ? 'שוב'
                                      : 'שוב'
                                    : isGirl
                                    ? 'התחילי'
                                    : 'התחל'}
                                </span>
                              </button>
                            ) : (
                              <span className="text-xs font-bold opacity-60">🔒</span>
                            )}
                          </div>
                        </div>

                        {/* Inline Mobile Mission Preview (shown right inside the selected node on <lg screens) */}
                        {isSelected && unlocked && (
                          <div
                            className="lg:hidden mt-3 pt-3 border-t border-current/10 space-y-2.5"
                            dir="rtl"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className={`font-bold ${theme.mutedTextClass}`}>
                                {mission.grammarTopic}
                              </span>
                              <span className="font-extrabold text-emerald-600 dark:text-emerald-300" dir="ltr">
                                +{Math.round(mission.baseXp * tierMeta.xpMultiplier)} XP · +
                                {mission.baseDiamonds + tierMeta.diamondBonus} 💎
                              </span>
                            </div>

                            {/* Compact Horizontal / Grid Vocab Chips for Mobile */}
                            <div className="flex flex-wrap gap-1.5">
                              {mission.vocabulary.map((v) => (
                                <button
                                  key={v.wordEn}
                                  type="button"
                                  onClick={() => onSpeakEnglish(v.wordEn, 0.9)}
                                  className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
                                >
                                  <Volume2 className="w-3 h-3 shrink-0" />
                                  {v.emoji && <span aria-hidden="true">{v.emoji}</span>}
                                  <span dir="ltr" className="font-extrabold">{v.wordEn}</span>
                                  <span className="opacity-75">· {v.translationHe}</span>
                                </button>
                              ))}
                            </div>

                            <button
                              type="button"
                              onClick={() => onStartMission(mission)}
                              className={`w-full py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 ${theme.primaryBtnClass}`}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>
                                {isGirl
                                  ? `התחילי משימה ${mission.unitNumber}.${mission.missionNumber}`
                                  : `התחל משימה ${mission.unitNumber}.${mission.missionNumber}`}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 5 Columns (Desktop Only): Selected Mission Briefing & Audio Vocabulary Studio */}
        {selectedMission && (
          <aside className="hidden lg:block lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <div className={`rounded-3xl p-5 md:p-6 ${theme.cardBgClass} space-y-4`}>
              {/* Mission Header */}
              <div className="space-y-1.5" dir="rtl">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>
                    {selectedMission.icon} משימה {selectedMission.unitNumber}.
                    {selectedMission.missionNumber}
                  </span>
                  <span className="text-xs font-bold opacity-80">
                    ⏱️ {selectedMission.estimatedMinutes} דקות
                  </span>
                </div>

                <h3 className="text-xl font-extrabold" dir="ltr">
                  {selectedMission.titleEn}
                </h3>
                <p className="text-sm font-bold">{inflectHebrew(selectedMission.titleHe, gender)}</p>
                <p className={`text-xs leading-relaxed ${theme.mutedTextClass}`}>
                  {inflectHebrew(selectedMission.storyHookHe, gender)}
                </p>
              </div>

              {/* Active Proficiency Tier Objective Box */}
              {currentTierObj && (
                <div
                  className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-400/30 space-y-2"
                  dir="rtl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span>רמת {tierMeta.labelHe}:</span>
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-300" dir="ltr">
                      +{Math.round(selectedMission.baseXp * tierMeta.xpMultiplier)} XP · +
                      {selectedMission.baseDiamonds + tierMeta.diamondBonus} 💎
                    </span>
                  </div>
                  <p className="text-xs font-semibold">{inflectHebrew(currentTierObj.focusHe, gender)}</p>
                  <div
                    className="p-2.5 rounded-xl bg-black/5 dark:bg-black/25 text-xs font-bold flex items-center justify-between gap-2"
                    dir="ltr"
                  >
                    <span>&ldquo;{currentTierObj.samplePromptEn}&rdquo;</span>
                    <button
                      type="button"
                      onClick={() =>
                        onSpeakEnglish(
                          currentTierObj.samplePromptEn.replace(/_______/g, ''),
                          0.92
                        )
                      }
                      className={`p-1.5 rounded-lg shrink-0 ${theme.secondaryBtnClass}`}
                      title="Listen to sample sentence"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Target Vocabulary Studio with 1-Tap TTS Pronunciation */}
              <div className="space-y-2" dir="rtl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>אוצר מילים למשימה ({isGirl ? 'לחצי' : 'לחץ'} להאזנה 🔊):</span>
                  </h4>
                  <span className="text-xs opacity-75">
                    {selectedMission.vocabulary.length} מילים
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedMission.vocabulary.map((vocab) => (
                    <div
                      key={vocab.wordEn}
                      className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center justify-between gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => onSpeakEnglish(`${vocab.wordEn}. ${vocab.exampleEn}`, 0.9)}
                        className={`p-2 rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
                        title={`Listen to "${vocab.wordEn}"`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-purple-600 dark:text-purple-300">
                            {vocab.translationHe}
                          </span>
                          <span className="font-extrabold text-sm" dir="ltr">
                            {vocab.emoji && <span aria-hidden="true">{vocab.emoji} </span>}
                            {vocab.wordEn}{' '}
                            <span className="text-xs font-normal opacity-70">
                              ({vocab.partOfSpeech})
                            </span>
                          </span>
                        </div>
                        <p className="text-xs opacity-80 mt-0.5" dir="ltr">
                          {vocab.exampleEn}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Selected Mission CTA */}
              <button
                type="button"
                onClick={() => onStartMission(selectedMission)}
                className={`w-full py-3.5 rounded-2xl font-extrabold text-sm md:text-base flex items-center justify-center gap-2 ${theme.primaryBtnClass}`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span dir="rtl">
                  {isGirl
                    ? `התחילי את משימה ${selectedMission.unitNumber}.${selectedMission.missionNumber}`
                    : `התחל את משימה ${selectedMission.unitNumber}.${selectedMission.missionNumber}`}
                </span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};
