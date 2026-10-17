import { DreamEntry, GradeId, LearnerProfile } from '../types/learner';
import { seededShuffle } from '../utils/shuffle';
import { RoomActivityReward, applyRoomActivityReward } from './roomActivities';
import { getRoom } from './room';
import { GradeBand, getGradeBand } from './voiceMessages';

/**
 * Feature 12, phase 4 — 🛏️ Dream Journal: the learner invents a dream by picking Hebrew words for
 * guided sentence frames, then translates it into English blank by blank, then reads it aloud.
 * Frames are written so the Hebrew never depends on the learner's gender.
 */

export interface DreamWord {
  en: string;
  he: string;
  emoji: string;
}

export interface DreamFrame {
  id: string;
  /** English template with {0} and {1} blanks */
  en: string;
  /** Hebrew template with the same blanks */
  he: string;
  /** Word choices for each blank */
  blanks: [DreamWord[], DreamWord[]];
}

export const DREAM_FRAMES_PER_ENTRY = 2;
export const MAX_JOURNAL_ENTRIES = 20;
export const MAX_NOTE_LENGTH = 200;

const w = (en: string, he: string, emoji: string): DreamWord => ({ en, he, emoji });

const FRAMES: Record<GradeBand, Omit<DreamFrame, 'id'>[]> = {
  early: [
    {
      en: 'I see a {0} in the {1}.',
      he: 'אני רואה {0} ב{1}.',
      blanks: [
        [w('dog', 'כלב', '🐶'), w('cat', 'חתול', '🐱'), w('horse', 'סוס', '🐴'), w('bird', 'ציפור', '🐦')],
        [w('sky', 'שמיים', '☁️'), w('park', 'פארק', '🌳'), w('sea', 'ים', '🌊'), w('garden', 'גינה', '🌷')],
      ],
    },
    {
      en: 'There is a {0} on the {1}.',
      he: 'יש {0} על ה{1}.',
      blanks: [
        [w('cat', 'חתול', '🐱'), w('frog', 'צפרדע', '🐸'), w('robot', 'רובוט', '🤖'), w('cake', 'עוגה', '🎂')],
        [w('bed', 'מיטה', '🛏️'), w('moon', 'ירח', '🌙'), w('car', 'מכונית', '🚗'), w('roof', 'גג', '🏠')],
      ],
    },
    {
      en: 'I flew to the {0} with my {1}.',
      he: 'טסתי ל{0} עם ה{1} שלי.',
      blanks: [
        [w('moon', 'ירח', '🌙'), w('sea', 'ים', '🌊'), w('zoo', 'גן החיות', '🦁'), w('park', 'פארק', '🌳')],
        [w('dog', 'כלב', '🐶'), w('teddy bear', 'דובי', '🧸'), w('cat', 'חתול', '🐱'), w('kite', 'עפיפון', '🪁')],
      ],
    },
    {
      en: 'I have a {0} and a {1}.',
      he: 'יש לי {0} ו{1}.',
      blanks: [
        [w('hat', 'כובע', '🎩'), w('ball', 'כדור', '⚽'), w('cake', 'עוגה', '🎂'), w('kite', 'עפיפון', '🪁')],
        [w('balloon', 'בלון', '🎈'), w('book', 'ספר', '📚'), w('star', 'כוכב', '⭐'), w('box', 'קופסה', '📦')],
      ],
    },
  ],
  band1: [
    {
      en: 'I dreamed that I was in {0} with {1}.',
      he: 'חלמתי שהייתי ב{0} עם {1}.',
      blanks: [
        [w('space', 'חלל', '🚀'), w('a castle', 'טירה', '🏰'), w('the jungle', 'ג׳ונגל', '🌴'), w('the ocean', 'אוקיינוס', '🌊')],
        [w('a dragon', 'דרקון', '🐉'), w('my teacher', 'המורה שלי', '👩‍🏫'), w('a robot', 'רובוט', '🤖'), w('a talking cat', 'חתול מדבר', '🐱')],
      ],
    },
    {
      en: 'We found {0} under the {1}.',
      he: 'מצאנו {0} מתחת ל{1}.',
      blanks: [
        [w('a treasure', 'אוצר', '💰'), w('a secret map', 'מפה סודית', '🗺️'), w('a golden key', 'מפתח זהב', '🔑'), w('a tiny dragon', 'דרקון קטנטן', '🐉')],
        [w('bed', 'מיטה', '🛏️'), w('table', 'שולחן', '🍽️'), w('big tree', 'עץ הגדול', '🌳'), w('bridge', 'גשר', '🌉')],
      ],
    },
    {
      en: 'Suddenly, it started to {0}, so we {1}.',
      he: 'פתאום התחיל {0}, אז {1}.',
      blanks: [
        [w('rain', 'לרדת גשם', '🌧️'), w('snow', 'לרדת שלג', '❄️'), w('rain candy', 'לרדת ממתקים', '🍬'), w('thunder', 'לרעום', '⚡')],
        [w('ran home', 'רצנו הביתה', '🏃'), w('opened an umbrella', 'פתחנו מטרייה', '☂️'), w('danced outside', 'רקדנו בחוץ', '💃'), w('built a snowman', 'בנינו איש שלג', '⛄')],
      ],
    },
    {
      en: 'At the end, we ate {0} and played {1}.',
      he: 'בסוף, אכלנו {0} ושיחקנו {1}.',
      blanks: [
        [w('pizza', 'פיצה', '🍕'), w('ice cream', 'גלידה', '🍦'), w('pancakes', 'פנקייקים', '🥞'), w('birthday cake', 'עוגת יום הולדת', '🎂')],
        [w('soccer', 'כדורגל', '⚽'), w('hide and seek', 'מחבואים', '🙈'), w('chess', 'שחמט', '♟️'), w('video games', 'משחקי מחשב', '🎮')],
      ],
    },
  ],
  band2: [
    {
      en: 'I was walking through {0} when I saw {1}.',
      he: 'הלכתי ב{0} כשראיתי {1}.',
      blanks: [
        [w('a dark forest', 'יער חשוך', '🌲'), w('an empty city', 'עיר ריקה', '🏙️'), w('a crowded market', 'שוק הומה', '🛍️'), w('a snowy valley', 'עמק מושלג', '🏔️')],
        [w('a glowing door', 'דלת זוהרת', '🚪'), w('a giant whale', 'לוויתן ענק', '🐋'), w('my future self', 'את עצמי בעתיד', '🪞'), w('a flying train', 'רכבת מעופפת', '🚂')],
      ],
    },
    {
      en: 'Someone had left {0} on {1}.',
      he: 'מישהו השאיר {0} על {1}.',
      blanks: [
        [w('a mysterious letter', 'מכתב מסתורי', '✉️'), w('an old camera', 'מצלמה ישנה', '📷'), w('a box of gold coins', 'קופסת מטבעות זהב', '🪙'), w('a strange map', 'מפה מוזרה', '🗺️')],
        [w('my desk', 'השולחן שלי', '🗄️'), w('the roof', 'הגג', '🏠'), w('a bench in the park', 'ספסל בפארק', '🪑'), w('the kitchen table', 'שולחן המטבח', '🍽️')],
      ],
    },
    {
      en: 'If I wake up now, I will {0} before {1}.',
      he: 'אם אתעורר עכשיו, {0} לפני {1}.',
      blanks: [
        [w('write it down', 'אכתוב את זה', '✍️'), w('tell my friends', 'אספר לחברים שלי', '🗣️'), w('draw a picture of it', 'אצייר את זה', '🎨'), w('forget everything', 'אשכח הכול', '😶')],
        [w('breakfast', 'ארוחת הבוקר', '🍳'), w('school', 'בית הספר', '🏫'), w('the bus comes', 'שהאוטובוס יגיע', '🚌'), w('my alarm rings', 'שהשעון המעורר יצלצל', '⏰')],
      ],
    },
    {
      en: 'It was the {0} dream I have ever had, and it lasted {1}.',
      he: 'זה היה החלום {0} שחלמתי אי פעם, והוא נמשך {1}.',
      blanks: [
        [w('strangest', 'הכי מוזר', '🌀'), w('scariest', 'הכי מפחיד', '👻'), w('funniest', 'הכי מצחיק', '😂'), w('most beautiful', 'הכי יפה', '🌈')],
        [w('all night', 'כל הלילה', '🌙'), w('only a minute', 'רק דקה', '⏱️'), w('until sunrise', 'עד הזריחה', '🌅'), w('for hours', 'שעות', '⌛')],
      ],
    },
  ],
  band3: [
    {
      en: 'The dream, which took place in {0}, was about {1}.',
      he: 'החלום, שהתרחש ב{0}, עסק ב{1}.',
      blanks: [
        [w('a city made of glass', 'עיר עשויה זכוכית', '🏙️'), w('a submarine', 'צוללת', '🚢'), w('the year 3000', 'שנת 3000', '🚀'), w('an abandoned library', 'ספרייה נטושה', '📚')],
        [w('a race against time', 'מרוץ נגד הזמן', '⏳'), w('a lost memory', 'זיכרון אבוד', '🧠'), w('a secret society', 'אגודה סודית', '🕵️'), w('a broken promise', 'הבטחה שהופרה', '💔')],
      ],
    },
    {
      en: 'Although I tried to {0}, I could not {1}.',
      he: 'למרות שניסיתי {0}, לא הצלחתי {1}.',
      blanks: [
        [w('run away', 'לברוח', '🏃'), w('shout for help', 'לצעוק לעזרה', '📣'), w('open the door', 'לפתוח את הדלת', '🚪'), w('turn on the light', 'להדליק את האור', '💡')],
        [w('move my legs', 'להזיז את הרגליים', '🦵'), w('find the exit', 'למצוא את היציאה', '🧭'), w('remember my name', 'לזכור את השם שלי', '🪪'), w('wake up', 'להתעורר', '⏰')],
      ],
    },
    {
      en: 'In the dream, people had been {0} for centuries, until {1}.',
      he: 'בחלום, אנשים {0} במשך מאות שנים, עד ש{1}.',
      blanks: [
        [w('living underground', 'חיו מתחת לאדמה', '🕳️'), w('waiting for rain', 'חיכו לגשם', '🌧️'), w('speaking only English', 'דיברו רק אנגלית', '🗣️'), w('searching for a hidden city', 'חיפשו עיר נסתרת', '🔍')],
        [w('a child found the key', 'ילד מצא את המפתח', '🔑'), w('the sun disappeared', 'השמש נעלמה', '🌑'), w('a stranger arrived', 'זר הגיע', '🧳'), w('the river changed direction', 'הנהר שינה כיוון', '🌊')],
      ],
    },
    {
      en: 'Looking back, the dream suggests that {0}, so I should {1}.',
      he: 'במבט לאחור, החלום מרמז ש{0}, ולכן כדאי לי {1}.',
      blanks: [
        [w('change is coming', 'שינוי מתקרב', '🔄'), w('time is running out', 'הזמן אוזל', '⏳'), w('my fears are not real', 'הפחדים שלי אינם אמיתיים', '👻'), w('a big decision is ahead', 'החלטה גדולה מחכה', '🛤️')],
        [w('trust myself', 'לסמוך על עצמי', '🤝'), w('take a break', 'לקחת הפסקה', '☕'), w('face my fears', 'להתמודד עם הפחדים שלי', '💪'), w('plan ahead', 'לתכנן מראש', '🗓️')],
      ],
    },
  ],
};

export const DREAM_FRAMES: Record<GradeBand, DreamFrame[]> = {
  early: FRAMES.early.map((f, i) => ({ ...f, id: `dream-early-${i + 1}` })),
  band1: FRAMES.band1.map((f, i) => ({ ...f, id: `dream-band1-${i + 1}` })),
  band2: FRAMES.band2.map((f, i) => ({ ...f, id: `dream-band2-${i + 1}` })),
  band3: FRAMES.band3.map((f, i) => ({ ...f, id: `dream-band3-${i + 1}` })),
};

/** Two frames for the learner's grade band, in the order they appear in the story. */
export function pickDreamFrames(gradeId: GradeId, salt: string | number): DreamFrame[] {
  const frames = DREAM_FRAMES[getGradeBand(gradeId)];
  const picked = seededShuffle(frames, `dream-${salt}`).slice(0, DREAM_FRAMES_PER_ENTRY);
  return frames.filter((frame) => picked.includes(frame));
}

/** Fills a template's {0}/{1} blanks; missing words stay as "___". */
export function fillFrame(template: string, words: (string | undefined)[]): string {
  return template.replace(/\{(\d)\}/g, (_, i: string) => words[Number(i)] ?? '___');
}

/** The correct English word plus two other choices from the same blank, shuffled. */
export function getTranslationChoices(frame: DreamFrame, blankIdx: number, chosen: DreamWord, seed: string | number): string[] {
  const others = frame.blanks[blankIdx].filter((word) => word.en !== chosen.en).map((word) => word.en);
  return seededShuffle([chosen.en, ...seededShuffle(others, `${seed}-others`).slice(0, 2)], seed);
}

/** Case, extra spaces and end punctuation don't matter when the learner types a translation. */
export function isSameTranslation(typed: string, expected: string): boolean {
  const clean = (text: string) => text.toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim();
  return clean(typed) === clean(expected);
}

export function getJournalEntries(profile: LearnerProfile): DreamEntry[] {
  return getRoom(profile).dreamJournal || [];
}

/** Newest first, at most MAX_JOURNAL_ENTRIES. */
export function keepNewestEntries(entries: DreamEntry[]): DreamEntry[] {
  return [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, MAX_JOURNAL_ENTRIES);
}

/** Saves a finished dream and gives the daily journal reward (reading it aloud counts as voice practice). */
export function saveDreamEntry(
  profile: LearnerProfile,
  entry: Omit<DreamEntry, 'id' | 'createdAt'>,
  wasReadAloud: boolean,
  now: Date
): RoomActivityReward {
  const room = getRoom(profile);
  const noteHe = entry.noteHe?.trim().slice(0, MAX_NOTE_LENGTH);
  const saved: DreamEntry = {
    id: `dream-${now.getTime()}`,
    createdAt: now.toISOString(),
    textEn: entry.textEn,
    textHe: entry.textHe,
    ...(noteHe ? { noteHe } : {}),
  };
  const withEntry: LearnerProfile = {
    ...profile,
    room: { ...room, dreamJournal: keepNewestEntries([saved, ...(room.dreamJournal || [])]) },
  };
  return applyRoomActivityReward(withEntry, 'journal', wasReadAloud ? 1 : 0, now);
}
