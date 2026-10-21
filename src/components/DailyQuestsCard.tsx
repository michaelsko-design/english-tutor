import React from 'react';
import { celebrate } from '../utils/celebrate';
import { getDailyQuests, DailyQuestDefinition } from '../data/rewardShop';
import { DailyActivityCounters, LearnerGender } from '../types/learner';
import { ThemeDefinition } from '../themes/themeRegistry';
import { Flame, CheckCircle2, Gift, ShieldCheck } from 'lucide-react';
import { addDays, toLocalDateStr } from '../utils/dates';
import { Button } from './ui/Button';

interface DailyQuestsCardProps {
  streakDays: number;
  /** Local dates with a finished session (from the activity log) */
  activeDates: string[];
  dailyCounters: DailyActivityCounters;
  claimedQuestIds: string[];
  gender: LearnerGender;
  theme: ThemeDefinition;
  isShabbatObserver?: boolean;
  onClaimQuest: (quest: DailyQuestDefinition) => void;
  onOpenShop?: () => void;
}

export const DailyQuestsCard: React.FC<DailyQuestsCardProps> = ({
  streakDays,
  activeDates,
  dailyCounters,
  claimedQuestIds,
  gender,
  theme,
  isShabbatObserver = true,
  onClaimQuest,
}) => {
  const quests = getDailyQuests(gender);
  const today = new Date();
  const todayDayIdx = today.getDay();
  const todayStr = toLocalDateStr(today);
  const activeDateSet = new Set(activeDates);
  if (dailyCounters.missionsCompletedToday > 0) activeDateSet.add(todayStr);

  const weekDays = [
    { label: 'א׳', dayIndex: 0, isShabbatSafe: false },
    { label: 'ב׳', dayIndex: 1, isShabbatSafe: false },
    { label: 'ג׳', dayIndex: 2, isShabbatSafe: false },
    { label: 'ד׳', dayIndex: 3, isShabbatSafe: false },
    { label: 'ה׳', dayIndex: 4, isShabbatSafe: false },
    { label: 'ו׳', dayIndex: 5, isShabbatSafe: isShabbatObserver },
    { label: 'ש׳', dayIndex: 6, isShabbatSafe: isShabbatObserver },
  ];

  const handleClaim = (quest: DailyQuestDefinition) => {
    celebrate('small');
    onClaimQuest(quest);
  };

  return (
    <section
      aria-label="Daily Quests and Weekly Streak"
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6"
    >
      {/* Left 7 Cols: 3 Daily Quests */}
      <div className={`lg:col-span-7 rounded-3xl p-4 sm:p-5 md:p-6 ${theme.cardBgClass} space-y-3`}>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base md:text-lg font-extrabold flex items-center gap-2">
            <span>🎯 אתגרים יומיים</span>
          </h3>
          <span className={`text-xs font-semibold ${theme.mutedTextClass}`}>
            בונוס יהלומים ונקודות <bdi dir="ltr" lang="en">Vibe</bdi>
          </span>
        </div>

        <div className="space-y-2.5">
          {quests.map((quest) => {
            const currentVal = quest.getCurrentCount(dailyCounters);
            const progressRatio = Math.min(1, currentVal / quest.targetCount);
            const isCompleted = currentVal >= quest.targetCount;
            const isClaimed = claimedQuestIds.includes(quest.id);

            return (
              <div
                key={quest.id}
                className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center text-lg shrink-0">
                    {quest.icon}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-xs md:text-sm leading-snug">
                        {quest.titleHe}
                      </span>
                      <span className="text-xs font-bold opacity-75 shrink-0" dir="ltr" lang="en">
                        {Math.min(currentVal, quest.targetCount)}/{quest.targetCount}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full bg-black/15 dark:bg-white/15 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-rose-400 rounded-full transition-all duration-300"
                        style={{ width: `${Math.round(progressRatio * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Reward / Claim CTA */}
                <div className="flex items-center justify-end shrink-0">
                  {isClaimed ? (
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>נאסף</span>
                    </span>
                  ) : isCompleted ? (
                    <Button theme={theme} size="sm" className="animate-pulse" onClick={() => handleClaim(quest)}>
                      <Gift className="w-3.5 h-3.5" />
                      <span dir="ltr" lang="en">+{quest.rewardDiamonds} 💎</span>
                    </Button>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${theme.badgeClass}`} dir="ltr" lang="en">
                      +{quest.rewardDiamonds} 💎
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 5 Cols: Compact Weekly Streak Calendar */}
      <div
        className={`lg:col-span-5 rounded-3xl p-4 sm:p-5 md:p-6 ${theme.cardBgClass} flex flex-col justify-between gap-3`}
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base md:text-lg font-extrabold flex items-center gap-1.5">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span>רצף שבועי ({streakDays} ימים)</span>
          </h3>
          {isShabbatObserver && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>שבת שמורה</span>
            </span>
          )}
        </div>

        {/* 7-Day Streak Row */}
        <div className="grid grid-cols-7 gap-1.5">
          {weekDays.map((d) => {
            const isToday = d.dayIndex === todayDayIdx;
            const isPast = d.dayIndex < todayDayIdx;
            const isActive = activeDateSet.has(addDays(todayStr, d.dayIndex - todayDayIdx));
            // 🔥 a learning day, 🛡️ a protected day, 💤 a missed day, ⚪ still to come (or today)
            const icon = isActive ? '🔥' : d.isShabbatSafe ? '🛡️' : isPast ? '💤' : '⚪';

            return (
              <div
                key={d.label}
                className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center gap-1 ${
                  isToday
                    ? 'border-2 border-orange-400 bg-orange-500/15'
                    : d.isShabbatSafe
                    ? 'border-emerald-400/40 bg-emerald-500/10'
                    : 'border-current/10 bg-black/5 dark:bg-white/5'
                }`}
              >
                <span className="text-xs font-extrabold">{d.label}</span>
                <span className="text-sm" aria-label={isActive ? 'יום למידה' : d.isShabbatSafe ? 'יום מוגן' : isPast ? 'יום בלי למידה' : 'עוד לא'}>
                  {icon}
                </span>
              </div>
            );
          })}
        </div>

        <p className={`text-xs ${theme.mutedTextClass}`}>
          {isShabbatObserver
            ? 'בימי שישי ושבת הרצף שלך מוגן אוטומטית 🛡️'
            : 'השלימו משימה קצרה מדי יום כדי לשמור על הרצף 🔥'}
        </p>
      </div>
    </section>
  );
};
