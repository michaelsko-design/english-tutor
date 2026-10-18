export type VoicePreference = 'female' | 'male';

export const DEFAULT_VOICE_PREFERENCE: VoicePreference = 'female';

export interface VoiceInfo {
  name: string;
  lang: string;
}

const FEMALE_NAMES =
  /\b(aria|jenny|samantha|zira|susan|karen|moira|tessa|serena|victoria|allison|ava|libby|sonia|emma|female)\b|google us english/i;
const MALE_NAMES = /\b(david|mark|guy|alex|daniel|fred|george|ryan|james|tom|male)\b/i;
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

export function speakWithVoice(text: string, rate: number, preference: VoicePreference): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  const voice = pickVoice(loadVoices(), preference);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }
  window.speechSynthesis.speak(utterance);
}
