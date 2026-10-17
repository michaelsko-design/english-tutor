import React, { useState } from 'react';
import { getRoom, getUnplacedRoomItems } from '../../data/room';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { RoomScene } from './RoomScene';
import { RoomScreen } from './RoomScreen';
import { AVATAR_HOME } from './roomLayout';

interface RoomHubProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  avatarEmoji: string;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onOpenShop: () => void;
}

/** Feature 12: the dashboard card with a live preview of the room, plus the room overlay. */
export const RoomHub: React.FC<RoomHubProps> = ({
  profile,
  theme,
  avatarEmoji,
  onUpdateProfile,
  onSpeakEnglish,
  onOpenShop,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unplacedCount = getUnplacedRoomItems(profile).length;

  return (
    <>
      <section
        id="english-room"
        aria-label="החדר האנגלי שלי"
        className={`rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${theme.cardBgClass}`}
        dir="rtl"
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-56 shrink-0 rounded-3xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
          aria-label="כניסה לחדר"
        >
          <RoomScene
            themeId={profile.themeId}
            avatarEmoji={avatarEmoji}
            placements={getRoom(profile).placements}
            avatarPos={AVATAR_HOME}
          />
        </button>
        <div className="flex-1 space-y-2">
          <h2 className="font-extrabold text-base sm:text-lg">🏠 החדר האנגלי שלי</h2>
          <p className={`text-xs sm:text-sm ${theme.mutedTextClass}`}>
            מעצבים את החדר באנגלית: כל פריט נכנס לחדר רק אחרי שאומרים או מאייתים את השם שלו.
          </p>
          {unplacedCount > 0 && (
            <p className="text-xs font-extrabold text-fuchsia-600 dark:text-fuchsia-300">
              🎁 {unplacedCount === 1 ? 'פריט אחד מחכה לך' : `${unplacedCount} פריטים מחכים לך`}
            </p>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className={`px-5 py-2.5 rounded-2xl font-extrabold text-sm ${theme.primaryBtnClass}`}
          >
            כניסה לחדר שלי 🚪
          </button>
        </div>
      </section>

      {isOpen && (
        <RoomScreen
          profile={profile}
          theme={theme}
          avatarEmoji={avatarEmoji}
          onUpdateProfile={onUpdateProfile}
          onSpeakEnglish={onSpeakEnglish}
          onOpenShop={onOpenShop}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
