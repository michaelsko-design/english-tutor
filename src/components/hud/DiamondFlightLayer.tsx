import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DiamondFlight, ScreenPoint, finishFlight, landGem } from '../../services/diamondFlight';
import { useDiamondFlights } from '../../hooks/useDiamondFlight';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
  getDiamondTargetPoint,
  getFlightDurationMs,
  getGemPhase,
  getGemPose,
} from '../../utils/diamondFlightPath';
import { playSfx } from '../../utils/sfx';
import { HudIcon } from './HudIcon';

const GEM_PX = 30;
const SPARKLE_COUNT = 10;
const SPARKLE_DISTANCE_PX = 70;
const SPARKLE_MS = 600;
const RING_MS = 520;
const PULSE_MS = 320;
const FLOAT_LABEL_MS = 1100;

interface FloatLabel {
  id: string;
  amount: number;
  at: ScreenPoint;
}

let nextLabelNumber = 1;

const canAnimate = (el: Element | null): el is HTMLElement =>
  Boolean(el) && typeof (el as HTMLElement).animate === 'function';

/** The HUD gem counter swells and glows as a gem lands in it. */
function pulseTarget(): void {
  const el = document.querySelector('[data-diamond-target]');
  if (!canAnimate(el)) return;
  el.animate(
    [
      { transform: 'scale(1)', filter: 'drop-shadow(0 0 0 rgba(56,189,248,0))' },
      { transform: 'scale(1.22)', filter: 'drop-shadow(0 0 10px rgba(56,189,248,0.9))' },
      { transform: 'scale(1)', filter: 'drop-shadow(0 0 0 rgba(56,189,248,0))' },
    ],
    { duration: PULSE_MS, easing: 'ease-out' }
  );
}

const placeAt = (point: ScreenPoint, sizePx: number): React.CSSProperties => ({
  position: 'fixed',
  left: point.x - sizePx / 2,
  top: point.y - sizePx / 2,
  width: sizePx,
  height: sizePx,
});

/** The burst at the reward: an expanding ring and sparkles thrown outward. */
const BurstEffect: React.FC<{ at: ScreenPoint }> = ({ at }) => {
  const ringRef = useRef<HTMLSpanElement>(null);
  const sparkleRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (canAnimate(ringRef.current)) {
      ringRef.current.animate(
        [
          { transform: 'scale(0.2)', opacity: 0.9 },
          { transform: 'scale(2.6)', opacity: 0 },
        ],
        { duration: RING_MS, easing: 'ease-out', fill: 'forwards' }
      );
    }
    sparkleRefs.current.forEach((el, i) => {
      if (!canAnimate(el)) return;
      const angle = (i / SPARKLE_COUNT) * Math.PI * 2;
      const dx = Math.cos(angle) * SPARKLE_DISTANCE_PX;
      const dy = Math.sin(angle) * SPARKLE_DISTANCE_PX;
      el.animate(
        [
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0 },
        ],
        { duration: SPARKLE_MS, easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)', fill: 'forwards' }
      );
    });
  }, []);

  return (
    <>
      <span ref={ringRef} className="rounded-full border-4 border-sky-300/90 opacity-0" style={placeAt(at, 56)} />
      {Array.from({ length: SPARKLE_COUNT }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            sparkleRefs.current[i] = el;
          }}
          className={`rounded-full opacity-0 ${i % 2 === 0 ? 'bg-amber-200' : 'bg-sky-200'} shadow-[0_0_8px_rgba(255,255,255,0.9)]`}
          style={placeAt(at, i % 2 === 0 ? 7 : 5)}
        />
      ))}
    </>
  );
};

/** One reward's gems: burst out, arc up into the counter, and land one by one. */
const GemFlight: React.FC<{ flight: DiamondFlight; onAllLanded: (amount: number, at: ScreenPoint) => void }> = ({
  flight,
  onAllLanded,
}) => {
  const gemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { id, gems, amount } = flight;
  const source = flight.from ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const sourceX = source.x;
  const sourceY = source.y;

  useEffect(() => {
    const from = { x: sourceX, y: sourceY };
    const landed = new Set<number>();
    const startedAt = performance.now();
    const durationMs = getFlightDurationMs(gems);
    let target = getDiamondTargetPoint();
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      // The counter can move (scroll, a closing dialog): aim at where it is now
      target = getDiamondTargetPoint();
      gems.forEach((gem, i) => {
        const pose = getGemPose(gem, from, target, elapsed);
        const el = gemRefs.current[i];
        if (el) {
          el.style.transform = `translate(${pose.x - GEM_PX / 2}px, ${pose.y - GEM_PX / 2}px) rotate(${pose.rotateDeg}deg) scale(${pose.scale})`;
          el.style.opacity = String(pose.opacity);
        }
        if (getGemPhase(gem, elapsed) === 'landed' && !landed.has(i)) {
          landed.add(i);
          if (landed.size === 1) playSfx('coins');
          landGem(id, gem.value);
          pulseTarget();
        }
      });
      if (elapsed < durationMs) {
        frameId = requestAnimationFrame(tick);
        return;
      }
      onAllLanded(amount, target);
      finishFlight(id);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [id, gems, amount, sourceX, sourceY, onAllLanded]);

  return (
    <>
      <BurstEffect at={source} />
      {gems.map((gem, i) => (
        <div
          key={gem.id}
          ref={(el) => {
            gemRefs.current[i] = el;
          }}
          className="fixed left-0 top-0 opacity-0 will-change-transform drop-shadow-[0_0_6px_rgba(125,211,252,0.9)]"
          style={{ width: GEM_PX, height: GEM_PX }}
        >
          <HudIcon name="gem" className="w-full h-full" />
        </div>
      ))}
    </>
  );
};

/** "+N" rising from the counter once every gem has landed. */
const FloatingAmount: React.FC<{ label: FloatLabel; onDone: (id: string) => void }> = ({ label, onDone }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (canAnimate(ref.current)) {
      ref.current.animate(
        [
          { transform: 'translate(-50%, 0) scale(0.8)', opacity: 0 },
          { transform: 'translate(-50%, -14px) scale(1.1)', opacity: 1, offset: 0.25 },
          { transform: 'translate(-50%, -38px) scale(1)', opacity: 0 },
        ],
        { duration: FLOAT_LABEL_MS, easing: 'ease-out', fill: 'forwards' }
      );
    }
    const timer = setTimeout(() => onDone(label.id), FLOAT_LABEL_MS);
    return () => clearTimeout(timer);
  }, [label.id, onDone]);

  return (
    <span
      ref={ref}
      dir="ltr"
      lang="en"
      className="fixed text-lg font-extrabold text-sky-500 dark:text-sky-300 opacity-0 whitespace-nowrap [text-shadow:0_1px_3px_rgba(0,0,0,0.35)]"
      style={{ left: label.at.x, top: label.at.y + 12 }}
    >
      +{label.amount}
    </span>
  );
};

/**
 * Feature: earned diamonds fly to the HUD gem counter. Rendered once beside the HUD; reward
 * screens start flights through services/diamondFlight. Reduced motion skips the flight and
 * just pulses the counter.
 */
export const DiamondFlightLayer: React.FC = () => {
  const { flights } = useDiamondFlights();
  const isReducedMotion = usePrefersReducedMotion();
  const [floatLabels, setFloatLabels] = useState<FloatLabel[]>([]);
  const flying = flights.filter((f) => f.status === 'flying');

  useEffect(() => {
    if (!isReducedMotion || flying.length === 0) return;
    flying.forEach((f) => finishFlight(f.id));
    pulseTarget();
  }, [isReducedMotion, flying]);

  const handleAllLanded = useCallback((amount: number, at: ScreenPoint) => {
    setFloatLabels((labels) => [...labels, { id: `label-${nextLabelNumber++}`, amount, at }]);
  }, []);
  const handleFloatDone = useCallback((labelId: string) => {
    setFloatLabels((labels) => labels.filter((l) => l.id !== labelId));
  }, []);

  if (isReducedMotion || (flying.length === 0 && floatLabels.length === 0)) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden" aria-hidden="true">
      {flying.map((f) => (
        <GemFlight key={f.id} flight={f} onAllLanded={handleAllLanded} />
      ))}
      {floatLabels.map((label) => (
        <FloatingAmount key={label.id} label={label} onDone={handleFloatDone} />
      ))}
    </div>,
    document.body
  );
};
