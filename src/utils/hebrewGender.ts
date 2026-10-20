import { LearnerGender } from '../types/learner';

/**
 * Returns gender-inflected Hebrew strings so the app speaks naturally
 * to a female ("בת") or male ("בן") student throughout all screens.
 */
export function getHebrewCopy(gender: LearnerGender, name: string) {
  const isGirl = gender === 'girl';
  const cleanName = name.trim() || (isGirl ? 'אלופה' : 'אלוף');

  return {
    welcomeTitle: isGirl
      ? `ברוכה הבאה, ${cleanName}! איזה כיף שחזרת ✨`
      : `ברוך הבא, ${cleanName}! איזה כיף שחזרת ✨`,
    onboardingSubtitle: isGirl
      ? 'בואי נכיר אותך כדי שנתאים את המשימות, הקול והאתגרים בדיוק בשבילך!'
      : 'בוא נכיר אותך כדי שנתאים את המשימות, הקול והאתגרים בדיוק בשבילך!',
    readyForMission: isGirl
      ? `${cleanName}, מוכנה למשימה היומית שלך?`
      : `${cleanName}, מוכן למשימה היומית שלך?`,
    chooseTierPrompt: isGirl
      ? 'בחרי את רמת הקושי למשימה של היום:'
      : 'בחר את רמת הקושי למשימה של היום:',
    startMissionCta: isGirl
      ? 'התחילי משימה בלחיצה אחת'
      : 'התחל משימה בלחיצה אחת',
    championBadge: isGirl ? 'אלופת האנגלית' : 'אלוף האנגלית',
    youLearnedWords: (count: number) =>
      isGirl ? `למדת כבר ${count} מילים חדשות!` : `למדת כבר ${count} מילים חדשות!`,
    keepStreakAlive: isGirl
      ? 'שמרי על הרצף היומי שלך וקבלי יהלומים כפולים!'
      : 'שמור על הרצף היומי שלך וקבל יהלומים כפולים!',
    pronunciationPrompt: isGirl
      ? 'הקשיבי למשפט ואז הקליטי את עצמך קוראת אותו בקול:'
      : 'הקשב למשפט ואז הקלט את עצמך קורא אותו בקול:',
    cloudSyncModalSubtitle: isGirl
      ? 'התחברי כדי שהכוכבים, היהלומים והרצף שלך יישמרו בענן ויסתנכרנו בין הטלפון למחשב!'
      : 'התחבר כדי שהכוכבים, היהלומים והרצף שלך יישמרו בענן ויסתנכרנו בין הטלפון למחשב!',
    loggedInAs: (label: string) =>
      isGirl ? `מחוברת בתור ${label}` : `מחובר בתור ${label}`,
    localGuestTapToSync: isGirl
      ? 'שמור במכשיר (לחצי לסנכרון ☁️)'
      : 'שמור במכשיר (לחץ לסנכרון ☁️)',
  };
}

/**
 * Replaces common feminine instructional phrases and verbs with their
 * masculine equivalents when `gender === 'boy'`, and vice versa when needed.
 */
export function inflectHebrew(text: string, gender: LearnerGender): string {
  if (!text) return text;
  if (gender === 'girl') {
    // If the base text is already female-oriented, return it.
    // Also handle any stray masculine words that should be female for a girl.
    return text;
  }

  // Multi-word phrases first (order matters to avoid partial substring collisions)
  const phraseReplacements: [RegExp, string][] = [
    [/שימי לב/g, 'שים לב'],
    [/הקליטי את עצמך קוראת/g, 'הקלט את עצמך קורא'],
    [/הקליטי את עצמך/g, 'הקלט את עצמך'],
    [/בלשית הדקדוק/g, 'בלש הדקדוק'],
    [/כתר הבלשית/g, 'כתר הבלש'],
    [/חקירת הבלשית/g, 'חקירת הבלש'],
    [/כתר אלופת האנגלית/g, 'כתר אלוף האנגלית'],
    [/אלופת האנגלית/g, 'אלוף האנגלית'],
    [/בטוחה בעצמך/g, 'בטוח בעצמך'],
    [/החברות שלך/g, 'החברים שלך'],
    [/חברות שלך/g, 'חברים שלך'],
    [/נסי שוב/g, 'נסה שוב'],
    [/תלמידת כיתה/g, 'תלמיד כיתה'],
    [/שומרת שבת/g, 'שומר שבת'],
    [/ברוכה הבאה/g, 'ברוך הבא'],
    [/ברוכה השבה/g, 'ברוך השב'],
    [/לא יכולה לדבר/g, 'לא יכול לדבר'],
    [/ממשיכות לשלב/g, 'ממשיכים לשלב'],
    [/היעזרי ברמז/g, 'היעזר ברמז'],
    [/האזנה בלבד/g, 'האזנה בלבד'],
    [/אשרי גישה/g, 'אשר גישה'],
    [/את אלופה/g, 'אתה אלוף'],
    [/למי שצוברת כוכבים ומתמידה/g, 'למי שצובר כוכבים ומתמיד'],
  ];

  let result = text;
  for (const [pattern, replacement] of phraseReplacements) {
    result = result.replace(pattern, replacement);
  }

  // Exact single-word boundaries (using Hebrew character range lookarounds).
  // Leave out forms that are also common nouns or adjectives: שלבי (stages of), עברי (Hebrew),
  // גלי (waves of), עני (poor). Instruction templates don't use them as imperatives.
  const wordReplacements: [string, string][] = [
    ['אלופה', 'אלוף'],
    ['בחרי', 'בחר'],
    ['השלימי', 'השלם'],
    ['לחצי', 'לחץ'],
    ['הקשיבי', 'הקשב'],
    ['חזרי', 'חזור'],
    ['האזיני', 'האזן'],
    ['קראי', 'קרא'],
    ['הקליטי', 'הקלט'],
    ['נסי', 'נסה'],
    ['בדקי', 'בדוק'],
    ['סמני', 'סמן'],
    ['הרכיבי', 'הרכב'],
    ['זכרי', 'זכור'],
    ['פתרי', 'פתור'],
    ['תרגלי', 'תרגל'],
    ['בואי', 'בוא'],
    ['סיימי', 'סיים'],
    ['אמרי', 'אמור'],
    ['זכי', 'זכה'],
    ['חפשי', 'חפש'],
    ['השיגי', 'השג'],
    ['התחילי', 'התחל'],
    ['התחברי', 'התחבר'],
    ['מחוברת', 'מחובר'],
    ['מוכנה', 'מוכן'],
    ['יכולה', 'יכול'],
    ['בלשית', 'בלש'],
    ['מתכננות', 'מתכננים'],
    ['תתחדשי', 'תתחדש'],
    ['תוכלי', 'תוכל'],
    ['תצליחי', 'תצליח'],
    ['קוראת', 'קורא'],
  ];

  for (const [femaleWord, maleWord] of wordReplacements) {
    const regex = new RegExp(`(?:^|(?<=[^א-ת־]))([ושכלבמ]*)${femaleWord}(?=[^א-ת־]|$)`, 'g');
    result = result.replace(regex, (_match, prefix) => `${prefix}${maleWord}`);
  }

  // Fix emoji detectives if present
  result = result.replace(/🕵️‍♀️/g, '🕵️‍♂️');

  return result;
}

/**
 * Tagged template that inflects only the literal template text, never the values put into it,
 * so learner-facing instructions follow the gender while story text and authored data stay as written.
 * With `const he = hebrewTemplate(gender)`, he`קראי את הסיפור. ${questionHe}` inflects "קראי" only.
 */
export function hebrewTemplate(gender: LearnerGender) {
  return (strings: TemplateStringsArray, ...values: unknown[]): string =>
    strings.reduce(
      (text, part, i) => `${text}${inflectHebrew(part, gender)}${i < values.length ? String(values[i]) : ''}`,
      ''
    );
}

/** Hebrew final letters and their regular forms, for appending a suffix to a stem or ending a word. */
const FINAL_TO_REGULAR: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' };
const REGULAR_TO_FINAL: Record<string, string> = { כ: 'ך', מ: 'ם', נ: 'ן', פ: 'ף', צ: 'ץ' };

/** "Word/suffix" pairs authored for both genders, e.g. אוהב/ת, החבר/ה, עומדים/ות, תוכל/י. */
const GENDER_SLASH_PATTERN = /(?<![א-ת])([א-ת]+)\/(ית|ות|ה|ת|י)(?![א-ת])/g;

function toRegularLastLetter(stem: string): string {
  const last = stem.slice(-1);
  return FINAL_TO_REGULAR[last] ? `${stem.slice(0, -1)}${FINAL_TO_REGULAR[last]}` : stem;
}

function toFinalLastLetter(stem: string): string {
  const last = stem.slice(-1);
  return REGULAR_TO_FINAL[last] ? `${stem.slice(0, -1)}${REGULAR_TO_FINAL[last]}` : stem;
}

function resolveSlashPair(stem: string, suffix: string, gender: LearnerGender): string {
  if (stem === 'את' && suffix === 'ה') return gender === 'girl' ? 'את' : 'אתה';
  if (gender === 'boy') return toFinalLastLetter(stem);
  if (suffix === 'ות' && stem.endsWith('ים')) return `${stem.slice(0, -2)}ות`;
  // שותה/ת, עושה/ה, מכבה/ת: the feminine form is the same word
  if (stem.endsWith('ה') && (suffix === 'ה' || suffix === 'ת')) return stem;
  return `${toRegularLastLetter(stem)}${suffix}`;
}

/**
 * Resolves authored "word/suffix" gender pairs to the learner's form:
 * "אני אוהב/ת" → "אני אוהבת" for a girl, "אני אוהב" for a boy; "את/ה" → "את" / "אתה".
 * Pairs that are not gender suffixes (כן/לא) are left as written.
 */
export function resolveGenderSlashes(text: string, gender: LearnerGender): string {
  if (!text || !text.includes('/')) return text;
  return text.replace(GENDER_SLASH_PATTERN, (_match, stem: string, suffix: string) =>
    resolveSlashPair(stem, suffix, gender)
  );
}
