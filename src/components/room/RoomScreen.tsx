import React, { useEffect, useRef, useState } from 'react';
import { celebrate } from '../../utils/celebrate';
import { prefersReducedMotion } from '../../utils/motion';
import {
  ROOM_OBJECTS,
  RoomObjectId,
  getOwnedRoomItems,
  getPlaceableSlots,
  getRoom,
  getPlacedRoomItems,
  getRoomItemFor,
  placeNamedRoomItem,
  removeRoomItem,
} from '../../data/room';
import { getWornItems } from '../../data/wardrobe';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { NameItemPanel } from './NameItemPanel';
import { RoomInventory } from './RoomInventory';
import { RoomScene, SceneBubble } from './RoomScene';
import { DreamJournalPanel } from './DreamJournalPanel';
import { GamesBookPanel } from './games/GamesBookPanel';
import { StickerStudioPanel } from './stickers/StickerStudioPanel';
import { PhonePanel } from './PhonePanel';
import { WardrobePanel } from './WardrobePanel';
import { AVATAR_HOME, OBJECT_POSITIONS, SLOT_POSITIONS, ScenePoint, getStandingPoint } from './roomLayout';
import { formatGainLtr } from '../../utils/bidi';
import { useStopSpeechOnLeave } from '../../hooks/useSpeech';
import { Button } from '../ui/Button';

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

/** Room activities shown in the panel under the scene; the inventory shows when none is open. */
type RoomPanel = 'wardrobe' | 'phone' | 'journal' | 'games' | 'stickers';

/** Mission objects whose activity is ready open a panel; the others show "coming soon". */
const OBJECT_PANELS: Partial<Record<RoomObjectId, RoomPanel>> = {
  wardrobe: 'wardrobe',
  phone: 'phone',
  bed: 'journal',
  'games-book': 'games',
};

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
  useStopSpeechOnLeave();
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
  const [activePanel, setActivePanel] = useState<RoomPanel | null>(null);
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

  const highlightedSlotIds = selectedItemId ? getPlaceableSlots(profile, selectedItemId).map((s) => s.id) : [];

  const handleSelectItem = (itemId: string) => {
    setFocusedSlotId(null);
    setActivePanel(null);
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
      setStatusText(null);
      return;
    }
    const item = getRoomItemFor(profile, itemId);
    setSelectedItemId(itemId);
    setStatusText(
      isGirl
        ? `${item?.emoji} ${item?.nameHe} — בחרי מקום מהבהב בחדר ✨`
        : `${item?.emoji} ${item?.nameHe} — בחר מקום מהבהב בחדר ✨`
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
    const item = getRoomItemFor(profile, room.placements[slotId]);
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
    setActivePanel(null);
    walkTo(point, () => {
      const panel = OBJECT_PANELS[objectId];
      if (panel) {
        setBubble({ at: point, textEn: object.nameEn, textHe: object.nameHe });
        setActivePanel(panel);
        return;
      }
      onSpeakEnglish(object.nameEn, 0.9);
      setBubble({ at: point, textEn: object.nameEn, textHe: `בקרוב: ${object.activityHe}` });
    });
  };

  const handleNamed = () => {
    if (!naming) return;
    const item = getRoomItemFor(profile, naming.itemId);
    const result = placeNamedRoomItem(profile, naming.slotId, naming.itemId, new Date());
    onUpdateProfile(result.profile);
    celebrate('small');
    if (item) {
      setBubble({ at: SLOT_POSITIONS[naming.slotId], textEn: item.nameEn, textHe: item.nameHe });
    }
    setStatusText(
      result.xpEarned > 0
        ? `${item?.emoji} ${item?.nameEn} בחדר! ${formatGainLtr(result.xpEarned, 'XP')} על מילה חדשה 🌟`
        : `${item?.emoji} ${item?.nameEn} בחדר! 🏠`
    );
    setNaming(null);
    setSelectedItemId(null);
  };

  const handleRemove = (slotId: string) => {
    const item = getRoomItemFor(profile, room.placements[slotId]);
    onUpdateProfile(removeRoomItem(profile, slotId, new Date()));
    setFocusedSlotId(null);
    setBubble(null);
    setStatusText(`${item?.emoji} ${item?.nameEn} חזר לארגז הפריטים 📦`);
  };

  const closePanel = () => {
    setActivePanel(null);
    setBubble(null);
  };

  const focusedItem = focusedSlotId ? getRoomItemFor(profile, room.placements[focusedSlotId]) : undefined;
  const namingItem = naming ? getRoomItemFor(profile, naming.itemId) : undefined;

  const header = (
    <div className="flex items-center justify-between gap-2">
      <h2 className="font-extrabold text-sm sm:text-base truncate">🏠 החדר האנגלי שלי</h2>
      <Button theme={theme} variant="secondary" size="sm" className="shrink-0" onClick={() => {
          setSelectedItemId(null);
          setFocusedSlotId(null);
          setNaming(null);
          setStatusText(null);
          setActivePanel('stickers');
        }}>
        🎨 מדבקות
      </Button>
      <Button theme={theme} variant="secondary" size="sm" className="shrink-0" onClick={onOpenShop} aria-label="החלפת אווטאר">
        <span className="text-base leading-none">{avatarEmoji}</span>
        <span className="hidden sm:inline">החלפת אווטאר</span>
      </Button>
    </div>
  );

  return (
    <ExamModalShell theme={theme} labelHe="החדר האנגלי שלי" onClose={onClose} maxWidthClass="max-w-3xl" header={header}>
      <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
        <RoomScene
          themeId={profile.themeId}
          avatarEmoji={avatarEmoji}
          worn={getWornItems(profile, avatarEmoji)}
          placedItems={getPlacedRoomItems(profile)}
          avatarPos={avatarPos}
          isAvatarFacingLeft={isFacingLeft}
          highlightedSlotIds={naming ? [] : highlightedSlotIds}
          bubble={bubble}
          onTapSlot={naming ? () => undefined : handleTapSlot}
          onTapObject={naming ? () => undefined : handleTapObject}
        />

        {statusText && (
          <p className="text-xs sm:text-sm font-extrabold text-center" role="status">
            {statusText}
          </p>
        )}

        {focusedSlotId && focusedItem && !naming && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button theme={theme} variant="secondary" size="sm" onClick={() => handleSelectItem(focusedItem.id)}>
              🔀 הזזה ({focusedItem.nameEn})
            </Button>
            <Button theme={theme} variant="secondary" size="sm" onClick={() => handleRemove(focusedSlotId)}>
              📦 החזרה לארגז
            </Button>
          </div>
        )}

        {activePanel === 'wardrobe' ? (
          <WardrobePanel
            profile={profile}
            avatarEmoji={avatarEmoji}
            theme={theme}
            onUpdateProfile={onUpdateProfile}
            onSpeakEnglish={onSpeakEnglish}
            onClose={closePanel}
          />
        ) : activePanel === 'journal' ? (
          <DreamJournalPanel
            profile={profile}
            theme={theme}
            onUpdateProfile={onUpdateProfile}
            onSpeakEnglish={onSpeakEnglish}
            onClose={closePanel}
          />
        ) : activePanel === 'games' ? (
          <GamesBookPanel
            profile={profile}
            theme={theme}
            onUpdateProfile={onUpdateProfile}
            onSpeakEnglish={onSpeakEnglish}
            onClose={closePanel}
          />
        ) : activePanel === 'stickers' ? (
          <StickerStudioPanel
            profile={profile}
            theme={theme}
            onUpdateProfile={onUpdateProfile}
            onSpeakEnglish={onSpeakEnglish}
            onPlaceSticker={handleSelectItem}
            onOpenShop={onOpenShop}
            onClose={closePanel}
          />
        ) : activePanel === 'phone' ? (
          <PhonePanel
            profile={profile}
            theme={theme}
            onUpdateProfile={onUpdateProfile}
            onSpeakEnglish={onSpeakEnglish}
            onClose={closePanel}
          />
        ) : naming && namingItem ? (
          <NameItemPanel
            key={`${naming.itemId}-${naming.slotId}`}
            item={namingItem}
            gender={profile.gender}
            theme={theme}
            goalHe={`כדי להניח בחדר: ${namingItem.nameHe}`}
            nextLabel="להניח בחדר ✨"
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

        <p className={`text-xs text-center ${theme.mutedTextClass}`}>
          🚪 ארון: הלבשה · 📱 טלפון: הודעות קוליות · 🛏️ מיטה: יומן חלומות · 📖 ספר המשחקים: משחקי מילים · 🎨 מדבקות: אלבום וציור
        </p>
      </div>
    </ExamModalShell>
  );
};
