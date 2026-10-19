/** Prints the size of the read-aloud corpus: `npm run tts:corpus`. */
import { collectCorpus, estimateClipBytes } from './corpus';

const phrases = collectCorpus();
const chars = phrases.reduce((sum, phrase) => sum + phrase.text.length, 0);
const bytes = phrases.reduce((sum, phrase) => sum + estimateClipBytes(phrase), 0);
const slow = phrases.filter((phrase) => phrase.speed === 'slow').length;
const words = phrases.filter((phrase) => !phrase.text.includes(' ')).length;

const mb = (value: number) => (value / 1024 / 1024).toFixed(1);
console.log(`Phrases: ${phrases.length} (${words} single words, ${slow} slow clips)`);
console.log(`Characters per voice: ${chars} (both voices: ${chars * 2})`);
console.log(`Estimated size per voice: ${mb(bytes)} MB (both voices: ${mb(bytes * 2)} MB)`);
