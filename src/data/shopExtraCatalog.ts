import type { RewardRarity } from './shopRarity';

/** Extra Reward Shop avatars (dashboard avatars, emoji only) and wardrobe accessories. */

export interface ExtraAvatarEntry {
  id: string;
  emoji: string;
  titleEn: string;
  titleHe: string;
  costDiamonds: number;
  rarity: RewardRarity;
}

export type ExtraWearLayer = 'head' | 'face' | 'neck' | 'torso';

export interface ExtraWearEntry {
  id: string;
  emoji: string;
  nameEn: string;
  nameHe: string;
  layer: ExtraWearLayer;
  isHumanOnly: boolean;
  costDiamonds: number;
  rarity: RewardRarity;
}

const avatar = (
  slug: string,
  emoji: string,
  titleEn: string,
  titleHe: string,
  costDiamonds: number,
  rarity: RewardRarity
): ExtraAvatarEntry => ({ id: `avatar-${slug}`, emoji, titleEn, titleHe, costDiamonds, rarity });

export const EXTRA_AVATARS: ExtraAvatarEntry[] = [
  // Common
  avatar('duck', '🦆', 'Duck', 'ברווזון', 40, 'common'),
  avatar('chicken', '🐔', 'Chicken', 'תרנגולת', 40, 'common'),
  avatar('frog', '🐸', 'Frog', 'צפרדע', 40, 'common'),
  avatar('piglet', '🐷', 'Piglet', 'חזרזיר', 40, 'common'),
  avatar('tiger', '🐯', 'Tiger', 'נמר', 45, 'common'),
  avatar('bear', '🐻', 'Bear', 'דובי', 45, 'common'),
  avatar('hamster', '🐹', 'Hamster', 'אוגר', 45, 'common'),
  avatar('sheep', '🐑', 'Sheep', 'כבשה', 45, 'common'),
  avatar('cow', '🐄', 'Cow', 'פרה', 45, 'common'),
  avatar('turtle', '🐢', 'Turtle', 'צב', 50, 'common'),
  avatar('fish', '🐠', 'Fish', 'דג צבעוני', 50, 'common'),
  avatar('monkey', '🐒', 'Monkey', 'קוף', 55, 'common'),
  avatar('lizard', '🦎', 'Lizard', 'לטאה', 55, 'common'),
  avatar('pony', '🐴', 'Pony', 'פוני', 55, 'common'),
  avatar('snake', '🐍', 'Snake', 'נחש', 60, 'common'),
  avatar('elephant', '🐘', 'Elephant', 'פיל', 60, 'common'),
  avatar('giraffe', '🦒', 'Giraffe', 'ג׳ירפה', 60, 'common'),
  avatar('crocodile', '🐊', 'Crocodile', 'תנין', 70, 'common'),
  // Rare
  avatar('zebra', '🦓', 'Zebra', 'זברה', 100, 'rare'),
  avatar('lion', '🦁', 'Lion', 'אריה', 110, 'rare'),
  avatar('kangaroo', '🦘', 'Kangaroo', 'קנגורו', 120, 'rare'),
  avatar('owl', '🦉', 'Wise Owl', 'ינשוף חכם', 120, 'rare'),
  avatar('parrot', '🦜', 'Parrot', 'תוכי', 130, 'rare'),
  avatar('octopus', '🐙', 'Octopus', 'תמנון', 140, 'rare'),
  avatar('eagle', '🦅', 'Eagle', 'נשר', 150, 'rare'),
  avatar('whale', '🐳', 'Whale', 'לווייתן', 160, 'rare'),
  // Epic
  avatar('ghost', '👻', 'Friendly Ghost', 'רוח רפאים חמודה', 260, 'epic'),
  avatar('robot', '🤖', 'Robot Buddy', 'רובוט חבר', 280, 'epic'),
  avatar('unicorn', '🦄', 'Unicorn', 'חד קרן', 300, 'epic'),
  avatar('dragon', '🐉', 'Dragon', 'דרקון', 380, 'epic'),
  // Legendary
  avatar('star', '🌟', 'Super Star', 'כוכב על', 500, 'legendary'),
  avatar('rocket', '🚀', 'Rocket', 'טיל חלל', 600, 'legendary'),
  avatar('castle', '🏰', 'Castle', 'טירה', 700, 'legendary'),
];

const wear = (
  slug: string,
  emoji: string,
  nameEn: string,
  nameHe: string,
  layer: ExtraWearLayer,
  isHumanOnly: boolean,
  costDiamonds: number,
  rarity: RewardRarity
): ExtraWearEntry => ({ id: `wear-${slug}`, emoji, nameEn, nameHe, layer, isHumanOnly, costDiamonds, rarity });

export const EXTRA_WEAR: ExtraWearEntry[] = [
  wear('flower', '🌺', 'flower', 'פרח לשיער', 'head', false, 45, 'common'),
  wear('headphones', '🎧', 'headphones', 'אוזניות', 'head', false, 60, 'common'),
  wear('mask', '🎭', 'mask', 'מסכה', 'face', false, 90, 'common'),
  wear('badge', '🎖️', 'badge', 'אות כבוד', 'neck', false, 110, 'rare'),
  wear('golden-key', '🗝️', 'golden key', 'מפתח זהב', 'neck', false, 120, 'rare'),
  wear('medal', '🏅', 'medal', 'מדליה', 'neck', false, 130, 'rare'),
  wear('suit', '👔', 'suit', 'חליפה', 'torso', true, 140, 'rare'),
  wear('gold-medal', '🥇', 'gold medal', 'מדליית זהב', 'neck', false, 200, 'epic'),
  wear('cape', '🦸', 'cape', 'גלימת גיבור', 'torso', true, 260, 'epic'),
  wear('diamond', '💎', 'diamond', 'יהלום', 'neck', false, 300, 'epic'),
];
