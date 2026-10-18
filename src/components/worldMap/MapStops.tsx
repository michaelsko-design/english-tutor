import React, { useEffect, useState } from 'react';
import { MapStop } from '../../data/worldMap';
import { getCommonArt, pickCutoutSrc } from '../../themes/themeArt';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { inflectHebrew } from '../../utils/hebrewGender';
import { LearnerGender } from '../../types/learner';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Companion } from '../companion/Companion';
import { ArtImage } from '../art/ArtImage';
import { LockBadge, StarRow, getPinStyle } from './mapPieces';
import { WorldMapStyle } from './worldMapStyles';
import { hasSeenCastleOpen, rememberCastleOpen } from './castleMemory';

export const COIN_SIZE = 60;
export const CASTLE_SIZE = 108;
export const MAP_COMPANION_SIZE = 66;
/** How far the companion's feet sink into the top of the coin */
const COMPANION_FEET_OVERLAP = 12;
/** The castle stays shut this long before it opens, so the change is seen */
const CASTLE_OPEN_DELAY_MS = 700;

interface StopProps {
  stop: MapStop;
  mapHeight: number;
  theme: ThemeDefinition;
  gender: LearnerGender;
  style: WorldMapStyle;
  onSelect: (stop: MapStop) => void;
}

function getStopLabel(stop: MapStop, gender: LearnerGender): string {
  const { mission, status, stars } = stop.state;
  const title = `משימה ${mission.unitNumber}.${mission.missionNumber}: ${inflectHebrew(mission.titleHe, gender)}`;
  if (status === 'locked') return `${title}, נעולה`;
  if (status === 'done') return `${title}, ${stars} מתוך 3 כוכבים`;
  return `${title}, ${stop.state.isCurrent ? 'המשימה הבאה' : 'פתוחה'}`;
}

const DONE_COIN_CLASS =
  'bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 border-amber-600 text-amber-950 [--chunky-edge:#b45309]';
const LOCKED_COIN_CLASS = 'bg-gradient-to-b from-slate-300 to-slate-400 border-slate-500 text-slate-600';

/** A mission coin: gold with stars when done, pulsing with the companion on it when it's next, grey when locked. */
export const MissionCoinStop: React.FC<StopProps> = ({ stop, mapHeight, theme, gender, style, onSelect }) => {
  const isReducedMotion = usePrefersReducedMotion();
  const { mission, status, stars, isCurrent } = stop.state;
  const coinClass = status === 'done' ? DONE_COIN_CLASS : status === 'open' ? style.openCoinClass : LOCKED_COIN_CLASS;

  return (
    <div
      // The current stop sits one layer down, so its companion never covers the stars of the stop above
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${isCurrent ? 'z-[1]' : 'z-[2]'}`}
      style={{ ...getPinStyle(stop.position, mapHeight), width: COIN_SIZE, height: COIN_SIZE }}
      data-mission-id={mission.id}
    >
      {isCurrent && (
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{ bottom: COIN_SIZE - COMPANION_FEET_OVERLAP }}
        >
          <Companion theme={theme} pose="idle" size={MAP_COMPANION_SIZE} />
        </div>
      )}
      <button
        type="button"
        onClick={() => onSelect(stop)}
        aria-label={getStopLabel(stop, gender)}
        className={`btn-chunky relative w-full h-full rounded-full border-4 flex items-center justify-center text-2xl ${coinClass}`}
      >
        {isCurrent && status !== 'locked' && !isReducedMotion && (
          <span
            className={`absolute -inset-1.5 rounded-full border-4 animate-coin-pulse pointer-events-none ${style.pulseRingClass}`}
            aria-hidden="true"
          />
        )}
        <span className="absolute inset-1 rounded-full border-2 border-white/40 pointer-events-none" aria-hidden="true" />
        {status === 'locked' ? (
          <span className="opacity-50 grayscale" aria-hidden="true">
            {mission.icon}
          </span>
        ) : (
          <span aria-hidden="true">{mission.icon}</span>
        )}
        {status === 'locked' && <LockBadge className="-bottom-1 -right-1" />}
      </button>
      <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
        {status === 'done' ? (
          <span className={`px-1.5 py-0.5 rounded-full ${style.stopLabelClass}`}>
            <StarRow stars={stars} />
          </span>
        ) : (
          <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${style.stopLabelClass}`} dir="ltr">
            {mission.unitNumber}.{mission.missionNumber}
          </span>
        )}
      </div>
    </div>
  );
};

type CastlePhase = 'shut' | 'opening' | 'done';

/** Plays the opening once per device: the first time the castle is shown with its gate met. */
function useCastleOpening(missionId: string, isNewlyOpen: boolean): { isShut: boolean; isOpening: boolean } {
  const isReducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<CastlePhase>(() =>
    isNewlyOpen && !hasSeenCastleOpen(missionId) ? 'shut' : 'done'
  );

  // A gate met while the map stays on screen (back from a mission) opens the castle too
  useEffect(() => {
    if (isNewlyOpen && !hasSeenCastleOpen(missionId)) setPhase('shut');
  }, [isNewlyOpen, missionId]);

  useEffect(() => {
    if (phase !== 'shut') return undefined;
    rememberCastleOpen(missionId);
    if (isReducedMotion) {
      setPhase('done');
      return undefined;
    }
    const timer = window.setTimeout(() => setPhase('opening'), CASTLE_OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [phase, missionId, isReducedMotion]);

  return { isShut: phase === 'shut', isOpening: phase === 'opening' };
}

/** The Boss stop: a castle showing the stars earned toward its gate, which opens when the gate is met. */
export const BossCastleStop: React.FC<StopProps> = ({ stop, mapHeight, theme, gender, style, onSelect }) => {
  const { mission, status, stars, isCurrent, bossGate } = stop.state;
  const isNewlyOpen = status === 'open' && Boolean(bossGate?.isMet);
  const { isShut, isOpening } = useCastleOpening(mission.id, isNewlyOpen);
  const isOpen = status !== 'locked' && !isShut;
  const isCompanionOnRight = stop.position.x < 0.5;

  const art = getCommonArt(isOpen ? 'boss-open' : 'boss-locked');
  const fallback = (
    <div
      className={`absolute inset-[10%] rounded-[30%] border-4 flex items-center justify-center text-5xl shadow-lg ${
        isOpen
          ? 'bg-gradient-to-b from-amber-100 to-amber-300 border-amber-600'
          : 'bg-gradient-to-b from-stone-300 to-stone-500 border-stone-600'
      }`}
    >
      <span className={isOpen ? '' : 'grayscale opacity-70'}>🏰</span>
      {!isOpen && <LockBadge className="-bottom-1 -right-1 w-8 h-8" />}
    </div>
  );

  return (
    <div
      className="absolute z-[2] -translate-x-1/2 -translate-y-1/2"
      style={{ ...getPinStyle(stop.position, mapHeight), width: CASTLE_SIZE, height: CASTLE_SIZE }}
      data-mission-id={mission.id}
    >
      {isCurrent && (
        <div
          className="absolute bottom-0 pointer-events-none"
          style={isCompanionOnRight ? { left: CASTLE_SIZE - 18 } : { right: CASTLE_SIZE - 18 }}
        >
          <Companion theme={theme} pose="idle" size={MAP_COMPANION_SIZE} />
        </div>
      )}
      <button
        type="button"
        onClick={() => onSelect(stop)}
        aria-label={`בוס: ${getStopLabel(stop, gender)}`}
        className={`relative w-full h-full rounded-3xl transition-transform active:scale-95 ${isOpening ? 'animate-castle-open' : ''}`}
      >
        <ArtImage
          src={pickCutoutSrc(art, CASTLE_SIZE, typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1)}
          className="w-full h-full"
          imgClassName="drop-shadow-xl"
          fallback={fallback}
        />
        {isOpening && (
          <span
            className="absolute inset-0 flex items-center justify-center text-6xl animate-castle-sparkle pointer-events-none"
            aria-hidden="true"
          >
            ✨
          </span>
        )}
      </button>
      <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
        {status === 'done' ? (
          <span className={`flex px-1.5 py-0.5 rounded-full ${style.stopLabelClass}`}>
            <StarRow stars={stars} />
          </span>
        ) : bossGate && !bossGate.isMet ? (
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-amber-950 border-2 border-amber-600 shadow"
            dir="ltr"
          >
            👑 {bossGate.earned}/{bossGate.required} ⭐
          </span>
        ) : (
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500 text-white border-2 border-emerald-700 shadow"
          >
            👑 הבוס מחכה!
          </span>
        )}
      </div>
    </div>
  );
};
