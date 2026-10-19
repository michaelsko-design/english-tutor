import { RefObject, useEffect, useRef } from 'react';

/**
 * What every modal dialog needs: focus moves into it and stays there (Tab wraps around), Escape
 * closes only the top-most dialog (a shop opened over the stats sheet closes first), focus goes
 * back to where it was on close, and the page behind doesn't scroll.
 */

/** Open dialogs, oldest first; only the last one answers Escape. */
const openDialogs: symbol[] = [];
let scrollLocks = 0;
let savedBodyOverflow = '';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function lockScroll(): void {
  if (scrollLocks === 0) {
    savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLocks += 1;
}

function unlockScroll(): void {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) document.body.style.overflow = savedBodyOverflow;
}

interface DialogOptions {
  /** Called on Escape; leave it out for a dialog that can't be dismissed */
  onClose?: () => void;
  /** Escape can be turned off for a while (e.g. on a result that must be collected) */
  isEscapeEnabled?: boolean;
  /** What gets focus on open, when the dialog's own element can't take it (display: contents) */
  initialFocusRef?: RefObject<HTMLElement>;
}

export function useDialog(
  ref: RefObject<HTMLElement>,
  { onClose, isEscapeEnabled = true, initialFocusRef }: DialogOptions = {}
): void {
  // Parents pass inline callbacks, so the latest ones are read through refs
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const isEscapeEnabledRef = useRef(isEscapeEnabled);
  isEscapeEnabledRef.current = isEscapeEnabled;

  useEffect(() => {
    const id = Symbol('dialog');
    openDialogs.push(id);
    const returnFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (initialFocusRef ?? ref).current?.focus({ preventScroll: true });
    lockScroll();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (openDialogs[openDialogs.length - 1] !== id) return;
      if (e.key === 'Escape') {
        if (isEscapeEnabledRef.current && onCloseRef.current) {
          e.stopPropagation();
          onCloseRef.current();
        }
        return;
      }
      if (e.key !== 'Tab' || !ref.current) return;
      const focusable = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const isOutside = !ref.current.contains(active);
      if (e.shiftKey && (active === first || active === ref.current || isOutside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || isOutside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      const index = openDialogs.indexOf(id);
      if (index >= 0) openDialogs.splice(index, 1);
      unlockScroll();
      if (returnFocusTo?.isConnected) returnFocusTo.focus({ preventScroll: true });
    };
    // Runs once per open dialog; the callbacks are read through refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
