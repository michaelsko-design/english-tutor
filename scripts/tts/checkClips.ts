/** Lists corpus phrases with no rendered clip: `npm run tts:check -- [--voice female|male]`. */
import { collectCorpus, collectSkippedPhrases } from './corpus';
import { readManifest } from './clipManifest';

const HEBREW = /[֐-׿]/;
const LATIN_LETTER = /\p{Script=Latin}/u;

const index = process.argv.indexOf('--voice');
const voice = index >= 0 ? process.argv[index + 1] : 'female';
const manifest = readManifest();
const rendered = new Set(manifest?.voices[voice as 'female' | 'male'] ?? []);
const missing = collectCorpus().filter((phrase) => !rendered.has(phrase.key));
// Text with Hebrew is meant for the device voice; English left out of the corpus is a gap.
const skippedEnglish = collectSkippedPhrases().filter((text) => LATIN_LETTER.test(text) && !HEBREW.test(text));

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
