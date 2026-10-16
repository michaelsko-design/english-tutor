export type LearnerGender = 'girl' | 'boy';

export type GradeId = 'grade-5' | 'grade-6' | 'grade-7' | 'grade-8' | 'grade-9';

export type ProficiencyTier = 'explorer' | 'challenger' | 'master';

export type ThemeId = 'cozy-studio' | 'neon-pop' | 'starlight-rpg';

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
  diamonds: number;
  streakDays: number;
  shabbatShieldActive: boolean;
  wordsMastered: number;
  missionsCompleted: number;
}

export interface DailyActivityCounters {
  dateStr: string;
  missionsCompletedToday: number;
  voiceWordsPracticedToday: number;
  threeStarMissionsToday: number;
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

export interface LearnerProfile {
  isOnboarded: boolean;
  name: string;
  age: number;
  gender: LearnerGender;
  gradeId: GradeId;
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
  createdAt: string;
}

export const SUPPORTED_GRADES: GradeMetadata[] = [
  {
    id: 'grade-5',
    labelEn: '5th Grade',
    labelHe: 'כיתה ה׳',
    ministryBand: 'Band I (Foundation)',
    recommendedAge: 10,
    descriptionHe: 'אוצר מילים בסיסי, קריאה ראשונית ומשפטים פשוטים',
  },
  {
    id: 'grade-6',
    labelEn: '6th Grade',
    labelHe: 'כיתה ו׳',
    ministryBand: 'Band I+ (Foundation)',
    recommendedAge: 11,
    descriptionHe: 'חיזוק הבסיס לקראת חטיבת הביניים וזמני הווה',
  },
  {
    id: 'grade-7',
    labelEn: '7th Grade',
    labelHe: 'כיתה ז׳',
    ministryBand: 'Band II (Intermediate Entry)',
    recommendedAge: 12,
    descriptionHe: 'תוכנית משרד החינוך לכיתה ז׳: Present Simple/Prog, Past Simple, אוצר מילים Band II וקטעי Unseen',
  },
  {
    id: 'grade-8',
    labelEn: '8th Grade',
    labelHe: 'כיתה ח׳',
    ministryBand: 'Band II+ (Intermediate)',
    recommendedAge: 13,
    descriptionHe: 'העמקת זמנים, Future, Modals, כתיבה והבנת הנקרא מתקדמת',
  },
  {
    id: 'grade-9',
    labelEn: '9th Grade',
    labelHe: 'כיתה ט׳',
    ministryBand: 'Band II / Band III Prep',
    recommendedAge: 14,
    descriptionHe: 'אנגלית ברמה גבוהה, ניבים, Passive וקריאה ביקורתית',
  },
];

export function getRecommendedGradeForAge(age: number): GradeId {
  if (age <= 10) return 'grade-5';
  if (age === 11) return 'grade-6';
  if (age === 12) return 'grade-7';
  if (age === 13) return 'grade-8';
  return 'grade-9';
}
