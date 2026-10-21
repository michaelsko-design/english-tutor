import React, { useEffect, useRef } from 'react';
import { ModalPortal } from '../ModalPortal';
import { useDialog } from '../../hooks/useDialog';
import { Trophy, Zap } from 'lucide-react';
import { MissionNode } from '../../data/curriculum';
import { RoomRewardItem } from '../../data/roomRewards';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { useAnimationClock } from '../../hooks/useAnimationClock';
import { celebrate } from '../../utils/celebrate';
import { getVictoryDurationMs, getVictoryFrame, VictoryFrame } from '../../utils/rewardFeedback';
import { playSfx } from '../../utils/sfx';
import { FluentIcon } from '../hud/FluentIcon';
import { LevelBadge } from '../hud/LevelBadge';
import { Companion } from '../companion/Companion';
import { Button } from '../ui/Button';

interface MissionVictoryProps {
  mission: MissionNode;
  tierLabelEn: string;
  starsEarned: 1 | 2 | 3;
  xpEarned: number;
  maxCombo: number;
  diamondsEarned: number;
  wordsLearned: number;
  /** The learner's XP and level before this mission, for the XP bar */
  startXp: number;
  startLevel: number;
  /** Shown only for a 3-star result */
  roomReward: RoomRewardItem | null;
  isGirl: boolean;
  learnerName: string;
  currencyNameHe: string;
  theme: ThemeDefinition;
  onCollect: () => void;
}

const STAR_SLOTS = [0, 1, 2];
export const VICTORY_COMPANION_SIZE = 120;
const LEVEL_BADGE_SIZE = 64;

/** Sounds and confetti for what changed between two frames of the victory sequence. */
function playFrameEffects(prev: VictoryFrame, next: VictoryFrame, starsEarned: number): void {
  for (let slot = prev.landedStarCount; slot < next.landedStarCount; slot++) {
    playSfx(slot < starsEarned ? 'star' : 'star-miss');
  }
  if (prev.landedStarCount < STAR_SLOTS.length && next.landedStarCount === STAR_SLOTS.length) {
    celebrate(starsEarned === 3 ? 'big' : 'medium', { isSilent: true });
  }
  if (!prev.hasLeveledUp && next.hasLeveledUp) playSfx('level-up');
  if (prev.diamondsShown === 0 && next.diamondsShown > 0) playSfx('coins');
  if (!prev.isItemRevealed && next.isItemRevealed) playSfx('celebrate');
}

/**
 * Feature 24: the staged mission victory. Over about four seconds the stars land one by one,
 * the XP bar fills toward the next level (with a level-up badge), the diamonds and words count
 * up, and the room item is revealed last. A tap skips to the end; reduced motion starts there.
 */
export const MissionVictory: React.FC<MissionVictoryProps> = ({
  mission,
  tierLabelEn,
  starsEarned,
  xpEarned,
  maxCombo,
  diamondsEarned,
  wordsLearned,
  startXp,
  startLevel,
  roomReward,
  isGirl,
  learnerName,
  currencyNameHe,
  theme,
  onCollect,
}) => {
  const hasRoomItem = roomReward !== null;
  const { elapsedMs, skip } = useAnimationClock(getVictoryDurationMs(hasRoomItem));
  const frame = getVictoryFrame(
    { starsEarned, startXp, startLevel, xpEarned, diamondsEarned, wordsLearned, hasRoomItem },
    elapsedMs
  );

  const prevFrameRef = useRef(frame);
  const isSkippedRef = useRef(false);
  useEffect(() => {
    // Reduced motion starts at the final state: one cheer instead of the staged sounds.
    if (prevFrameRef.current.isDone) playSfx('celebrate');
  }, []);
  useEffect(() => {
    const prev = prevFrameRef.current;
    prevFrameRef.current = frame;
    if (!isSkippedRef.current) playFrameEffects(prev, frame, starsEarned);
  });

  const handleSkip = () => {
    if (frame.isDone) return;
    isSkippedRef.current = true;
    skip();
  };

  // Focus moves to the result (read by screen readers); there's no Escape: the rewards are collected
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(dialogRef);

  const handleCollect = (event: React.MouseEvent) => {
    event.stopPropagation();
    onCollect();
  };

  return (
    <ModalPortal>
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleSkip}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={`outline-none w-full max-w-lg rounded-3xl p-6 md:p-8 ${theme.cardBgClass} ${theme.pageBgClass} text-center space-y-5 shadow-2xl border-2 border-amber-400`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mission-victory-title"
      >
        {/* The companion cheers (Feature 25), holding up the trophy */}
        <div className="relative w-fit mx-auto">
          <Companion theme={theme} pose="cheer" size={VICTORY_COMPANION_SIZE} />
          <FluentIcon name="trophy" className="absolute -bottom-1 -right-6 w-12 h-12 drop-shadow-md" />
        </div>

        <div className="space-y-1.5">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-extrabold">
            MISSION COMPLETE · משימה הושלמה!
          </span>
          <h2 id="mission-victory-title" className="text-2xl md:text-3xl font-extrabold">
            {isGirl ? `כל הכבוד, ${learnerName}! את אלופה! 🎉` : `כל הכבוד, ${learnerName}! אתה אלוף! 🎉`}
          </h2>
          <p className={`text-sm ${theme.mutedTextClass}`}>
            סיימת את משימה {mission.unitNumber}.{mission.missionNumber}: <b>{mission.titleHe}</b> ברמת {tierLabelEn}
          </p>
        </div>

        <p className="sr-only">
          {`${starsEarned} מתוך 3 כוכבים, ${xpEarned} נקודות XP, ${diamondsEarned} ${currencyNameHe}, ${wordsLearned} מילים`}
          {frame.hasLeveledUp ? `, עלייה לרמה ${frame.level}` : ''}
        </p>

        {/* Stars land one by one; a missed star lands grey */}
        <div className="flex items-center justify-center gap-3 py-1" aria-hidden="true">
          {STAR_SLOTS.map((slot) => {
            const hasLanded = slot < frame.landedStarCount;
            const isEarned = slot < starsEarned;
            return (
              <div
                key={slot}
                className={`p-3 rounded-2xl border ${
                  !hasLanded
                    ? 'border-dashed border-current/20 opacity-30'
                    : isEarned
                    ? 'bg-amber-400/20 border-amber-400 animate-star-land'
                    : 'bg-black/10 border-current/10 opacity-50 animate-star-land'
                } ${slot === 1 ? 'relative -top-2' : ''}`}
              >
                {hasLanded ? (
                  <FluentIcon name="star" className="w-10 h-10" isGreyed={!isEarned} />
                ) : (
                  <span className="block w-10 h-10" />
                )}
              </div>
            );
          })}
        </div>

        {/* XP bar toward the next level; a level-up pins the level badge to its corner */}
        <div className="relative p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2" aria-hidden="true">
          {frame.hasLeveledUp && (
            <div className="absolute -top-10 -right-4 animate-reward-pop">
              <LevelBadge level={frame.level} size={LEVEL_BADGE_SIZE} />
            </div>
          )}
          <div className="flex items-center justify-between text-xs font-extrabold" dir="ltr" lang="en">
            <span>Lv.{frame.level}</span>
            {frame.hasLeveledUp && (
              <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-sm animate-reward-pop" dir="rtl">
                רמה חדשה! <bdi dir="ltr" lang="en">Lv.{frame.level}</bdi>
              </span>
            )}
            <span className="opacity-70">Lv.{frame.level + 1}</span>
          </div>
          <div className="h-3.5 rounded-full bg-black/15 dark:bg-white/15 overflow-hidden" dir="ltr" lang="en">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400"
              style={{ width: `${Math.round(frame.levelRatio * 100)}%` }}
            />
          </div>
        </div>

        {/* Earned rewards count up */}
        <div className="grid grid-cols-3 gap-3" aria-hidden="true">
          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10">
            <Zap className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
            <div className="text-base sm:text-lg font-extrabold tabular-nums whitespace-nowrap" dir="ltr" lang="en">
              +{frame.xpShown} XP
            </div>
            <div className="text-xs opacity-75">
              כולל בונוס {maxCombo}x רצף
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10">
            <FluentIcon name="gem" className="w-6 h-6 mx-auto mb-1" />
            <div className="text-base sm:text-lg font-extrabold tabular-nums whitespace-nowrap" dir="ltr" lang="en">
              +{frame.diamondsShown}
            </div>
            <div className="text-xs opacity-75">
              {currencyNameHe}
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10">
            <Trophy className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <div className="text-base sm:text-lg font-extrabold tabular-nums whitespace-nowrap">
              <bdi dir="ltr" lang="en">+{frame.wordsShown}</bdi> מילים
            </div>
            <div className="text-xs opacity-75">
              נוספו לאוצר המילים
            </div>
          </div>
        </div>

        {/* The room item is revealed last; its space is kept so nothing jumps */}
        {roomReward && (
          <div
            className={`p-3.5 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-400/50 flex items-center justify-center gap-3 ${
              frame.isItemRevealed ? 'animate-card-flip' : 'invisible'
            }`}
            aria-hidden={!frame.isItemRevealed}
          >
            <span className="text-3xl leading-none" aria-hidden="true">
              {roomReward.emoji}
            </span>
            <div className="text-right">
              <div className="text-sm font-extrabold">
                {roomReward.kind === 'wear' ? '🎁 בגד חדש לארון בחדר האנגלי' : '🎁 פריט חדש לחדר האנגלי'}:{' '}
                {roomReward.nameHe}
              </div>
              <div className="text-xs opacity-80">
                {isGirl ? 'אמרי או אייתי' : 'אמור או איית'} &ldquo;<span dir="ltr" lang="en">{roomReward.nameEn}</span>&rdquo; כדי{' '}
                {roomReward.kind === 'wear' ? 'ללבוש אותו' : 'להניח אותו בחדר'}
              </div>
            </div>
          </div>
        )}

        <Button theme={theme} size="lg" className="w-full" onClick={handleCollect}>
          <span>איסוף פרסים וחזרה לדשבורד 🚀</span>
        </Button>

        <p className={`text-xs ${theme.mutedTextClass} ${frame.isDone ? 'invisible' : ''}`} aria-hidden="true">
          הקשה על המסך מדלגת לסוף ⏩
        </p>
      </div>
    </div>
    </ModalPortal>
  );
};
