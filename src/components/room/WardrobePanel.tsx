import React, { useState } from 'react';
import { celebrate } from '../../utils/celebrate';
import {
  DRESS_UP_DAILY_GOAL,
  DRESS_UP_REWARD_DIAMONDS,
  DRESS_UP_REWARD_XP,
  NamingMethod,
  canWear,
  getDressUpDay,
  getOwnedWardrobeItems,
  getWardrobeDistractors,
  getWardrobeItem,
  getWornItems,
  isHumanAvatar,
  putOnWardrobeItem,
  takeOffWardrobeLayer,
} from '../../data/wardrobe';
import { LearnerProfile, ProficiencyTier } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { DressedAvatar } from './DressedAvatar';
import { NameItemPanel } from './NameItemPanel';
import { RoomPanelFrame } from './RoomPanelFrame';
import { formatGainLtr } from '../../utils/bidi';

interface WardrobePanelProps {
  profile: LearnerProfile;
  avatarEmoji: string;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onClose: () => void;
}

/** Explorer may also pick the name from three choices; Master must spell it. */
const NAMING_MODES: Record<ProficiencyTier, NamingMethod[]> = {
  explorer: ['say', 'choose', 'spell'],
  challenger: ['say', 'spell'],
  master: ['spell'],
};

/** Feature 12, phase 2: the Dress-Up Studio opened from the wardrobe. */
export const WardrobePanel: React.FC<WardrobePanelProps> = ({
  profile,
  avatarEmoji,
  theme,
  onUpdateProfile,
  onSpeakEnglish,
  onClose,
}) => {
  const isGirl = profile.gender === 'girl';
  const [namingId, setNamingId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [salt] = useState(() => Math.floor(Math.random() * 1_000_000_000));

  const owned = getOwnedWardrobeItems(profile);
  const worn = getWornItems(profile, avatarEmoji);
  const wornIds = worn.map((item) => item.id);
  const day = getDressUpDay(profile, new Date());
  const namingItem = namingId ? getWardrobeItem(namingId) : undefined;

  const handleTapItem = (itemId: string) => {
    const item = getWardrobeItem(itemId);
    if (!item) return;
    if (wornIds.includes(itemId)) {
      onUpdateProfile(takeOffWardrobeLayer(profile, item.layer, new Date()));
      setStatusText(`${item.emoji} ${item.nameEn} — הורדת 👋`);
      return;
    }
    if (!canWear(item, avatarEmoji)) {
      setStatusText('את הבגד הזה לובשים רק אווטארים של ילדה או ילד 👧👦');
      return;
    }
    setStatusText(null);
    setNamingId(itemId);
  };

  const handleNamed = (method: NamingMethod) => {
    if (!namingItem) return;
    const result = putOnWardrobeItem(profile, namingItem.id, avatarEmoji, method, new Date());
    onUpdateProfile(result.profile);
    if (result.isDailyRewardEarned) celebrate('medium');
    const rewards = [
      result.xpEarned > 0 ? formatGainLtr(result.xpEarned, 'XP') : '',
      result.diamondsEarned > 0 ? formatGainLtr(result.diamondsEarned, '💎') : '',
    ]
      .filter(Boolean)
      .join(' ');
    setStatusText(
      result.isDailyRewardEarned
        ? `${isGirl ? 'מהממת' : 'מהמם'}! השלמת את אתגר ההלבשה היומי 🎉 ${rewards}`
        : `לבשת ${namingItem.nameEn} ${namingItem.emoji}${rewards ? ` · ${rewards}` : ''}`
    );
    setNamingId(null);
  };

  const progressText = day.isRewarded
    ? '✓ קיבלת היום את פרס ההלבשה. אפשר להמשיך להתלבש בכיף!'
    : `היום: ${Math.min(day.namedCount, DRESS_UP_DAILY_GOAL)}/${DRESS_UP_DAILY_GOAL} פריטים — פרס יומי ${formatGainLtr(DRESS_UP_REWARD_XP, 'XP')} ו־${DRESS_UP_REWARD_DIAMONDS} 💎`;

  if (namingItem) {
    return (
      <NameItemPanel
        key={namingItem.id}
        item={namingItem}
        gender={profile.gender}
        theme={theme}
        modes={NAMING_MODES[profile.preferredTier]}
        distractorNames={getWardrobeDistractors(namingItem, `${namingItem.id}-${salt}`)}
        goalHe={`כדי ללבוש: ${namingItem.nameHe}`}
        nextLabel="ללבוש ✨"
        onSpeakEnglish={onSpeakEnglish}
        onNamed={handleNamed}
        onCancel={() => setNamingId(null)}
      />
    );
  }

  return (
    <RoomPanelFrame titleHe="🚪 סטודיו ההלבשה · Dress-Up" theme={theme} onClose={onClose}>

      <div className="flex items-center gap-4">
        <div className="w-24 h-32 shrink-0 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center pt-4">
          <DressedAvatar avatarEmoji={avatarEmoji} worn={worn} fontSize={worn.some((i) => i.isHumanOnly) ? '40px' : '52px'} />
        </div>
        <div className="space-y-1.5 text-xs">
          <p className="font-extrabold">{progressText}</p>
          <p className={theme.mutedTextClass}>
            כדי ללבוש פריט — קוראים לו בשם באנגלית. לחיצה על פריט שלובשים מורידה אותו.
          </p>
          {!isHumanAvatar(avatarEmoji) && (
            <p className={theme.mutedTextClass}>
              🐾 אווטאר של חיה לובש אקססוריז. בגדים — רק לאווטאר ילדה 👧 או ילד 👦.
            </p>
          )}
        </div>
      </div>

      {statusText && (
        <p className="text-xs sm:text-sm font-extrabold text-center" role="status">
          {statusText}
        </p>
      )}

      <ul className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {owned.map((item) => {
          const isWorn = wornIds.includes(item.id);
          const isWearable = canWear(item, avatarEmoji);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleTapItem(item.id)}
                aria-pressed={isWorn}
                className={`w-full p-2 rounded-2xl flex flex-col items-center gap-0.5 border-2 transition-all ${
                  isWorn ? 'border-emerald-500 bg-emerald-500/15' : 'border-transparent bg-black/5 dark:bg-white/5 hover:border-current/20'
                } ${isWearable ? '' : 'opacity-40'}`}
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="text-xs font-extrabold truncate max-w-full">{item.nameHe}</span>
                <span className={`text-xs font-bold ${isWorn ? 'text-emerald-600 dark:text-emerald-300' : theme.mutedTextClass}`}>
                  {isWorn ? '✓ לבוש' : isWearable ? 'ללבוש' : 'רק לילד/ה'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className={`text-xs ${theme.mutedTextClass}`}>
        🎁 עוד בגדים ואקססוריז: משימות עם 3 כוכבים, ו־🕶️ אקססוריז מיוחדים בחנות.
      </p>
    </RoomPanelFrame>
  );
};
