/** Lists corpus phrases with no rendered clip: `npm run tts:check -- [--voice female|male|he-female]`. */
import { collectCorpus, collectSkippedPhrases } from './corpus';
import { readManifest } from './clipManifest';
import { HEBREW_VOICE, isTtsVoice } from '../../src/services/tts/ttsText';

const HEBREW = /[֐-׿]/;
const LATIN_LETTER = /\p{Script=Latin}/u;

const index = process.argv.indexOf('--voice');
const voiceArg = index >= 0 ? process.argv[index + 1] : 'female';
if (!isTtsVoice(voiceArg)) throw new Error(`Unknown voice "${voiceArg}"; use female, male or he-female.`);
const voice = voiceArg;
const manifest = readManifest();
const rendered = new Set(manifest?.voices[voice] ?? []);
const missing = collectCorpus(voice).filter((phrase) => !rendered.has(phrase.key));
// English corpus: text with Hebrew is for the Hebrew voice; English left out is a gap.
// Hebrew corpus: anything left out (an unsupported character, too long) is a gap.
const skippedEnglish = collectSkippedPhrases(voice).filter((text) =>
  voice === HEBREW_VOICE ? true : LATIN_LETTER.test(text) && !HEBREW.test(text),
);

if (skippedEnglish.length > 0) {
  skippedEnglish.forEach((text) => console.log(`  skipped: ${text.slice(0, 80)}`));
  console.log(`${skippedEnglish.length} English phrases can't be rendered (unsupported characters or too long); fix isCloudSpeakable or the text.`);
}

if (missing.length === 0) {
  console.log(`${voice}: every corpus phrase has a clip (${rendered.size}).`);
} else {
  missing.slice(0, 40).forEach((phrase) => console.log(`  ${phrase.key} [${phrase.speed}] ${phrase.text.slice(0, 80)}`));
  if (missing.length > 40) console.log(`  ... and ${missing.length - 40} more`);
  console.log(`${voice}: ${missing.length} phrases without a clip. Run npm run tts:render -- --voice ${voice}.`);
}

if (missing.length > 0 || skippedEnglish.length > 0) process.exit(1);
