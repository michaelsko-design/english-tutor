import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Clock, Play, Sparkles, Volume2, X } from 'lucide-react';
import { MapStop } from '../../data/worldMap';
import { LearnerGender, ProficiencyTier } from '../../types/learner';
import { ThemeDefinition, TIER_CONFIG } from '../../themes/themeRegistry';
import { inflectHebrew } from '../../utils/hebrewGender';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { TierChoice } from '../mission/TierChoice';
import { StarRow } from './mapPieces';
import { WorldMapStyle } from './worldMapStyles';

interface MissionSheetProps {
  stop: MapStop;
  /** The mission before this one, for the "finish it first" message on a locked stop */
  previousTitleHe: string | null;
  tier: ProficiencyTier;
  onSelectTier?: (tier: ProficiencyTier) => void;
  theme: ThemeDefinition;
  style: WorldMapStyle;
  gender: LearnerGender;
  onStart: () => void;
  onClose: () => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

function getLockedMessage(stop: MapStop, previousTitleHe: string | null, gender: LearnerGender): string {
  const gate = stop.state.bossGate;
  if (gate && !gate.isMet) {
    return `🔒 עוד ${gate.missing} ⭐ במשימות היחידה כדי לפתוח את משימת הבוס (${gate.earned}/${gate.required}). אפשר לשחק שוב במשימה ולאסוף עוד כוכבים!`;
  }
  const finish = gender === 'girl' ? 'סיימי' : 'סיים';
  return previousTitleHe
    ? `🔒 ${finish} קודם את המשימה „${inflectHebrew(previousTitleHe, gender)}” כדי לפתוח את המשימה הזו.`
    : `🔒 ${finish} קודם את המשימה הקודמת כדי לפתוח את המשימה הזו.`;
}

/**
 * The full mission card of a world map stop (Feature 26), as a bottom sheet: the whole title,
 * story, rewards, words to hear, the tier choice and Start. Rendered into <body> so no blurred
 * card around the map can trap its fixed position.
 */
export const MissionSheet: React.FC<MissionSheetProps> = ({
  stop,
  previousTitleHe,
  tier,
  onSelectTier,
  theme,
  style,
  gender,
  onStart,
  onClose,
  onSpeakEnglish,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const isReducedMotion = usePrefersReducedMotion();
  const { mission, status, stars } = stop.state;
  const isGirl = gender === 'girl';
  const tierMeta = TIER_CONFIG[tier];
  const tierObjective = mission.tierObjectives[tier];
  const xp = Math.round(mission.baseXp * tierMeta.xpMultiplier);
  const diamonds = mission.baseDiamonds + tierMeta.diamondBonus;
  const startLabel =
    status === 'done' ? (isGirl ? 'שחקי שוב 🔁' : 'שחק שוב 🔁') : isGirl ? 'התחילי את המשימה 🚀' : 'התחל את המשימה 🚀';

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center" role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="mission-sheet-title"
        dir="rtl"
        className={`relative w-full max-w-lg max-h-[88vh] overflow-y-auto overscroll-contain rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.35)] ${style.sheetBgClass} ${style.sheetEdgeClass} ${
          isReducedMotion ? '' : 'animate-sheet-up'
        }`}
      >
        <div className="sticky top-0 z-10 flex justify-center pt-2 pb-1 bg-inherit" aria-hidden="true">
          <span className="w-12 h-1.5 rounded-full bg-current opacity-20" />
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className={`absolute top-3 left-3 z-20 p-2 rounded-xl ${theme.secondaryBtnClass}`}
          aria-label="סגירה"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-4 sm:px-6 pb-4 space-y-4">
          <header className="space-y-1.5 pe-1 ps-10">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>
              {mission.isBoss ? '👑 משימת בוס · ' : ''}
              יחידה {mission.unitNumber} · משימה {mission.missionNumber}
            </span>
            <h3 id="mission-sheet-title" className="text-xl font-extrabold leading-snug">
              <span className="me-1.5" aria-hidden="true">
                {mission.icon}
              </span>
              {inflectHebrew(mission.titleHe, gender)}
            </h3>
            <p className="text-sm font-bold opacity-80" dir="ltr">
              {mission.titleEn}
            </p>
          </header>

          <p className="text-sm font-semibold leading-relaxed">{inflectHebrew(mission.storyHookHe, gender)}</p>

          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${style.sheetChipClass}`}>
              <Clock className="w-3.5 h-3.5" /> כ-{mission.estimatedMinutes} דקות
            </span>
            <span className={`px-2.5 py-1 rounded-full ${style.sheetChipClass}`} dir="ltr">
              {mission.grammarTopic}
            </span>
            {status === 'done' && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/20" aria-label={`${stars} מתוך 3 כוכבים`}>
                <StarRow stars={stars} />
              </span>
            )}
          </div>

          {status === 'locked' ? (
            <p className="p-3.5 rounded-2xl bg-amber-400/15 border-2 border-amber-400/60 text-sm font-extrabold leading-relaxed">
              {getLockedMessage(stop, previousTitleHe, gender)}
            </p>
          ) : (
            <>
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-between gap-2">
                <span className="text-sm font-extrabold">🎁 פרסים ברמת {tierMeta.labelHe}:</span>
                <span className={`text-sm font-extrabold ${style.rewardTextClass}`} dir="ltr">
                  +{xp} XP · +{diamonds} 💎
                </span>
              </div>

              {onSelectTier && (
                <TierChoice tier={tier} onChangeTier={onSelectTier} gender={gender} theme={theme} isCompact />
              )}

              {tierObjective && (
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-400/30 space-y-2">
                  <p className="text-xs font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                    {inflectHebrew(tierObjective.focusHe, gender)}
                  </p>
                  <div className="p-2.5 rounded-xl bg-black/10 text-sm font-bold flex items-center justify-between gap-2" dir="ltr">
                    <span>&ldquo;{tierObjective.samplePromptEn}&rdquo;</span>
                    <button
                      type="button"
                      onClick={() => onSpeakEnglish(tierObjective.samplePromptEn.replace(/_+/g, ''), 0.92)}
                      className={`p-1.5 rounded-lg shrink-0 ${theme.secondaryBtnClass}`}
                      aria-label="האזנה למשפט לדוגמה"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <h4 className="text-sm font-extrabold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>
                {mission.vocabulary.length} מילים במשימה ({isGirl ? 'לחצי' : 'לחץ'} להאזנה 🔊)
              </span>
            </h4>
            <ul className="grid grid-cols-1 gap-1.5">
              {mission.vocabulary.map((word) => (
                <li key={word.wordEn}>
                  <button
                    type="button"
                    onClick={() => onSpeakEnglish(`${word.wordEn}. ${word.exampleEn}`, 0.9)}
                    className={`w-full p-2.5 rounded-2xl ${style.sheetChipClass} flex items-center gap-2.5 text-start`}
                  >
                    <Volume2 className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold">{word.translationHe}</span>
                        <span className="font-extrabold text-sm" dir="ltr">
                          {word.emoji && <span aria-hidden="true">{word.emoji} </span>}
                          {word.wordEn}
                        </span>
                      </span>
                      <span className="block text-xs opacity-75 mt-0.5" dir="ltr">
                        {word.exampleEn}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {status !== 'locked' && (
          <div className={`sticky bottom-0 px-4 sm:px-6 pt-2 pb-4 ${style.sheetBgClass}`}>
            <button
              type="button"
              onClick={onStart}
              className={`btn-chunky w-full py-3.5 rounded-2xl text-lg font-extrabold flex items-center justify-center gap-2 ${theme.primaryBtnClass}`}
            >
              <Play className="w-5 h-5 fill-current" />
              {startLabel}
            </button>
          </div>
        )}
      </section>
    </div>,
    document.body
  );
};
