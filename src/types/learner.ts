export type LearnerGender = 'girl' | 'boy';

export type GradeId =
  | 'grade-1'
  | 'grade-2'
  | 'grade-3'
  | 'grade-4'
  | 'grade-5'
  | 'grade-6'
  | 'grade-7'
  | 'grade-8'
  | 'grade-9'
  | 'grade-10'
  | 'grade-11'
  | 'grade-12';

export type ProficiencyTier = 'explorer' | 'challenger' | 'master';

export type ThemeId = 'cozy-studio' | 'neon-pop' | 'starlight-rpg';

export type CloudSyncStatus = 'synced' | 'syncing' | 'local-only' | 'offline-error';

export interface AuthUserSummary {
  uid: string;
  displayName: string | null;
  email: string | null;
  isAnonymous: boolean;
}

export interface GradeMetadata {
  id: GradeId;
  labelEn: string;
  labelHe: string;
  ministryBand: string;
  recommendedAge: number;
  descriptionHe: string;
}

export interface LearnerStats {
  xp: number;
  level: number;
  stars: number;
  maxPossibleStars: number;
  /** The spendable balance: always the balance of `LearnerProfile.diamondLedger` once it exists */
  diamonds: number;
  /** Consecutive learning days up to `streakLastDateStr`; read it with getCurrentStreak (data/streak.ts) */
  streakDays: number;
  /** Local date of the last day that counted for the streak */
  streakLastDateStr?: string;
  /** Streak shields bought in the shop and used up on missed days (both only grow) */
  streakShieldsBought?: number;
  streakShieldsUsed?: number;
  /** Days with at least one finished session, ever (the old streak number became this) */
  totalActiveDays?: number;
  shabbatShieldActive: boolean;
  /** Lifetime counter (counts replays and Vault practice); stored but not shown, see countMasteredWords */
  wordsMastered: number;
  missionsCompleted: number;
}

export interface DailyActivityCounters {
  dateStr: string;
  missionsCompletedToday: number;
  voiceWordsPracticedToday: number;
  threeStarMissionsToday: number;
}

/** Diamonds earned and spent on one device. Both only grow, so devices merge by taking the max. */
export interface DiamondLedgerEntry {
  earned: number;
  spent: number;
}

/** Device id -> its diamond totals; the balance is the sum of earned minus spent (data/diamondLedger.ts) */
export type DiamondLedger = Record<string, DiamondLedgerEntry>;

/** Words said in the Vocabulary Vault that earned a reward today */
export interface VaultPracticeDay {
  dateStr: string;
  words: string[];
}

/** One local day of learning activity, kept for the weekly parent report (Feature 9). */
export interface ActivityLogEntry {
  /** Local date, YYYY-MM-DD */
  dateStr: string;
  /** Activities that count as a mission for the daily quests and streak */
  sessions: number;
  voiceWords: number;
  threeStarSessions: number;
  xpEarned: number;
  starsGained: number;
  /** Missions that gained stars that day -> their new star count */
  missionStars: Record<string, number>;
  /** Missions that got their first star that day */
  firstCompletedIds: string[];
}

export interface TodaysMissionSuggestion {
  id: string;
  unitNumber: number;
  missionNumber: number;
  unitTitleEn: string;
  titleEn: string;
  titleHe: string;
  summaryHe: string;
  estimatedMinutes: number;
  xpReward: number;
  diamondReward: number;
  maxStars: 3;
  skills: string[];
  sampleSentenceEn: string;
  sampleSentenceHe: string;
}

/** Outcome of the adaptive diagnostic placement test (Feature 11). */
export interface PlacementResult {
  /** ISO timestamp of when the test was finished; the latest result wins on merge */
  completedAt: string;
  /** Highest grade level the learner showed mastery of */
  estimatedGradeId: GradeId;
  recommendedGradeId: GradeId;
  recommendedTier: ProficiencyTier;
  correctCount: number;
  totalQuestions: number;
}

/** A skill area a school exam can test (Feature 18). */
export type ExamSkill = 'grammar' | 'vocabulary' | 'unseen' | 'sentences';

/** One (unit × skill) slice of the exam material, practised in a study session. */
export interface ExamFocusBlock {
  unitNumber: number;
  skill: ExamSkill;
}

export interface ExamPlanDay {
  dayIndex: number;
  /** Local calendar date, YYYY-MM-DD */
  dateStr: string;
  kind: 'practice' | 'mock';
  /** Material for a practice day; empty means a mixed review of everything */
  focus: ExamFocusBlock[];
  /** ISO timestamp of the first completion */
  completedAt?: string;
  /** Best score (0–100) reached on this day's session */
  scorePercent?: number;
}

/** Personalized exam preparation plan (Feature 18). */
export interface ExamPrepPlan {
  id: string;
  createdAt: string;
  gradeId: GradeId;
  /** Local calendar date of the exam, YYYY-MM-DD */
  examDateStr: string;
  unitNumbers: number[];
  skills: ExamSkill[];
  days: ExamPlanDay[];
  /** Best mock exam score (0–100) */
  bestMockScore?: number;
  /** ISO timestamp of the first mock exam passed with the "Exam Ready" score */
  certificateEarnedAt?: string;
  /**
   * ISO timestamp of when the learner dismissed the plan. Plans are archived instead of removed,
   * because a removed field would come back from another device on the next merge.
   */
  archivedAt?: string;
}

/** A school word-list line: a word or short phrase, or a whole sentence (Feature 10). */
export type CustomItemKind = 'word' | 'sentence';

export interface CustomWordItem {
  id: string;
  textEn: string;
  translationHe?: string;
  kind: CustomItemKind;
}

/** A word list the learner pasted from a school worksheet (Feature 10). */
export interface CustomWordList {
  id: string;
  title: string;
  createdAt: string;
  /** Emptied when the list is archived, so the kept tombstone stays small */
  items: CustomWordItem[];
  /** Best session score (0–100) */
  bestScore?: number;
  /** ISO timestamp of the latest finished session */
  lastPracticedAt?: string;
  /** Local calendar date (YYYY-MM-DD) of the latest session that earned the full reward */
  lastRewardedDateStr?: string;
  /**
   * ISO timestamp of when the learner deleted the list. Lists are archived instead of removed,
   * because a removed list would come back from another device on the next merge.
   */
  archivedAt?: string;
}

/** Today's Dress-Up Studio practice toward the once-a-day reward (Feature 12). */
export interface DressUpDay {
  /** Local calendar date, YYYY-MM-DD */
  dateStr: string;
  /** Distinct wardrobe items put on today (the length of wornItemIds when it is there) */
  namedCount: number;
  /** Ids of the wardrobe items put on today; older profiles don't have it */
  wornItemIds?: string[];
  /** How many of them were named by voice */
  voiceCount: number;
  /** Whether today's dress-up reward was already given */
  isRewarded: boolean;
}

/** A dream written in the room's Dream Journal (Feature 12). */
export interface DreamEntry {
  id: string;
  createdAt: string;
  textEn: string;
  textHe: string;
  /** Optional free Hebrew note about the dream (not scored) */
  noteHe?: string;
}

/** A sticker the learner drew in the Sticker Studio (Feature 12). */
export interface DrawnSticker {
  id: string;
  /** The English name the learner gave it */
  nameEn: string;
  /** Small PNG data URL; emptied when the sticker is deleted */
  imageDataUrl: string;
  createdAt: string;
  /**
   * ISO timestamp of when the learner deleted it. Stickers are archived instead of removed,
   * because a removed sticker would come back from another device on the next merge.
   */
  archivedAt?: string;
}

/** The learner's room layout (Feature 12). Owned room items live in `unlockedRewardIds`. */
export interface LearnerRoom {
  /** Maps slotId -> placed room item id */
  placements: Record<string, string>;
  /** Maps wardrobe layer -> worn wardrobe item id; saved with the layout */
  outfit?: Record<string, string>;
  dressUpDay?: DressUpDay;
  /** Activity id -> local date (YYYY-MM-DD) of its latest full daily reward */
  activityRewardDates?: Record<string, string>;
  /** Saved dreams, newest first (at most 20) */
  dreamJournal?: DreamEntry[];
  /** Word game id -> best score (0–100) in the Games Book */
  gameBestScores?: Record<string, number>;
  /** Stickers drawn in the Sticker Studio, including deleted (archived) ones */
  drawnStickers?: DrawnSticker[];
  /** Sticker shown as the app background pattern; saved with the layout */
  backgroundStickerId?: string;
  /** Items the learner has said or spelled at least once (the first time earns XP) */
  namedItemIds: string[];
  /** ISO timestamp of the latest layout or outfit change; the newer one wins on merge */
  updatedAt: string;
}

/** How a daily contest ended for the learner (Feature 19). */
export type ContestOutcome = 'won' | 'lost' | 'tie' | 'friend-missed';

/** A decided daily contest; recording it also marks its diamonds as given. */
export interface ContestRecord {
  contestId: string;
  friendUid: string;
  friendName: string;
  /** Local date the contest was played for, YYYY-MM-DD */
  dateStr: string;
  myScorePercent: number;
  /** Missing when the friend didn't play */
  theirScorePercent?: number;
  outcome: ContestOutcome;
  diamondsEarned: number;
  recordedAt: string;
}

/** The learner's Friends Hub settings (Feature 19). Friends themselves live in Firestore. */
export interface FriendsHubState {
  /** The settings toggle; when off the hub is hidden and friends can't see the learner's progress */
  isEnabled: boolean;
  /** The learner's 6-character friend code, once claimed */
  friendCode?: string;
  /** When the code was claimed; if two devices each claimed one, the earlier code is kept */
  friendCodeCreatedAt?: string;
  /** Contests finished today that earned the full finishing reward */
  contestFinishDay?: { dateStr: string; count: number };
  /** Decided contests, newest first (at most 50) */
  contestHistory?: ContestRecord[];
  /** Whether others can find the learner by username (off unless turned on); the friend code always works */
  isUsernameSearchable?: boolean;
  /** When a parent approved turning the hub on for a learner under 13 */
  parentApprovedAt?: string;
  /** ISO timestamp of the latest toggle change; the newer one wins on merge */
  updatedAt: string;
}

export interface LearnerProfile {
  isOnboarded: boolean;
  name: string;
  age: number;
  gender: LearnerGender;
  /** The grade the learner practises (a placement test may move it) */
  gradeId: GradeId;
  /** The grade the learner is in at school, kept as the base of placement tests */
  schoolGradeId?: GradeId;
  preferredTier: ProficiencyTier;
  themeId: ThemeId;
  stats: LearnerStats;
  /** Maps missionId -> stars earned (0 to 3) */
  missionProgress: Record<string, number>;
  /** Unlocked shop item IDs */
  unlockedRewardIds: string[];
  /** Optional custom equipped avatar emoji from the shop */
  equippedAvatarEmoji?: string;
  /** Daily quest IDs claimed today */
  claimedDailyQuestIds: string[];
  /** Daily activity counters for quests and streaks */
  dailyCounters: DailyActivityCounters;
  /** Whether the user observes Shabbat and has streak protected on weekends */
  isShabbatObserver?: boolean;
  /** Read-aloud voice; a missing value means the female voice */
  voicePreference?: 'female' | 'male';
  /** When a parent agreed to the privacy notice at onboarding (learners under 13) */
  parentalConsentAt?: string;
  /** Whether the new user has seen and acknowledged the complimentary welcome diamonds modal */
  hasSeenWelcomeGiftModal?: boolean;
  /** Latest diagnostic placement test result, if the learner has taken it */
  placementResult?: PlacementResult;
  /** Active exam preparation plan, if the learner created one */
  examPrep?: ExamPrepPlan;
  /** Word lists imported from school worksheets, including archived (deleted) ones */
  customWordLists?: CustomWordList[];
  /** My English Room layout, once the learner has placed or named an item */
  room?: LearnerRoom;
  /** Friends Hub settings, once the learner opened the hub or changed its toggle */
  friendsHub?: FriendsHubState;
  /** Daily activity of the last 12 weeks, oldest first, for the weekly parent report */
  activityLog?: ActivityLogEntry[];
  /** Per-device diamond totals; `stats.diamonds` is their balance */
  diamondLedger?: DiamondLedger;
  /** Mission id -> local date of its last full reward, so replays can't farm diamonds */
  missionRewardDates?: Record<string, string>;
  /** Vault words rewarded today */
  vaultPractice?: VaultPracticeDay;
  createdAt: string;
  /** ISO timestamp of the latest profile update for conflict resolution */
  updatedAt?: string;
}

export const SUPPORTED_GRADES: GradeMetadata[] = [
  // Elementary School (יסודי)
  {
    id: 'grade-1',
    labelEn: '1st Grade',
    labelHe: 'כיתה א׳',
    ministryBand: 'Pre-Foundation (Phonics & Letters)',
    recommendedAge: 6,
    descriptionHe: 'אותיות ה-ABC, צלילים ראשונים, צבעים, חיות וברכות שלום',
  },
  {
    id: 'grade-2',
    labelEn: '2nd Grade',
    labelHe: 'כיתה ב׳',
    ministryBand: 'Pre-Foundation+ (CVC & Sight Words)',
    recommendedAge: 7,
    descriptionHe: 'קריאת מילים קצרות (CVC), משפחה, חלקי גוף ומילות יסוד',
  },
  {
    id: 'grade-3',
    labelEn: '3rd Grade',
    labelHe: 'כיתה ג׳',
    ministryBand: 'Pre-Band I (Early Reading)',
    recommendedAge: 8,
    descriptionHe: 'קריאה שוטפת, משפטים פשוטים, כלי כתיבה, ימים ומזג אוויר',
  },
  {
    id: 'grade-4',
    labelEn: '4th Grade',
    labelHe: 'כיתה ד׳',
    ministryBand: 'Band I (Entry)',
    recommendedAge: 9,
    descriptionHe: 'פועלי פעולה (Action Verbs), יכולת (Can/Can\'t), כינויי גוף ומשפטים ראשונים',
  },
  {
    id: 'grade-5',
    labelEn: '5th Grade',
    labelHe: 'כיתה ה׳',
    ministryBand: 'Band I (Foundation)',
    recommendedAge: 10,
    descriptionHe: 'אוצר מילים בסיסי, פועל Be (Am/Is/Are), הרגלים יומיים ותיאורים',
  },
  {
    id: 'grade-6',
    labelEn: '6th Grade',
    labelHe: 'כיתה ו׳',
    ministryBand: 'Band I+ (Transition to Junior High)',
    recommendedAge: 11,
    descriptionHe: 'חיזוק לקראת חטיבת הביניים, זמני הווה (Simple vs. Progressive) ותחביבים',
  },

  // Junior High / Middle School (חטיבת ביניים)
  {
    id: 'grade-7',
    labelEn: '7th Grade',
    labelHe: 'כיתה ז׳',
    ministryBand: 'Band II (Intermediate Entry)',
    recommendedAge: 12,
    descriptionHe: 'תוכנית משרד החינוך: Present Simple/Prog, Past Simple V2, Band II וקטעי Unseen',
  },
  {
    id: 'grade-8',
    labelEn: '8th Grade',
    labelHe: 'כיתה ח׳',
    ministryBand: 'Band II+ (Core Intermediate)',
    recommendedAge: 13,
    descriptionHe: 'העמקת זמנים, Past Progressive (While/When), Future Will/Going to ו-Modals',
  },
  {
    id: 'grade-9',
    labelEn: '9th Grade',
    labelHe: 'כיתה ט׳',
    ministryBand: 'Band II / Band III Prep',
    recommendedAge: 14,
    descriptionHe: 'Present Perfect Simple, משפטי תנאי (Conditionals), טיעונים ודיבייט',
  },

  // High School & Bagrut (תיכון ובגרות)
  {
    id: 'grade-10',
    labelEn: '10th Grade',
    labelHe: 'כיתה י׳',
    ministryBand: 'Band III (High School Entry)',
    recommendedAge: 15,
    descriptionHe: 'הכנה לשאלון C/E, סביל (Passive Voice), פסוקיות יחסיות ואוצר מילים Band III',
  },
  {
    id: 'grade-11',
    labelEn: '11th Grade',
    labelHe: 'כיתה י״א',
    ministryBand: 'Band III (Core / Module E)',
    recommendedAge: 16,
    descriptionHe: 'שאלון E/D, ספרות ואסטרטגיות חשיבה (HOTS), דיבור עקיף (Reported Speech) ותנאי מורכב',
  },
  {
    id: 'grade-12',
    labelEn: '12th Grade',
    labelHe: 'כיתה י״ב',
    ministryBand: 'Band III+ (Bagrut Mastery & Oral)',
    recommendedAge: 17,
    descriptionHe: 'שאלון G/F, חיבורי דעה וטיעון, סימולציית בגרות בעל-פה (Spoken Bagrut) ושליטה אקדמית',
  },
];

export function getRecommendedGradeForAge(age: number): GradeId {
  if (age <= 6) return 'grade-1';
  if (age === 7) return 'grade-2';
  if (age === 8) return 'grade-3';
  if (age === 9) return 'grade-4';
  if (age === 10) return 'grade-5';
  if (age === 11) return 'grade-6';
  if (age === 12) return 'grade-7';
  if (age === 13) return 'grade-8';
  if (age === 14) return 'grade-9';
  if (age === 15) return 'grade-10';
  if (age === 16) return 'grade-11';
  return 'grade-12';
}
