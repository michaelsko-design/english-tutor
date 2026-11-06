import type { RewardRarity, SeasonId } from './shopRarity';

/**
 * Stickers and decor sold in the Reward Shop that live in My English Room. Each one is a room item
 * (placeable) and a shop card (id, price, rarity). Emoji must use literals: the icon-bounds script
 * (scripts/art/measure_icon_bounds.py) reads this file.
 */
export type ShopRoomSlot = 'floor' | 'desk' | 'wall' | 'shelf' | 'board';

export interface ShopRoomEntry {
  id: string;
  emoji: string;
  nameEn: string;
  nameHe: string;
  slotKind: ShopRoomSlot;
  /** 'sticker' is sold under the stickers tab, 'decor' under room decor */
  shopCategory: 'sticker' | 'studio-decor';
  costDiamonds: number;
  rarity: RewardRarity;
  season?: SeasonId;
}

export const EXTRA_SHOP_ROOM_ITEMS: ShopRoomEntry[] = [
  // Stickers, common
  { id: 'sticker-pizza', emoji: '🍕', nameEn: 'pizza', nameHe: 'פיצה', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 35, rarity: 'common' },
  { id: 'sticker-donut', emoji: '🍩', nameEn: 'donut', nameHe: 'סופגנייה', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 35, rarity: 'common' },
  { id: 'sticker-ice-cream', emoji: '🍦', nameEn: 'ice cream', nameHe: 'גלידה', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 35, rarity: 'common' },
  { id: 'sticker-strawberry', emoji: '🍓', nameEn: 'strawberry', nameHe: 'תות', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 35, rarity: 'common' },
  { id: 'sticker-lemon', emoji: '🍋', nameEn: 'lemon', nameHe: 'לימון', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 35, rarity: 'common' },
  { id: 'sticker-cookie', emoji: '🍪', nameEn: 'cookie', nameHe: 'עוגייה', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 40, rarity: 'common' },
  { id: 'sticker-cupcake', emoji: '🧁', nameEn: 'cupcake', nameHe: 'קאפקייק', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 40, rarity: 'common' },
  { id: 'sticker-cake', emoji: '🍰', nameEn: 'cake', nameHe: 'עוגה', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 45, rarity: 'common' },
  { id: 'sticker-lollipop', emoji: '🍭', nameEn: 'lollipop', nameHe: 'סוכרייה על מקל', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 45, rarity: 'common' },
  { id: 'sticker-chocolate', emoji: '🍫', nameEn: 'chocolate', nameHe: 'שוקולד', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 45, rarity: 'common' },
  // Stickers, rare
  { id: 'sticker-game', emoji: '🎮', nameEn: 'game', nameHe: 'משחק', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 110, rarity: 'rare' },
  { id: 'sticker-camera', emoji: '📷', nameEn: 'camera', nameHe: 'מצלמה', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 100, rarity: 'rare' },
  { id: 'sticker-violin', emoji: '🎻', nameEn: 'violin', nameHe: 'כינור', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 110, rarity: 'rare' },
  { id: 'sticker-piano', emoji: '🎹', nameEn: 'piano', nameHe: 'פסנתר', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 120, rarity: 'rare' },
  { id: 'sticker-volcano', emoji: '🌋', nameEn: 'volcano', nameHe: 'הר געש', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 130, rarity: 'rare' },
  { id: 'sticker-airplane', emoji: '✈️', nameEn: 'airplane', nameHe: 'מטוס', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 140, rarity: 'rare' },
  // Stickers, epic and legendary
  { id: 'sticker-fireworks', emoji: '🎆', nameEn: 'fireworks', nameHe: 'זיקוקים', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 260, rarity: 'epic' },
  { id: 'sticker-galaxy', emoji: '🌌', nameEn: 'galaxy', nameHe: 'גלקסיה', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 300, rarity: 'epic' },
  { id: 'sticker-circus', emoji: '🎪', nameEn: 'circus', nameHe: 'קרקס', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 280, rarity: 'epic' },
  { id: 'sticker-gold-coin', emoji: '🪙', nameEn: 'gold coin', nameHe: 'מטבע זהב', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 500, rarity: 'legendary' },

  // Decor
  { id: 'decor-pine-tree', emoji: '🌲', nameEn: 'pine tree', nameHe: 'אורן', slotKind: 'floor', shopCategory: 'studio-decor', costDiamonds: 70, rarity: 'common' },
  { id: 'decor-bike', emoji: '🚲', nameEn: 'bike', nameHe: 'אופניים', slotKind: 'floor', shopCategory: 'studio-decor', costDiamonds: 120, rarity: 'rare' },
  { id: 'decor-train', emoji: '🚂', nameEn: 'train', nameHe: 'רכבת', slotKind: 'floor', shopCategory: 'studio-decor', costDiamonds: 220, rarity: 'epic' },
  { id: 'decor-shell', emoji: '🐚', nameEn: 'shell', nameHe: 'צדף', slotKind: 'desk', shopCategory: 'studio-decor', costDiamonds: 40, rarity: 'common' },
  { id: 'decor-candle', emoji: '🕯️', nameEn: 'candle', nameHe: 'נר', slotKind: 'desk', shopCategory: 'studio-decor', costDiamonds: 50, rarity: 'common' },
  { id: 'decor-dice', emoji: '🎲', nameEn: 'dice', nameHe: 'קוביות', slotKind: 'desk', shopCategory: 'studio-decor', costDiamonds: 55, rarity: 'common' },
  { id: 'decor-puzzle', emoji: '🧩', nameEn: 'puzzle', nameHe: 'פאזל', slotKind: 'desk', shopCategory: 'studio-decor', costDiamonds: 60, rarity: 'common' },
  { id: 'decor-chess', emoji: '♟️', nameEn: 'chess', nameHe: 'שחמט', slotKind: 'desk', shopCategory: 'studio-decor', costDiamonds: 100, rarity: 'rare' },
  { id: 'decor-tv', emoji: '📺', nameEn: 'TV', nameHe: 'טלוויזיה', slotKind: 'desk', shopCategory: 'studio-decor', costDiamonds: 110, rarity: 'rare' },
  { id: 'decor-microscope', emoji: '🔬', nameEn: 'microscope', nameHe: 'מיקרוסקופ', slotKind: 'desk', shopCategory: 'studio-decor', costDiamonds: 150, rarity: 'rare' },
  { id: 'decor-tulip', emoji: '🌷', nameEn: 'tulip', nameHe: 'צבעוני', slotKind: 'shelf', shopCategory: 'studio-decor', costDiamonds: 45, rarity: 'common' },
  { id: 'decor-clover', emoji: '🍀', nameEn: 'clover', nameHe: 'תלתן', slotKind: 'shelf', shopCategory: 'studio-decor', costDiamonds: 50, rarity: 'common' },
  { id: 'decor-vase', emoji: '🏺', nameEn: 'vase', nameHe: 'אגרטל', slotKind: 'shelf', shopCategory: 'studio-decor', costDiamonds: 60, rarity: 'common' },
  { id: 'decor-doll', emoji: '🪆', nameEn: 'doll', nameHe: 'בובה', slotKind: 'shelf', shopCategory: 'studio-decor', costDiamonds: 90, rarity: 'common' },
  { id: 'decor-crystal-ball', emoji: '🔮', nameEn: 'crystal ball', nameHe: 'כדור קסמים', slotKind: 'shelf', shopCategory: 'studio-decor', costDiamonds: 320, rarity: 'epic' },
  { id: 'decor-map', emoji: '🗺️', nameEn: 'map', nameHe: 'מפה', slotKind: 'wall', shopCategory: 'studio-decor', costDiamonds: 70, rarity: 'common' },
  { id: 'decor-window', emoji: '🪟', nameEn: 'window', nameHe: 'חלון', slotKind: 'wall', shopCategory: 'studio-decor', costDiamonds: 90, rarity: 'common' },
  { id: 'decor-moon', emoji: '🌙', nameEn: 'moon', nameHe: 'ירח', slotKind: 'wall', shopCategory: 'studio-decor', costDiamonds: 100, rarity: 'rare' },
  { id: 'decor-sun', emoji: '☀️', nameEn: 'sun', nameHe: 'שמש', slotKind: 'wall', shopCategory: 'studio-decor', costDiamonds: 80, rarity: 'common' },

  // Seasonal (shown to buy only inside their window; owned items stay)
  { id: 'season-menorah', emoji: '🕎', nameEn: 'menorah', nameHe: 'חנוכייה', slotKind: 'shelf', shopCategory: 'studio-decor', costDiamonds: 150, rarity: 'rare', season: 'hanukkah' },
  { id: 'season-snowflake', emoji: '❄️', nameEn: 'snowflake', nameHe: 'פתית שלג', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 80, rarity: 'common', season: 'winter' },
  { id: 'season-snowman', emoji: '⛄', nameEn: 'snowman', nameHe: 'איש שלג', slotKind: 'floor', shopCategory: 'studio-decor', costDiamonds: 130, rarity: 'rare', season: 'winter' },
  { id: 'season-honey', emoji: '🍯', nameEn: 'honey', nameHe: 'דבש', slotKind: 'desk', shopCategory: 'studio-decor', costDiamonds: 100, rarity: 'rare', season: 'tishrei' },
  { id: 'season-apple', emoji: '🍎', nameEn: 'apple', nameHe: 'תפוח', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 60, rarity: 'common', season: 'tishrei' },
  { id: 'season-matzah', emoji: '🫓', nameEn: 'matzah', nameHe: 'מצה', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 80, rarity: 'common', season: 'pesach' },
  { id: 'season-flag', emoji: '🇮🇱', nameEn: 'flag', nameHe: 'דגל', slotKind: 'wall', shopCategory: 'studio-decor', costDiamonds: 120, rarity: 'rare', season: 'independence' },
  { id: 'season-beach', emoji: '🏖️', nameEn: 'beach', nameHe: 'חוף', slotKind: 'wall', shopCategory: 'studio-decor', costDiamonds: 140, rarity: 'rare', season: 'summer' },
  { id: 'season-watermelon', emoji: '🍉', nameEn: 'watermelon', nameHe: 'אבטיח', slotKind: 'board', shopCategory: 'sticker', costDiamonds: 60, rarity: 'common', season: 'summer' },
  { id: 'season-palm-tree', emoji: '🌴', nameEn: 'palm tree', nameHe: 'דקל', slotKind: 'floor', shopCategory: 'studio-decor', costDiamonds: 150, rarity: 'rare', season: 'summer' },
];
