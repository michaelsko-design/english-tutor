import React, { useState } from 'react';
import { Flame, Star, Target, UserMinus } from 'lucide-react';
import { FRIEND_REACTIONS, FriendLink, PublicProfile } from '../../data/friends';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface FriendCardProps {
  friend: FriendLink;
  /** undefined while loading, null when the friend turned the hub off */
  publicProfile: PublicProfile | null | undefined;
  gender: LearnerGender;
  theme: ThemeDefinition;
  isBusy: boolean;
  onReact: (emoji: string) => void;
  onRemove: () => void;
  /** Extra actions under the stats (Phase 2: the daily contest) */
  children?: React.ReactNode;
}

/** Feature 19: one friend's avatar, name and progress, with preset reactions and remove. */
export const FriendCard: React.FC<FriendCardProps> = ({
  friend,
  publicProfile,
  gender,
  theme,
  isBusy,
  onReact,
  onRemove,
  children,
}) => {
  const isGirl = gender === 'girl';
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false);
  const name = publicProfile?.displayName || friend.fallbackName;
  const avatar = publicProfile?.avatarEmoji || friend.fallbackAvatar;

  const stats = publicProfile
    ? [
        { icon: <Flame className="w-3.5 h-3.5 text-orange-500" />, value: publicProfile.streakDays, labelHe: 'ימי רצף' },
        { icon: <Star className="w-3.5 h-3.5 text-amber-500" />, value: publicProfile.stars, labelHe: 'כוכבים' },
        { icon: <Target className="w-3.5 h-3.5 text-emerald-500" />, value: publicProfile.missionsCompleted, labelHe: 'משימות הושלמו' },
      ]
    : [];

  return (
    <li className={`rounded-2xl p-3 sm:p-4 space-y-3 ${theme.cardBgClass}`}>
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${theme.inputBgClass}`} aria-hidden="true">
            {avatar}
          </div>
          {friend.theirReaction && (
            <span
              className="absolute -bottom-1.5 -left-1.5 text-lg drop-shadow"
              title={`עידוד מ${name}`}
              aria-label={`עידוד מ${name}: ${friend.theirReaction.emoji}`}
              role="img"
            >
              {friend.theirReaction.emoji}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-sm sm:text-base truncate" dir="auto">{name}</p>
          {publicProfile ? (
            <p className={`text-xs font-bold ${theme.accentTextClass}`}>Lv.{publicProfile.level}</p>
          ) : (
            <p className={`text-xs ${theme.mutedTextClass}`}>
              {publicProfile === null ? 'ההתקדמות לא זמינה כרגע' : 'טוען...'}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsConfirmingRemove(true)}
          disabled={isBusy}
          className={`p-2 rounded-xl ${theme.secondaryBtnClass} disabled:opacity-40`}
          aria-label={`הסרת ${name} מהחברים`}
          title="הסרה מהחברים"
        >
          <UserMinus className="w-4 h-4" />
        </button>
      </div>

      {stats.length > 0 && (
        <dl className="grid grid-cols-3 gap-2 text-center">
          {stats.map((s) => (
            <div key={s.labelHe} className={`rounded-xl py-1.5 ${theme.inputBgClass}`}>
              <dd className="flex items-center justify-center gap-1 font-black text-sm">
                {s.icon}
                {s.value}
              </dd>
              <dt className={`text-[10px] font-bold ${theme.mutedTextClass}`}>{s.labelHe}</dt>
            </div>
          ))}
        </dl>
      )}

      <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label={`עידוד ל${name}`}>
        <span className={`text-[11px] font-bold ${theme.mutedTextClass}`}>{isGirl ? 'שלחי עידוד:' : 'שלח עידוד:'}</span>
        {FRIEND_REACTIONS.map((r) => {
          const isSent = friend.myReaction?.emoji === r.emoji;
          return (
            <button
              key={r.emoji}
              type="button"
              onClick={() => onReact(r.emoji)}
              disabled={isBusy}
              aria-label={r.labelHe}
              aria-pressed={isSent}
              className={`w-8 h-8 rounded-xl text-base transition-transform hover:scale-110 active:scale-95 disabled:opacity-40 ${
                isSent ? 'ring-2 ring-fuchsia-500 bg-fuchsia-500/15' : theme.inputBgClass
              }`}
            >
              {r.emoji}
            </button>
          );
        })}
      </div>

      {children}

      {isConfirmingRemove && (
        <div className="rounded-xl p-3 bg-rose-500/10 border border-rose-500/30 space-y-2" role="alert">
          <p className="text-xs font-bold">
            להסיר את {name} מהחברים? אפשר להוסיף שוב בכל זמן.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setIsConfirmingRemove(false);
                onRemove();
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-rose-500 text-white"
            >
              כן, להסיר
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingRemove(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold ${theme.secondaryBtnClass}`}
            >
              ביטול
            </button>
          </div>
        </div>
      )}
    </li>
  );
};
