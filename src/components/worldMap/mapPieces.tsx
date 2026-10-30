import React from 'react';
import { Lock } from 'lucide-react';
import { CurriculumUnit } from '../../data/curriculum';
import { MapPoint, MissionArtTheme, getUnitLandmarkArt, pickCutoutSrc } from '../../themes/themeArt';
import { MAP_BANNER_HEIGHT } from '../../data/worldMap';
import { HudIcon } from '../hud/HudIcon';
import { ArtImage } from '../art/ArtImage';
import { WorldMapStyle } from './worldMapStyles';

/** Landmark width, as a share of the map width */
const LANDMARK_WIDTH_SHARE = 0.34;
/** Rough landmark size on a phone, to pick the 256px or 512px file */
const LANDMARK_DISPLAY_PX = 140;

function getDevicePixelRatio(): number {
  return typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
}

/** Places an element's centre on a map point. */
export function getPinStyle(point: MapPoint, mapHeight: number): React.CSSProperties {
  return { left: `${point.x * 100}%`, top: `${(point.y / mapHeight) * 100}%` };
}

/** Three stars, earned ones in colour. */
export const StarRow: React.FC<{ stars: number; sizeClass?: string }> = ({ stars, sizeClass = 'w-4 h-4' }) => (
  <span className="flex items-center gap-px shrink-0" dir="ltr" lang="en">
    {[1, 2, 3].map((n) => (
      <HudIcon key={n} name="star" className={`${sizeClass} shrink-0`} isGreyed={stars < n} />
    ))}
  </span>
);

interface UnitBannerProps {
  unit: CurriculumUnit;
  bannerTop: number;
  mapHeight: number;
  starsEarned: number;
  starsPossible: number;
  style: WorldMapStyle;
  /** A just-released content pack's unit: a "חדש!" tag on the sign */
  isNew?: boolean;
}

/** A unit's header: a strip across the join between two backgrounds with a sign of its titles. */
export const UnitBanner: React.FC<UnitBannerProps> = ({
  unit,
  bannerTop,
  mapHeight,
  starsEarned,
  starsPossible,
  style,
  isNew = false,
}) => (
  <div
    className="absolute inset-x-0 z-[3] flex items-center justify-center"
    style={{ top: `${(bannerTop / mapHeight) * 100}%`, height: `${(MAP_BANNER_HEIGHT / mapHeight) * 100}%` }}
  >
    <div className={`absolute inset-x-0 top-[24%] bottom-[24%] ${style.bannerRibbonClass}`} aria-hidden="true" />
    <div
      className={`relative w-[88%] min-h-[86%] py-1 rounded-2xl px-3 flex items-center gap-2.5 ${style.bannerSignClass}`}
    >
      {isNew && (
        <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-extrabold shadow-md ring-2 ring-white/80">
          חדש!
        </span>
      )}
      <span
        className={`w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center text-2xl shadow-md ${style.bannerBadgeClass}`}
        aria-hidden="true"
      >
        {unit.badgeEmoji}
      </span>
      <span className="flex-1 min-w-0 min-h-0 max-h-full overflow-hidden leading-tight">
        {/* The titles already start with the unit number ("פרק 1:", "Unit 1:"), so no separate label */}
        <span className="block text-sm sm:text-base font-extrabold line-clamp-2">{unit.titleHe}</span>
        <span className="block text-xs font-bold opacity-80 line-clamp-1" dir="ltr" lang="en" title={unit.titleEn}>
          {unit.titleEn}
        </span>
      </span>
      <span
        className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-xl bg-black/10 text-xs font-extrabold"
        dir="ltr" lang="en"
        aria-label={`${starsEarned} מתוך ${starsPossible} כוכבים ביחידה`}
      >
        <HudIcon name="star" className="w-4 h-4" />
        {starsEarned}/{starsPossible}
      </span>
    </div>
  </div>
);

interface MapLandmarkProps {
  theme: MissionArtTheme;
  unit: CurriculumUnit;
  gradeNumber: number | null;
  position: MapPoint;
  mapHeight: number;
}

/** The unit's landmark beside the path; its badge emoji until the picture is generated. */
export const MapLandmark: React.FC<MapLandmarkProps> = ({ theme, unit, gradeNumber, position, mapHeight }) => {
  const fallback = (
    <div className="absolute inset-[18%] rounded-full bg-white/80 ring-4 ring-white/40 shadow-lg flex items-center justify-center">
      <span className="text-4xl leading-none">{unit.badgeEmoji}</span>
    </div>
  );
  return (
    <div
      className="absolute z-[1] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ ...getPinStyle(position, mapHeight), width: `${LANDMARK_WIDTH_SHARE * 100}%` }}
      aria-hidden="true"
    >
      {gradeNumber === null ? (
        <div className="relative aspect-square">{fallback}</div>
      ) : (
        <ArtImage
          src={pickCutoutSrc(getUnitLandmarkArt(theme, gradeNumber, unit), LANDMARK_DISPLAY_PX, getDevicePixelRatio())}
          className="aspect-square w-full"
          imgClassName="drop-shadow-lg"
          fallback={fallback}
        />
      )}
    </div>
  );
};

/** The small lock badge on a locked stop. */
/** The small crown on a stop that needs EnglishVibe Pro (docs/feature-pro-tier.md) */
export const ProBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`absolute flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950 border-2 border-white shadow text-xs ${className}`}
    aria-hidden="true"
  >
    👑
  </span>
);

export const LockBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`absolute flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-white border-2 border-white shadow ${className}`}
    aria-hidden="true"
  >
    <Lock className="w-3 h-3" />
  </span>
);
