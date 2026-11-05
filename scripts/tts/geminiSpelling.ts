/**
 * The text the Gemini Hebrew voice is given for a clip. Gemini reads Hebrew by context, so most
 * lines go as written, with no instructions: an instruction in the text is read aloud, and naming
 * the listener ("to a girl") doesn't change the forms it uses. Checked by ear (2026-10):
 * - a word written the same for a girl and a boy ("בנית") is read in either form, so each clip gets
 *   that one word in niqqud for its listener (בָּנִיתְּ banit / בָּנִיתָ banita; the closing sheva
 *   and dagesh mark the girl's form, as in שָׁמַעַתְּ: sheva alone, or none, often gave banita);
 * - a few words it misreads get niqqud too (ובחרי as uvhari, לחץ as lahetz).
 * Azure's IPA list (api/_lib/hebrewPronunciation.ts) stays for the online voice.
 */
import { LISTENER_GENDERED_WORDS, parseListenerGender } from '../../src/services/tts/ttsText';

/**
 * The words of LISTENER_GENDERED_WORDS, plus רואה: in a line said to the learner, "אני רואה" is the
 * learner speaking ("קראת משפט שלם: 'אני רואה תרנגולת'"), so it takes their form too.
 */
type GenderedWord = (typeof LISTENER_GENDERED_WORDS)[number] | 'רואה';

/** A girl's form of each word that reads by gender. */
export const GEMINI_GIRL_FORMS: Record<GenderedWord, string> = {
  // Shva plus dagesh, like the other girl forms: with the shva alone (בָּנִיתְ) Gemini said banita in
  // many takes; this one was banit in 3 of 3 (2026-11 spelling test)
  בנית: 'בָּנִיתְּ',
  שמעת: 'שָׁמַעַתְּ',
  ששמעת: 'שֶׁשָּׁמַעַתְּ',
  קראת: 'קָרָאתְ',
  סיימת: 'סִייַּמְתְּ',
  דילגת: 'דִּילַגְתְּ',
  אותך: 'אוֹתָךְ',
  שלך: 'שֶׁלָּךְ',
  // "Great!" is feminine (me'ula) for a girl and masculine (me'ule) for a boy
  מעולה: 'מְעֻלָּה',
  רואה: 'רוֹאָה',
};

/** A boy's form: without niqqud Gemini sometimes says the girl's (בנית as banit). */
export const GEMINI_BOY_FORMS: Record<GenderedWord, string> = {
  בנית: 'בָּנִיתָ',
  שמעת: 'שָׁמַעְתָּ',
  ששמעת: 'שֶׁשָּׁמַעְתָּ',
  קראת: 'קָרָאתָ',
  סיימת: 'סִייַּמְתָּ',
  דילגת: 'דִּילַגְתָּ',
  אותך: 'אוֹתְךָ',
  שלך: 'שֶׁלְּךָ',
  מעולה: 'מְעֻלֶּה',
  רואה: 'רוֹאֶה',
};

/** Words Gemini misreads without niqqud, for every listener. Add one only after hearing it wrong. */
export const GEMINI_SPELLINGS: Readonly<Record<string, string>> = {
  ובחרי: 'וּבִחְרִי',
  // Segol, not tsere: by ear (2026-10) הַקְשֵׁב still came out hakshiv in 4 of 6 takes, הַקְשֶׁב never
  הקשב: 'הַקְשֶׁב',
  והקשב: 'וְהַקְשֶׁב',
  // Qamatz: by ear (2026-10) לְחַץ still came out lahetz in 5 of 18 takes, לְחָץ never
  לחץ: 'לְחָץ',
  וקרא: 'וּקְרָא',
  // "be-BOS" (in the boss), stress on the last syllable; unvoweled it was read "Babos"
  בבוס: 'בְּבּוֹס',
  // Heard wrong in the 2026-10 review, and right once voweled (the listening lab, scripts/tts/geminiLab.ts)
  קראי: 'קִרְאִי',
  קראו: 'קִרְאוּ',
  וקראי: 'וְקִרְאִי',
  אמרו: 'אִמְרוּ',
  חשבו: 'חִשְׁבוּ',
  מטרייה: 'מִטְרִיָּה',
  דובי: 'דּוּבִי',
  לאוגר: 'לָאוֹגֵר',
  מצדף: 'מִצֶּדֶף',
  מיטה: 'מִטָּה',
  לימון: 'לִימוֹן',
  תרנגולת: 'תַּרְנְגֹלֶת',
  זו: 'זוֹ',
};

/**
 * Whole lines that come out with an English accent even when each word is right: all of it goes in
 * niqqud, which keeps Gemini on Hebrew sounds. Keyed by the line without its trailing punctuation.
 */
export const GEMINI_FULL_NIQQUD: Readonly<Record<string, string>> = {
  'הקשב ואמור את המילה בקול': 'הַקְשֶׁב וֶאֱמוֹר אֶת הַמִּלָּה בְּקוֹל',
  'הקשיבי ואמרי את המילה בקול': 'הַקְשִׁיבִי וְאִמְרִי אֶת הַמִּלָּה בְּקוֹל',
};

const TRAILING_PUNCTUATION = /[\s:.!?]*$/;

function applyFullNiqqud(text: string): string {
  const punctuation = TRAILING_PUNCTUATION.exec(text)?.[0] ?? '';
  const line = text.slice(0, text.length - punctuation.length);
  const voweled = GEMINI_FULL_NIQQUD[line];
  return voweled ? voweled + punctuation : text;
}

const HEBREW_LETTER = '\\u05d0-\\u05ea';

function replaceWords(text: string, spellings: Readonly<Record<string, string>>): string {
  const words = Object.keys(spellings);
  if (words.length === 0) return text;
  const pattern = new RegExp(`(?<![${HEBREW_LETTER}])(${words.join('|')})(?![${HEBREW_LETTER}])`, 'g');
  return text.replace(pattern, (word) => spellings[word] ?? word);
}

/**
 * English letters it reads as Hebrew words, by their name: "האות Z" came out as ze (זה). Only a
 * capital letter standing alone; the screen still shows the letter.
 */
export const GEMINI_LETTER_NAMES: Readonly<Record<string, string>> = {
  Z: 'Zed',
};

const LONE_LETTER = /(?<![A-Za-z])([A-Z])(?![A-Za-z])/g;

/** The letters' English names. A Latin letter alone in a Hebrew sentence is sometimes not read at all ("M: אותה אות"). */
const ENGLISH_LETTER_NAMES: Readonly<Record<string, string>> = {
  A: 'Ay', B: 'Bee', C: 'Cee', D: 'Dee', E: 'E', F: 'Eff', G: 'Gee', H: 'Aitch', I: 'Eye', J: 'Jay', K: 'Kay', L: 'El', M: 'Em',
  N: 'En', O: 'Oh', P: 'Pee', Q: 'Cue', R: 'Ar', S: 'Ess', T: 'Tee', U: 'You', V: 'Vee', W: 'Double-u', X: 'Ex', Y: 'Why', Z: 'Zed',
};

/**
 * "B b: אותה אות, גדולה וקטנה" (a capital and its small form on the screen) was read as the letter
 * twice, "bee bee" (2026-11, by ear). Said once, by its name: the Hebrew that follows names both forms.
 */
const LETTER_PAIR = /(?<![A-Za-z])([A-Z]) \1(?![A-Za-z])/gi;

function sayLetterPairOnce(text: string): string {
  return text.replace(LETTER_PAIR, (_pair, letter: string) => ENGLISH_LETTER_NAMES[letter.toUpperCase()] ?? letter);
}

/**
 * "6 six מסתיים באות X": the numeral and its word were read as "six six" (2026-11, by ear). The word
 * alone is heard; the screen keeps the numeral.
 */
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const NUMERAL_BEFORE_WORD = /(?<![\w.])(\d{1,2}) ([A-Za-z]+)(?![A-Za-z])/g;

function dropNumeralBeforeItsWord(text: string): string {
  return text.replace(NUMERAL_BEFORE_WORD, (match, numeral: string, word: string) =>
    NUMBER_WORDS[Number(numeral)] === word.toLowerCase() ? word : match,
  );
}

/** A line about letters ("…שייכת לאות…") has its lone Latin letters, capital or small, read by name; elsewhere "I" and "a" are words. */
const LETTER_LINE = /אות(?![א-ת])/;
const ANY_LONE_LETTER = /(?<![A-Za-z'’/])([A-Za-z])(?![A-Za-z'’/])/g;

function sayLoneLettersByName(text: string): string {
  if (!LETTER_LINE.test(text)) return text;
  return text.replace(ANY_LONE_LETTER, (letter) => ENGLISH_LETTER_NAMES[letter.toUpperCase()] ?? letter);
}

/** A Hebrew clip's text (maybe tagged `[to:girl] …`) as Gemini reads it. */
export function toGeminiText(clipText: string): string {
  const { gender, text } = parseListenerGender(clipText);
  const forms = gender === 'girl' ? GEMINI_GIRL_FORMS : gender === 'boy' ? GEMINI_BOY_FORMS : null;
  const paired = sayLoneLettersByName(sayLetterPairOnce(dropNumeralBeforeItsWord(text)));
  const whole = applyFullNiqqud(paired);
  if (whole !== paired) return withFinalStop(whole);
  const forListener = forms ? replaceWords(paired, forms) : paired;
  return withFinalStop(replaceWords(forListener, GEMINI_SPELLINGS).replace(LONE_LETTER, (letter) => GEMINI_LETTER_NAMES[letter] ?? letter));
}

const ENDS_WITH_PUNCTUATION = /[.!?:;,…—"”')]$/;

/**
 * A sentence with no closing mark came out sounding like a question (2026-11, by ear). A full stop
 * is not read aloud and keeps the ending falling. Single words (vault, letters) stay as they are.
 */
function withFinalStop(text: string): string {
  const line = text.trimEnd();
  return /\s/.test(line) && !ENDS_WITH_PUNCTUATION.test(line) ? `${line}.` : text;
}
