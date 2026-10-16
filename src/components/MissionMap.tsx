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
  onSelectTier: (tier: ProficiencyTier) => void;
  theme: ThemeDefinition;
  gender: LearnerGender;
  onStartMission: (mission: MissionNode) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

export const MissionMap: React.FC<MissionMapProps> = ({
  units,
  missionProgress,
  selectedTier,
  onSelectTier,
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
    <section aria-label="Interactive Story World and Mission Map" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3" dir="rtl">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
            <span>🗺️ מפת העולמות והמשימות (Interactive Mission Map)</span>
          </h2>
          <p className={`text-xs md:text-sm ${theme.mutedTextClass}`}>
            {isGirl
              ? 'בחרי כל משימה פתוחה במפה כדי לתרגל אוצר מילים Band II, להאזין להגייה ולהתחיל לשחק!'
              : 'בחר כל משימה פתוחה במפה כדי לתרגל אוצר מילים Band II, להאזין להגייה ולהתחיל לשחק!'}
          </p>
        </div>

        {/* Global Proficiency Tier Pills */}
        <div className="flex items-center gap-1.5 self-start">
          {(['explorer', 'challenger', 'master'] as ProficiencyTier[]).map((tk) => {
            const tm = TIER_CONFIG[tk];
            const active = selectedTier === tk;
            return (
              <button
                key={tk}
                type="button"
                onClick={() => onSelectTier(tk)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                  active ? theme.primaryBtnClass : theme.secondaryBtnClass
                }`}
              >
                <span>{tm.badgeEmoji}</span>
                <span>{tm.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Column Layout: Left = Winding Units & Nodes, Right = Selected Mission Briefing & Vocab Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Columns: Units & Mission Nodes */}
        <div className="lg:col-span-7 space-y-5">
          {units.map((unit) => {
            const unitStars = unit.missions.reduce(
              (acc, m) => acc + (missionProgress[m.id] || 0),
              0
            );
            const maxUnitStars = unit.missions.length * 3;

            return (
              <div
                key={unit.unitNumber}
                className={`rounded-3xl p-5 md:p-6 ${theme.cardBgClass} space-y-4`}
              >
                {/* Unit Banner */}
                <div className="flex items-start justify-between gap-3 border-b border-current/10 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${theme.primaryBtnClass} shrink-0`}
                    >
                      {unit.badgeEmoji}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base md:text-lg">
                        {unit.titleEn}
                      </h3>
                      <p className="text-xs md:text-sm font-bold" dir="rtl">
                        {unit.titleHe}
                      </p>
                      <p className={`text-xs ${theme.mutedTextClass} mt-0.5`} dir="rtl">
                        {unit.subtitleHe}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 shrink-0 ${theme.badgeClass}`}
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>
                      {unitStars} / {maxUnitStars}
                    </span>
                  </div>
                </div>

                {/* Mission Nodes List */}
                <div className="space-y-3">
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
                        className={`rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                          unlocked ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                        } ${
                          isSelected
                            ? 'ring-2 ring-purple-500 bg-purple-500/10'
                            : 'bg-black/5 dark:bg-white/5 hover:bg-purple-500/5'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                              unlocked
                                ? theme.primaryBtnClass
                                : 'bg-slate-400/20 text-slate-400'
                            }`}
                          >
                            {unlocked ? mission.icon : <Lock className="w-5 h-5" />}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-extrabold text-sm md:text-base">
                                {mission.unitNumber}.{mission.missionNumber}{' '}
                                {mission.titleEn}
                              </span>
                              {mission.isBoss && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-400/25 border border-amber-400 text-amber-600 dark:text-amber-300 text-xs font-extrabold flex items-center gap-1">
                                  <Crown className="w-3 h-3" /> BOSS
                                </span>
                              )}
                              {isCurrentNext && (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-extrabold">
                                  המשימה הבאה שלך!
                                </span>
                              )}
                            </div>

                            <p className="text-xs font-bold" dir="rtl">
                              {mission.titleHe}
                            </p>
                            <p className={`text-xs ${theme.mutedTextClass}`}>
                              {mission.grammarTopic}
                            </p>
                          </div>
                        </div>

                        {/* Stars & Action Button */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-current/10">
                          <div
                            className="flex items-center gap-1"
                            title={`${starsEarned} of 3 Stars Earned`}
                          >
                            {[1, 2, 3].map((starNum) => (
                              <Star
                                key={starNum}
                                className={`w-4 h-4 ${
                                  starsEarned >= starNum
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-400/50'
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
                              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${
                                isSelected
                                  ? theme.primaryBtnClass
                                  : theme.secondaryBtnClass
                              }`}
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span dir="rtl">
                                {starsEarned > 0 ? 'שחקי שוב (+💎)' : 'התחילי'}
                              </span>
                            </button>
                          ) : (
                            <span className="text-xs font-bold opacity-70" dir="rtl">
                              🔒 נעול
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 5 Columns: Selected Mission Briefing & Audio Vocabulary Studio */}
        {selectedMission && (
          <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className={`rounded-3xl p-5 md:p-6 ${theme.cardBgClass} space-y-5`}>
              {/* Mission Header */}
              <div className="space-y-2" dir="rtl">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>
                    {selectedMission.icon} משימה {selectedMission.unitNumber}.
                    {selectedMission.missionNumber} · תדריך משימה
                  </span>
                  <span className="text-xs font-bold opacity-80">
                    ⏱️ {selectedMission.estimatedMinutes} דקות
                  </span>
                </div>

                <h3 className="text-xl font-extrabold" dir="ltr">
                  {selectedMission.titleEn}
                </h3>
                <p className="text-sm font-bold">{selectedMission.titleHe}</p>
                <p className={`text-xs leading-relaxed ${theme.mutedTextClass}`}>
                  {selectedMission.storyHookHe}
                </p>
              </div>

              {/* Active Proficiency Tier Objective Box */}
              {currentTierObj && (
                <div
                  className="p-4 rounded-2xl bg-purple-500/10 border border-purple-400/30 space-y-2"
                  dir="rtl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      <span>
                        רמת {tierMeta.labelEn} ({tierMeta.labelHe}):
                      </span>
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-300">
                      +{Math.round(selectedMission.baseXp * tierMeta.xpMultiplier)} XP · +
                      {selectedMission.baseDiamonds + tierMeta.diamondBonus} 💎
                    </span>
                  </div>
                  <p className="text-xs font-semibold">{currentTierObj.focusHe}</p>
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
              <div className="space-y-2.5" dir="rtl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>אוצר מילים למשימה (לחצי להאזנה 🔊):</span>
                  </h4>
                  <span className="text-xs opacity-75">
                    {selectedMission.vocabulary.length} מילים
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedMission.vocabulary.map((vocab) => (
                    <div
                      key={vocab.wordEn}
                      className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center justify-between gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => onSpeakEnglish(`${vocab.wordEn}. ${vocab.exampleEn}`, 0.9)}
                        className={`p-2.5 rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
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
                className={`w-full py-4 rounded-2xl font-extrabold text-sm md:text-base flex items-center justify-center gap-2 ${theme.primaryBtnClass}`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span dir="rtl">
                  {isGirl
                    ? `התחילי את משימה ${selectedMission.unitNumber}.${selectedMission.missionNumber} עכשיו`
                    : `התחל את משימה ${selectedMission.unitNumber}.${selectedMission.missionNumber} עכשיו`}
                </span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </section>
  );
};
