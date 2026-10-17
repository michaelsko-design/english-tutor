import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ROOM_OBJECTS,
  RoomObjectId,
  getOwnedRoomItems,
  getPlaceableSlots,
  getRoom,
  getRoomItem,
  placeNamedRoomItem,
  removeRoomItem,
} from '../../data/room';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { NameItemPanel } from './NameItemPanel';
import { RoomInventory } from './RoomInventory';
import { RoomScene, SceneBubble } from './RoomScene';
import { AVATAR_HOME, OBJECT_POSITIONS, SLOT_POSITIONS, ScenePoint, getStandingPoint } from './roomLayout';

interface RoomScreenProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  avatarEmoji: string;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onOpenShop: () => void;
  onClose: () => void;
}

const WALK_MS = 700;

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/** Feature 12: the room itself. The avatar walks to what you tap; items are placed by naming them. */
export const RoomScreen: React.FC<RoomScreenProps> = ({
  profile,
  theme,
  avatarEmoji,
  onUpdateProfile,
  onSpeakEnglish,
  onOpenShop,
  onClose,
}) => {
  const isGirl = profile.gender === 'girl';
  const room = getRoom(profile);
  const ownedItems = getOwnedRoomItems(profile);
  const placedItemIds = Object.values(room.placements);

  const [avatarPos, setAvatarPos] = useState<ScenePoint>(AVATAR_HOME);
  const [isFacingLeft, setIsFacingLeft] = useState(false);
  const [bubble, setBubble] = useState<SceneBubble | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [focusedSlotId, setFocusedSlotId] = useState<string | null>(null);
  const [naming, setNaming] = useState<{ itemId: string; slotId: string } | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const walkTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(walkTimer.current), []);

  /** Moves the avatar next to `target`, then runs `onArrive` once it gets there. */
  const walkTo = (target: ScenePoint, onArrive: () => void) => {
    const standAt = getStandingPoint(target);
    window.clearTimeout(walkTimer.current);
    setBubble(null);
    setIsFacingLeft(standAt.x < avatarPos.x);
    setAvatarPos(standAt);
    walkTimer.current = window.setTimeout(onArrive, prefersReducedMotion() ? 0 : WALK_MS);
  };

  const highlightedSlotIds = selectedItemId ? getPlaceableSlots(selectedItemId).map((s) => s.id) : [];

  const handleSelectItem = (itemId: string) => {
    setFocusedSlotId(null);
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
      setStatusText(null);
      return;
    }
    const item = getRoomItem(itemId);
    setSelectedItemId(itemId);
    setStatusText(
      isGirl
        ? `לאן נכניס את ה${item?.nameHe}? בחרי מקום מהבהב בחדר ✨`
        : `לאן נכניס את ה${item?.nameHe}? בחר מקום מהבהב בחדר ✨`
    );
  };

  const handleTapSlot = (slotId: string) => {
    const point = SLOT_POSITIONS[slotId];
    if (selectedItemId && highlightedSlotIds.includes(slotId)) {
      const itemId = selectedItemId;
      setStatusText(null);
      walkTo(point, () => setNaming({ itemId, slotId }));
      return;
    }
    const item = getRoomItem(room.placements[slotId]);
    if (!item) return;
    setSelectedItemId(null);
    setStatusText(null);
    walkTo(point, () => {
      onSpeakEnglish(item.nameEn, 0.9);
      setBubble({ at: point, textEn: item.nameEn, textHe: item.nameHe });
      setFocusedSlotId(slotId);
    });
  };

  const handleTapObject = (objectId: RoomObjectId) => {
    const object = ROOM_OBJECTS.find((o) => o.id === objectId);
    if (!object) return;
    const point = OBJECT_POSITIONS[objectId];
    setSelectedItemId(null);
    setFocusedSlotId(null);
    setStatusText(null);
    walkTo(point, () => {
      onSpeakEnglish(object.nameEn, 0.9);
      setBubble({ at: point, textEn: object.nameEn, textHe: `בקרוב: ${object.activityHe}` });
    });
  };

  const handleNamed = () => {
    if (!naming) return;
    const item = getRoomItem(naming.itemId);
    const result = placeNamedRoomItem(profile, naming.slotId, naming.itemId, new Date());
    onUpdateProfile(result.profile);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.55 } });
    if (item) {
      setBubble({ at: SLOT_POSITIONS[naming.slotId], textEn: item.nameEn, textHe: item.nameHe });
    }
    setStatusText(
      result.xpEarned > 0
        ? `ה${item?.nameHe} בחדר! +${result.xpEarned} XP על מילה חדשה 🌟`
        : `ה${item?.nameHe} בחדר! 🏠`
    );
    setNaming(null);
    setSelectedItemId(null);
  };

  const handleRemove = (slotId: string) => {
    const item = getRoomItem(room.placements[slotId]);
    onUpdateProfile(removeRoomItem(profile, slotId, new Date()));
    setFocusedSlotId(null);
    setBubble(null);
    setStatusText(`ה${item?.nameHe} חזר לארגז הפריטים 📦`);
  };

  const focusedItem = focusedSlotId ? getRoomItem(room.placements[focusedSlotId]) : undefined;
  const namingItem = naming ? getRoomItem(naming.itemId) : undefined;

  const header = (
    <div className="flex items-center justify-between gap-2" dir="rtl">
      <h2 className="font-extrabold text-sm sm:text-base truncate">🏠 החדר האנגלי שלי</h2>
      <button
        type="button"
        onClick={onOpenShop}
        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shrink-0 ${theme.secondaryBtnClass}`}
      >
        <span className="text-base leading-none">{avatarEmoji}</span>
        <span>החלפת אווטאר</span>
      </button>
    </div>
  );

  return (
    <ExamModalShell theme={theme} labelHe="החדר האנגלי שלי" onClose={onClose} maxWidthClass="max-w-3xl" header={header}>
      <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
        <RoomScene
          themeId={profile.themeId}
          avatarEmoji={avatarEmoji}
          placements={room.placements}
          avatarPos={avatarPos}
          isAvatarFacingLeft={isFacingLeft}
          highlightedSlotIds={naming ? [] : highlightedSlotIds}
          bubble={bubble}
          onTapSlot={naming ? () => undefined : handleTapSlot}
          onTapObject={naming ? () => undefined : handleTapObject}
        />

        {statusText && (
          <p className="text-xs sm:text-sm font-extrabold text-center" dir="rtl" role="status">
            {statusText}
          </p>
        )}

        {focusedSlotId && focusedItem && !naming && (
          <div className="flex flex-wrap items-center justify-center gap-2" dir="rtl">
            <button
              type="button"
              onClick={() => handleSelectItem(focusedItem.id)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold ${theme.secondaryBtnClass}`}
            >
              🔀 הזזת ה{focusedItem.nameHe}
            </button>
            <button
              type="button"
              onClick={() => handleRemove(focusedSlotId)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold ${theme.secondaryBtnClass}`}
            >
              📦 החזרה לארגז
            </button>
          </div>
        )}

        {naming && namingItem ? (
          <NameItemPanel
            key={`${naming.itemId}-${naming.slotId}`}
            item={namingItem}
            gender={profile.gender}
            tier={profile.preferredTier}
            theme={theme}
            onSpeakEnglish={onSpeakEnglish}
            onNamed={handleNamed}
            onCancel={() => setNaming(null)}
          />
        ) : (
          <RoomInventory
            items={ownedItems}
            placedItemIds={placedItemIds}
            selectedItemId={selectedItemId}
            gender={profile.gender}
            theme={theme}
            onSelectItem={handleSelectItem}
          />
        )}

        <p className={`text-[11px] text-center ${theme.mutedTextClass}`} dir="rtl">
          {isGirl
            ? '🛏️ 📱 🚪 📖 — לחצי על המיטה, הטלפון, הארון וספר המשחקים: הפעילויות שלהם מגיעות בקרוב!'
            : '🛏️ 📱 🚪 📖 — לחץ על המיטה, הטלפון, הארון וספר המשחקים: הפעילויות שלהם מגיעות בקרוב!'}
        </p>
      </div>
    </ExamModalShell>
  );
};
