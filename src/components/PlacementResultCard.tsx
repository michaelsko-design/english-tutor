import React from 'react';
import { LearnerProfile, PlacementResult, SUPPORTED_GRADES } from '../types/learner';
import { ThemeDefinition, TIER_CONFIG } from '../themes/themeRegistry';
import { NON_READER_RESULT_HE, PLACEMENT_REWARD_DIAMONDS, PLACEMENT_REWARD_XP } from '../data/placementTest';
import { isolateEnglishRuns } from '../utils/bidi';
import { useAutoSpeakHebrew } from '../hooks/useAutoSpeakHebrew';
import { Sparkles, Check } from 'lucide-react';
import { Button } from './ui/Button';

interface PlacementResultCardProps {
  result: PlacementResult;
  profile: LearnerProfile;
  theme: ThemeDefinition;
  isFirstTest: boolean;
  onFinish: (applyRecommendation: boolean) => void;
}

function gradeMeta(gradeId: PlacementResult['estimatedGradeId']) {
  return SUPPORTED_GRADES.find((g) => g.id === gradeId) || SUPPORTED_GRADES[0];
}

export const PlacementResultCard: React.FC<PlacementResultCardProps> = ({
  result,
  profile,
  theme,
  isFirstTest,
  onFinish,
}) => {
  const isGirl = profile.gender === 'girl';
  const estimated = gradeMeta(result.estimatedGradeId);
  const recommendedGrade = gradeMeta(result.recommendedGradeId);
  const currentGrade = gradeMeta(profile.gradeId);
  const tier = TIER_CONFIG[result.recommendedTier];
  const isGradeChange = result.recommendedGradeId !== profile.gradeId;
  const isSameAsCurrent = !isGradeChange && result.recommendedTier === profile.preferredTier;
  useAutoSpeakHebrew(NON_READER_RESULT_HE, Boolean(result.isNonReader), 0);

  return (
    <div className="p-5 sm:p-7 space-y-5 text-center">
      <div className="space-y-2">
        <div
          className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-3xl ${theme.primaryBtnClass}`}
        >
          🎯
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold">
          סיימת את מבחן הרמה, {profile.name}! 🎉
        </h2>
        {result.isNonReader ? (
          <p className="text-lg font-extrabold">{isolateEnglishRuns(NON_READER_RESULT_HE)}</p>
        ) : (
          <p className={`text-sm font-bold ${theme.mutedTextClass}`}>
            ענית נכון על{' '}
            <span dir="ltr" lang="en">
              {result.correctCount}/{result.totalQuestions}
            </span>{' '}
            שאלות
          </p>
        )}
      </div>

      <div className={`p-4 rounded-2xl ${theme.cardBgClass} space-y-1`}>
        <div className={`text-xs font-bold ${theme.mutedTextClass}`}>הרמה שלך באנגלית</div>
        <div className="text-2xl font-extrabold">{estimated.labelHe}</div>
        <div className={`text-xs font-bold ${theme.accentTextClass}`} dir="ltr" lang="en">
          {estimated.ministryBand}
        </div>
      </div>

      <div className={`p-4 rounded-2xl ${theme.cardBgClass} space-y-3 text-right`}>
        <div className="font-extrabold text-sm flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>ההמלצה שלנו</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 space-y-0.5">
            <div className={`text-xs font-bold ${theme.mutedTextClass}`}>שכבת לימוד</div>
            <div className="font-extrabold">{recommendedGrade.labelHe}</div>
            {isGradeChange && (
              <div className={`text-xs ${theme.mutedTextClass}`}>
                (במקום {currentGrade.labelHe})
              </div>
            )}
          </div>
          <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 space-y-0.5">
            <div className={`text-xs font-bold ${theme.mutedTextClass}`}>רמת קושי</div>
            <div className="font-extrabold">
              {tier.badgeEmoji} {tier.labelHe}
            </div>
            <div className={`text-xs ${theme.mutedTextClass}`} dir="ltr" lang="en">
              {tier.labelEn}
            </div>
          </div>
        </div>
        <p className={`text-xs ${theme.mutedTextClass}`}>{tier.descriptionHe}</p>
      </div>

      {isFirstTest && (
        <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-sm font-extrabold">
          🎁 קיבלת <span dir="ltr" lang="en">+{PLACEMENT_REWARD_XP} XP</span> ו-
          {PLACEMENT_REWARD_DIAMONDS} 💎 על השלמת המבחן!
        </div>
      )}

      {isSameAsCurrent ? (
        <Button theme={theme} size="lg" className="w-full" onClick={() => onFinish(true)}>
          <Check className="w-5 h-5" />
          <span>
            {isGirl
              ? 'ההגדרות שלך כבר מתאימות. בואי נמשיך!'
              : 'ההגדרות שלך כבר מתאימות. בוא נמשיך!'}
          </span>
        </Button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2.5">
          <Button theme={theme} size="lg" className="flex-1" onClick={() => onFinish(true)}>
            <Check className="w-5 h-5" />
            <span>{isGirl ? 'עדכני לפי ההמלצה' : 'עדכן לפי ההמלצה'}</span>
          </Button>
          <Button theme={theme} variant="secondary" size="lg" onClick={() => onFinish(false)}>
            {isGirl ? 'השאירי את ההגדרות שלי' : 'השאר את ההגדרות שלי'}
          </Button>
        </div>
      )}
    </div>
  );
};
