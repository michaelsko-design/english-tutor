import { GradeId, LearnerProfile } from '../types/learner';
import { seededShuffle } from '../utils/shuffle';
import { RoomActivityReward, applyRoomActivityReward } from './roomActivities';

/**
 * Feature 12, phase 3 — 📱 Voice Messages: a friend sends a message and the learner records the
 * English voice reply, scored with the speech-similarity engine. Replies grow with the grade band.
 */

/** Grades 1–3, 4–6, 7–9 and 10–12 (Pre-Band I, Band I, Band II, Band III). */
export type GradeBand = 'early' | 'band1' | 'band2' | 'band3';

export interface VoiceMessagePrompt {
  id: string;
  fromName: string;
  fromEmoji: string;
  incomingEn: string;
  incomingHe: string;
  /** The English voice reply the learner records */
  replyEn: string;
  replyHe: string;
}

export const PHONE_SESSION_SIZE = 3;

export function getGradeBand(gradeId: GradeId): GradeBand {
  const grade = Number(gradeId.replace('grade-', ''));
  if (grade <= 3) return 'early';
  if (grade <= 6) return 'band1';
  if (grade <= 9) return 'band2';
  return 'band3';
}

type PromptSeed = Omit<VoiceMessagePrompt, 'id'>;

const EARLY: PromptSeed[] = [
  { fromName: 'Maya', fromEmoji: '👧', incomingEn: 'Hi! How are you?', incomingHe: 'היי! מה שלומך?', replyEn: 'I am fine.', replyHe: 'אני בסדר.' },
  { fromName: 'Tom', fromEmoji: '👦', incomingEn: 'Do you like cats?', incomingHe: 'את/ה אוהב/ת חתולים?', replyEn: 'Yes, I do!', replyHe: 'כן, אני אוהב/ת!' },
  { fromName: 'Grandma', fromEmoji: '👵', incomingEn: 'Good night, sweetie!', incomingHe: 'לילה טוב, מתוק/ה!', replyEn: 'Good night, Grandma!', replyHe: 'לילה טוב, סבתא!' },
  { fromName: 'Dan', fromEmoji: '🧒', incomingEn: "Let's play ball!", incomingHe: 'בוא/י נשחק בכדור!', replyEn: "Okay, let's play!", replyHe: 'בסדר, בוא/י נשחק!' },
  { fromName: 'Noa', fromEmoji: '👧', incomingEn: 'What color is your bag?', incomingHe: 'באיזה צבע התיק שלך?', replyEn: 'It is red.', replyHe: 'הוא אדום.' },
  { fromName: 'Teacher', fromEmoji: '👩‍🏫', incomingEn: 'Good morning, class!', incomingHe: 'בוקר טוב, כיתה!', replyEn: 'Good morning, teacher!', replyHe: 'בוקר טוב, מורה!' },
  { fromName: 'Mom', fromEmoji: '👩', incomingEn: 'Are you hungry?', incomingHe: 'את/ה רעב/ה?', replyEn: 'Yes, I am.', replyHe: 'כן, אני רעב/ה.' },
  { fromName: 'Ben', fromEmoji: '👦', incomingEn: 'Happy birthday!', incomingHe: 'יום הולדת שמח!', replyEn: 'Thank you so much!', replyHe: 'תודה רבה!' },
];

const BAND1: PromptSeed[] = [
  { fromName: 'Lily', fromEmoji: '👧', incomingEn: 'Can you come to the park today?', incomingHe: 'את/ה יכול/ה לבוא היום לפארק?', replyEn: 'Sorry, I cannot come today.', replyHe: 'סליחה, אני לא יכול/ה לבוא היום.' },
  { fromName: 'Omer', fromEmoji: '👦', incomingEn: 'What time is the soccer game?', incomingHe: 'באיזו שעה משחק הכדורגל?', replyEn: 'It starts at five.', replyHe: 'הוא מתחיל בחמש.' },
  { fromName: 'Dad', fromEmoji: '👨', incomingEn: 'Where are you now?', incomingHe: 'איפה את/ה עכשיו?', replyEn: 'I am at the library.', replyHe: 'אני בספרייה.' },
  { fromName: 'Sara', fromEmoji: '👧', incomingEn: 'What do you usually do on Fridays?', incomingHe: 'מה את/ה בדרך כלל עושה בימי שישי?', replyEn: 'I usually visit my grandparents.', replyHe: 'אני בדרך כלל מבקר/ת את סבא וסבתא.' },
  { fromName: 'Coach', fromEmoji: '🧑‍🏫', incomingEn: 'Did you bring your water bottle?', incomingHe: 'הבאת את בקבוק המים שלך?', replyEn: 'Yes, it is in my bag.', replyHe: 'כן, הוא בתיק שלי.' },
  { fromName: 'Maya', fromEmoji: '👧', incomingEn: 'What is your favorite subject?', incomingHe: 'מה המקצוע האהוב עליך?', replyEn: 'My favorite subject is English.', replyHe: 'המקצוע האהוב עליי הוא אנגלית.' },
  { fromName: 'Tom', fromEmoji: '👦', incomingEn: 'There is a new movie. Do you want to see it?', incomingHe: 'יש סרט חדש. את/ה רוצה לראות אותו?', replyEn: 'Yes, I want to see it!', replyHe: 'כן, אני רוצה לראות אותו!' },
  { fromName: 'Grandpa', fromEmoji: '👴', incomingEn: 'How was your day at school?', incomingHe: 'איך היה היום שלך בבית הספר?', replyEn: 'It was great, thank you.', replyHe: 'היה מעולה, תודה.' },
];

const BAND2: PromptSeed[] = [
  { fromName: 'Noa', fromEmoji: '👧', incomingEn: 'Are you going to the party on Saturday?', incomingHe: 'את/ה הולך/ת למסיבה בשבת?', replyEn: 'Yes, I am going to be there. I will bring some snacks.', replyHe: 'כן, אני אהיה שם. אביא חטיפים.' },
  { fromName: 'Dan', fromEmoji: '🧑', incomingEn: 'Have you ever been to Eilat?', incomingHe: 'היית פעם באילת?', replyEn: 'Yes, I have been there twice. It was really hot.', replyHe: 'כן, הייתי שם פעמיים. היה ממש חם.' },
  { fromName: 'Teacher', fromEmoji: '👩‍🏫', incomingEn: 'Why were you late this morning?', incomingHe: 'למה איחרת הבוקר?', replyEn: 'I missed the bus. I am really sorry.', replyHe: 'פספסתי את האוטובוס. אני ממש מצטער/ת.' },
  { fromName: 'Ben', fromEmoji: '👦', incomingEn: 'What were you doing when I called?', incomingHe: 'מה עשית כשהתקשרתי?', replyEn: 'I was doing my homework. I will call you back later.', replyHe: 'הכנתי שיעורי בית. אחזור אליך אחר כך.' },
  { fromName: 'Lily', fromEmoji: '👧', incomingEn: 'If it rains tomorrow, what will we do?', incomingHe: 'אם מחר ירד גשם, מה נעשה?', replyEn: 'If it rains, we will watch a movie. It will be fun.', replyHe: 'אם ירד גשם, נראה סרט. יהיה כיף.' },
  { fromName: 'Mom', fromEmoji: '👩', incomingEn: 'Did you finish your science project?', incomingHe: 'סיימת את הפרויקט במדעים?', replyEn: 'Not yet, but I have already started. I will finish it tonight.', replyHe: 'עוד לא, אבל כבר התחלתי. אסיים אותו הערב.' },
  { fromName: 'Omer', fromEmoji: '👦', incomingEn: 'Which is better, the book or the movie?', incomingHe: 'מה יותר טוב, הספר או הסרט?', replyEn: 'The book is better than the movie. It has more details.', replyHe: 'הספר טוב יותר מהסרט. יש בו יותר פרטים.' },
  { fromName: 'Coach', fromEmoji: '🧑‍🏫', incomingEn: 'You should practice more before the game.', incomingHe: 'כדאי שתתאמן/י יותר לפני המשחק.', replyEn: 'You are right. I will practice every day.', replyHe: 'זה נכון. אתאמן כל יום.' },
];

const BAND3: PromptSeed[] = [
  { fromName: 'Yael', fromEmoji: '👩‍🎓', incomingEn: 'Have you started preparing for the Bagrut exam?', incomingHe: 'כבר התחלת להתכונן לבגרות?', replyEn: 'Yes, I have been studying for two weeks. I feel more confident now.', replyHe: 'כן, אני לומד/ת כבר שבועיים. אני מרגיש/ה יותר בטוח/ה עכשיו.' },
  { fromName: 'Itai', fromEmoji: '🧑', incomingEn: 'If you could travel anywhere, where would you go?', incomingHe: 'אם היית יכול/ה לטוס לכל מקום, לאן היית טס/ה?', replyEn: 'If I could travel anywhere, I would go to Japan. I would love to see Tokyo.', replyHe: 'אם הייתי יכול/ה, הייתי טס/ה ליפן. הייתי שמח/ה לראות את טוקיו.' },
  { fromName: 'Teacher', fromEmoji: '👩‍🏫', incomingEn: 'Could you summarize the article for the class?', incomingHe: 'תוכל/י לסכם את המאמר לכיתה?', replyEn: 'The article claims that social media affects our sleep. However, more research is needed.', replyHe: 'המאמר טוען שהרשתות החברתיות משפיעות על השינה שלנו. עם זאת, נדרש מחקר נוסף.' },
  { fromName: 'Noa', fromEmoji: '👧', incomingEn: 'I heard the concert was cancelled. Is that true?', incomingHe: 'שמעתי שההופעה בוטלה. זה נכון?', replyEn: 'Yes, it was cancelled because of the weather. It will probably be held next month.', replyHe: 'כן, היא בוטלה בגלל מזג האוויר. היא כנראה תתקיים בחודש הבא.' },
  { fromName: 'Manager', fromEmoji: '🧑‍💼', incomingEn: 'The meeting has been moved to Thursday.', incomingHe: 'הפגישה הועברה ליום חמישי.', replyEn: 'Thank you for letting me know. I will update my calendar.', replyHe: 'תודה שעדכנת אותי. אעדכן את היומן שלי.' },
  { fromName: 'Ben', fromEmoji: '👦', incomingEn: 'What would you have done if you had missed the flight?', incomingHe: 'מה היית עושה אילו פספסת את הטיסה?', replyEn: 'If I had missed the flight, I would have taken the next one. Luckily, it did not happen.', replyHe: 'אילו פספסתי את הטיסה, הייתי עולה על הבאה. למזלי, זה לא קרה.' },
  { fromName: 'Sara', fromEmoji: '👧', incomingEn: 'Do you think school should start later?', incomingHe: 'את/ה חושב/ת שהלימודים צריכים להתחיל מאוחר יותר?', replyEn: 'In my opinion, school should start later. Students would be more focused.', replyHe: 'לדעתי, הלימודים צריכים להתחיל מאוחר יותר. התלמידים יהיו מרוכזים יותר.' },
  { fromName: 'Omer', fromEmoji: '👦', incomingEn: 'You must have been exhausted after the trip!', incomingHe: 'בטח היית מותש/ת אחרי הטיול!', replyEn: 'I was exhausted, but it was worth it. I would definitely do it again.', replyHe: 'הייתי מותש/ת, אבל היה שווה. בהחלט הייתי עושה את זה שוב.' },
];

function withIds(band: GradeBand, seeds: PromptSeed[]): VoiceMessagePrompt[] {
  return seeds.map((seed, idx) => ({ ...seed, id: `vm-${band}-${idx + 1}` }));
}

export const VOICE_MESSAGES: Record<GradeBand, VoiceMessagePrompt[]> = {
  early: withIds('early', EARLY),
  band1: withIds('band1', BAND1),
  band2: withIds('band2', BAND2),
  band3: withIds('band3', BAND3),
};

/** Three messages for the learner's grade band, in an order that varies by `salt`. */
export function buildPhoneSession(gradeId: GradeId, salt: string | number): VoiceMessagePrompt[] {
  return seededShuffle(VOICE_MESSAGES[getGradeBand(gradeId)], `phone-${salt}`).slice(0, PHONE_SESSION_SIZE);
}

/** A session with at least one sent message earns the room-activity reward; sent replies count as voice words. */
export function applyPhoneSessionResult(profile: LearnerProfile, sentCount: number, now: Date): RoomActivityReward | null {
  if (sentCount <= 0) return null;
  return applyRoomActivityReward(profile, 'phone', sentCount, now);
}
