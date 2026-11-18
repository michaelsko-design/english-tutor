import React, { useEffect, useState } from 'react';
import { APP_NAME } from '../../config/appInfo';
import { buildParentPortalUrl, buildParentUrl } from '../../data/parentLink';
import { buildParentShareMessageHe } from '../../data/showOff';
import { createParentInvite, listParentsOfChild } from '../../services/parentService';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { ShareTextActions } from '../ShareTextActions';

interface ParentShareBlockProps {
  uid: string;
  childName: string;
  childAvatar: string;
  /** The progress line(s) the message opens with; the parent link is added after it */
  summaryHe: string;
  theme: ThemeDefinition;
  /** The share or WhatsApp button was tapped */
  onShared?: () => void;
}

type ShareState = { kind: 'preparing' } | { kind: 'ready'; message: string } | { kind: 'failed'; errorHe: string };

const OFFLINE_HE = 'לא הצלחנו להכין את ההודעה. כדאי לנסות שוב בעוד רגע.';

/** The parent link to add: the portal for a paired parent, or a new pairing code. */
export async function prepareParentLink(
  uid: string,
  childName: string,
  childAvatar: string,
  origin: string
): Promise<{ ok: true; url: string; code: string | null } | { ok: false; errorHe: string }> {
  let parentCount: number;
  try {
    parentCount = (await listParentsOfChild(uid)).length;
  } catch {
    // Unknown whether a parent is paired: a new code could replace a working one, so stop here
    return { ok: false, errorHe: OFFLINE_HE };
  }
  if (parentCount > 0) return { ok: true, url: buildParentPortalUrl(origin), code: null };
  const invite = await createParentInvite(uid, childName, childAvatar);
  if (!invite.ok) return { ok: false, errorHe: invite.errorHe };
  return { ok: true, url: buildParentUrl(origin, invite.value.code), code: invite.value.code };
}

/**
 * "Show your parents": a progress message with the parent link, ready to send over WhatsApp or the
 * share sheet. Used on the first-win screen and the placement result. Never required: a failure is
 * shown with a retry, and the screen around it always has a way on.
 */
export const ParentShareBlock: React.FC<ParentShareBlockProps> = ({ uid, childName, childAvatar, summaryHe, theme, onShared }) => {
  const [state, setState] = useState<ShareState>({ kind: 'preparing' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    setState({ kind: 'preparing' });
    void prepareParentLink(uid, childName, childAvatar, window.location.origin).then((link) => {
      if (isCancelled) return;
      setState(link.ok ? { kind: 'ready', message: buildParentShareMessageHe(summaryHe, link) } : { kind: 'failed', errorHe: link.errorHe });
    });
    return () => {
      isCancelled = true;
    };
  }, [uid, childName, childAvatar, summaryHe, attempt]);

  if (state.kind === 'preparing') {
    return <p className={`text-xs font-bold ${theme.mutedTextClass}`}>מכינים את ההודעה…</p>;
  }

  if (state.kind === 'failed') {
    return (
      <div className="space-y-2">
        <p role="alert" className="text-xs font-bold text-rose-600 dark:text-rose-300">
          {state.errorHe}
        </p>
        <button type="button" onClick={() => setAttempt((n) => n + 1)} className={`px-4 py-2 rounded-xl text-sm font-extrabold ${theme.secondaryBtnClass}`}>
          לנסות שוב
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <ShareTextActions
        text={state.message}
        shareTitle={APP_NAME}
        shareLabel="שליחה להורים"
        copyLabel="העתקת ההודעה"
        copiedLabel="הועתק ✓"
        copyFailedLabel="לא הצלחנו להעתיק"
        theme={theme}
        onShare={onShared}
      />
    </div>
  );
};
