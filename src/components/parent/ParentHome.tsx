import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { ParentInvite, ParentLink, maskParentEmail, normalizeParentCode, snapshotToProfile } from '../../data/parentLink';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import {
  claimParentCode,
  listChildrenOfParent,
  loadReportSnapshot,
  previewParentCode,
  unlinkParent,
} from '../../services/parentService';
import { getTtsService } from '../../services/tts';
import { toLocalDateStr } from '../../utils/dates';
import { lazyNamed } from '../../utils/lazyNamed';
import { ScreenLoading } from '../ScreenLoading';
import { ResetPinForm } from './ResetPinForm';

const WeeklyReportScreen = lazyNamed(() => import('../progressReport/WeeklyReportScreen'), 'WeeklyReportScreen');

interface ParentHomeProps {
  user: User;
  theme: ThemeDefinition;
  initialCode: string | null;
  onSignOut: () => void;
}

interface OpenReport {
  link: ParentLink;
  profile: LearnerProfile | null;
}

const sectionClass = 'p-4 rounded-3xl space-y-3';
const buttonClass = 'min-h-11 px-4 rounded-2xl text-sm font-extrabold';

/** Removes the code from the address so a refresh doesn't offer it again. */
function clearCodeFromAddress(): void {
  window.history.replaceState(null, '', `${window.location.pathname}?parent`);
}

/** The signed-in parent: join a learner with a code, see the paired learners, open a weekly report. */
export const ParentHome: React.FC<ParentHomeProps> = ({ user, theme, initialCode, onSignOut }) => {
  const [children, setChildren] = useState<ParentLink[] | null>(null);
  const [pendingCode, setPendingCode] = useState<string | null>(initialCode);
  const [preview, setPreview] = useState<ParentInvite | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [openReport, setOpenReport] = useState<OpenReport | null>(null);
  const [resetPinFor, setResetPinFor] = useState<string | null>(null);
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [errorHe, setErrorHe] = useState<string | null>(null);
  const [noticeHe, setNoticeHe] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setChildren(await listChildrenOfParent(user.uid));
    } catch {
      setChildren([]);
      setErrorHe('לא הצלחנו לטעון את הרשימה. בדקו את החיבור ונסו שוב.');
    }
  }, [user.uid]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // A code from the link or the input is looked up first, so the parent sees whose it is
  useEffect(() => {
    if (!pendingCode) {
      setPreview(null);
      return;
    }
    let isCancelled = false;
    void previewParentCode(pendingCode).then((result) => {
      if (isCancelled) return;
      if (result.ok) {
        setPreview(result.value);
      } else {
        setPreview(null);
        setPendingCode(null);
        setErrorHe(result.errorHe);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [pendingCode]);

  const handleLookup = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorHe(null);
    setNoticeHe(null);
    setPendingCode(normalizeParentCode(codeInput));
  };

  const handleConfirm = async () => {
    if (!pendingCode) return;
    setIsBusy(true);
    setErrorHe(null);
    const result = await claimParentCode(user.uid, pendingCode, new Date(), maskParentEmail(user.email));
    setIsBusy(false);
    setIsAdultConfirmed(false);
    if (result.ok) {
      setNoticeHe(`${result.value.childName} מחובר/ת. הדוח יופיע אחרי שייכנסו לאפליקציה.`);
      setPendingCode(null);
      setCodeInput('');
      clearCodeFromAddress();
      await refresh();
    } else {
      setErrorHe(result.errorHe);
      setPendingCode(null);
    }
  };

  const handleOpenReport = async (link: ParentLink) => {
    setIsBusy(true);
    setErrorHe(null);
    try {
      const snapshot = await loadReportSnapshot(link.childUid);
      if (snapshot) setOpenReport({ link, profile: snapshotToProfile(snapshot) });
      else setNoticeHe(`עדיין אין דוח של ${link.childName}. הוא נוצר כשנכנסים לאפליקציה כשההורה מחובר.`);
    } catch {
      setErrorHe('לא הצלחנו לטעון את הדוח. בדקו את החיבור ונסו שוב.');
    }
    setIsBusy(false);
  };

  const handleUnlink = async (link: ParentLink) => {
    setIsBusy(true);
    const result = await unlinkParent(link);
    if (!result.ok) setErrorHe(result.errorHe);
    await refresh();
    setIsBusy(false);
  };

  const speakEnglish = (text: string, rate?: number) => {
    void getTtsService().speak(text, { rate });
  };

  return (
    <>
      {noticeHe && (
        <p role="status" className={`${sectionClass} ${theme.cardBgClass} text-sm font-bold`}>
          {noticeHe}
        </p>
      )}
      {errorHe && (
        <p role="alert" className="text-sm font-extrabold text-rose-700 dark:text-rose-300">
          {errorHe}
        </p>
      )}

      {preview && pendingCode && (
        <section className={`${sectionClass} ${theme.cardBgClass}`}>
          <p className="text-sm font-bold">
            לחבר את <span className="font-black">{preview.childName}</span> {preview.childAvatar} לחשבון ההורה שלך? תראו את
            הדוח השבועי של ההתקדמות בלבד.
          </p>
          <label className="flex items-start gap-2 text-xs sm:text-sm font-bold">
            <input
              type="checkbox"
              checked={isAdultConfirmed}
              onChange={(e) => setIsAdultConfirmed(e.target.checked)}
              className="mt-0.5 w-5 h-5 shrink-0"
            />
            אני ההורה או האפוטרופוס של {preview.childName}, בן/בת 18 ומעלה. הקוד נמסר לי על ידי {preview.childName}.
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isBusy || !isAdultConfirmed}
              onClick={() => void handleConfirm()}
              className={`${buttonClass} flex-1 ${theme.primaryBtnClass}`}
            >
              אישור החיבור
            </button>
            <button
              type="button"
              onClick={() => {
                setPendingCode(null);
                clearCodeFromAddress();
              }}
              className={`${buttonClass} ${theme.secondaryBtnClass}`}
            >
              ביטול
            </button>
          </div>
        </section>
      )}

      <section className={`${sectionClass} ${theme.cardBgClass}`} aria-label="הילדים שלי">
        <h2 className="text-base font-extrabold">הלומדים המחוברים</h2>
        {children === null && <p role="status">טוענים…</p>}
        {children?.length === 0 && (
          <p className={`text-sm font-bold ${theme.mutedTextClass}`}>
            עוד לא חובר אף לומד. הילד או הילדה יוצרים קוד בהגדרות של האפליקציה (״הורים״), ואז אפשר להכניס אותו כאן.
          </p>
        )}
        {children?.map((link) => (
          <div key={link.childUid} className="space-y-2">
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-black/5 dark:bg-white/5">
              <span className="font-extrabold text-sm">
                <span aria-hidden="true">{link.childAvatar}</span> {link.childName}
              </span>
              <span className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => void handleOpenReport(link)}
                  className={`${buttonClass} ${theme.primaryBtnClass}`}
                >
                  הדוח השבועי
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => setResetPinFor(resetPinFor === link.childUid ? null : link.childUid)}
                  aria-expanded={resetPinFor === link.childUid}
                  className={`${buttonClass} ${theme.secondaryBtnClass}`}
                >
                  החלפת קוד סודי
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => void handleUnlink(link)}
                  className={`${buttonClass} border border-rose-500/50 text-rose-700 dark:text-rose-300`}
                >
                  ניתוק
                </button>
              </span>
            </div>
            {resetPinFor === link.childUid && (
              <ResetPinForm
                childUid={link.childUid}
                childName={link.childName}
                theme={theme}
                onDone={(message) => {
                  setResetPinFor(null);
                  setErrorHe(null);
                  setNoticeHe(message);
                }}
                onCancel={() => setResetPinFor(null)}
              />
            )}
          </div>
        ))}
      </section>

      <form onSubmit={handleLookup} className={`${sectionClass} ${theme.cardBgClass}`}>
        <label className="block text-sm font-bold">
          חיבור לומד חדש: קוד ההורים
          <input
            type="text"
            dir="ltr"
            lang="en"
            autoCapitalize="characters"
            autoComplete="off"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            className={`mt-1 w-full px-3 py-2.5 rounded-xl text-base font-bold tracking-widest outline-none ${theme.inputBgClass}`}
          />
        </label>
        <button
          type="submit"
          disabled={isBusy || codeInput.trim().length === 0}
          className={`${buttonClass} w-full ${theme.secondaryBtnClass} disabled:opacity-50`}
        >
          בדיקת הקוד
        </button>
      </form>

      <button type="button" onClick={onSignOut} className={`${buttonClass} w-full ${theme.secondaryBtnClass}`}>
        התנתקות
      </button>

      {openReport?.profile && (
        <Suspense fallback={<ScreenLoading />}>
          <WeeklyReportScreen
            profile={openReport.profile}
            theme={theme}
            todayStr={toLocalDateStr(new Date())}
            onSpeakEnglish={speakEnglish}
            onClose={() => setOpenReport(null)}
          />
        </Suspense>
      )}
    </>
  );
};
