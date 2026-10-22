import React, { useRef, useState } from 'react';
import { celebrate } from '../../../utils/celebrate';
import { Mic } from 'lucide-react';
import { saveStickerImage } from '../../../services/stickerImages';
import { AddStickerError, addDrawnSticker, isValidStickerName } from '../../../data/stickers';
import { LearnerProfile } from '../../../types/learner';
import { ThemeDefinition } from '../../../themes/themeRegistry';
import { getSpeechErrorTextHe, useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { StickerCanvas, StickerCanvasHandle, Stroke } from './StickerCanvas';
import { Button } from '../../ui/Button';

interface StickerDrawPanelProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onDone: () => void;
}

const COLORS = [
  { hex: '#111827', nameHe: 'שחור' },
  { hex: '#ef4444', nameHe: 'אדום' },
  { hex: '#f97316', nameHe: 'כתום' },
  { hex: '#facc15', nameHe: 'צהוב' },
  { hex: '#22c55e', nameHe: 'ירוק' },
  { hex: '#3b82f6', nameHe: 'כחול' },
  { hex: '#a855f7', nameHe: 'סגול' },
  { hex: '#ec4899', nameHe: 'ורוד' },
];
const BRUSHES = [
  { width: 14, labelHe: 'דק' },
  { width: 34, labelHe: 'עבה' },
];

/** Why a drawing wasn't saved, addressed by gender. */
function getErrorText(error: AddStickerError, isGirl: boolean): string {
  switch (error) {
    case 'no-pass':
      return 'צריך את כרטיס סטודיו המדבקות מהחנות 🎨';
    case 'full':
      return isGirl ? 'האלבום מלא — מחקי מדבקה ישנה כדי לשמור חדשה' : 'האלבום מלא — מחק מדבקה ישנה כדי לשמור חדשה';
    case 'bad-name':
      return 'השם צריך להיות באנגלית: מילה אחת עד שלוש, באותיות בלבד';
    case 'bad-image':
      return isGirl ? 'משהו השתבש בשמירת הציור — נסי לצייר שוב' : 'משהו השתבש בשמירת הציור — נסה לצייר שוב';
  }
}

/** Draw a sticker, give it an English name (typed or spoken), and save it to the album. */
export const StickerDrawPanel: React.FC<StickerDrawPanelProps> = ({ profile, theme, onUpdateProfile, onSpeakEnglish, onDone }) => {
  const isGirl = profile.gender === 'girl';
  const canvasRef = useRef<StickerCanvasHandle>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [color, setColor] = useState(COLORS[1].hex);
  const [brushWidth, setBrushWidth] = useState(BRUSHES[0].width);
  const [isEraser, setIsEraser] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const speech = useSpeechRecognition();

  const handleListen = () => {
    setError(null);
    speech.start('', {
      onResult: (transcript) => setName(transcript.replace(/[^A-Za-z ]/g, '').trim().slice(0, 20)),
      onError: (kind) => setError(getSpeechErrorTextHe(kind, profile.gender)),
    });
  };

  const handleSave = () => {
    if (!canvasRef.current || strokes.length === 0) return;
    const now = new Date();
    const imageDataUrl = canvasRef.current.exportPng();
    const result = addDrawnSticker(profile, name, imageDataUrl, now);
    if (result.error || !result.stickerId) {
      setError(getErrorText(result.error ?? 'bad-image', isGirl));
      return;
    }
    // The picture is stored first, so the profile never names a sticker without one
    saveStickerImage(result.stickerId, imageDataUrl, now.toISOString()).catch((e) =>
      console.warn('Saving the sticker picture failed:', (e as { code?: string })?.code ?? e)
    );
    onUpdateProfile(result.profile);
    onSpeakEnglish(name.trim(), 0.9);
    celebrate('small');
    onDone();
  };

  const canSave = strokes.length > 0 && isValidStickerName(name);

  return (
    <div className="space-y-3">
      <StickerCanvas
        ref={canvasRef}
        strokes={strokes}
        color={color}
        brushWidth={brushWidth}
        isEraser={isEraser}
        onStrokesChange={setStrokes}
      />

      <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label="צבעים">
        {COLORS.map(({ hex, nameHe }) => (
          <button
            key={hex}
            type="button"
            onClick={() => {
              setColor(hex);
              setIsEraser(false);
            }}
            aria-label={`צבע ${nameHe}`}
            aria-pressed={!isEraser && color === hex}
            className={`w-8 h-8 rounded-full border-2 ${!isEraser && color === hex ? 'border-fuchsia-500 scale-110' : 'border-white/70'}`}
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {BRUSHES.map((brush) => (
          <button
            key={brush.width}
            type="button"
            onClick={() => setBrushWidth(brush.width)}
            aria-pressed={brushWidth === brush.width}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${brushWidth === brush.width ? theme.primaryBtnClass : theme.secondaryBtnClass}`}
          >
            🖌️ {brush.labelHe}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIsEraser(!isEraser)}
          aria-pressed={isEraser}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold ${isEraser ? theme.primaryBtnClass : theme.secondaryBtnClass}`}
        >
          🧽 מחק
        </button>
        <Button theme={theme} variant="secondary" size="sm" onClick={() => setStrokes(strokes.slice(0, -1))} disabled={strokes.length === 0}>
          ↩️ ביטול
        </Button>
        <Button theme={theme} variant="secondary" size="sm" onClick={() => setStrokes([])} disabled={strokes.length === 0}>
          🗑️ ניקוי
        </Button>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="sticker-name" className="text-xs font-extrabold block">
          {isGirl ? 'איך קוראים למדבקה באנגלית? (כתבי או אמרי)' : 'איך קוראים למדבקה באנגלית? (כתוב או אמור)'}
        </label>
        <div className="flex gap-2">
          <input
            id="sticker-name"
            value={name}
            onChange={(e) => setName(e.target.value.replace(/[^A-Za-z ]/g, '').slice(0, 20))}
            placeholder="e.g. happy sun"
            dir="ltr" lang="en"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-bold ${theme.inputBgClass}`}
          />
          <button
            type="button"
            onClick={handleListen}
            aria-label="אמירת השם במיקרופון"
            className={`px-3 rounded-xl ${speech.isListening ? 'bg-rose-500 text-white animate-pulse' : theme.secondaryBtnClass}`}
          >
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && <p className="text-xs font-bold text-rose-600 dark:text-rose-300">{error}</p>}

      <div className="flex gap-2">
        <Button theme={theme} className="flex-1" onClick={handleSave} disabled={!canSave}>
          שמירה באלבום ✨
        </Button>
        <Button theme={theme} variant="secondary" onClick={onDone}>
          ביטול
        </Button>
      </div>
    </div>
  );
};
