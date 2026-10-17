import React, { useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Mic } from 'lucide-react';
import { AddStickerError, addDrawnSticker, isValidStickerName } from '../../../data/stickers';
import { LearnerProfile } from '../../../types/learner';
import { ThemeDefinition } from '../../../themes/themeRegistry';
import { getSpeechErrorTextHe, useSpeechRecognition } from '../../../hooks/useSpeechRecognition';
import { StickerCanvas, StickerCanvasHandle, Stroke } from './StickerCanvas';

interface StickerDrawPanelProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onDone: () => void;
}

const COLORS = ['#111827', '#ef4444', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
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
  const [color, setColor] = useState(COLORS[1]);
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
    const result = addDrawnSticker(profile, name, canvasRef.current.exportPng(), new Date());
    if (result.error) {
      setError(getErrorText(result.error, isGirl));
      return;
    }
    onUpdateProfile(result.profile);
    onSpeakEnglish(name.trim(), 0.9);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
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
        {COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setColor(c);
              setIsEraser(false);
            }}
            aria-label={`צבע ${c}`}
            aria-pressed={!isEraser && color === c}
            className={`w-8 h-8 rounded-full border-2 ${!isEraser && color === c ? 'border-fuchsia-500 scale-110' : 'border-white/70'}`}
            style={{ backgroundColor: c }}
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
        <button
          type="button"
          onClick={() => setStrokes(strokes.slice(0, -1))}
          disabled={strokes.length === 0}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold ${theme.secondaryBtnClass} disabled:opacity-40`}
        >
          ↩️ ביטול
        </button>
        <button
          type="button"
          onClick={() => setStrokes([])}
          disabled={strokes.length === 0}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold ${theme.secondaryBtnClass} disabled:opacity-40`}
        >
          🗑️ ניקוי
        </button>
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
            dir="ltr"
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
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className={`flex-1 py-2.5 rounded-2xl font-extrabold text-sm ${theme.primaryBtnClass} disabled:opacity-40`}
        >
          שמירה באלבום ✨
        </button>
        <button type="button" onClick={onDone} className={`px-4 py-2.5 rounded-2xl font-bold text-sm ${theme.secondaryBtnClass}`}>
          ביטול
        </button>
      </div>
    </div>
  );
};
