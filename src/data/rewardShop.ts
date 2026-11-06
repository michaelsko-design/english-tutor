import { DailyActivityCounters, LearnerGender } from '../types/learner';
import { inflectHebrew } from '../utils/hebrewGender';

import { EXTRA_AVATARS, EXTRA_WEAR } from './shopExtraCatalog';
import { EXTRA_SHOP_ROOM_ITEMS } from './shopRoomItems';
import { RewardRarity, SeasonId, SEASON_WINDOWS } from './shopRarity';

export type RewardCategory = 'avatar' | 'accessory' | 'sticker' | 'studio-decor' | 'boost' | 'mystery';

export interface RewardShopItem {
  id: string;
  category: RewardCategory;
  emoji: string;
  titleEn: string;
  titleHe: string;
  descriptionHe: string;
  costDiamonds: number;
  /** Missing = derived from the price (see rarityFromCost) */
  rarity?: RewardRarity;
  /** Limited-time item: can only be bought inside the season's window */
  season?: SeasonId;
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

export type MysteryBoxTier = 'bronze' | 'silver' | 'gold';

/** Mystery boxes are shop cards that can be bought again and again, like the streak shield. */
export const MYSTERY_BOX_ITEMS: RewardShopItem[] = [
  { id: 'mystery-bronze', category: 'mystery', emoji: '🎁', titleEn: 'Bronze Mystery Box', titleHe: 'קופסת הפתעה ארד', descriptionHe: 'פריט אקראי שעוד אין לך. לרוב רגיל, לפעמים נדיר!', costDiamonds: 60 },
  { id: 'mystery-silver', category: 'mystery', emoji: '🎁', titleEn: 'Silver Mystery Box', titleHe: 'קופסת הפתעה כסף', descriptionHe: 'פריט אקראי שעוד אין לך. סיכוי טוב לנדיר ואפילו לאפי!', costDiamonds: 150 },
  { id: 'mystery-gold', category: 'mystery', emoji: '🎁', titleEn: 'Gold Mystery Box', titleHe: 'קופסת הפתעה זהב', descriptionHe: 'פריט אקראי שעוד אין לך. נדיר, אפי ואפילו אגדי!', costDiamonds: 350 },
];

export const REWARD_SHOP_ITEMS: RewardShopItem[] = [
  // Equippable Avatars
  {
    id: 'avatar-boba-cat',
    category: 'avatar',
    emoji: '🧋',
    titleEn: 'Seoul Boba Tea',
    titleHe: 'בובה-טי מסיאול (ברירת מחדל)',
    descriptionHe: 'הסמל הרשמי של EnglishVibe!',
    costDiamonds: 0,
  },
  // Free starter avatars that live in My English Room (Feature 12)
  ...[
    { id: 'avatar-starter-girl', emoji: '👧', titleEn: 'Girl', titleHe: 'ילדה' },
    { id: 'avatar-starter-boy', emoji: '👦', titleEn: 'Boy', titleHe: 'ילד' },
    { id: 'avatar-starter-dog', emoji: '🐶', titleEn: 'Puppy', titleHe: 'כלבלב' },
    { id: 'avatar-starter-cat', emoji: '🐱', titleEn: 'Kitten', titleHe: 'חתלתול' },
    { id: 'avatar-starter-panda', emoji: '🐼', titleEn: 'Panda', titleHe: 'פנדה' },
  ].map(
    (starter): RewardShopItem => ({
      ...starter,
      category: 'avatar',
      descriptionHe: 'אווטאר חינמי שגר איתך בחדר האנגלי.',
      costDiamonds: 0,
    })
  ),
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
    titleEn: 'Comet the Starlight Fox',
    titleHe: 'שביט שועל הכוכבים',
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

  // Wardrobe accessories for My English Room (Feature 12); ids match the wardrobe items
  {
    id: 'wear-sunglasses',
    category: 'accessory',
    emoji: '🕶️',
    titleEn: 'Sunglasses',
    titleHe: 'משקפי שמש לארון',
    descriptionHe: 'אקססורי לאווטאר בחדר האנגלי. כדי ללבוש אותו אומרים או מאייתים "sunglasses".',
    costDiamonds: 40,
  },
  {
    id: 'wear-graduation-cap',
    category: 'accessory',
    emoji: '🎓',
    titleEn: 'Graduation Cap',
    titleHe: 'כובע סיום לארון',
    descriptionHe: 'כובע של אלופי אנגלית! כדי ללבוש אותו אומרים או מאייתים "graduation cap".',
    costDiamonds: 50,
  },
  {
    id: 'wear-crown',
    category: 'accessory',
    emoji: '👑',
    titleEn: 'Crown',
    titleHe: 'כתר לארון',
    descriptionHe: 'כתר מלכותי לאווטאר בחדר. כדי ללבוש אותו אומרים או מאייתים "crown".',
    costDiamonds: 70,
  },

  // Collectible Aesthetic Stickers
  {
    id: 'pass-sticker-studio',
    category: 'sticker',
    emoji: '🎨',
    titleEn: 'Sticker Studio Pass',
    titleHe: 'כרטיס לסטודיו המדבקות',
    descriptionHe: 'פרימיום: ציור מדבקות משלך בחדר האנגלי — עם שם באנגלית לכל מדבקה!',
    costDiamonds: 150,
  },
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
    titleHe: 'מגן רצף לימי חול',
    descriptionHe: 'שומר על הרצף שלך ביום לימודים שפספסת. כל מגן שומר על יום אחד, ואפשר לקנות עוד.',
    costDiamonds: 50,
  },

  // Mystery boxes: open one for a random item you don't own yet (see mysteryBox.ts)
  ...MYSTERY_BOX_ITEMS,

  // Expansion catalog (rarity tiers, seasonal items)
  ...EXTRA_AVATARS.map(
    (a): RewardShopItem => ({
      id: a.id,
      category: 'avatar',
      emoji: a.emoji,
      titleEn: a.titleEn,
      titleHe: a.titleHe,
      descriptionHe: 'אווטאר חדש לדשבורד. אפשר להצמיד אותו כאווטאר הראשי.',
      costDiamonds: a.costDiamonds,
      rarity: a.rarity,
    })
  ),
  ...EXTRA_WEAR.map(
    (w): RewardShopItem => ({
      id: w.id,
      category: 'accessory',
      emoji: w.emoji,
      titleEn: w.nameEn,
      titleHe: `${w.nameHe} לארון`,
      descriptionHe: `אקססורי לאווטאר בחדר האנגלי. כדי ללבוש אותו אומרים או מאייתים "${w.nameEn}".`,
      costDiamonds: w.costDiamonds,
      rarity: w.rarity,
    })
  ),
  ...EXTRA_SHOP_ROOM_ITEMS.map(
    (r): RewardShopItem => ({
      id: r.id,
      category: r.shopCategory,
      emoji: r.emoji,
      titleEn: r.nameEn,
      titleHe: r.nameHe,
      descriptionHe: r.season
        ? `פריט לחדר האנגלי. זמין רק בעונת ${SEASON_WINDOWS[r.season].labelHe}!`
        : r.shopCategory === 'sticker'
          ? 'מדבקה לאלבום ולחדר האנגלי. כדי להניח אותה אומרים או מאייתים את שמה.'
          : 'פריט עיצוב לחדר האנגלי. כדי להניח אותו אומרים או מאייתים את שמו.',
      costDiamonds: r.costDiamonds,
      rarity: r.rarity,
      season: r.season,
    })
  ),
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
