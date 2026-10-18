import React from 'react';
import { Swords } from 'lucide-react';
import {
  ContestDoc,
  getContestState,
  getScorePercent,
} from '../../data/contests';
import { ContestOutcome, LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface ContestPanelProps {
  /** Today's contest with this friend, if there is one */
  contest: ContestDoc | undefined;
  myUid: string;
  friendName: string;
  record: { wins: number; losses: number; ties: number };
  /** Diamonds the decided contest gave, once it was recorded */
  diamondsEarned?: number;
  gender: LearnerGender;
  theme: ThemeDefinition;
  now: Date;
  isBusy: boolean;
  onInvite: () => void;
  onRespond: (isAccepted: boolean) => void;
  onPlay: () => void;
}

// The friend's gender is unknown, so these lines avoid gendered verbs about the friend
function getOutcomeTextHe(state: ContestOutcome, friendName: string): string {
  switch (state) {
    case 'won':
      return 'ניצחון! 🏆';
    case 'lost':
      return `הפעם הניצחון הלך ל${friendName}. בפעם הבאה! 💪`;
    case 'tie':
      return 'תיקו! 🤝';
    case 'friend-missed':
      return `האתגר נגמר בלי תוצאה מ${friendName}.`;
  }
}

/** Feature 19: today's daily contest with one friend, inside the friend's card. */
export const ContestPanel: React.FC<ContestPanelProps> = ({
  contest,
  myUid,
  friendName,
  record,
  diamondsEarned,
  gender,
  theme,
  now,
  isBusy,
  onInvite,
  onRespond,
  onPlay,
}) => {
  const isGirl = gender === 'girl';
  const hasRecord = record.wins + record.losses + record.ties > 0;
  const buttonClass = `px-3.5 py-2 rounded-xl font-extrabold text-xs flex items-center gap-1.5 disabled:opacity-40`;
  const state = contest ? getContestState(contest, myUid, now) : null;
  const mine = contest?.results?.[myUid];
  const theirs = contest?.results?.[contest.uids.find((uid) => uid !== myUid) || ''];

  const body = (() => {
    if (!contest || !state) {
      return (
        <button type="button" onClick={onInvite} disabled={isBusy} className={`${buttonClass} ${theme.primaryBtnClass}`}>
          <Swords className="w-4 h-4" />
          {isGirl ? 'הזמיני לאתגר יומי' : 'הזמן לאתגר יומי'}
        </button>
      );
    }
    switch (state) {
      case 'invited-me':
        return (
          <div className="space-y-2">
            <p className="text-xs font-extrabold">⚔️ קיבלת הזמנה לאתגר מ{friendName}! עד חצות.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => onRespond(true)} disabled={isBusy} className={`${buttonClass} ${theme.primaryBtnClass}`}>
                <Swords className="w-4 h-4" />
                {isGirl ? 'קבלי ושחקי' : 'קבל ושחק'}
              </button>
              <button type="button" onClick={() => onRespond(false)} disabled={isBusy} className={`${buttonClass} ${theme.secondaryBtnClass}`}>
                לא היום
              </button>
            </div>
          </div>
        );
      case 'ready':
        return (
          <div className="space-y-2">
            {contest.createdBy === myUid && (
              <p className={`text-xs ${theme.mutedTextClass}`}>
                {contest.status === 'accepted' ? 'האתגר אושר!' : `ההזמנה נשלחה ל${friendName}.`} אפשר לשחק עד חצות.
              </p>
            )}
            <button type="button" onClick={onPlay} disabled={isBusy} className={`${buttonClass} ${theme.primaryBtnClass}`}>
              ▶ {isGirl ? 'שחקי עכשיו' : 'שחק עכשיו'}
            </button>
          </div>
        );
      case 'waiting':
        return (
          <p className="text-xs font-bold">
            ✅ התוצאה שלך: {mine?.correctCount}/{mine?.totalCount}. מחכים ל{friendName} עד חצות.
          </p>
        );
      case 'missed':
        return <p className={`text-xs ${theme.mutedTextClass}`}>האתגר של היום נגמר לפני ששיחקת.</p>;
      case 'declined':
        return <p className={`text-xs ${theme.mutedTextClass}`}>האתגר של היום בוטל. אפשר לנסות שוב מחר.</p>;
      default:
        return (
          <div className="space-y-0.5">
            <p className="text-xs font-extrabold">{getOutcomeTextHe(state, friendName)}</p>
            <p className={`text-xs ${theme.mutedTextClass}`}>
              {mine && `${isGirl ? 'את' : 'אתה'}: ${getScorePercent(mine)}%`}
              {theirs && ` · ${friendName}: ${getScorePercent(theirs)}%`}
              {diamondsEarned ? ` · +${diamondsEarned} 💎` : ''}
            </p>
          </div>
        );
    }
  })();

  return (
    <div className={`rounded-xl p-2.5 space-y-2 ${theme.inputBgClass}`} aria-label={`אתגר יומי מול ${friendName}`} role="group" aria-live="polite">
      {body}
      {hasRecord && (
        <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
          המאזן מול {friendName}: 🏆 {record.wins} · 🤝 {record.ties} · {record.losses} הפסדים
        </p>
      )}
    </div>
  );
};
