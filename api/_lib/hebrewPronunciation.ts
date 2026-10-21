/**
 * Hebrew words the voice misreads without niqqud ("הקשב" as hakashev, "שם" as sham), spelled out in
 * IPA for the Hebrew clips. Only the audio changes: the screen text and the clip keys stay as they
 * are. Checked by ear (2026-10): niqqud is misread too, and IPA on every word sounds unnatural, so
 * only ambiguous words are listed.
 *
 * Every IPA spelling splits its syllables with dots and marks the stressed one (ˈ): without the
 * dots the voice stresses the syllable before the mark ("naˈse" came out NAse). A few words get a
 * short pause after them, where the next word ran into them ("ב-B").
 *
 * `pattern` is the word as written, or a phrase with the word in [brackets] when the reading
 * depends on its neighbors ("יש [שם]" is shem, "אני [שם]" is sam).
 */
import type { LISTENER_GENDERED_WORDS, ListenerGender } from '../../src/services/tts/ttsText.js';

export interface PronunciationEntry {
  pattern: string;
  ipa: string;
  pauseAfterMs?: number;
}

export const HEBREW_PRONUNCIATIONS: readonly PronunciationEntry[] = [
  // Commands that would otherwise be read as past tense or with an extra vowel
  { pattern: 'הקשב', ipa: 'hak.ˈʃev' },
  { pattern: 'והקשב', ipa: 've.hak.ˈʃev' },
  { pattern: 'הקשיבי', ipa: 'hak.ˈʃi.vi' },
  { pattern: 'והקשיבי', ipa: 've.hak.ˈʃi.vi' },
  { pattern: 'הקשיבו', ipa: 'hak.ˈʃi.vu' },
  { pattern: 'בחר', ipa: 'ˈbχaʁ' },
  { pattern: 'ובחר', ipa: 'uv.ˈχaʁ' },
  { pattern: 'בחרי', ipa: 'ba.χa.ˈʁi' },
  { pattern: 'ובחרי', ipa: 'u.va.χa.ˈʁi' },
  { pattern: 'לחץ', ipa: 'le.ˈχats' },
  { pattern: 'לחצי', ipa: 'la.χa.ˈtsi' },
  { pattern: 'לחצו', ipa: 'la.χa.ˈtsu' },
  { pattern: 'קרא', ipa: 'ˈkʁa' },
  { pattern: 'וקרא', ipa: 'u.ˈkʁa' },
  { pattern: 'קראי', ipa: 'kiʁ.ˈʔi' },
  { pattern: 'וקראי', ipa: 'u.kiʁ.ˈʔi' },
  { pattern: 'קראו', ipa: 'kiʁ.ˈʔu' },
  { pattern: 'אמור', ipa: 'e.ˈmoʁ' },
  { pattern: 'ואמור', ipa: 've.e.ˈmoʁ' },
  { pattern: 'אמרי', ipa: 'im.ˈʁi' },
  { pattern: 'ואמרי', ipa: 've.im.ˈʁi' },
  { pattern: 'אמרו', ipa: 'im.ˈʁu' },
  // The Boss recap line is built at run time, so it is read by this online voice ("be-BOS", not "Babos")
  { pattern: 'בבוס', ipa: 'be.ˈbos' },
  { pattern: 'נסה', ipa: 'na.ˈse' },
  { pattern: 'ונסה', ipa: 've.na.ˈse' },
  { pattern: 'נסי', ipa: 'na.ˈsi' },
  { pattern: 'ונסי', ipa: 've.na.ˈsi' },
  { pattern: 'נסו', ipa: 'na.ˈsu' },
  { pattern: 'ונסו', ipa: 've.na.ˈsu' },
  { pattern: 'שמע', ipa: 'ˈʃma' },
  { pattern: 'ושמע', ipa: 'u.ˈʃma' },
  { pattern: 'שמעי', ipa: 'ʃim.ˈʔi' },
  { pattern: 'ושמעי', ipa: 'u.ʃim.ˈʔi' },
  { pattern: 'חפש', ipa: 'χa.ˈpes' },
  { pattern: 'חפשי', ipa: 'χap.ˈsi' },
  { pattern: 'חפשו', ipa: 'χap.ˈsu' },
  { pattern: 'הרכב', ipa: 'haʁ.ˈkev' },
  { pattern: 'והרכב', ipa: 've.haʁ.ˈkev' },
  { pattern: 'הרכיבי', ipa: 'haʁ.ˈki.vi' },
  { pattern: 'והרכיבי', ipa: 've.haʁ.ˈki.vi' },
  { pattern: 'בדוק', ipa: 'ˈbdok' },
  { pattern: 'ובדוק', ipa: 'uv.ˈdok' },
  { pattern: 'בדקי', ipa: 'bid.ˈki' },
  { pattern: 'ובדקי', ipa: 'u.vid.ˈki' },
  { pattern: 'בדקו', ipa: 'bid.ˈku' },
  { pattern: 'ובדקו', ipa: 'u.vid.ˈku' },
  { pattern: 'חשבו', ipa: 'χiʃ.ˈvu' },
  { pattern: 'ספרו', ipa: 'sif.ˈʁu' },
  { pattern: 'פתחו', ipa: 'pit.ˈχu' },
  { pattern: 'ופתחו', ipa: 'u.pit.ˈχu' },
  { pattern: 'סגרו', ipa: 'sig.ˈʁu' },
  { pattern: 'הסתכל', ipa: 'his.ta.ˈkel' },
  { pattern: 'הסתכלי', ipa: 'his.tak.ˈli' },
  { pattern: 'הסתכלו', ipa: 'his.tak.ˈlu' },
  { pattern: 'וחזור', ipa: 've.χa.ˈzoʁ' },
  { pattern: 'וחזרי', ipa: 've.χiz.ˈʁi' },
  { pattern: 'השתמש', ipa: 'hiʃ.ta.ˈmeʃ' },
  { pattern: 'השתמשי', ipa: 'hiʃ.tam.ˈʃi' },
  { pattern: 'היעזר', ipa: 'he.ʔa.ˈzeʁ' },
  { pattern: 'היעזרי', ipa: 'he.ʔaz.ˈʁi' },
  { pattern: 'וגעי', ipa: 've.ɡe.ˈʔi' },

  // שם: shem (a name) or sam (puts), by its neighbors
  { pattern: 'יש [שם]', ipa: 'ˈʃem' },
  { pattern: '[שם] העצם', ipa: 'ˈʃem' },
  { pattern: '[שם] עצם', ipa: 'ˈʃem' },
  { pattern: '[לשם] העצם', ipa: 'le.ˈʃem' },
  { pattern: '[שם] הדבר', ipa: 'ˈʃem' },
  { pattern: '[שם] האות', ipa: 'ˈʃem' },
  { pattern: '[שם] החפץ', ipa: 'ˈʃem' },
  { pattern: 'את [השם]', ipa: 'ha.ˈʃem' },
  { pattern: 'אני [שם]', ipa: 'ˈsam' },
  { pattern: 'בן [שם]', ipa: 'ˈsam' },

  // A yes/no pair, said as two words (boy/girl pairs like משחק/ת reach the voice in the learner's form)
  { pattern: 'כן/לא', ipa: 'ˈken o ˈlo' },

  // A one-letter prefix joined to an English word ("ב-B", "ו-red"), read as a syllable, not a letter name
  { pattern: 'ב-', ipa: 'be', pauseAfterMs: 50 },
  { pattern: 'ו-', ipa: 've' },
  { pattern: 'ה-', ipa: 'ha' },
  { pattern: 'מ-', ipa: 'mi' },
  { pattern: 'ל-', ipa: 'le', pauseAfterMs: 120 },
];

/**
 * The words said to the learner that read by gender (LISTENER_GENDERED_WORDS), in a girl's and a
 * boy's form. Used when the clip is tagged with the learner's gender (`[to:girl] …`).
 */
export const LISTENER_GENDERED_PRONUNCIATIONS: Record<(typeof LISTENER_GENDERED_WORDS)[number], Record<ListenerGender, string>> = {
  בנית: { girl: 'ba.ˈnit', boy: 'ba.ˈni.ta' },
  שמעת: { girl: 'ʃa.ˈmat', boy: 'ʃa.ˈma.ta' },
  ששמעת: { girl: 'ʃe.ʃa.ˈmat', boy: 'ʃe.ʃa.ˈma.ta' },
  קראת: { girl: 'ka.ˈʁat', boy: 'ka.ˈʁa.ta' },
  סיימת: { girl: 'si.ˈjamt', boy: 'si.ˈjam.ta' },
  דילגת: { girl: 'di.ˈlagt', boy: 'di.ˈlag.ta' },
  אותך: { girl: 'o.ˈtaχ', boy: 'ot.ˈχa' },
  שלך: { girl: 'ʃe.ˈlaχ', boy: 'ʃel.ˈχa' },
};

/** A piece of Hebrew text, with the IPA (and pause) to say it with when it is a listed word. */
export interface PronouncedSegment {
  text: string;
  ipa?: string;
  pauseAfterMs?: number;
}

const HEBREW_LETTER = '\\u05d0-\\u05ea';

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\/-]/g, '\\$&');

interface CompiledEntry {
  regex: RegExp;
  ipa: string;
  pauseAfterMs?: number;
}

/** `before [word] after` as a regex whose groups are (before)(word)(after), bounded by non-letters. */
function compileEntry({ pattern, ipa, pauseAfterMs }: PronunciationEntry): CompiledEntry {
  const bracket = /^(.*)\[(.+)\](.*)$/.exec(pattern);
  const [before, word, after] = bracket ? bracket.slice(1) : ['', pattern, ''];
  const source = `(?<![${HEBREW_LETTER}])(${escapeRegExp(before)})(${escapeRegExp(word)})(${escapeRegExp(after)})(?![${HEBREW_LETTER}])`;
  return { regex: new RegExp(source, 'g'), ipa, pauseAfterMs };
}

const COMPILED = HEBREW_PRONUNCIATIONS.map(compileEntry);

const compileGendered = (gender: ListenerGender) =>
  Object.entries(LISTENER_GENDERED_PRONUNCIATIONS).map(([pattern, forms]) => compileEntry({ pattern, ipa: forms[gender] }));

const COMPILED_FOR: Record<ListenerGender, CompiledEntry[]> = {
  girl: [...compileGendered('girl'), ...COMPILED],
  boy: [...compileGendered('boy'), ...COMPILED],
};

interface Mark {
  start: number;
  end: number;
  ipa: string;
  pauseAfterMs?: number;
}

/**
 * Splits Hebrew text into plain pieces and listed words, the first match winning where entries
 * overlap. With the learner's gender, words like "בנית" are spelled in their form too.
 */
export function markPronunciations(text: string, gender: ListenerGender | null = null): PronouncedSegment[] {
  const marks: Mark[] = [];
  for (const { regex, ipa, pauseAfterMs } of gender ? COMPILED_FOR[gender] : COMPILED) {
    for (const match of text.matchAll(regex)) {
      const start = (match.index ?? 0) + match[1].length;
      const end = start + match[2].length;
      if (!marks.some((mark) => start < mark.end && end > mark.start)) marks.push({ start, end, ipa, pauseAfterMs });
    }
  }
  const sorted = [...marks].sort((a, b) => a.start - b.start);
  const segments: PronouncedSegment[] = [];
  let last = 0;
  for (const { start, end, ipa, pauseAfterMs } of sorted) {
    if (start > last) segments.push({ text: text.slice(last, start) });
    segments.push({ text: text.slice(start, end), ipa, ...(pauseAfterMs ? { pauseAfterMs } : {}) });
    last = end;
  }
  if (last < text.length) segments.push({ text: text.slice(last) });
  return segments;
}
