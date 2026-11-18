import React, { useState } from 'react';
import { LearnerProfile, PlacementResult, SUPPORTED_GRADES } from '../types/learner';
import { ThemeDefinition, TIER_CONFIG } from '../themes/themeRegistry';
import { NON_READER_RESULT_HE, PLACEMENT_REWARD_DIAMONDS, PLACEMENT_REWARD_XP } from '../data/placementTest';
import { isolateEnglishRuns } from '../utils/bidi';
import { useAutoSpeakHebrew } from '../hooks/useAutoSpeakHebrew';
import { Sparkles, Check, Send } from 'lucide-react';
import { auth } from '../services/firebase';
import { trackEvent } from '../services/analytics';
import { buildPlacementSummaryHe } from '../data/showOff';
import { ParentShareBlock } from './parent/ParentShareBlock';
import { Button } from './ui/Button';
import { VibeAmount } from './ui/VibeAmount';

interface PlacementResultCardProps {
  result: PlacementResult;
  profile: LearnerProfile;
  theme: ThemeDefinition;
  isFirstTest: boolean;
  /** Offer "show my level to a parent" (a test taken from the home screen, not during onboarding) */
  canShareWithParent?: boolean;
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
  canShareWithParent = false,
  onFinish,
}) => {
  const user = auth?.currentUser ?? null;
  const uid = canShareWithParent && user && !user.isAnonymous ? user.uid : null;
  const [isSharing, setIsSharing] = useState(false);
  const isGirl = profile.gender === 'girl';
  const estimated = gradeMeta(result.estimatedGradeId);
  const recommendedGrade = gradeMeta(result.recommendedGradeId);
  const currentGrade = gradeMeta(profile.gradeId);
  const tier = TIER_CONFIG[result.recommendedTier];
  const isGradeChange = result.recommendedGradeId !== profile.gradeId;
  const isSameAsCurrent = !isGradeChange && result.recommendedTier === profile.preferredTier;
  useAutoSpeakHebrew(NON_READER_RESULT_HE, Boolean(result.isNonReader), 0, true);

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
          🎁 קיבלת <VibeAmount amount={PLACEMENT_REWARD_XP} hasPlus /> ו-
          {PLACEMENT_REWARD_DIAMONDS} 💎 על השלמת המבחן!
        </div>
      )}

      {uid && (
        <ParentShareArea
          uid={uid}
          profile={profile}
          theme={theme}
          isOpen={isSharing}
          onOpen={() => setIsSharing(true)}
          summaryHe={buildPlacementSummaryHe({
            name: profile.name,
            gender: profile.gender,
            levelHe: result.isNonReader ? 'מתחילים מהאותיות' : estimated.labelHe,
            practiceGradeHe: recommendedGrade.labelHe,
            tierHe: tier.labelHe,
          })}
        />
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

interface ParentShareAreaProps {
  uid: string;
  profile: LearnerProfile;
  theme: ThemeDefinition;
  isOpen: boolean;
  onOpen: () => void;
  summaryHe: string;
}

/** A small "show a parent" button that opens the message with the parent link. */
const ParentShareArea: React.FC<ParentShareAreaProps> = ({ uid, profile, theme, isOpen, onOpen, summaryHe }) => {
  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={`w-full min-h-11 px-4 py-2.5 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-1.5 border border-current/20`}
      >
        <Send className="w-4 h-4" aria-hidden="true" />
        להראות להורים את הרמה שלי
      </button>
    );
  }
  return (
    <section aria-label="לשתף את ההורים" className={`p-4 rounded-2xl ${theme.cardBgClass} space-y-2`}>
      <p className="text-sm font-bold">שולחים להורים את התוצאה, עם קישור לאזור ההורים:</p>
      <ParentShareBlock
        uid={uid}
        childName={profile.name}
        childAvatar={profile.equippedAvatarEmoji || theme.companion.avatarEmoji}
        summaryHe={summaryHe}
        theme={theme}
        onShared={() => trackEvent('placement_shared')}
      />
    </section>
  );
};
