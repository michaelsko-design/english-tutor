/**
 * A coarse device bucket for analytics, e.g. `ios-safari-phone-pwa`. Only fixed words from the
 * lists below are ever produced (never the raw user-agent), so it can't fingerprint a child.
 * The same pattern is enforced by firestore.rules (`DEVICE_PATTERN`).
 */

export interface DeviceSignals {
  userAgent: string;
  /** `navigator.maxTouchPoints` (iPadOS reports a Mac user-agent but has touch points) */
  maxTouchPoints: number;
  /** The shorter screen side in CSS pixels */
  shortSide: number;
  /** Running as an installed app (home-screen icon) rather than in a browser tab */
  isStandalone: boolean;
}

export const DEVICE_PATTERN = /^(ios|android|windows|mac|linux|other)-(safari|chrome|firefox|edge|samsung|other)-(phone|tablet|desktop)(-pwa)?$/;

const TABLET_MIN_SHORT_SIDE = 600;

function detectOs(ua: string, maxTouchPoints: number): string {
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  if (/macintosh|mac os x/i.test(ua)) return maxTouchPoints > 1 ? 'ios' : 'mac';
  if (/windows/i.test(ua)) return 'windows';
  if (/linux|cros/i.test(ua)) return 'linux';
  return 'other';
}

/** Order matters: Edge, Samsung and the iOS wrappers all also say "Chrome" or "Safari" */
function detectBrowser(ua: string): string {
  if (/edg(e|a|ios)?\//i.test(ua)) return 'edge';
  if (/samsungbrowser/i.test(ua)) return 'samsung';
  if (/firefox|fxios/i.test(ua)) return 'firefox';
  if (/chrome|crios/i.test(ua)) return 'chrome';
  if (/safari/i.test(ua)) return 'safari';
  return 'other';
}

function detectForm(os: string, ua: string, shortSide: number): string {
  if (/ipad/i.test(ua)) return 'tablet';
  if (/iphone|ipod/i.test(ua)) return 'phone';
  if (os === 'ios') return 'tablet'; // iPadOS posing as a Mac
  if (os === 'android') return /mobile/i.test(ua) || shortSide < TABLET_MIN_SHORT_SIDE ? 'phone' : 'tablet';
  return 'desktop';
}

export function classifyDevice(signals: DeviceSignals): string {
  const os = detectOs(signals.userAgent, signals.maxTouchPoints);
  const browser = detectBrowser(signals.userAgent);
  const form = detectForm(os, signals.userAgent, signals.shortSide);
  return `${os}-${browser}-${form}${signals.isStandalone ? '-pwa' : ''}`;
}

/** The current device's bucket, or `undefined` outside a browser */
export function detectDevice(): string | undefined {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return undefined;
  try {
    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)').matches === true ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const device = classifyDevice({
      userAgent: navigator.userAgent,
      maxTouchPoints: navigator.maxTouchPoints ?? 0,
      shortSide: Math.min(window.screen.width, window.screen.height),
      isStandalone,
    });
    return DEVICE_PATTERN.test(device) ? device : undefined;
  } catch {
    return undefined;
  }
}
