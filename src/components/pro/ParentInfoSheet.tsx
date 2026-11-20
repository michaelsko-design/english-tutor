import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { APP_NAME } from '../../config/appInfo';
import {
  PARENT_INFO_SPOKEN_HE,
  PARENT_INFO_TITLE_HE,
  SHARE_PARENTS_AREA_LABEL_HE,
  buildParentsAreaMessageHe,
  buildProAskUrl,
} from '../../data/proAsk';
import { trackEvent } from '../../services/analytics';
import { createParentInvite, listParentsOfChild } from '../../services/parentService';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import type { ProAskLearner, ProUpsellFocus } from './proUpsellContext';
import { HebrewAudioContext } from '../../data/hebrewAudio';
import { useDialog } from '../../hooks/useDialog';
import { useStopSpeechOnLeave } from '../../hooks/useSpeech';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { HebrewSpeakButton } from '../drills/HebrewSpeakButton';
import { ShareTextActions } from '../ShareTextActions';
import { Button } from '../ui/Button';
import { SHEET_OVERLAY_CLASS, SHEET_PANEL_WIDE_CLASS } from '../ui/sheetLayout';

interface ParentInfoSheetProps {
  learner: ProAskLearner;
  /** The locked part that opened the sheet (kept for the callers; the sheet reads the same for all) */
  focus: ProUpsellFocus;
  theme: ThemeDefinition;
  /** Grades 1–2 hear the sheet's line in Hebrew (Feature 47) */
  readsHebrewAloud?: boolean;
  onClose: () => void;
}

type ShareState =
  | { kind: 'idle' }
  | { kind: 'preparing' }
  | { kind: 'ready'; message: string }
  | { kind: 'failed'; errorHe: string };

/** The link to share: the portal for a paired parent, or a new pairing code when there is none. */
async function prepareShareMessage(learner: ProAskLearner): Promise<ShareState> {
  const origin = window.location.origin;
  let parents: Awaited<ReturnType<typeof listParentsOfChild>>;
  try {
    parents = await listParentsOfChild(learner.uid);
  } catch {
    // Unknown whether a parent is paired: a new code could replace a working one, so try again later
    return { kind: 'failed', errorHe: 'לא הצלחנו להתחבר. כדאי לנסות שוב בעוד רגע.' };
  }
  if (parents.length > 0) return { kind: 'ready', message: buildParentsAreaMessageHe(buildProAskUrl(origin, null)) };
  const invite = await createParentInvite(learner.uid, learner.name, learner.avatarEmoji);
  if (!invite.ok) return { kind: 'failed', errorHe: invite.errorHe };
  return { kind: 'ready', message: buildParentsAreaMessageHe(buildProAskUrl(origin, invite.value.code)) };
}

/**
 * What a learner sees at a Pro part (docs/feature-pro-tier.md, "The learner's side"): a neutral
 * "for parents" note and a link to the parent area to share. No perks, prices, mascot pitch or ask to
 * buy: the law on marketing to minors bars them (data/proAsk.ts). The parent area does the rest.
 */
export const ParentInfoSheet: React.FC<ParentInfoSheetProps> = ({ learner, theme, readsHebrewAloud = false, onClose }) => {
  const sheetRef = useRef<HTMLElement>(null);
  const isReducedMotion = usePrefersReducedMotion();
  useDialog(sheetRef, { onClose });
  useStopSpeechOnLeave();
  const [shareState, setShareState] = useState<ShareState>({ kind: 'idle' });
  const isGirl = learner.gender === 'girl';

  const handleShare = async () => {
    setShareState({ kind: 'preparing' });
    const next = await prepareShareMessage(learner);
    if (next.kind === 'ready') trackEvent('pro_ask_sent');
    setShareState(next);
  };

  // The funnel's "reached a Pro part": every way into this sheet is a locked Pro stop
  useEffect(() => {
    trackEvent('pro_wall_view');
  }, []);

  const shareArea = (() => {
    if (learner.isGuest) {
      return (
        <p className="p-3 rounded-2xl bg-amber-400/15 text-sm font-bold">
          {isGirl ? 'קודם שמרי' : 'קודם שמור'} את החשבון (בהגדרות ← חשבון), כדי שההתקדמות לא תלך לאיבוד.
        </p>
      );
    }
    if (shareState.kind === 'ready') {
      return (
        <ShareTextActions
          text={shareState.message}
          shareTitle={APP_NAME}
          shareLabel="שיתוף הקישור"
          copyLabel="העתקת הקישור"
          copiedLabel="הועתק ✓"
          copyFailedLabel="לא הצלחנו להעתיק"
          theme={theme}
        />
      );
    }
    return (
      <div className="space-y-2">
        {shareState.kind === 'failed' && (
          <p role="alert" className="text-xs font-bold text-rose-500">
            {shareState.errorHe}
          </p>
        )}
        <Button theme={theme} variant="secondary" className="w-full" onClick={handleShare} disabled={shareState.kind === 'preparing'}>
          {shareState.kind === 'preparing' ? 'מכינים את הקישור…' : SHARE_PARENTS_AREA_LABEL_HE}
        </Button>
      </div>
    );
  })();

  return createPortal(
    <div className={`${SHEET_OVERLAY_CLASS} z-[80]`} role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <section
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="parent-info-title"
        className={`relative w-full max-w-lg max-h-[88dvh] overflow-y-auto overscroll-contain rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] space-y-4 outline-none ${SHEET_PANEL_WIDE_CLASS} ${theme.cardBgClass} ${
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
        <div className="space-y-2 pt-2 pl-12">
          <h2 id="parent-info-title" className="text-lg font-extrabold">
            {PARENT_INFO_TITLE_HE}
          </h2>
          <div className="flex items-start gap-1.5">
            <p className={`flex-1 text-sm font-bold ${theme.mutedTextClass}`}>
              החלק הזה כלול במסלול <bdi dir="ltr" lang="en">Pro</bdi>. אפשר להמשיך לתרגל בחלקים הפתוחים, והורים יכולים להיכנס לאזור ההורים
              למידע נוסף.
            </p>
            <HebrewAudioContext.Provider value={readsHebrewAloud}>
              <HebrewSpeakButton text={PARENT_INFO_SPOKEN_HE} label="הקשבה" />
            </HebrewAudioContext.Provider>
          </div>
        </div>
        {shareArea}
      </section>
    </div>,
    document.body
  );
};
