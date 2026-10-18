import React from 'react';
import { getComboFlameLevel, getTrailSegments, TrailSegmentState } from '../../utils/missionFeedback';
import { FluentIcon } from '../hud/FluentIcon';

interface TrailProgressProps {
  stepCount: number;
  currentStepIdx: number;
  isCurrentStepCompleted: boolean;
  combo: number;
}

const SEGMENT_STYLE: Record<TrailSegmentState, string> = {
  done: 'bg-emerald-500 shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)]',
  current: 'bg-amber-400 animate-trail-pulse',
  // The theme's text colour, faint: dark on the light theme, light on the dark ones
  todo: 'bg-current opacity-20',
};

const FLAME_SIZE_BY_LEVEL = ['', 'w-6 h-6', 'w-8 h-8', 'w-10 h-10'];

/**
 * Feature 25: the mission trail. One segment per step turns green when the step is answered,
 * and the combo shows as a flame that grows at 3x and again at 5x.
 */
export const TrailProgress: React.FC<TrailProgressProps> = ({
  stepCount,
  currentStepIdx,
  isCurrentStepCompleted,
  combo,
}) => {
  const segments = getTrailSegments(stepCount, currentStepIdx, isCurrentStepCompleted);
  const doneCount = segments.filter((state) => state === 'done').length;
  const flameLevel = getComboFlameLevel(combo);

  return (
    <div className="flex-1 flex items-center gap-2 min-w-0">
      <div
        className="flex-1 flex items-center gap-1.5"
        role="progressbar"
        aria-label="התקדמות במשימה"
        aria-valuemin={0}
        aria-valuemax={stepCount}
        aria-valuenow={doneCount}
      >
        {segments.map((state, idx) => (
          <span key={idx} className={`flex-1 h-3 rounded-full transition-colors duration-300 ${SEGMENT_STYLE[state]}`} />
        ))}
      </div>

      {/* Fixed width so the trail never jumps when the flame appears */}
      <div className="w-14 h-10 shrink-0 flex items-center justify-center" aria-live="polite">
        {flameLevel > 0 && (
          <span key={flameLevel} className="flex items-center gap-0.5 animate-reward-pop">
            <FluentIcon name="flame" className={FLAME_SIZE_BY_LEVEL[flameLevel]} />
            <span className="text-xs font-extrabold tabular-nums" dir="ltr">
              {combo}x
            </span>
            <span className="sr-only">רצף תשובות נכונות</span>
          </span>
        )}
      </div>
    </div>
  );
};
