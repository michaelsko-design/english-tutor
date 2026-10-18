import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { LocateFixed } from 'lucide-react';
import { CurriculumUnit, MissionNode } from '../data/curriculum';
import { LearnerGender, ProficiencyTier } from '../types/learner';
import { ThemeDefinition } from '../themes/themeRegistry';
import { MAP_BG_ASPECT } from '../themes/themeArt';
import { MapStop, buildWorldMap, getUnitGradeNumber } from '../data/worldMap';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { ArtImage } from './art/ArtImage';
import { MapPathLayer } from './worldMap/MapPathLayer';
import { MapLandmark, UnitBanner } from './worldMap/mapPieces';
import { BossCastleStop, MissionCoinStop } from './worldMap/MapStops';
import { MissionSheet } from './worldMap/MissionSheet';
import { WORLD_MAP_STYLES } from './worldMap/worldMapStyles';

interface MissionMapProps {
  units: CurriculumUnit[];
  missionProgress: Record<string, number>;
  selectedTier: ProficiencyTier;
  onSelectTier?: (tier: ProficiencyTier) => void;
  theme: ThemeDefinition;
  gender: LearnerGender;
  onStartMission: (mission: MissionNode) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

/** Where the current mission lands in the map window, as a share of its height from the top */
const CURRENT_STOP_VIEW_SHARE = 0.55;
/** The map window: about one phone screen, so the page around it still scrolls */
const MAP_WINDOW_HEIGHT = 'min(76vh, 760px)';

/**
 * The World Map (Feature 26): one illustrated region per unit on the theme's map background,
 * a path through all of them with a coin for every mission and a castle for every Boss. The
 * companion stands on the next mission, and tapping a stop opens its mission sheet.
 */
export const MissionMap: React.FC<MissionMapProps> = ({
  units,
  missionProgress,
  selectedTier,
  onSelectTier,
  theme,
  gender,
  onStartMission,
  onSpeakEnglish,
}) => {
  const style = WORLD_MAP_STYLES[theme.id];
  const isReducedMotion = usePrefersReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [openMissionId, setOpenMissionId] = useState<string | null>(null);

  const layout = useMemo(
    () => buildWorldMap(units, missionProgress, theme.art.mapPath.centerline, MAP_BG_ASPECT),
    [units, missionProgress, theme]
  );
  const allStops = layout.regions.flatMap((r) => r.stops);
  const openStop = allStops.find((s) => s.state.mission.id === openMissionId) ?? null;
  const currentMissionId = layout.currentStop?.state.mission.id ?? null;
  const isGirl = gender === 'girl';

  const scrollToCurrent = useCallback(
    (behavior: ScrollBehavior) => {
      const container = scrollRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas || !layout.currentStop) return;
      const stopY = (layout.currentStop.position.y / layout.height) * canvas.offsetHeight;
      container.scrollTo({ top: Math.max(0, stopY - container.clientHeight * CURRENT_STOP_VIEW_SHARE), behavior });
    },
    [layout]
  );

  // On open, on a new grade and when the next mission moves: bring the current mission into view
  useLayoutEffect(() => {
    scrollToCurrent('auto');
    // Only these changes should move the map, not every progress update
  }, [currentMissionId, units]);

  const handleCloseSheet = useCallback(() => setOpenMissionId(null), []);
  const handleSelectStop = useCallback((stop: MapStop) => setOpenMissionId(stop.state.mission.id), []);

  const previousTitleHe = (() => {
    if (!openStop) return null;
    const idx = allStops.indexOf(openStop);
    return idx > 0 ? allStops[idx - 1].state.mission.titleHe : null;
  })();

  return (
    <section aria-label="מפת העולם והמשימות" className="space-y-3 md:space-y-4">
      <div className="flex items-end justify-between gap-3 px-1" dir="rtl">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold">🗺️ מפת העולם</h2>
          <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
            {isGirl ? 'לחצי על מטבע כדי לראות את המשימה ולהתחיל' : 'לחץ על מטבע כדי לראות את המשימה ולהתחיל'}
          </p>
        </div>
        {layout.currentStop && (
          <button
            type="button"
            onClick={() => scrollToCurrent(isReducedMotion ? 'auto' : 'smooth')}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
          >
            <LocateFixed className="w-4 h-4" />
            למשימה הבאה
          </button>
        )}
      </div>

      <div className="mx-auto w-full max-w-[520px] rounded-[28px] overflow-hidden border-4 border-white/60 shadow-xl">
        <div ref={scrollRef} className="relative overflow-y-auto overscroll-contain" style={{ height: MAP_WINDOW_HEIGHT }}>
          <div
            ref={canvasRef}
            className={`relative w-full ${style.canvasFallbackClass}`}
            style={{ aspectRatio: `1 / ${layout.height}` }}
            dir="ltr"
          >
            {layout.regions.map((region) => (
              <div
                key={`bg-${region.unit.unitNumber}`}
                className="absolute inset-x-0"
                style={{
                  top: `${(region.top / layout.height) * 100}%`,
                  height: `${(region.height / layout.height) * 100}%`,
                }}
                aria-hidden="true"
              >
                <ArtImage src={theme.art.mapBg} className="w-full h-full" imgStyle={{ objectFit: 'fill' }} />
              </div>
            ))}

            <MapPathLayer path={layout.path} trail={layout.trail} mapHeight={layout.height} style={theme.art.mapPath} />

            {layout.regions.map((region) => (
              <MapLandmark
                key={`landmark-${region.unit.unitNumber}`}
                unit={region.unit}
                gradeNumber={getUnitGradeNumber(region.unit)}
                position={region.landmark.position}
                mapHeight={layout.height}
              />
            ))}

            {allStops.map((stop) => {
              const StopComponent = stop.state.mission.isBoss ? BossCastleStop : MissionCoinStop;
              return (
                <StopComponent
                  key={stop.state.mission.id}
                  stop={stop}
                  mapHeight={layout.height}
                  theme={theme}
                  gender={gender}
                  style={style}
                  onSelect={handleSelectStop}
                />
              );
            })}

            {layout.regions.map((region) => (
              <UnitBanner
                key={`banner-${region.unit.unitNumber}`}
                unit={region.unit}
                bannerTop={region.bannerTop}
                mapHeight={layout.height}
                starsEarned={region.stops.reduce((acc, s) => acc + s.state.stars, 0)}
                starsPossible={region.stops.length * 3}
                style={style}
              />
            ))}
          </div>
        </div>
      </div>

      {openStop && (
        <MissionSheet
          stop={openStop}
          previousTitleHe={previousTitleHe}
          tier={selectedTier}
          onSelectTier={onSelectTier}
          theme={theme}
          style={style}
          gender={gender}
          onStart={() => {
            setOpenMissionId(null);
            onStartMission(openStop.state.mission);
          }}
          onClose={handleCloseSheet}
          onSpeakEnglish={onSpeakEnglish}
        />
      )}
    </section>
  );
};
