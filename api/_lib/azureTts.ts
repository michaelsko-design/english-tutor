/**
 * Azure Neural text-to-speech, shared by the /api/tts proxy and the clip render script
 * (scripts/tts/renderClips.ts). Voices and prosody live here only, so changing a voice is one edit
 * (and a re-render of the clips).
 */
import { splitLangRuns, type ClipVoice, type TtsSpeed } from '../../src/services/tts/ttsText.js';

export type TtsVoiceId = ClipVoice;

/**
 * Hebrew is read by a multilingual voice: it speaks the Hebrew and switches to native English for
 * the English words inside an instruction ("מעולה! cat פירושו חתול"). Chosen by ear over
 * he-IL-HilaNeural, which reads those words with a Hebrew accent.
 */
export const AZURE_VOICE_NAMES: Record<TtsVoiceId, string> = {
  female: 'en-US-JennyNeural',
  male: 'en-US-GuyNeural',
  'he-female': 'en-US-AvaMultilingualNeural',
};

const XML_LANG = { en: 'en-US', he: 'he-IL' } as const;

const PROSODY_RATE: Record<TtsSpeed, string> = {
  normal: '-8%',
  slow: '-30%',
};

/** Silence before the speech, so a phone or Bluetooth speaker that wakes up late doesn't cut the first sound. */
const LEADING_BREAK_MS = 200;

export const AZURE_OUTPUT_FORMAT = 'audio-24khz-48kbitrate-mono-mp3';

export interface AzureConfig {
  key: string;
  region: string;
}

export class AzureTtsError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'AzureTtsError';
  }
}

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Hebrew text as <lang> runs, so the multilingual voice switches language at each English word. */
function buildHebrewBody(text: string, speed: TtsSpeed): string {
  return splitLangRuns(text)
    .map(
      (run) =>
        `<lang xml:lang="${XML_LANG[run.lang]}"><prosody rate="${PROSODY_RATE[speed]}">${escapeXml(run.text)}</prosody></lang>`,
    )
    .join('');
}

export function buildSsml(text: string, voice: TtsVoiceId, speed: TtsSpeed): string {
  const isHebrew = voice === 'he-female';
  const body = isHebrew ? buildHebrewBody(text, speed) : `<prosody rate="${PROSODY_RATE[speed]}">${escapeXml(text)}</prosody>`;
  return (
    `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${isHebrew ? XML_LANG.he : XML_LANG.en}">` +
    `<voice name="${AZURE_VOICE_NAMES[voice]}">` +
    `<break time="${LEADING_BREAK_MS}ms"/>` +
    body +
    `</voice></speak>`
  );
}

/** Reads AZURE_SPEECH_KEY / AZURE_SPEECH_REGION, or null when either is missing. */
export function readAzureConfig(env: Record<string, string | undefined>): AzureConfig | null {
  const key = env.AZURE_SPEECH_KEY?.trim();
  const region = env.AZURE_SPEECH_REGION?.trim();
  if (!key || !region || !/^[a-z0-9]+$/i.test(region)) return null;
  return { key, region };
}

/** Synthesizes one phrase to MP3 bytes. Throws AzureTtsError with Azure's HTTP status on failure. */
export async function synthesize(
  text: string,
  voice: TtsVoiceId,
  speed: TtsSpeed,
  config: AzureConfig,
  timeoutMs: number,
  fetchImpl: typeof fetch = fetch,
): Promise<ArrayBuffer> {
  const response = await fetchImpl(`https://${config.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': config.key,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': AZURE_OUTPUT_FORMAT,
      'User-Agent': 'englishvibe-tts',
    },
    body: buildSsml(text, voice, speed),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    throw new AzureTtsError(`Azure TTS failed with status ${response.status}`, response.status);
  }
  const audio = await response.arrayBuffer();
  if (audio.byteLength === 0) throw new AzureTtsError('Azure TTS returned no audio', 502);
  return audio;
}
