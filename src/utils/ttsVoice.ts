export type VoicePreference = 'female' | 'male';

export const DEFAULT_VOICE_PREFERENCE: VoicePreference = 'female';

export interface VoiceInfo {
  name: string;
  lang: string;
}

const FEMALE_NAMES =
  /\b(aria|jenny|samantha|zira|susan|karen|moira|tessa|serena|victoria|allison|ava|libby|sonia|emma|female)\b|google us english|-x-(sfg|iob|iog|tpc|tpf)\b/i;
const MALE_NAMES = /\b(david|mark|guy|alex|daniel|fred|george|ryan|james|tom|male)\b|-x-(iol|iom|tpd)\b/i;

const UNMATCHED_MALE_PITCH = 0.7;
const UNMATCHED_FEMALE_PITCH = 1.1;

/** With no recognisable voice, the default voice is used, so the pitch keeps the two options apart. */
export function getFallbackPitch(preference: VoicePreference, hasMatchedVoice: boolean): number {
  if (hasMatchedVoice) return 1;
  return preference === 'male' ? UNMATCHED_MALE_PITCH : UNMATCHED_FEMALE_PITCH;
}
const NEURAL_NAMES = /natural|online|neural/i;

function isMale(name: string): boolean {
  if (/female/i.test(name)) return false;
  return MALE_NAMES.test(name);
}

function scoreVoice(voice: VoiceInfo, preference: VoicePreference): number {
  const matches = preference === 'male' ? isMale(voice.name) : FEMALE_NAMES.test(voice.name) && !isMale(voice.name);
  if (!matches) return 0;
  let score = 1;
  if (/^en[-_]US$/i.test(voice.lang)) score += 2;
  if (NEURAL_NAMES.test(voice.name)) score += 4;
  return score;
}

/** The best English voice of the preferred kind, or null when none is recognised (the browser default is used). */
export function pickVoice<T extends VoiceInfo>(voices: readonly T[], preference: VoicePreference): T | null {
  const kind: VoicePreference = preference === 'male' ? 'male' : 'female';
  let best: T | null = null;
  let bestScore = 0;
  for (const voice of voices) {
    if (!/^en([-_]|$)/i.test(voice.lang)) continue;
    const score = scoreVoice(voice, kind);
    if (score > bestScore) {
      best = voice;
      bestScore = score;
    }
  }
  return best;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (cachedVoices.length === 0) cachedVoices = window.speechSynthesis.getVoices();
  return cachedVoices;
}

/** Chrome loads voices asynchronously; refresh the cache when they arrive. */
export function watchVoices(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    cachedVoices = window.speechSynthesis.getVoices();
  });
}

/** The English voices of this device and the one chosen for the preference, for diagnosing a wrong-sounding voice. */
export function describeVoices(preference: VoicePreference): { picked: string | null; english: string[] } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return { picked: null, english: [] };
  const voices = loadVoices();
  return {
    picked: pickVoice(voices, preference)?.name ?? null,
    english: voices.filter((voice) => /^en([-_]|$)/i.test(voice.lang)).map((voice) => `${voice.name} (${voice.lang})`),
  };
}

/** The device's Hebrew voice, or null when it has none (most desktops; then nothing is read). */
export function pickHebrewVoice<T extends VoiceInfo>(voices: readonly T[]): T | null {
  return voices.find((voice) => /^(he|iw)([-_]|$)/i.test(voice.lang)) ?? null;
}

/** Reads the text with the device's own voice; resolves when it ends, fails or is stopped. */
export function speakWithVoice(
  text: string,
  rate: number,
  preference: VoicePreference,
  onStart?: () => void,
  lang: 'en' | 'he' = 'en',
): Promise<void> {
  if (!isDeviceVoiceAvailable()) return Promise.resolve();
  window.speechSynthesis.cancel();
  if (lang === 'he') return speakHebrewWithDevice(text, rate, onStart);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  const voice = pickVoice(loadVoices(), preference);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  utterance.pitch = getFallbackPitch(preference, voice !== null);
  return new Promise((resolve) => {
    utterance.onstart = () => onStart?.();
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

function speakHebrewWithDevice(text: string, rate: number, onStart?: () => void): Promise<void> {
  const voice = pickHebrewVoice(loadVoices());
  // An English voice would spell the Hebrew out letter by letter, so without a Hebrew voice it stays silent.
  if (!voice) return Promise.resolve();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.rate = rate;
  return new Promise((resolve) => {
    utterance.onstart = () => onStart?.();
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export function isDeviceVoiceAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function stopDeviceVoice(): void {
  if (isDeviceVoiceAvailable()) window.speechSynthesis.cancel();
}
