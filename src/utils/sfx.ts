/**
 * Short sound effects (Feature 24): CC0 Kenney sounds in public/sfx/. Sounds start only after the
 * learner's first tap or key press (browsers block audio before a user gesture), and a mute
 * setting is saved on the device. Browsers that can't play Ogg Vorbis stay silent.
 */

export type SfxName =
  | 'tap'
  | 'correct'
  | 'wrong'
  | 'star'
  | 'star-miss'
  | 'coins'
  | 'level-up'
  | 'celebrate';

const SFX_FILES: Record<SfxName, string> = {
  tap: '/sfx/tap.ogg',
  correct: '/sfx/correct.ogg',
  wrong: '/sfx/wrong.ogg',
  star: '/sfx/star.ogg',
  'star-miss': '/sfx/star-miss.ogg',
  coins: '/sfx/coins.ogg',
  'level-up': '/sfx/level-up.ogg',
  celebrate: '/sfx/celebrate.ogg',
};

const SFX_VOLUME = 0.55;
export const SFX_MUTED_STORAGE_KEY = 'english_tutor_sfx_muted';

let hasUserGesture = false;
let isMuted = readStoredMuted();
const mutedListeners = new Set<() => void>();
const audioCache = new Map<SfxName, HTMLAudioElement>();

function readStoredMuted(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(SFX_MUTED_STORAGE_KEY) === '1';
  } catch {
    // Storage can be blocked (private mode); sound then stays on for this visit.
    return false;
  }
}

function canPlayOgg(): boolean {
  if (typeof Audio === 'undefined') return false;
  return new Audio().canPlayType('audio/ogg; codecs="vorbis"') !== '';
}

function getAudio(name: SfxName): HTMLAudioElement {
  const cached = audioCache.get(name);
  if (cached) return cached;
  const audio = new Audio(SFX_FILES[name]);
  audio.preload = 'auto';
  audio.volume = SFX_VOLUME;
  audioCache.set(name, audio);
  return audio;
}

function handleFirstGesture(): void {
  hasUserGesture = true;
  window.removeEventListener('pointerdown', handleFirstGesture, true);
  window.removeEventListener('keydown', handleFirstGesture, true);
  if (!isMuted && canPlayOgg()) {
    (Object.keys(SFX_FILES) as SfxName[]).forEach(getAudio);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', handleFirstGesture, true);
  window.addEventListener('keydown', handleFirstGesture, true);
}

export function playSfx(name: SfxName): void {
  if (isMuted || !hasUserGesture || !canPlayOgg()) return;
  const sound = getAudio(name).cloneNode(true) as HTMLAudioElement;
  sound.volume = SFX_VOLUME;
  // A sound that fails to load or is blocked must never interrupt the lesson.
  sound.play().catch(() => undefined);
}

export function isSfxMuted(): boolean {
  return isMuted;
}

export function setSfxMuted(muted: boolean): void {
  isMuted = muted;
  try {
    localStorage.setItem(SFX_MUTED_STORAGE_KEY, muted ? '1' : '0');
  } catch {
    // Not saved when storage is blocked; the setting still applies until the page reloads.
  }
  mutedListeners.forEach((listener) => listener());
}

export function subscribeSfxMuted(listener: () => void): () => void {
  mutedListeners.add(listener);
  return () => mutedListeners.delete(listener);
}
