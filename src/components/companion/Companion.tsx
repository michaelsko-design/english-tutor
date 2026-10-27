import React from 'react';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { CompanionPose, pickCutoutSrc } from '../../themes/themeArt';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { preloadArt } from '../../utils/artStatus';
import { ArtImage } from '../art/ArtImage';

interface CompanionProps {
  theme: ThemeDefinition;
  pose: CompanionPose;
  /** Width and height in CSS pixels (the largest it is shown at, which picks the art file) */
  size: number;
  /** Width and height classes instead of `size`, e.g. a fluid size that shrinks on short screens */
  sizeClassName?: string;
  /** Extra classes (not positioning: the companion is always `relative`; wrap it to place it) */
  className?: string;
  /** The soft ground shadow; off when the companion peeks from behind a card */
  hasShadow?: boolean;
}

/** Idle and wave bob, cheer hops with a squash, oops wiggles, think sways. */
const MOTION_CLASS_BY_POSE: Record<CompanionPose, string> = {
  idle: 'animate-companion-bob',
  wave: 'animate-companion-bob',
  think: 'animate-companion-sway',
  cheer: 'animate-companion-hop',
  oops: 'animate-companion-wiggle',
};

const SHADOW_CLASS_BY_POSE: Record<CompanionPose, string> = {
  idle: 'animate-companion-shadow-bob',
  wave: 'animate-companion-shadow-bob',
  think: '',
  cheer: 'animate-companion-shadow-hop',
  oops: '',
};

function getDevicePixelRatio(): number {
  return typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
}

/** The file a companion pose shows at this size: the 256px one when it is sharp enough. */
export function getCompanionSrc(theme: ThemeDefinition, pose: CompanionPose, size: number): string {
  return pickCutoutSrc(theme.companion.art[pose], size, getDevicePixelRatio());
}

/** Starts loading poses before they are shown, so a pose change never flashes empty. */
export function preloadCompanion(theme: ThemeDefinition, poses: CompanionPose[], size: number): void {
  poses.forEach((pose) => preloadArt(getCompanionSrc(theme, pose, size)));
}

/**
 * The learner's mascot (Feature 25), e.g. Mochi, DJ Beat or Comet, in one of five poses, with CSS
 * motion and a ground shadow. Until the mascot's art exists it shows the mascot's avatar emoji
 * in a soft bubble of the same size, so nothing moves when the art arrives.
 */
export const Companion: React.FC<CompanionProps> = ({ theme, pose, size, sizeClassName, className = '', hasShadow = true }) => {
  const isReducedMotion = usePrefersReducedMotion();
  const motionClass = isReducedMotion ? '' : MOTION_CLASS_BY_POSE[pose];
  const shadowClass = isReducedMotion ? '' : SHADOW_CLASS_BY_POSE[pose];

  const fallback = (
    <div className="absolute inset-x-0 bottom-[4%] flex justify-center">
      <div
        className="rounded-full bg-white/85 ring-4 ring-white/40 shadow-lg flex items-center justify-center"
        style={{ width: '72%', height: '72%', fontSize: size * 0.4 }}
      >
        <span className="leading-none">{theme.companion.avatarEmoji}</span>
      </div>
    </div>
  );

  return (
    <div
      className={`relative shrink-0 pointer-events-none select-none ${sizeClassName ?? ''} ${className}`}
      style={sizeClassName ? undefined : { width: size, height: size }}
      aria-hidden="true"
    >
      {hasShadow && (
        <div
          className={`absolute left-[22%] bottom-0 w-[56%] h-[9%] rounded-[50%] bg-black/25 blur-[3px] ${shadowClass}`}
        />
      )}
      {/* Keyed by pose so each new pose replays its motion */}
      <div key={pose} className={`absolute inset-0 origin-bottom ${motionClass}`}>
        <ArtImage
          src={getCompanionSrc(theme, pose, size)}
          className="w-full h-full"
          imgStyle={theme.companionRim ? { filter: theme.companionRim } : undefined}
          fallback={fallback}
        />
      </div>
    </div>
  );
};
