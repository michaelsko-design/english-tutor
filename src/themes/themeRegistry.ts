import { CompanionId, GradeId, ProficiencyTier, ThemeId, TodaysMissionSuggestion } from '../types/learner';
import { buildThemeArt, ThemeArt } from './themeArt';
import { CompanionDefinition, getCompanion, getCompanionRim, IS_ART_PREVIEW } from './companionRegistry';

export type ThemeAudience = 'young' | 'teen';

/** A theme's look, without the mascot (`ThemeDefinition` adds the learner's mascot). */
export interface ThemeBase {
  id: ThemeId;
  name: string;
  /** A dark page: the `dark:` colours apply (tailwind darkMode 'class', set by App) */
  isDark: boolean;
  /** The browser bar colour (meta theme-color) */
  themeColor: string;
  optionLabel: string;
  taglineEn: string;
  taglineHe: string;
  /** The mascot of a learner who hasn't chosen one */
  defaultCompanionId: CompanionId;
  /** Playful themes for younger learners, or calmer grown-up ones; the picker groups them */
  audience: ThemeAudience;
  /** Offered in the picker; a theme stays hidden (except on the dev server) until its art is in */
  isReleased: boolean;
  currencyNameEn: string;
  currencyNameHe: string;
  shopTitleHe: string;
  // Pluggable layout & visual tokens
  pageBgClass: string;
  cardBgClass: string;
  heroCardClass: string;
  hudBgClass: string;
  primaryBtnClass: string;
  secondaryBtnClass: string;
  badgeClass: string;
  accentTextClass: string;
  mutedTextClass: string;
  inputBgClass: string;
  /** Generated scene art for this theme (Feature 25) */
  art: ThemeArt;
  /**
   * The folder of this theme's own landmarks, chests, Boss and level badge
   * (/art/landmarks/<folder>, /art/common/<folder>), or null for the shared set.
   * Set it only once the theme's whole set is in public/art, so no stop falls back to an emoji.
   */
  missionArtFolder: string | null;
}

/** The theme the app draws with: its look plus the learner's mascot. */
export interface ThemeDefinition extends ThemeBase {
  companion: CompanionDefinition;
  /** CSS filter drawn around the mascot art, or null (a light rim for dark art on a dark theme) */
  companionRim: string | null;
}

export const DEFAULT_THEME_ID: ThemeId = 'cozy-studio';

export const THEME_BASES: Record<ThemeId, ThemeBase> = {
  'cozy-studio': {
    id: 'cozy-studio',
    isDark: false,
    themeColor: '#9333ea',
    name: 'Cozy',
    optionLabel: 'Option B: Cozy Pastel Studio (Default)',
    taglineEn: 'Aesthetic Journal, Café Quests & Sticker Studio',
    taglineHe: 'סטודיו פסטל חמים, יומן מדבקות ומשימות קפה וטיולים',
    defaultCompanionId: 'mochi',
    audience: 'young',
    isReleased: true,
    currencyNameEn: 'Diamonds',
    currencyNameHe: 'יהלומים',
    shopTitleHe: 'חדר מעוצב ואלבום מדבקות',
    pageBgClass:
      'bg-gradient-to-br from-rose-50 via-purple-50 to-amber-50 text-slate-800',
    cardBgClass:
      'bg-white/90 backdrop-blur-md border border-purple-200/80 shadow-sm shadow-purple-200/40',
    heroCardClass:
      'bg-gradient-to-r from-white via-rose-50/90 to-purple-100/90 border-2 border-purple-300 shadow-xl shadow-purple-200/50',
    hudBgClass:
      'bg-white/85 backdrop-blur-md border-b border-purple-200/80 shadow-sm',
    primaryBtnClass:
      'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-rose-400 text-white shadow-lg shadow-purple-300/60 hover:brightness-105 active:scale-[0.99]',
    secondaryBtnClass:
      'bg-purple-100/80 hover:bg-purple-200/80 text-purple-900 border border-purple-200',
    badgeClass:
      'bg-purple-100 border border-purple-300 text-purple-800',
    accentTextClass: 'text-purple-700',
    mutedTextClass: 'text-slate-600',
    inputBgClass:
      'bg-white border border-purple-200 text-slate-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200',
    art: buildThemeArt('cozy-studio'),
    missionArtFolder: null,
  },
  'neon-pop': {
    id: 'neon-pop',
    isDark: true,
    themeColor: '#4a044e',
    name: 'Pop',
    optionLabel: 'Option A: Neon Pop & Social Quest',
    taglineEn: 'Backstage Pass, Group Chats & Pop Music Quests',
    taglineHe: 'אווירת פופ ומוזיקה, צ׳אטים עם חברים ואתגרי קצב',
    defaultCompanionId: 'dj-beat',
    audience: 'young',
    isReleased: true,
    currencyNameEn: 'Diamonds',
    currencyNameHe: 'יהלומים',
    shopTitleHe: 'סטודיו מוזיקה ולוקים לאווטאר',
    pageBgClass:
      'bg-gradient-to-br from-fuchsia-950 via-purple-950 to-indigo-950 text-white',
    cardBgClass:
      'bg-white/10 backdrop-blur-md border border-white/15 shadow-lg shadow-black/20',
    heroCardClass:
      'bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 border-2 border-pink-400/60 shadow-xl shadow-pink-950/50',
    hudBgClass:
      'bg-white/10 backdrop-blur-md border-b border-white/15',
    primaryBtnClass:
      'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-[0.99]',
    secondaryBtnClass:
      'bg-white/10 hover:bg-white/20 text-white border border-white/20',
    badgeClass:
      'bg-pink-500/20 border border-pink-400/40 text-pink-200',
    accentTextClass: 'text-pink-300',
    mutedTextClass: 'text-purple-200/80',
    inputBgClass:
      'bg-black/30 border border-white/25 text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30',
    art: buildThemeArt('neon-pop'),
    missionArtFolder: null,
  },
  'starlight-rpg': {
    id: 'starlight-rpg',
    isDark: true,
    themeColor: '#020617',
    name: 'Stars',
    optionLabel: 'Option C: Starlight Academy RPG',
    taglineEn: 'Cosmic Mysteries, Spell Codes & Pet Evolution',
    taglineHe: 'אקדמיית הכוכבים, תעלומות קסם ושדרוג חיית מחמד',
    defaultCompanionId: 'comet',
    audience: 'young',
    isReleased: true,
    currencyNameEn: 'Diamonds',
    currencyNameHe: 'יהלומים',
    shopTitleHe: 'מקדש הכוכבים ושדרוג השועל',
    pageBgClass:
      'bg-gradient-to-br from-slate-950 via-indigo-950 to-cyan-950 text-cyan-50',
    cardBgClass:
      'bg-slate-900/75 backdrop-blur-md border border-cyan-400/25 shadow-lg shadow-cyan-950/40',
    heroCardClass:
      'bg-gradient-to-r from-slate-900/90 via-indigo-950/90 to-cyan-900/60 border-2 border-cyan-400/60 shadow-xl shadow-cyan-950/60',
    hudBgClass:
      'bg-slate-900/85 backdrop-blur-md border-b border-cyan-500/30',
    primaryBtnClass:
      'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-[0.99]',
    secondaryBtnClass:
      'bg-slate-800/80 hover:bg-slate-700/80 text-cyan-100 border border-cyan-500/30',
    badgeClass:
      'bg-cyan-500/20 border border-cyan-400/40 text-cyan-200',
    accentTextClass: 'text-cyan-300',
    mutedTextClass: 'text-cyan-200/75',
    inputBgClass:
      'bg-slate-900/90 border border-cyan-400/30 text-cyan-50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30',
    art: buildThemeArt('starlight-rpg'),
    missionArtFolder: null,
  },
  // Grown-up themes for older learners: flat surfaces, one accent colour, no glow
  'focus-desk': {
    id: 'focus-desk',
    isDark: false,
    themeColor: '#0f766e',
    name: 'Focus',
    optionLabel: 'Focus: Clean Study Desk',
    taglineEn: 'Study Desk, Clear Goals & Calm Focus',
    taglineHe: 'שולחן עבודה נקי, מטרות ברורות וריכוז רגוע',
    defaultCompanionId: 'sage',
    audience: 'teen',
    isReleased: true,
    currencyNameEn: 'Diamonds',
    currencyNameHe: 'יהלומים',
    shopTitleHe: 'פינת העבודה והסגנון האישי',
    pageBgClass: 'bg-[#f6f4ef] text-slate-800',
    cardBgClass: 'bg-white border border-stone-200 shadow-sm',
    heroCardClass: 'bg-white border border-stone-300 border-s-4 border-s-teal-600 shadow-md shadow-stone-300/40',
    hudBgClass: 'bg-[#f6f4ef]/90 backdrop-blur-md border-b border-stone-200',
    primaryBtnClass: 'bg-teal-700 text-white shadow-sm hover:bg-teal-800 active:scale-[0.99]',
    secondaryBtnClass: 'bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-300',
    badgeClass: 'bg-teal-50 border border-teal-200 text-teal-800',
    accentTextClass: 'text-teal-700',
    mutedTextClass: 'text-slate-600',
    inputBgClass:
      'bg-white border border-stone-300 text-slate-800 focus:border-teal-600 focus:ring-2 focus:ring-teal-100',
    art: buildThemeArt('focus-desk'),
    missionArtFolder: 'focus-desk',
  },
  'urban-night': {
    id: 'urban-night',
    isDark: true,
    themeColor: '#16181d',
    name: 'Street',
    optionLabel: 'Street: City at Night',
    taglineEn: 'City Nights, Street Art & Skate Sessions',
    taglineHe: 'לילות בעיר, אמנות רחוב וסשן סקייט',
    defaultCompanionId: 'kai',
    audience: 'teen',
    isReleased: true,
    currencyNameEn: 'Diamonds',
    currencyNameHe: 'יהלומים',
    shopTitleHe: 'הסטודיו בעיר והסטייל שלך',
    pageBgClass: 'bg-[#16181d] text-zinc-100',
    cardBgClass: 'bg-zinc-900 border border-zinc-700/80 shadow-md shadow-black/30',
    heroCardClass: 'bg-zinc-900 border-2 border-lime-400/70 shadow-lg shadow-black/40',
    hudBgClass: 'bg-[#16181d]/90 backdrop-blur-md border-b border-zinc-800',
    primaryBtnClass: 'bg-lime-400 text-zinc-950 shadow-sm hover:bg-lime-300 active:scale-[0.99]',
    secondaryBtnClass: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-600',
    badgeClass: 'bg-lime-400/15 border border-lime-400/40 text-lime-300',
    accentTextClass: 'text-lime-400',
    mutedTextClass: 'text-zinc-400',
    inputBgClass:
      'bg-zinc-950 border border-zinc-600 text-zinc-100 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/30',
    art: buildThemeArt('urban-night'),
    missionArtFolder: 'urban-night',
  },
  'travel-journal': {
    id: 'travel-journal',
    isDark: false,
    themeColor: '#1e3a5f',
    name: 'Journey',
    optionLabel: 'Journey: Travel Journal',
    taglineEn: 'Boarding Passes, Field Notes & World Routes',
    taglineHe: 'כרטיסי טיסה, יומן מסע ומסלולים בעולם',
    defaultCompanionId: 'atlas',
    audience: 'teen',
    isReleased: true,
    currencyNameEn: 'Diamonds',
    currencyNameHe: 'יהלומים',
    shopTitleHe: 'תיק הגב ומזכרות מהדרך',
    pageBgClass: 'bg-[#f3ead8] text-[#1f2a37]',
    cardBgClass: 'bg-[#fffaf0] border border-[#d9c7a3] shadow-sm shadow-amber-900/10',
    heroCardClass: 'bg-[#fffaf0] border-2 border-dashed border-[#1e3a5f]/40 shadow-md shadow-amber-900/10',
    hudBgClass: 'bg-[#f3ead8]/90 backdrop-blur-md border-b border-[#d9c7a3]',
    primaryBtnClass: 'bg-[#1e3a5f] text-[#fffaf0] shadow-sm hover:bg-[#274b78] active:scale-[0.99]',
    secondaryBtnClass: 'bg-[#e8dcc2] hover:bg-[#dfd0b0] text-[#1f2a37] border border-[#c9b48a]',
    badgeClass: 'bg-[#5b6b3a]/10 border border-[#5b6b3a]/40 text-[#3f4d24]',
    accentTextClass: 'text-[#5b6b3a]',
    mutedTextClass: 'text-[#5a5346]',
    inputBgClass:
      'bg-[#fffaf0] border border-[#c9b48a] text-[#1f2a37] focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20',
    art: buildThemeArt('travel-journal'),
    missionArtFolder: null,
  },
};

export const THEME_IDS = Object.keys(THEME_BASES) as ThemeId[];

/** The themes the picker offers: the released ones, plus the chosen one so it never disappears. */
export function getPickableThemeIds(chosenId?: ThemeId, isPreview = IS_ART_PREVIEW): ThemeId[] {
  return THEME_IDS.filter((id) => isPreview || THEME_BASES[id].isReleased || id === chosenId);
}

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(THEME_BASES, value);
}

/** Resolved themes are cached, so each theme + mascot pair is one stable object (safe as a hook dependency). */
const resolvedThemes = new Map<string, ThemeDefinition>();

/**
 * The theme to draw with: the theme's look and the learner's mascot (the theme's default one when
 * none is chosen). An unknown theme or mascot id, e.g. saved by a newer app version, falls back.
 */
export function resolveTheme(themeId: string | undefined, companionId?: string): ThemeDefinition {
  const base = THEME_BASES[isThemeId(themeId) ? themeId : DEFAULT_THEME_ID];
  const companion = getCompanion(companionId, base.defaultCompanionId);
  const key = `${base.id}|${companion.id}`;
  const cached = resolvedThemes.get(key);
  if (cached) return cached;
  const resolved: ThemeDefinition = { ...base, companion, companionRim: getCompanionRim(companion, base.isDark) };
  resolvedThemes.set(key, resolved);
  return resolved;
}

export const TIER_CONFIG: Record<
  ProficiencyTier,
  {
    id: ProficiencyTier;
    labelEn: string;
    labelHe: string;
    badgeEmoji: string;
    descriptionHe: string;
    xpMultiplier: number;
    diamondBonus: number;
  }
> = {
  explorer: {
    id: 'explorer',
    labelEn: 'Explorer',
    labelHe: 'בסיס וביטחון',
    badgeEmoji: '🌱',
    descriptionHe: 'רמזים מלאים בעברית, השמעה איטית ובניית ביטחון',
    xpMultiplier: 1.0,
    diamondBonus: 5,
  },
  challenger: {
    id: 'challenger',
    labelEn: 'Challenger',
    labelHe: 'רמת כיתה מלאה',
    badgeEmoji: '⚡',
    descriptionHe: 'מותאם בדיוק לדרישות השכבה במשרד החינוך (1.5x נקודות)',
    xpMultiplier: 1.5,
    diamondBonus: 12,
  },
  master: {
    id: 'master',
    labelEn: 'Master',
    labelHe: 'מצוינות והעשרה',
    badgeEmoji: '👑',
    descriptionHe: 'אתגרי ניסוח, פעלי מצב ודיבור שוטף (2x נקודות + יהלומים)',
    xpMultiplier: 2.0,
    diamondBonus: 20,
  },
};

export const TODAYS_MISSION_BY_GRADE: Record<GradeId, TodaysMissionSuggestion> = {
  'grade-1': {
    id: 'g1-u11-m1',
    unitNumber: 1,
    missionNumber: 1,
    unitTitleEn: 'Unit 1: ABC Friends (כיתה א׳)',
    titleEn: 'Meet A, B and C',
    titleHe: 'מכירים את A, B, C',
    summaryHe: 'נכיר את שלוש האותיות הראשונות באנגלית, הגדולות והקטנות, ותמונות שמתחילות בהן!',
    estimatedMinutes: 2,
    xpReward: 25,
    diamondReward: 6,
    maxStars: 3,
    skills: ['Letter Names', 'Capital & Small Letters', 'First Words'],
    sampleSentenceEn: 'A is for apple.',
    sampleSentenceHe: 'A כמו תפוח',
  },
  'grade-2': {
    id: 'g2-u1-m1',
    unitNumber: 1,
    missionNumber: 1,
    unitTitleEn: 'Unit 1: Toy Shop & Word Explorers (כיתה ב׳)',
    titleEn: 'My Favorite Toys & CVC Words',
    titleHe: 'הצעצועים האהובים ומילים קצרות',
    summaryHe: 'קריאת מילות CVC קצרות (cat, red, big, sun), זיהוי צעצועים ואימון הגייה חווייתי!',
    estimatedMinutes: 2,
    xpReward: 35,
    diamondReward: 9,
    maxStars: 3,
    skills: ['CVC Blends', 'Toy Vocabulary', 'Phonics Reading'],
    sampleSentenceEn: 'I have a big red ball in my bag.',
    sampleSentenceHe: 'יש לי כדור אדום גדול בתיק שלי.',
  },
  'grade-3': {
    id: 'g3-u1-m1',
    unitNumber: 1,
    missionNumber: 1,
    unitTitleEn: 'Unit 1: Little Artists & School Friends (כיתה ג׳)',
    titleEn: 'My Colorful School Backpack',
    titleHe: 'ילקוט בית הספר הצבעוני שלי',
    summaryHe: 'שימוש ב-"I have" ו-"I like", תיאור כלי כתיבה וקריאת משפט שלם בקול!',
    estimatedMinutes: 3,
    xpReward: 40,
    diamondReward: 10,
    maxStars: 3,
    skills: ['Pre-Band I Words', 'I have / I like', 'Speaking Aloud'],
    sampleSentenceEn: 'I have blue pens and yellow paper in my desk.',
    sampleSentenceHe: 'יש לי עטים כחולים ודף צהוב בשולחן שלי.',
  },
  'grade-4': {
    id: 'g4-u1-m1',
    unitNumber: 1,
    missionNumber: 1,
    unitTitleEn: 'Unit 1: Superhero Action Academy (כיתה ד׳)',
    titleEn: 'Super Powers: Can You Fly?',
    titleHe: 'כוחות על: מה אתם יכולים לעשות?',
    summaryHe: 'לימוד פועלי פעולה (run, jump, swim), שימוש ב-Can / Can\'t ואימון קול מהנה!',
    estimatedMinutes: 3,
    xpReward: 40,
    diamondReward: 10,
    maxStars: 3,
    skills: ['Action Verbs', 'Can / Can\'t', 'Voice Power Drill'],
    sampleSentenceEn: 'Super heroes can fly fast and help people every day.',
    sampleSentenceHe: 'גיבורי על יכולים לעוף מהר ולעזור לאנשים כל יום.',
  },
  'grade-5': {
    id: 'g5-u1-m1',
    unitNumber: 1,
    missionNumber: 1,
    unitTitleEn: 'Unit 1: My Favorite Things & Animals (כיתה ה׳)',
    titleEn: 'Pet Café Greetings & Colors',
    titleHe: 'מפגש בבית הקפה לחיות מחמד',
    summaryHe: 'נלמד להציג את עצמנו באנגלית, לתאר חיות מחמד ולהגיד משפט שלם בקול!',
    estimatedMinutes: 3,
    xpReward: 40,
    diamondReward: 10,
    maxStars: 3,
    skills: ['Vocabulary Band I', 'Am / Is / Are', 'Speaking Aloud'],
    sampleSentenceEn: 'My cute cat likes warm milk every morning.',
    sampleSentenceHe: 'החתול החמוד שלי אוהב חלב חם כל בוקר.',
  },
  'grade-6': {
    id: 'g6-u1-m2',
    unitNumber: 1,
    missionNumber: 2,
    unitTitleEn: 'Unit 1: Daily Adventures & Routines (כיתה ו׳)',
    titleEn: 'After-School Hobby Club',
    titleHe: 'מועדון התחביבים אחרי בית הספר',
    summaryHe: 'תרגול משפטי Present Simple, מילות תדירות (Always, Usually) וקריאה בקול!',
    estimatedMinutes: 3,
    xpReward: 45,
    diamondReward: 12,
    maxStars: 3,
    skills: ['Present Simple', 'Time Expressions', 'Voice Reading'],
    sampleSentenceEn: 'We usually play music together on Tuesdays.',
    sampleSentenceHe: 'אנחנו בדרך כלל מנגנים יחד בימי שלישי.',
  },
  'grade-7': {
    id: 'g7-u3-m2',
    unitNumber: 3,
    missionNumber: 2,
    unitTitleEn: 'Chapter 3: Seoul Café & Travel Diary (כיתה ז׳)',
    titleEn: 'Right Now vs. Every Day at the Studio',
    titleHe: 'מה קורה עכשיו לעומת הרגלים קבועים',
    summaryHe:
      'תרגול חווייתי של Present Progressive מול Present Simple, אוצר מילים Band II וזיהוי דיבור באנגלית!',
    estimatedMinutes: 4,
    xpReward: 60,
    diamondReward: 15,
    maxStars: 3,
    skills: ['Present Progressive vs. Simple', 'Band II Vocab', 'Voice & Chat'],
    sampleSentenceEn:
      'Usually Noa takes the bus, but today she is walking to the studio with her friends.',
    sampleSentenceHe:
      'בדרך כלל נועה נוסעת באוטובוס, אבל היום היא הולכת ברגל לסטודיו עם חברותיה.',
  },
  'grade-8': {
    id: 'g8-u2-m1',
    unitNumber: 2,
    missionNumber: 1,
    unitTitleEn: 'Unit 2: Mystery Trip & Past Stories (כיתה ח׳)',
    titleEn: 'The Lost Passport Clue',
    titleHe: 'תעלומת הדרכון האבוד בלונדון',
    summaryHe: 'שילוב Past Simple (פעלים רגילים ויוצאי דופן), שאלות עם Did ואימון הגייה!',
    estimatedMinutes: 4,
    xpReward: 70,
    diamondReward: 18,
    maxStars: 3,
    skills: ['Past Simple Irregulars', 'Unseen Clues', 'Pronunciation'],
    sampleSentenceEn: 'Did you find the hidden ticket inside the old notebook yesterday?',
    sampleSentenceHe: 'האם מצאת את הכרטיס הנסתר בתוך המחברת הישנה אתמול?',
  },
  'grade-9': {
    id: 'g9-u1-m3',
    unitNumber: 1,
    missionNumber: 3,
    unitTitleEn: 'Unit 1: Future Innovators & Teen Podcast (כיתה ט׳)',
    titleEn: 'Recording Our First Global Podcast',
    titleHe: 'הקלטת הפודקאסט הבינלאומי שלנו',
    summaryHe: 'אוצר מילים מתקדם (Band III Prep), משפטי תנאי ודיבור שוטף מול המיקרופון!',
    estimatedMinutes: 5,
    xpReward: 85,
    diamondReward: 22,
    maxStars: 3,
    skills: ['Band III Prep', 'Conditionals & Modals', 'Fluency Speaking'],
    sampleSentenceEn: 'If we practice our pronunciation daily, we will sound confident on the podcast.',
    sampleSentenceHe: 'אם נתרגל את ההגייה שלנו מדי יום, נישמע בטוחים בעצמנו בפודקאסט.',
  },
  'grade-10': {
    id: 'g10-u1-m1',
    unitNumber: 1,
    missionNumber: 1,
    unitTitleEn: 'Unit 1: Global Youth Summit & Environment (כיתה י׳)',
    titleEn: 'Protecting Our Planet: Passive Action',
    titleHe: 'שומרים על כדור הארץ: משפטי סביל',
    summaryHe: 'היכרות עם מבנה הסביל (Passive Voice), אוצר מילים Band III והבנת הנקרא לקראת שאלון C/E!',
    estimatedMinutes: 5,
    xpReward: 90,
    diamondReward: 25,
    maxStars: 3,
    skills: ['Passive Voice', 'Band III Environment', 'Bagrut Unseen'],
    sampleSentenceEn: 'Millions of plastic bottles are recycled every year around the world.',
    sampleSentenceHe: 'מיליוני בקבוקי פלסטיק ממוחזרים מדי שנה ברחבי העולם.',
  },
  'grade-11': {
    id: 'g11-u1-m1',
    unitNumber: 1,
    missionNumber: 1,
    unitTitleEn: 'Unit 1: Literature, Cinema & Critical Minds (כיתה י״א)',
    titleEn: 'Cause & Effect: A Summer\'s Reading',
    titleHe: 'סיבה ותוצאה: ניתוח ספרותי ו-HOTS',
    summaryHe: 'אסטרטגיות חשיבה מסדר גבוה (HOTS), תנאי שלישי וחיבור משפטי מורכב לקראת שאלון E!',
    estimatedMinutes: 5,
    xpReward: 95,
    diamondReward: 28,
    maxStars: 3,
    skills: ['HOTS Cause & Effect', 'Past Perfect & Conditionals', 'Module E Prep'],
    sampleSentenceEn: 'If George had studied diligently, he would have achieved his dream earlier.',
    sampleSentenceHe: 'אילו ג׳ורג׳ היה לומד בשקדנות, הוא היה מגשים את חלומו מוקדם יותר.',
  },
  'grade-12': {
    id: 'g12-u1-m1',
    unitNumber: 1,
    missionNumber: 1,
    unitTitleEn: 'Unit 1: Bagrut Launchpad & Global Fluency (כיתה י״ב)',
    titleEn: 'Spoken Bagrut: Technology in Education',
    titleHe: 'בגרות בעל-פה: טכנולוגיה וחינוך',
    summaryHe: 'סימולציית בגרות בעל-פה, מילות קישור אקדמיות (Furthermore, In conclusion) ודיבור רהוט!',
    estimatedMinutes: 6,
    xpReward: 100,
    diamondReward: 30,
    maxStars: 3,
    skills: ['Spoken Bagrut Interview', 'Academic Connectors', 'Module G Mastery'],
    sampleSentenceEn: 'Furthermore, innovative digital tools allow students to express their ideas independently.',
    sampleSentenceHe: 'יתרה מזאת, כלים דיגיטליים חדשניים מאפשרים לתלמידים לבטא את רעיונותיהם באופן עצמאי.',
  },
};
