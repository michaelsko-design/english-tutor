import React from 'react';
import confetti from 'canvas-confetti';
import { DAILY_QUESTS, DailyQuestDefinition } from '../data/rewardShop';
import { DailyActivityCounters, LearnerGender } from '../types/learner';
import { ThemeDefinition } from '../themes/themeRegistry';
import { Flame, CheckCircle2, Gift, ShieldCheck, ShoppingBag } from 'lucide-react';

interface DailyQuestsCardProps {
  streakDays: number;
  dailyCounters: DailyActivityCounters;
  claimedQuestIds: string[];
  gender: LearnerGender;
  theme: ThemeDefinition;
  onClaimQuest: (quest: DailyQuestDefinition) => void;
  onOpenShop: () => void;
}

const WEEK_DAYS_HE = [
  { label: 'א׳', dayIndex: 0 },
  { label: 'ב׳', dayIndex: 1 },
  { label: 'ג׳', dayIndex: 2 },
  { label: 'ד׳', dayIndex: 3 },
  { label: 'ה׳', dayIndex: 4 },
  { label: 'ו׳', dayIndex: 5, isShabbatSafe: true },
  { label: 'ש׳', dayIndex: 6, isShabbatSafe: true },
];

export const DailyQuestsCard: React.FC<DailyQuestsCardProps> = ({
  streakDays,
  dailyCounters,
  claimedQuestIds,
  gender,
  theme,
  onClaimQuest,
  onOpenShop,
}) => {
  const isGirl = gender === 'girl';
  const todayDayIdx = new Date().getDay();

  const handleClaim = (quest: DailyQuestDefinition) => {
    confetti({ particleCount: 55, spread: 60, origin: { y: 0.7 } });
    onClaimQuest(quest);
  };

  return (
    <section
      aria-label="Daily Quests and Weekly Streak"
      className="grid grid-cols-1 lg:grid-cols-12 gap-6"
    >
      {/* Left 7 Cols: 3 Daily Quests */}
      <div className={`lg:col-span-7 rounded-3xl p-5 md:p-6 ${theme.cardBgClass} space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2" dir="rtl">
          <div>
            <h3 className="text-lg md:text-xl font-extrabold flex items-center gap-2">
              <span>🎯 משימות יומיות (Daily Quests)</span>
            </h3>
            <p className={`text-xs ${theme.mutedTextClass}`}>
              {isGirl
                ? 'השלימי אתגרים יומיים כדי לזכות ביהלומים נוספים לחנות הפרסים!'
                : 'השלם אתגרים יומיים כדי לזכות ביהלומים נוספים לחנות הפרסים!'}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenShop}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span dir="rtl">לחנות הפרסים 💎</span>
          </button>
        </div>

        <div className="space-y-3" dir="rtl">
          {DAILY_QUESTS.map((quest) => {
            const currentVal = quest.getCurrentCount(dailyCounters);
            const progressRatio = Math.min(1, currentVal / quest.targetCount);
            const isCompleted = currentVal >= quest.targetCount;
            const isClaimed = claimedQuestIds.includes(quest.id);

            return (
              <div
                key={quest.id}
                className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center text-xl shrink-0">
                    {quest.icon}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-xs md:text-sm">
                        {quest.titleHe}
                      </span>
                      <span className="text-xs font-bold opacity-75">
                        {Math.min(currentVal, quest.targetCount)} / {quest.targetCount}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2.5 rounded-full bg-black/15 dark:bg-white/15 overflow-hidden">
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
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>נאסף!</span>
                    </span>
                  ) : isCompleted ? (
                    <button
                      type="button"
                      onClick={() => handleClaim(quest)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 animate-pulse ${theme.primaryBtnClass}`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>איסוף +{quest.rewardDiamonds} 💎</span>
                    </button>
                  ) : (
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${theme.badgeClass}`}>
                      +{quest.rewardDiamonds} 💎 · +{quest.rewardXp} XP
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 5 Cols: Weekly Streak Calendar & Shabbat Shield Card */}
      <div
        className={`lg:col-span-5 rounded-3xl p-5 md:p-6 ${theme.cardBgClass} flex flex-col justify-between gap-4`}
        dir="rtl"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-300 text-xs font-extrabold flex items-center gap-1.5">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>רצף למידה: {streakDays} ימים ברצף!</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>שבת שמורה</span>
            </span>
          </div>

          <h3 className="text-lg font-extrabold pt-1">
            לוח הרצף השבועי שלך 🔥
          </h3>
          <p className={`text-xs ${theme.mutedTextClass}`}>
            {isGirl
              ? 'התמידי במשימה קצרה מדי יום! בימי שישי, שבת וחגים הרצף שלך מוגן אוטומטית.'
              : 'התמד במשימה קצרה מדי יום! בימי שישי, שבת וחגים הרצף שלך מוגן אוטומטית.'}
          </p>
        </div>

        {/* 7-Day Streak Row */}
        <div className="grid grid-cols-7 gap-1.5 py-2">
          {WEEK_DAYS_HE.map((d) => {
            const isToday = d.dayIndex === todayDayIdx;
            const isPastOrToday = d.dayIndex <= todayDayIdx;

            return (
              <div
                key={d.label}
                className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 ${
                  isToday
                    ? 'border-2 border-orange-400 bg-orange-500/15'
                    : d.isShabbatSafe
                    ? 'border-emerald-400/40 bg-emerald-500/10'
                    : 'border-current/10 bg-black/5 dark:bg-white/5'
                }`}
              >
                <span className="text-xs font-extrabold">{d.label}</span>
                <span className="text-base">
                  {d.isShabbatSafe ? '🛡️' : isPastOrToday ? '🔥' : '⚪'}
                </span>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onOpenShop}
          className={`w-full py-3 rounded-2xl text-xs md:text-sm font-extrabold flex items-center justify-center gap-2 ${theme.primaryBtnClass}`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>פתיחת חנות הפרסים ואלבום המדבקות 🛍️</span>
        </button>
      </div>
    </section>
  );
};
