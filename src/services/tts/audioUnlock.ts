/**
 * One shared <audio> element for every read-aloud clip. iOS only lets a page play sound from a
 * user gesture, so the element plays a moment of silence on the first tap or key press; after
 * that, clips that load later (after an await) may play on it too.
 */

let sharedAudio: HTMLAudioElement | null = null;
const gestureListeners = new Set<() => void>();

export function getSharedAudio(): HTMLAudioElement | null {
  if (typeof Audio === 'undefined') return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = 'auto';
    // Any sound that plays (the silence or a clip) proves the element is unlocked.
    if (typeof window !== 'undefined') sharedAudio.addEventListener('playing', removeUnlockListeners, { once: true });
  }
  return sharedAudio;
}

/** A 50 ms silent 8 kHz WAV, built in code so no file or data string is needed. */
function createSilentWavUrl(): string {
  const samples = 400;
  const buffer = new ArrayBuffer(44 + samples);
  const view = new DataView(buffer);
  const writeText = (offset: number, text: string) =>
    [...text].forEach((ch, i) => view.setUint8(offset + i, ch.charCodeAt(0)));
  writeText(0, 'RIFF');
  view.setUint32(4, 36 + samples, true);
  writeText(8, 'WAVEfmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, 8000, true);
  view.setUint32(28, 8000, true);
  view.setUint16(32, 1, true);
  view.setUint16(34, 8, true);
  writeText(36, 'data');
  view.setUint32(40, samples, true);
  for (let i = 0; i < samples; i += 1) view.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
}

/**
 * Gestures that count as user activation, also on iOS (a touch pointerdown does not). The
 * listeners stay until the silent play succeeds, so a blocked first try is retried next tap.
 */
const UNLOCK_EVENTS = ['touchend', 'click', 'keydown'] as const;
let isUnlocking = false;
let hasNotifiedGesture = false;

function removeUnlockListeners(): void {
  UNLOCK_EVENTS.forEach((type) => window.removeEventListener(type, handleGesture, true));
}

function handleGesture(): void {
  if (!hasNotifiedGesture) {
    hasNotifiedGesture = true;
    gestureListeners.forEach((listener) => listener());
  }
  const audio = getSharedAudio();
  if (!audio) {
    removeUnlockListeners();
    return;
  }
  // A clip already playing means the element is unlocked.
  if (!audio.paused) {
    removeUnlockListeners();
    return;
  }
  if (isUnlocking) return;
  isUnlocking = true;
  const silentUrl = createSilentWavUrl();
  audio.src = silentUrl;
  audio
    .play()
    .then(() => {
      removeUnlockListeners();
      // A clip may already have replaced the silence (the gesture was on a speaker button).
      if (audio.src === silentUrl) audio.pause();
    })
    // Blocked: the clip falls back to the device voice, and the next gesture tries again.
    .catch(() => undefined)
    .finally(() => {
      isUnlocking = false;
      URL.revokeObjectURL(silentUrl);
    });
}

if (typeof window !== 'undefined') {
  UNLOCK_EVENTS.forEach((type) => window.addEventListener(type, handleGesture, true));
}

/** Runs once on the learner's first tap or key press (used to load the clip list early). */
export function onFirstGesture(listener: () => void): void {
  gestureListeners.add(listener);
}
