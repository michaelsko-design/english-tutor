import React, { useState } from 'react';
import {
  MAX_DRAWN_STICKERS,
  deleteDrawnSticker,
  getActiveDrawnStickers,
  getAlbumStickers,
  getBackgroundSticker,
  hasStickerPass,
  setBackgroundSticker,
} from '../../../data/stickers';
import { getRoom } from '../../../data/room';
import { LearnerProfile } from '../../../types/learner';
import { ThemeDefinition } from '../../../themes/themeRegistry';
import { ItemIcon } from '../ItemIcon';
import { RoomPanelFrame } from '../RoomPanelFrame';
import { StickerDrawPanel } from './StickerDrawPanel';
import { Button } from '../../ui/Button';

interface StickerStudioPanelProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
  /** Starts placing the sticker on the room's sticker board */
  onPlaceSticker: (itemId: string) => void;
  onOpenShop: () => void;
  onClose: () => void;
}

/** Feature 12, phase 6: the sticker album, the app background and (premium) drawing stickers. */
export const StickerStudioPanel: React.FC<StickerStudioPanelProps> = ({
  profile,
  theme,
  onUpdateProfile,
  onSpeakEnglish,
  onPlaceSticker,
  onOpenShop,
  onClose,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const room = getRoom(profile);
  const stickers = getAlbumStickers(profile);
  const placedIds = Object.values(room.placements);
  const drawnCount = getActiveDrawnStickers(profile).length;
  const hasPass = hasStickerPass(profile);

  if (isDrawing) {
    return (
      <RoomPanelFrame titleHe="✏️ ציור מדבקה · Draw a Sticker" theme={theme} onClose={() => setIsDrawing(false)} closeLabel="לאלבום 🎨">
        <StickerDrawPanel
          profile={profile}
          theme={theme}
          onUpdateProfile={onUpdateProfile}
          onSpeakEnglish={onSpeakEnglish}
          onDone={() => setIsDrawing(false)}
        />
      </RoomPanelFrame>
    );
  }

  return (
    <RoomPanelFrame titleHe="🎨 סטודיו המדבקות · Sticker Studio" theme={theme} onClose={onClose}>
      <p className={`text-xs ${theme.mutedTextClass}`}>
        כל המדבקות שלך. אפשר להדביק אותן על הלוח בחדר או להפוך אחת לרקע של האפליקציה.
      </p>

      {stickers.length === 0 ? (
        <p className="text-xs font-bold text-center py-2">
          עוד אין מדבקות — אפשר לקבל במשימות עם 3 כוכבים ובחנות 🎁
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {stickers.map((item) => {
            const isOnBoard = placedIds.includes(item.id);
            const isBackground = room.backgroundStickerId === item.id;
            const isDrawn = Boolean(item.imageUrl);
            return (
              <li key={item.id} className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 flex flex-col items-center gap-1.5">
                <ItemIcon item={item} size="2.75rem" />
                <span className="text-xs font-extrabold" dir={isDrawn ? 'ltr' : 'rtl'}>
                  {isDrawn ? item.nameEn : item.nameHe}
                </span>
                <div className="flex flex-wrap justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => onPlaceSticker(item.id)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold ${isOnBoard ? 'bg-emerald-500/20' : theme.secondaryBtnClass}`}
                  >
                    {isOnBoard ? '✓ על הלוח' : '🧷 ללוח'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateProfile(setBackgroundSticker(profile, isBackground ? null : item.id, new Date()))}
                    aria-pressed={isBackground}
                    className={`px-2 py-1 rounded-lg text-xs font-bold ${isBackground ? theme.primaryBtnClass : theme.secondaryBtnClass}`}
                  >
                    {isBackground ? '✓ רקע' : '🖼️ רקע'}
                  </button>
                  {isDrawn &&
                    (confirmDeleteId === item.id ? (
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateProfile(deleteDrawnSticker(profile, item.id, new Date()));
                          setConfirmDeleteId(null);
                        }}
                        onBlur={() => setConfirmDeleteId(null)}
                        className="px-2 py-1 rounded-lg text-xs font-bold bg-rose-500 text-white"
                      >
                        למחוק?
                      </button>
                    ) : (
                      <Button theme={theme} variant="secondary" size="sm" onClick={() => setConfirmDeleteId(item.id)} aria-label={`מחיקת ${item.nameEn}`}>
                        🗑️
                      </Button>
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* A deleted sticker can stay as the background id after a merge; only offer to remove a shown one */}
      {getBackgroundSticker(profile) && (
        <button
          type="button"
          onClick={() => onUpdateProfile(setBackgroundSticker(profile, null, new Date()))}
          className={`text-xs font-bold underline underline-offset-2 ${theme.accentTextClass}`}
        >
          הסרת הרקע
        </button>
      )}

      {hasPass ? (
        <Button theme={theme} className="w-full" onClick={() => setIsDrawing(true)} disabled={drawnCount >= MAX_DRAWN_STICKERS}>
          ✏️ ציור מדבקה חדשה ({drawnCount}/{MAX_DRAWN_STICKERS})
        </Button>
      ) : (
        <div className="p-3 rounded-2xl border-2 border-dashed border-fuchsia-400/60 flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">
            🔒
          </span>
          <p className="flex-1 text-xs font-bold">
            פרימיום: ציור מדבקות משלך — עם כרטיס סטודיו המדבקות מהחנות.
          </p>
          <Button theme={theme} size="sm" className="shrink-0" onClick={onOpenShop}>
            לחנות 🛍️
          </Button>
        </div>
      )}
    </RoomPanelFrame>
  );
};
