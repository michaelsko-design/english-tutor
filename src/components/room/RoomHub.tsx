import React, { Suspense } from 'react';
import { getUnplacedRoomItems } from '../../data/room';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { DockTile } from '../home/DockTile';
import { lazyNamed } from '../../utils/lazyNamed';
import { ScreenLoading } from '../ScreenLoading';

const RoomScreen = lazyNamed(() => import('./RoomScreen'), 'RoomScreen');

interface RoomHubProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  avatarEmoji: string;
  /** Controlled by the dashboard, so the new-item toast can open the room too */
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onOpenShop: () => void;
}

/** Feature 12: the home dock tile (Feature 27), with a dot while an item waits to be placed, plus the room overlay. */
export const RoomHub: React.FC<RoomHubProps> = ({
  profile,
  theme,
  avatarEmoji,
  isOpen,
  onOpen,
  onClose,
  onUpdateProfile,
  onSpeakEnglish,
  onOpenShop,
}) => {
  const unplacedCount = getUnplacedRoomItems(profile).length;

  return (
    <>
      <DockTile
        emoji="🏠"
        labelHe="החדר שלי"
        theme={theme}
        onClick={onOpen}
        hasNews={unplacedCount > 0}
        newsLabelHe={unplacedCount === 1 ? 'פריט אחד מחכה לך' : `${unplacedCount} פריטים מחכים לך`}
      />

      {isOpen && (
        <Suspense fallback={<ScreenLoading />}>
          <RoomScreen
            profile={profile}
            theme={theme}
            avatarEmoji={avatarEmoji}
            onUpdateProfile={onUpdateProfile}
            onSpeakEnglish={onSpeakEnglish}
            onOpenShop={onOpenShop}
            onClose={onClose}
          />
        </Suspense>
      )}
    </>
  );
};
