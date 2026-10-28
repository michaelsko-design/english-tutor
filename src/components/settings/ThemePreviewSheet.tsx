import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { ASK_PARENT_LABEL_HE } from '../../data/proAsk';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import type { LearnerGender } from '../../types/learner';
import { useDialog } from '../../hooks/useDialog';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Button } from '../ui/Button';
import { ThemeMapPreview } from './ThemeMapPreview';

interface ThemePreviewSheetProps {
  /** The Pro theme and mascot being tried */
  previewTheme: ThemeDefinition;
  /** The learner's own look, for the sheet itself */
  theme: ThemeDefinition;
  gender: LearnerGender;
  onAskParent: () => void;
  onClose: () => void;
}

/**
 * A free learner tapped a Pro theme or mascot: their map in that look, with the mascot on the next
 * mission. Nothing is saved; closing goes back to the learner's own look.
 */
export const ThemePreviewSheet: React.FC<ThemePreviewSheetProps> = ({ previewTheme, theme, gender, onAskParent, onClose }) => {
  const sheetRef = useRef<HTMLElement>(null);
  const isReducedMotion = usePrefersReducedMotion();
  useDialog(sheetRef, { onClose });

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center" role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <section
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-preview-title"
        className={`relative w-full max-w-lg max-h-[92dvh] overflow-y-auto overscroll-contain rounded-t-3xl p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-3 outline-none ${theme.cardBgClass} ${
          isReducedMotion ? '' : 'animate-sheet-up'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-3 left-3 min-w-11 min-h-11 flex items-center justify-center rounded-xl ${theme.secondaryBtnClass}`}
          aria-label="סגירה"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="text-center space-y-0.5 px-12">
          <h2 id="theme-preview-title" className="text-lg font-extrabold">
            👑 תצוגה מקדימה
          </h2>
          <p className="text-sm font-bold">
            <bdi dir="ltr" lang="en">
              {previewTheme.name} · {previewTheme.companion.name}
            </bdi>
          </p>
          <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
            ככה תיראה המפה שלך עם <bdi dir="ltr" lang="en">Pro</bdi>
          </p>
        </div>
        <ThemeMapPreview theme={previewTheme} gender={gender} />
        <div className="grid grid-cols-2 gap-2">
          <Button theme={theme} size="sm" onClick={onAskParent}>
            {ASK_PARENT_LABEL_HE}
          </Button>
          <Button theme={theme} variant="secondary" size="sm" onClick={onClose}>
            חזרה לעיצוב שלי
          </Button>
        </div>
      </section>
    </div>,
    document.body
  );
};
