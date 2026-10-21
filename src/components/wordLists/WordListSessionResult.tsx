import React from 'react';
import {
  WORD_LIST_DAILY_REWARD_LIMIT,
  WORD_LIST_HIGH_SCORE,
  WordListAnswer,
  getWordListReward,
  scoreWordListAnswers,
} from '../../data/customWordLists';
import { toLocalDateStr } from '../../data/examPrep';
import { CustomWordList, LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { Button } from '../ui/Button';
import { VibeAmount } from '../ui/VibeAmount';

interface WordListSessionResultProps {
  list: CustomWordList;
  profile: LearnerProfile;
  answers: readonly WordListAnswer[];
  theme: ThemeDefinition;
  onSave: () => void;
  onSaveAndRetry: () => void;
}

/** Score and rewards at the end of a word-list session; saving applies them. */
export const WordListSessionResult: React.FC<WordListSessionResultProps> = ({
  list,
  profile,
  answers,
  theme,
  onSave,
  onSaveAndRetry,
}) => {
  const isGirl = profile.gender === 'girl';
  const score = scoreWordListAnswers(answers);
  const reward = getWordListReward(profile, list.id, score.scorePercent, toLocalDateStr(new Date()));
  const isGreat = score.scorePercent >= WORD_LIST_HIGH_SCORE;
  const skippedCount = answers.filter((a) => a.isSkipped).length;

  const headline = isGreat
    ? isGirl
      ? `${profile.name}, את שולטת ברשימה! 🎉`
      : `${profile.name}, אתה שולט ברשימה! 🎉`
    : isGirl
    ? 'עוד סיבוב אחד ואת שם 💪'
    : 'עוד סיבוב אחד ואתה שם 💪';

  return (
    <div className="p-5 sm:p-7 space-y-5">
      <div className="text-center space-y-2">
        <div className="text-5xl" aria-hidden="true">
          {isGreat ? '🏆' : '📋'}
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold">{headline}</h2>
        <p className="text-4xl font-extrabold" dir="ltr" lang="en">
          {score.scorePercent}%
        </p>
        <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
          {score.correctCount} נכונות בניסיון הראשון מתוך {score.scoredCount}
          {skippedCount > 0 && ` · ${skippedCount} תרגילי דיבור דולגו`}
        </p>
      </div>

      <div className="px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold text-center">
        🎁 <VibeAmount amount={reward.xp} hasPlus />
        {reward.diamonds > 0 && (
          <>
            {' · '}
            <span dir="ltr" lang="en">+{reward.diamonds} 💎</span>
          </>
        )}
        {!reward.isFullReward &&
          ` · הפרס המלא ניתן פעם ביום לכל רשימה (עד ${WORD_LIST_DAILY_REWARD_LIMIT} רשימות ביום)`}
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <Button theme={theme} size="lg" className="flex-1" onClick={onSave}>
          שמירה וחזרה לדשבורד
        </Button>
        <Button theme={theme} variant="secondary" size="lg" onClick={onSaveAndRetry}>
          {isGirl ? 'תרגלי שוב 🔄' : 'תרגל שוב 🔄'}
        </Button>
      </div>
    </div>
  );
};
