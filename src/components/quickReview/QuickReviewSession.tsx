import React, { useMemo } from 'react';
import type { WordListAnswer } from '../../data/customWordLists';
import { applyQuickReviewResult, buildQuickReviewList, buildQuickReviewSteps, getQuickReviewReward } from '../../data/quickReview';
import type { LearnerProfile, MissedWord } from '../../types/learner';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { toLocalDateStr } from '../../utils/dates';
import { WordListSessionRunner, type WordListSessionNext } from '../wordLists/WordListSessionRunner';

/** The note shown when the review was already done today and pays only the repeat XP */
export const QUICK_REVIEW_REPEAT_NOTE_HE = 'הפרס המלא של החזרה ניתן פעם ביום';

/** The result headline for a high score: the review is about missed words, not a school list */
export function getQuickReviewGreatHeadline(name: string): string {
  return `${name}, המילים האלה כבר יושבות טוב יותר! 🎉`;
}

interface QuickReviewSessionProps {
  words: MissedWord[];
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  /** `App.handleUpdateProfile`, which also records the activity log and the diamond ledger */
  onUpdateProfile: (updated: LearnerProfile) => void;
  onRetry: () => void;
  onClose: () => void;
}

/** The 1-minute review of missed words, on the word-list engine without its voice round. */
export const QuickReviewSession: React.FC<QuickReviewSessionProps> = ({
  words,
  profile,
  theme,
  onSpeakEnglish,
  onUpdateProfile,
  onRetry,
  onClose,
}) => {
  const list = useMemo(() => buildQuickReviewList(words), [words]);

  const handleFinish = (answers: WordListAnswer[], next: WordListSessionNext) => {
    onUpdateProfile(applyQuickReviewResult(profile, answers, new Date()).profile);
    if (next === 'retry') onRetry();
    else onClose();
  };

  return (
    <WordListSessionRunner
      list={list}
      profile={profile}
      theme={theme}
      getReward={() => getQuickReviewReward(profile, toLocalDateStr(new Date()))}
      repeatRewardNoteHe={QUICK_REVIEW_REPEAT_NOTE_HE}
      greatHeadlineHe={getQuickReviewGreatHeadline(profile.name)}
      buildSteps={buildQuickReviewSteps}
      onSpeakEnglish={onSpeakEnglish}
      onFinish={handleFinish}
      onClose={onClose}
    />
  );
};
