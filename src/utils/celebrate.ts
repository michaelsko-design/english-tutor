import confetti from 'canvas-confetti';
import { prefersReducedMotion } from './motion';
import { playSfx } from './sfx';

/**
 * One celebration vocabulary for every activity (Feature 24): small for a quick reward
 * (a quest claim, a purchase), medium for a finished activity, big for a mission or exam win.
 * Reduced motion skips the confetti; the sound still plays unless muted.
 */
export type CelebrationSize = 'small' | 'medium' | 'big';

const CONFETTI_BY_SIZE: Record<CelebrationSize, confetti.Options> = {
  small: { particleCount: 50, spread: 60, origin: { y: 0.65 } },
  medium: { particleCount: 75, spread: 70, origin: { y: 0.6 } },
  big: { particleCount: 110, spread: 85, origin: { y: 0.6 } },
};

const BIG_SIDE_BURST: confetti.Options = { particleCount: 45, spread: 55, startVelocity: 50 };

export function celebrate(size: CelebrationSize, options: { isSilent?: boolean } = {}): void {
  if (!options.isSilent) playSfx(size === 'small' ? 'coins' : 'celebrate');
  if (prefersReducedMotion()) return;

  confetti(CONFETTI_BY_SIZE[size]);
  if (size === 'big') {
    confetti({ ...BIG_SIDE_BURST, angle: 60, origin: { x: 0, y: 0.7 } });
    confetti({ ...BIG_SIDE_BURST, angle: 120, origin: { x: 1, y: 0.7 } });
  }
}
