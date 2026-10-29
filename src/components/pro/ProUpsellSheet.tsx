import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { APP_NAME } from '../../config/appInfo';
import {
  ASK_PARENT_LABEL_HE,
  buildProAskMessageHe,
  buildProAskUrl,
  getProSheetSpokenHe,
  getProSheetTitleHe,
  hasAskedToday,
  rememberAsk,
} from '../../data/proAsk';
import { createParentInvite, listParentsOfChild } from '../../services/parentService';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import type { ProAskLearner, ProUpsellFocus } from './proUpsellContext';
import { HebrewAudioContext } from '../../data/hebrewAudio';
import { useDialog } from '../../hooks/useDialog';
import { useStopSpeechOnLeave } from '../../hooks/useSpeech';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { toLocalDateStr } from '../../utils/dates';
import { Companion } from '../companion/Companion';
import { HebrewSpeakButton } from '../drills/HebrewSpeakButton';
import { ShareTextActions } from '../ShareTextActions';
import { Button } from '../ui/Button';

interface ProUpsellSheetProps {
  learner: ProAskLearner;
  focus: ProUpsellFocus;
  theme: ThemeDefinition;
  /** Grades 1–2 hear the sheet in Hebrew (Feature 47) */
  readsHebrewAloud?: boolean;
  onClose: () => void;
}

const PERKS: ReadonlyArray<{ focus: ProUpsellFocus; emoji: string; labelHe: string }> = [
  { focus: 'missions', emoji: '🗺️', labelHe: 'כל היחידות והבוסים בכל הכיתות' },
  { focus: 'exam', emoji: '📅', labelHe: 'הכנה מלאה למבחן, עם סימולציה ותעודה' },
  { focus: 'lists', emoji: '📝', labelHe: 'עוד רשימות מילים מבית הספר' },
  { focus: 'themes', emoji: '🎨', labelHe: 'כל ערכות העיצוב וכל הדמויות' },
];

type AskState =
  | { kind: 'idle' }
  | { kind: 'preparing' }
  | { kind: 'ready'; message: string }
  | { kind: 'failed'; errorHe: string };

/** The link to send: the portal for a paired parent, or a new pairing code when there is none. */
async function prepareAskMessage(learner: ProAskLearner): Promise<AskState> {
  const origin = window.location.origin;
  let parents: Awaited<ReturnType<typeof listParentsOfChild>>;
  try {
    parents = await listParentsOfChild(learner.uid);
  } catch {
    // Unknown whether a parent is paired: a new code could replace a working one, so try again later
    return { kind: 'failed', errorHe: 'לא הצלחנו להתחבר. כדאי לנסות שוב בעוד רגע.' };
  }
  if (parents.length > 0) {
    return { kind: 'ready', message: buildProAskMessageHe(learner.name, learner.gender, buildProAskUrl(origin, null)) };
  }
  const invite = await createParentInvite(learner.uid, learner.name, learner.avatarEmoji);
  if (!invite.ok) return { kind: 'failed', errorHe: invite.errorHe };
  const url = buildProAskUrl(origin, invite.value.code);
  return { kind: 'ready', message: buildProAskMessageHe(learner.name, learner.gender, url) };
}

/**
 * The kid-safe Pro sheet (docs/feature-pro-tier.md, "ask a parent"): what Pro opens and one button
 * that sends a parent the link. No prices or plans: only the paired parent ever pays.
 */
export const ProUpsellSheet: React.FC<ProUpsellSheetProps> = ({ learner, focus, theme, readsHebrewAloud = false, onClose }) => {
  const sheetRef = useRef<HTMLElement>(null);
  const isReducedMotion = usePrefersReducedMotion();
  useDialog(sheetRef, { onClose });
  useStopSpeechOnLeave();
  const todayStr = toLocalDateStr(new Date());
  const [askState, setAskState] = useState<AskState>({ kind: 'idle' });
  const hasAsked = askState.kind === 'idle' && hasAskedToday(learner.uid, todayStr);
  const isGirl = learner.gender === 'girl';
  const perks = [...PERKS.filter((p) => p.focus === focus), ...PERKS.filter((p) => p.focus !== focus)];

  const handleAsk = async () => {
    setAskState({ kind: 'preparing' });
    const next = await prepareAskMessage(learner);
    if (next.kind === 'ready') rememberAsk(learner.uid, todayStr);
    setAskState(next);
  };

  const askArea = (() => {
    if (learner.isGuest) {
      return (
        <p className="p-3 rounded-2xl bg-amber-400/15 text-sm font-bold">
          {isGirl ? 'קודם שמרי' : 'קודם שמור'} את החשבון (בהגדרות ← חשבון), כדי שההתקדמות וה-<bdi dir="ltr" lang="en">Pro</bdi> לא ילכו לאיבוד.
        </p>
      );
    }
    if (askState.kind === 'ready') {
      return (
        <div className="space-y-2">
          <p className="text-sm font-bold">{isGirl ? 'שלחי' : 'שלח'} את ההודעה להורה:</p>
          <ShareTextActions
            text={askState.message}
            shareTitle={`${APP_NAME} Pro`}
            shareLabel="שליחה להורה"
            copyLabel="העתקת ההודעה"
            copiedLabel="הועתק ✓"
            copyFailedLabel="לא הצלחנו להעתיק"
            theme={theme}
          />
        </div>
      );
    }
    return (
      <div className="space-y-2">
        {hasAsked && <p className={`text-xs font-bold ${theme.mutedTextClass}`}>שלחת כבר בקשה היום. אפשר לשלוח שוב.</p>}
        {askState.kind === 'failed' && (
          <p role="alert" className="text-xs font-bold text-rose-500">
            {askState.errorHe}
          </p>
        )}
        <Button theme={theme} size="lg" className="btn-chunky w-full" onClick={handleAsk} disabled={askState.kind === 'preparing'}>
          {askState.kind === 'preparing' ? 'מכינים את ההודעה…' : ASK_PARENT_LABEL_HE}
        </Button>
      </div>
    );
  })();

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center" role="presentation">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <section
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pro-upsell-title"
        className={`relative w-full max-w-lg max-h-[88dvh] overflow-y-auto overscroll-contain rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] space-y-4 outline-none ${theme.cardBgClass} ${
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
        <div className="flex flex-col items-center text-center gap-2 pt-2">
          <Companion theme={theme} pose="cheer" size={88} />
          <div className="flex items-center gap-1.5">
            <h2 id="pro-upsell-title" className="text-xl font-extrabold">
              {getProSheetTitleHe(learner.gender)}
            </h2>
            <HebrewAudioContext.Provider value={readsHebrewAloud}>
              <HebrewSpeakButton text={getProSheetSpokenHe(learner.gender)} label="הקשבה" />
            </HebrewAudioContext.Provider>
          </div>
          <p className={`text-sm font-bold ${theme.mutedTextClass}`}>
            עם <bdi dir="ltr" lang="en">{APP_NAME} Pro</bdi> נפתחים:
          </p>
        </div>
        <ul className="space-y-1.5">
          {perks.map((perk) => (
            <li key={perk.focus} className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-sm font-bold ${theme.inputBgClass}`}>
              <span className="text-xl" aria-hidden="true">
                {perk.emoji}
              </span>
              {perk.labelHe}
            </li>
          ))}
        </ul>
        {askArea}
      </section>
    </div>,
    document.body
  );
};
