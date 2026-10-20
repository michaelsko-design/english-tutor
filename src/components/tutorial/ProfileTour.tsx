import React, { useMemo } from 'react';
import { AuthUserSummary, LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { getTutorialSlides } from '../../data/appTutorial';
import { isFriendsHubEnabled } from '../../data/friends';
import { AppTour } from './AppTour';

interface ProfileTourProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  authUser: AuthUserSummary | null;
  finishLabelHe: string;
  onDone: () => void;
}

/** The app tour (Feature 45) for this learner: their avatar, diamonds name, Friends tile and Shabbat shield. */
export const ProfileTour: React.FC<ProfileTourProps> = ({ profile, theme, authUser, finishLabelHe, onDone }) => {
  const hasFriends = isFriendsHubEnabled(profile) && Boolean(authUser && !authUser.isAnonymous);
  const isShabbatObserver = profile.isShabbatObserver !== false;
  const slides = useMemo(
    () => getTutorialSlides({ currencyNameHe: theme.currencyNameHe, hasFriends, isShabbatObserver }),
    [theme.currencyNameHe, hasFriends, isShabbatObserver]
  );

  return (
    <AppTour
      theme={theme}
      slides={slides}
      avatarEmoji={profile.equippedAvatarEmoji || theme.avatarEmoji}
      isShabbatObserver={isShabbatObserver}
      finishLabelHe={finishLabelHe}
      onDone={onDone}
    />
  );
};
