import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { MissionNode } from '../../data/curriculum';
import { BossGate } from '../../data/milestones';
import { getPlayLabelHe } from '../../data/homeBase';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { inflectHebrew } from '../../utils/hebrewGender';
import { useArtStatus } from '../../hooks/useArtStatus';
import { Companion } from '../companion/Companion';

interface HomeHeroProps {
  theme: ThemeDefinition;
  gender: LearnerGender;
  greetingHe: string;
  mission: MissionNode;
  /** Set when the suggestion is a replay to open a star-gated Boss */
  bossGate: BossGate | null;
  xpReward: number;
  diamondReward: number;
  onPlay: () => void;
}

const WIDE_QUERY = '(min-width: 640px)';
const COMPANION_PX = { phone: 108, wide: 156 };

function useIsWideScreen(): boolean {
  const [isWide, setIsWide] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(WIDE_QUERY).matches : false
  );
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(WIDE_QUERY);
    const handleChange = () => setIsWide(query.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);
  return isWide;
}

/**
 * Feature 27: the home scene. The theme's home picture (building on the left) with the
 * companion and its speech bubble on the right, and one big Play button for today's mission.
 * Without the picture the hero card gradient shows instead.
 */
export const HomeHero: React.FC<HomeHeroProps> = ({
  theme,
  gender,
  greetingHe,
  mission,
  bossGate,
  xpReward,
  diamondReward,
  onPlay,
}) => {
  const sceneStatus = useArtStatus(theme.art.homeScene);
  const isWide = useIsWideScreen();
  const companionSize = isWide ? COMPANION_PX.wide : COMPANION_PX.phone;

  return (
    <section
      aria-label="המשימה של היום"
      className={`relative isolate overflow-hidden rounded-3xl min-h-[380px] sm:min-h-[400px] lg:min-h-[420px] ${theme.heroCardClass}`}
    >
      {sceneStatus === 'loaded' && (
        <img
          src={theme.art.homeScene}
          alt=""
          aria-hidden="true"
          draggable={false}
          decoding="async"
          // The building is on the left: keep it in view when a phone crops the sides
          className="absolute inset-0 -z-10 w-full h-full object-cover object-[12%_50%] sm:object-center select-none"
        />
      )}
      {/* Keeps the mission card readable over any picture */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 -z-10 bg-gradient-to-t from-black/35 to-transparent" aria-hidden="true" />

      <div className="relative min-h-[inherit] flex flex-col justify-between gap-3 p-3 sm:p-5">
        {/* Companion on the right (start), speech bubble beside it */}
        <div className="flex items-end gap-1.5 sm:gap-3">
          <Companion theme={theme} pose="wave" size={companionSize} />
          <div className="relative mb-16 sm:mb-24 max-w-[13.5rem] sm:max-w-xs rounded-2xl rounded-br-md bg-white/95 text-slate-800 px-3.5 py-2.5 shadow-lg ring-1 ring-black/5">
            <p className="text-sm sm:text-base font-extrabold leading-snug">{greetingHe}</p>
          </div>
        </div>

        {/* Today's mission + Play */}
        <div className={`w-full lg:max-w-md rounded-3xl p-3.5 sm:p-4 space-y-2.5 ${theme.cardBgClass}`}>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold">
              ⭐ המשימה היומית
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badgeClass}`}>
              ⏱️ {mission.estimatedMinutes} דק׳
            </span>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500 text-white"
              dir="ltr" lang="en"
            >
              +{xpReward} XP · +{diamondReward} 💎
            </span>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-extrabold leading-tight">{inflectHebrew(mission.titleHe, gender)}</h2>
            <p className={`text-xs sm:text-sm font-bold text-right ${theme.accentTextClass}`} dir="ltr" lang="en">
              Mission {mission.unitNumber}.{mission.missionNumber}: {mission.titleEn}
            </p>
          </div>

          {bossGate && (
            <p className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-amber-400/25 border border-amber-400/60">
              🔁 {gender === 'girl' ? 'שפרי' : 'שפר'} את המשימה הזו · עוד {bossGate.missing} ⭐ לפתיחת משימת הבוס
            </p>
          )}

          <button
            type="button"
            onClick={onPlay}
            className={`btn-chunky w-full py-3.5 sm:py-4 px-6 rounded-2xl font-black text-lg sm:text-xl flex items-center justify-center gap-2.5 ${theme.primaryBtnClass}`}
          >
            <Play className="w-6 h-6 fill-current" />
            <span>{getPlayLabelHe(gender, Boolean(bossGate))}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
