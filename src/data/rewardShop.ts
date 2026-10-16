import { DailyActivityCounters, LearnerGender } from '../types/learner';
import { inflectHebrew } from '../utils/hebrewGender';

export type RewardCategory = 'avatar' | 'sticker' | 'studio-decor' | 'boost';

export interface RewardShopItem {
  id: string;
  category: RewardCategory;
  emoji: string;
  titleEn: string;
  titleHe: string;
  descriptionHe: string;
  costDiamonds: number;
}

export interface DailyQuestDefinition {
  id: string;
  icon: string;
  titleEn: string;
  titleHe: string;
  targetCount: number;
  rewardDiamonds: number;
  rewardXp: number;
  getCurrentCount: (counters: DailyActivityCounters) => number;
}

export const DAILY_QUESTS: DailyQuestDefinition[] = [
  {
    id: 'quest-daily-mission',
    icon: '🎯',
    titleEn: 'Complete 1 Mission Today',
    titleHe: 'השלימי משימה אחת היום',
    targetCount: 1,
    rewardDiamonds: 20,
    rewardXp: 30,
    getCurrentCount: (c) => c.missionsCompletedToday,
  },
  {
    id: 'quest-voice-words',
    icon: '🎙️',
    titleEn: 'Practice Speaking 2 Words or Sentences',
    titleHe: 'תרגלי הגייה של 2 מילים או משפטים במיקרופון',
    targetCount: 2,
    rewardDiamonds: 15,
    rewardXp: 25,
    getCurrentCount: (c) => c.voiceWordsPracticedToday,
  },
  {
    id: 'quest-three-stars',
    icon: '⭐',
    titleEn: 'Finish a Mission with 3 Stars',
    titleHe: 'סיימי משימה עם 3 כוכבים מלאים',
    targetCount: 1,
    rewardDiamonds: 25,
    rewardXp: 40,
    getCurrentCount: (c) => c.threeStarMissionsToday,
  },
];

export const REWARD_SHOP_ITEMS: RewardShopItem[] = [
  // Equippable Avatars
  {
    id: 'avatar-boba-cat',
    category: 'avatar',
    emoji: '🧋',
    titleEn: 'Seoul Boba Tea',
    titleHe: 'בובה-טי מסיאול (ברירת מחדל)',
    descriptionHe: 'הסמל הרשמי של סטודיו PeachNote!',
    costDiamonds: 0,
  },
  {
    id: 'avatar-kpop-bunny',
    category: 'avatar',
    emoji: '🐰',
    titleEn: 'Pastel K-Pop Bunny',
    titleHe: 'ארנבונת K-Pop פסטלית',
    descriptionHe: 'אווטאר חמוד במיוחד שמופיע בראש הדשבורד ובצ׳אטים!',
    costDiamonds: 40,
  },
  {
    id: 'avatar-star-fox',
    category: 'avatar',
    emoji: '🦊',
    titleEn: 'Nova the Starlight Fox',
    titleHe: 'נובה שועלת הכוכבים',
    descriptionHe: 'שועלה קסומה שמלווה אותך במשימות המסתורין.',
    costDiamonds: 60,
  },
  {
    id: 'avatar-crown-queen',
    category: 'avatar',
    emoji: '👑',
    titleEn: 'Golden English Crown',
    titleHe: 'כתר אלופת האנגלית',
    descriptionHe: 'אווטאר מלכותי למי שצוברת כוכבים ומתמידה ברצף!',
    costDiamonds: 90,
  },
  {
    id: 'avatar-butterfly',
    category: 'avatar',
    emoji: '🦋',
    titleEn: 'Crystal Butterfly',
    titleHe: 'פרפר הקריסטל הכחול',
    descriptionHe: 'אווטאר נדיר וזוהר לדשבורד האישי.',
    costDiamonds: 75,
  },

  // Collectible Aesthetic Stickers
  {
    id: 'sticker-strawberry-croissant',
    category: 'sticker',
    emoji: '🥐',
    titleEn: 'Strawberry Café Sticker',
    titleHe: 'מדבקת קרואסון תות מפרק 1',
    descriptionHe: 'מדבקה לאלבום הסטודיו: מזכרת מבית הקפה בסיאול.',
    costDiamonds: 35,
  },
  {
    id: 'sticker-backstage-pass',
    category: 'sticker',
    emoji: '🎸',
    titleEn: 'VIP Backstage Guitar',
    titleHe: 'מדבקת גיטרה מאחורי הקלעים',
    descriptionHe: 'מדבקת VIP נדירה מפרק 2 (Present Progressive).',
    costDiamonds: 50,
  },
  {
    id: 'sticker-london-compass',
    category: 'sticker',
    emoji: '🧭',
    titleEn: 'Golden London Compass',
    titleHe: 'מדבקת המצפן המוזהב מלונדון',
    descriptionHe: 'מזכרת מחקירת הבלשית במוזיאון הבריטי (פרק 3).',
    costDiamonds: 65,
  },

  // Studio Decor & Streak Boosts
  {
    id: 'decor-neon-lamp',
    category: 'studio-decor',
    emoji: '🌸',
    titleEn: 'Cherry Blossom Desk Lamp',
    titleHe: 'מנורת פריחת הדובדבן לחדר',
    descriptionHe: 'מקשטת את הסטודיו האישי שלך באור ורוד חמים.',
    costDiamonds: 55,
  },
  {
    id: 'boost-streak-shield',
    category: 'boost',
    emoji: '🛡️',
    titleEn: 'Extra Weekday Streak Shield',
    titleHe: 'מגן רצף נוסף לימי חול + בונוס יום ברצף',
    descriptionHe: 'שומר על הרצף שלך גם אם פספסת יום לימודים עמוס ומוסיף +1 לרצף!',
    costDiamonds: 50,
  },
];

export function getDailyQuests(gender: LearnerGender): DailyQuestDefinition[] {
  return DAILY_QUESTS.map((q) => ({
    ...q,
    titleHe: inflectHebrew(q.titleHe, gender),
  }));
}

export function getRewardShopItems(gender: LearnerGender): RewardShopItem[] {
  return REWARD_SHOP_ITEMS.map((item) => ({
    ...item,
    titleHe: inflectHebrew(item.titleHe, gender),
    descriptionHe: inflectHebrew(item.descriptionHe, gender),
  }));
}
