import React, { useEffect, useRef, useState } from 'react';
import { celebrate } from '../../utils/celebrate';
import { prefersReducedMotion } from '../../utils/motion';
import {
  ROOM_OBJECTS,
  RoomObjectId,
  getOwnedRoomItems,
  getRoom,
  getRoomItemFor,
  removeRoomItem,
} from '../../data/room';
import {
  getObjectIdFromKey,
  getPlacedRoomEntries,
  isObjectKey,
  moveRoomEntry,
  placeNamedRoomItemAt,
} from '../../data/roomPlacement';
import { getAlbumStickers } from '../../data/stickers';
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
import { StickersLockedSheet } from './StickersLockedSheet';
import { PhonePanel } from './PhonePanel';
import { WardrobePanel } from './WardrobePanel';
import { AVATAR_HOME, ScenePoint, getStandingPoint } from './roomLayout';
import { formatGainLtr } from '../../utils/bidi';
import { useStopSpeechOnLeave } from '../../hooks/useSpeech';
import { Button } from '../ui/Button';
import { EmojiIcon } from '../art/EmojiIcon';

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
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [moveRequestKey, setMoveRequestKey] = useState<string | null>(null);
  const [isStickersHintOpen, setIsStickersHintOpen] = useState(false);
  const [naming, setNaming] = useState<{ itemId: string; point: ScenePoint } | null>(null);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<RoomPanel | null>(null);
  const walkTimer = useRef<number | undefined>(undefined);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => window.clearTimeout(walkTimer.current), []);

  // On a phone the panels sit below the room: bring a newly opened one into view
  useEffect(() => {
    if (activePanel) panelRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }, [activePanel]);

  /** Moves the avatar next to `target`, then runs `onArrive` once it gets there. */
  const walkTo = (target: ScenePoint, onArrive: () => void) => {
    const standAt = getStandingPoint(target);
    window.clearTimeout(walkTimer.current);
    setBubble(null);
    setIsFacingLeft(standAt.x < avatarPos.x);
    setAvatarPos(standAt);
    walkTimer.current = window.setTimeout(onArrive, prefersReducedMotion() ? 0 : WALK_MS);
  };

  const entries = getPlacedRoomEntries(profile);
  const placingKind = selectedItemId ? getRoomItemFor(profile, selectedItemId)?.slotKind ?? null : null;

  const handleSelectItem = (itemId: string) => {
    setFocusedKey(null);
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

  const handlePlaceAt = (point: ScenePoint) => {
    if (!selectedItemId) return;
    const itemId = selectedItemId;
    setStatusText(null);
    walkTo(point, () => setNaming({ itemId, point }));
  };

  const handleTapEntry = (key: string) => {
    const entry = entries.find((candidate) => candidate.key === key);
    if (!entry) return;
    if (isObjectKey(key)) {
      handleTapObject(getObjectIdFromKey(key), entry.point);
      return;
    }
    setSelectedItemId(null);
    setStatusText(null);
    walkTo(entry.point, () => {
      onSpeakEnglish(entry.item.nameEn, 0.9);
      setBubble({ at: entry.point, textEn: entry.item.nameEn, textHe: entry.item.nameHe });
      setFocusedKey(key);
    });
  };

  /** A drag or keyboard drop: the item moves and keeps its name; no naming needed again. */
  const handleMoveEntry = (key: string, point: ScenePoint) => {
    const entry = entries.find((candidate) => candidate.key === key);
    if (!entry) return;
    onUpdateProfile(moveRoomEntry(profile, key, point, new Date()));
    setFocusedKey(isObjectKey(key) ? null : entry.item.id);
    setBubble(null);
    setStatusText(`${entry.item.emoji} ${entry.item.nameEn} הוזז ✨`);
  };

  /** The "move" button: the item takes arrow keys (it can also just be dragged). */
  const handleStartMove = (key: string) => {
    setBubble(null);
    setStatusText('גוררים את הפריט, או משתמשים בחצים · Enter להנחה · Esc לביטול');
    setMoveRequestKey(key);
  };

  const handleTapObject = (objectId: string, point: ScenePoint) => {
    const object = ROOM_OBJECTS.find((o) => o.id === objectId);
    if (!object) {
      walkTo(point, () => setBubble({ at: point, textEn: 'desk', textHe: 'שולחן' }));
      return;
    }
    setSelectedItemId(null);
    setFocusedKey(null);
    setStatusText(null);
    setActivePanel(null);
    walkTo(point, () => {
      const panel = OBJECT_PANELS[object.id];
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
    const result = placeNamedRoomItemAt(profile, naming.itemId, naming.point, new Date());
    onUpdateProfile(result.profile);
    celebrate('small');
    if (item) {
      setBubble({ at: naming.point, textEn: item.nameEn, textHe: item.nameHe });
    }
    setStatusText(
      result.xpEarned > 0
        ? `${item?.emoji} ${item?.nameEn} בחדר! ${formatGainLtr(result.xpEarned, 'XP')} על מילה חדשה 🌟`
        : `${item?.emoji} ${item?.nameEn} בחדר! 🏠`
    );
    setNaming(null);
    setSelectedItemId(null);
  };

  const handleRemove = (key: string) => {
    const item = getRoomItemFor(profile, room.placements[key]);
    onUpdateProfile(removeRoomItem(profile, key, new Date()));
    setFocusedKey(null);
    setBubble(null);
    setStatusText(`${item?.emoji} ${item?.nameEn} חזר לארגז הפריטים 📦`);
  };

  const closePanel = () => {
    setActivePanel(null);
    setBubble(null);
  };

  const focusedItem = focusedKey ? getRoomItemFor(profile, room.placements[focusedKey]) : undefined;
  const namingItem = naming ? getRoomItemFor(profile, naming.itemId) : undefined;

  const header = (
    <div className="flex items-center justify-between gap-2">
      <h2 className="font-extrabold text-sm sm:text-base truncate">🏠 החדר האנגלי שלי</h2>
      <Button theme={theme} variant="secondary" size="sm" className="shrink-0" onClick={() => {
          setSelectedItemId(null);
          setFocusedKey(null);
          setNaming(null);
          setStatusText(null);
          if (getAlbumStickers(profile).length === 0) {
            setActivePanel(null);
            setIsStickersHintOpen(true);
            return;
          }
          setActivePanel('stickers');
        }}>
        🎨 מדבקות
      </Button>
      <Button theme={theme} variant="secondary" size="sm" className="shrink-0" onClick={onOpenShop} aria-label="החלפת אווטאר">
        <EmojiIcon emoji={avatarEmoji} size="1.25rem" />
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
          entries={entries}
          avatarPos={avatarPos}
          isAvatarFacingLeft={isFacingLeft}
          placingKind={naming ? null : placingKind}
          moveRequestKey={moveRequestKey}
          bubble={bubble}
          onPlaceAt={handlePlaceAt}
          onTapEntry={naming ? () => undefined : handleTapEntry}
          onMoveEntry={handleMoveEntry}
          onMoveRequestHandled={() => setMoveRequestKey(null)}
        />

        {statusText && (
          <p className="text-xs sm:text-sm font-extrabold text-center" role="status">
            {statusText}
          </p>
        )}

        {focusedKey && focusedItem && !naming && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button theme={theme} variant="secondary" size="sm" onClick={() => handleStartMove(focusedKey)}>
              🔀 הזזה ({focusedItem.nameEn})
            </Button>
            <Button theme={theme} variant="secondary" size="sm" onClick={() => handleRemove(focusedKey)}>
              📦 החזרה לארגז
            </Button>
          </div>
        )}

        <div ref={panelRef}>
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
            key={naming.itemId}
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
        </div>

        <p className={`text-xs text-center ${theme.mutedTextClass}`}>
          🚪 ארון: הלבשה · 📱 טלפון: הודעות קוליות · 🛏️ מיטה: יומן חלומות · 📖 ספר המשחקים: משחקי מילים · 🎨 מדבקות: אלבום וציור
        </p>
      </div>

      {isStickersHintOpen && (
        <StickersLockedSheet
          profile={profile}
          theme={theme}
          onOpenShop={() => {
            setIsStickersHintOpen(false);
            onOpenShop();
          }}
          onClose={() => setIsStickersHintOpen(false)}
        />
      )}
    </ExamModalShell>
  );
};
