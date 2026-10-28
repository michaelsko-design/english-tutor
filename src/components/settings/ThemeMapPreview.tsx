import React, { useMemo } from 'react';
import type { CurriculumUnit, MissionNode } from '../../data/curriculum/types';
import { buildWorldMap, getUnitGradeNumber } from '../../data/worldMap';
import { MAP_BG_ASPECT } from '../../themes/themeArt';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import type { LearnerGender } from '../../types/learner';
import { ArtImage } from '../art/ArtImage';
import { MapPathLayer } from '../worldMap/MapPathLayer';
import { MapLandmark } from '../worldMap/mapPieces';
import { BossCastleStop, MissionCoinStop } from '../worldMap/MapStops';
import { WORLD_MAP_STYLES } from '../worldMap/worldMapStyles';

/** Mission ids in the curriculum's pattern, so the region gets a real landmark picture (grade 3, unit 1) */
const PREVIEW_MISSIONS: ReadonlyArray<Pick<MissionNode, 'id' | 'missionNumber' | 'icon' | 'isBoss'>> = [
  { id: 'g3-u1-m1', missionNumber: 1, icon: '🌟' },
  { id: 'g3-u1-m2', missionNumber: 2, icon: '🎒' },
  { id: 'g3-u1-m3', missionNumber: 3, icon: '🧩' },
  { id: 'g3-u1-m4', missionNumber: 4, icon: '👑', isBoss: true },
];

/** One sample unit: only what the map draws is filled in */
const PREVIEW_UNIT: CurriculumUnit = {
  unitNumber: 1,
  titleEn: '',
  titleHe: '',
  subtitleHe: '',
  badgeEmoji: '🗺️',
  missions: PREVIEW_MISSIONS.map(
    (m) => ({ ...m, unitNumber: 1, titleEn: '', titleHe: '', vocabulary: [] }) as unknown as MissionNode
  ),
};

/** The first mission played: the companion stands on the second one, the path walked so far */
const PREVIEW_PROGRESS: Record<string, number> = { 'g3-u1-m1': 3 };

interface ThemeMapPreviewProps {
  /** The theme and mascot to show */
  theme: ThemeDefinition;
  gender: LearnerGender;
}

/**
 * A piece of the world map in a theme, drawn with the map's own parts: the background, the path,
 * mission coins, the Boss castle and the mascot on the next mission (its coin pulses, unless the
 * learner asked for less motion). For trying a theme before it is chosen.
 */
export const ThemeMapPreview: React.FC<ThemeMapPreviewProps> = ({ theme, gender }) => {
  const style = WORLD_MAP_STYLES[theme.id];
  const layout = useMemo(
    () => buildWorldMap([PREVIEW_UNIT], PREVIEW_PROGRESS, theme.art.mapPath.centerline, MAP_BG_ASPECT),
    [theme]
  );
  const [region] = layout.regions;

  return (
    // Only the region is shown: the strip above it holds the unit banner on the real map
    <div
      className="mx-auto w-full max-w-[250px] rounded-[24px] overflow-hidden border-4 border-white/60 shadow-xl"
      style={{ aspectRatio: `1 / ${region.height}` }}
    >
      <div
        className={`relative w-full pointer-events-none ${style.canvasFallbackClass}`}
        // A percentage margin is a share of the width, and map lengths are in map widths
        style={{ aspectRatio: `1 / ${layout.height}`, marginTop: `${-region.top * 100}%` }}
        dir="ltr"
        lang="en"
        aria-hidden="true"
        // The stops are buttons on the real map; here nothing can be tapped or focused (React 18 has no inert prop)
        ref={(el) => {
          if (el) el.inert = true;
        }}
      >
        <div
          className="absolute inset-x-0"
          style={{ top: `${(region.top / layout.height) * 100}%`, height: `${(region.height / layout.height) * 100}%` }}
        >
          <ArtImage src={theme.art.mapBg} className="w-full h-full" imgStyle={{ objectFit: 'fill' }} />
        </div>
        <MapPathLayer path={layout.path} trail={layout.trail} mapHeight={layout.height} style={theme.art.mapPath} />
        <MapLandmark
          theme={theme}
          unit={region.unit}
          gradeNumber={getUnitGradeNumber(region.unit)}
          position={region.landmark.position}
          mapHeight={layout.height}
        />
        {region.stops.map((stop) => {
          const StopComponent = stop.state.mission.isBoss ? BossCastleStop : MissionCoinStop;
          return (
            <StopComponent
              key={stop.state.mission.id}
              stop={stop}
              mapHeight={layout.height}
              theme={theme}
              gender={gender}
              style={style}
              onSelect={() => undefined}
            />
          );
        })}
      </div>
    </div>
  );
};
