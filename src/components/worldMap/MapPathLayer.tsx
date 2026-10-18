import React, { useId } from 'react';
import { MapPathStyle, MapPoint } from '../../themes/themeArt';

interface MapPathLayerProps {
  path: MapPoint[];
  /** The part already walked: from the top to the current mission */
  trail: MapPoint[];
  /** Height of the map, in map widths */
  mapHeight: number;
  style: MapPathStyle;
}

/** SVG units per map width: the SVG is 100 wide, so stroke widths are % of the map width. */
const UNITS_PER_WIDTH = 100;
const EDGE_WIDTH = 5.4;
const ROAD_WIDTH = 3.8;
const GLOW_WIDTH = 8;
const DASH_WIDTH = 0.9;
const DASH_PATTERN = '2.2 2.8';

const toSvgPath = (points: MapPoint[]): string =>
  points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(p.x * UNITS_PER_WIDTH).toFixed(2)},${(p.y * UNITS_PER_WIDTH).toFixed(2)}`)
    .join(' ');

/**
 * The world map path (Feature 26), drawn over the backgrounds in the same coordinates as the
 * stops so they line up at every screen width. On the dark themes a soft glow sits under it.
 */
export const MapPathLayer: React.FC<MapPathLayerProps> = ({ path, trail, mapHeight, style }) => {
  const glowId = `map-glow-${useId().replace(/:/g, '')}`;
  const pathD = toSvgPath(path);
  const strokeProps = { fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${UNITS_PER_WIDTH} ${(mapHeight * UNITS_PER_WIDTH).toFixed(2)}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {style.glowColor && (
        <>
          <defs>
            <filter id={glowId} x="-50%" y="-5%" width="200%" height="110%">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
          </defs>
          <path d={pathD} stroke={style.glowColor} strokeWidth={GLOW_WIDTH} opacity={0.7} filter={`url(#${glowId})`} {...strokeProps} />
        </>
      )}
      <path d={pathD} stroke={style.edgeColor} strokeWidth={EDGE_WIDTH} {...strokeProps} />
      <path d={pathD} stroke={style.fillColor} strokeWidth={ROAD_WIDTH} {...strokeProps} />
      {trail.length > 1 && (
        <path d={toSvgPath(trail)} stroke={style.trailColor} strokeWidth={ROAD_WIDTH} {...strokeProps} />
      )}
      <path
        d={pathD}
        stroke={style.dashColor}
        strokeWidth={DASH_WIDTH}
        strokeDasharray={DASH_PATTERN}
        opacity={0.85}
        {...strokeProps}
      />
    </svg>
  );
};
