import React, { useRef } from 'react';
import { ModalPortal } from '../ModalPortal';
import { useDialog } from '../../hooks/useDialog';
import { X } from 'lucide-react';
import { ThemeDefinition } from '../../themes/themeRegistry';

interface ExamModalShellProps {
  theme: ThemeDefinition;
  labelHe: string;
  /** Escape and the X button call this; omit it to make the dialog non-dismissable. */
  onClose?: () => void;
  maxWidthClass?: string;
  /** Optional content shown in the header bar next to the close button. */
  header?: React.ReactNode;
  children: React.ReactNode;
}

/** The app's modal dialog (exam prep, sheets, hubs): focus trap, Escape, focus return, no page scroll (useDialog). */
export const ExamModalShell: React.FC<ExamModalShellProps> = ({
  theme,
  labelHe,
  onClose,
  maxWidthClass = 'max-w-xl',
  header,
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(dialogRef, { onClose });

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={labelHe}
        className={`outline-none w-full ${maxWidthClass} max-h-full overflow-y-auto rounded-3xl shadow-2xl border border-current/15 ${theme.pageBgClass}`}
      >
        {(onClose || header) && (
          <div className={`sticky top-0 z-10 px-3.5 sm:px-5 py-3 ${theme.hudBgClass} flex items-center gap-2.5`}>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className={`min-w-11 min-h-11 flex items-center justify-center rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
                aria-label="סגירה"
                title="סגירה"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="flex-1 min-w-0">{header}</div>
          </div>
        )}
        {children}
      </div>
    </div>
    </ModalPortal>
  );
};
