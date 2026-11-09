import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RoomScreen } from './components/room/RoomScreen';
import { placeRoomItemAt } from './data/roomPlacement';
import { makeProfile } from './test/fixtures';
import { resolveTheme } from './themes/themeRegistry';
import { LearnerProfile, ThemeId } from './types/learner';

const themeId = (new URLSearchParams(location.search).get('theme') ?? 'starlight-rpg') as ThemeId;
const now = new Date();
const owned = ['room-sofa', 'room-chair', 'room-plant', 'room-ball', 'room-teddy', 'room-books', 'room-lamp', 'room-clock', 'room-picture', 'room-star', 'room-rainbow', 'room-heart'];
const start = makeProfile({ themeId, gender: 'girl', unlockedRewardIds: owned });
const placed: [string, number, number][] = [['room-plant', 20, 92], ['room-teddy', 80, 30], ['room-books', 86, 42], ['room-lamp', 84, 62], ['room-clock', 62, 35], ['room-star', 66, 22], ['room-rainbow', 74, 38], ['room-heart', 14, 22], ['room-chair', 30, 92], ['room-sofa', 60, 95], ['room-ball', 38, 90]];
const initial = placed.reduce((p, [id, x, y]) => placeRoomItemAt(p, id, { x, y }, now), start);

function Preview() {
  const [profile, setProfile] = useState<LearnerProfile>(initial);
  return (
    <RoomScreen
      profile={profile}
      theme={resolveTheme(themeId)}
      avatarEmoji="🦊"
      onUpdateProfile={setProfile}
      onSpeakEnglish={() => undefined}
      onOpenShop={() => undefined}
      onClose={() => undefined}
    />
  );
}

createRoot(document.getElementById('root')!).render(<Preview />);
