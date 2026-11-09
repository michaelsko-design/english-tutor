import React, { useState } from 'react';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { Button } from '../ui/Button';
import { SettingsTabs, tabButtonId, tabPanelId } from '../settings/SettingsTabs';
import { CredentialsForm } from './CredentialsForm';
import type { CredentialMode } from './credentialValidation';
import { LearnerBasicsForm } from '../LearnerBasicsForm';
import { clearSignupDraft, setSignupDraft, type SignupDraft } from '../../data/signupDraft';
import { suggestUsername } from '../../utils/username';
import { trackFunnel } from '../../services/analytics/funnel';

const NEW_LEARNER_DEFAULTS: SignupDraft = { name: '', gender: 'girl', gradeId: 'grade-4', hasParentConsent: false };

type Audience = 'child' | 'parent';

const AUDIENCE_TABS = [
  { id: 'child' as const, labelHe: 'ילד/ה', icon: '🧒' },
  { id: 'parent' as const, labelHe: 'הורה', icon: '🧑' },
];

const TABS_ID = 'sign-in-audience';
const PARENT_AREA_URL = '/?parent';

interface SignInPanelProps {
  theme: ThemeDefinition;
  isBusy: boolean;
  /** The sign-in gate asks who is entering; the cloud panel (already in the learner app) doesn't */
  showAudienceSwitch: boolean;
  /** Opening a new account failed because the name is taken: offers signing in with it */
  isUsernameTaken: boolean;
  /** The error or success line, shown under the form it is about */
  messages: React.ReactNode;
  onGoogle: () => void;
  onSubmitCredentials: (mode: CredentialMode, username: string, password: string) => void;
  onClearMessages: () => void;
}

/** Big Google button for a child: the quickest way in */
function GoogleButton({ theme, isBusy, onGoogle }: Pick<SignInPanelProps, 'theme' | 'isBusy' | 'onGoogle'>) {
  return (
    <div className="space-y-1">
      <Button theme={theme} size="lg" className="w-full" disabled={isBusy} onClick={onGoogle}>
        <span aria-hidden="true" className="w-6 h-6 rounded-full bg-white text-blue-600 font-black flex items-center justify-center">
          G
        </span>
        <span>כניסה עם Google</span>
      </Button>
      <p className={`text-xs text-center ${theme.mutedTextClass}`}>אם יש לך חשבון <bdi>Google (Gmail)</bdi></p>
    </div>
  );
}

function ParentContent({ theme }: { theme: ThemeDefinition }) {
  return (
    <div className="space-y-3">
      <p className="p-3.5 rounded-2xl border border-amber-500/50 bg-amber-500/10 text-sm font-extrabold">
        הורים נכנסים עם חשבון ה־Google <u>שלהם</u>, לא עם החשבון של הילד או הילדה.
      </p>
      <a
        href={PARENT_AREA_URL}
        className={`w-full min-h-[44px] px-6 py-3.5 rounded-2xl text-sm sm:text-base font-extrabold flex items-center justify-center ${theme.primaryBtnClass}`}
      >
        לאזור ההורים
      </a>
      <p className={`text-xs text-center ${theme.mutedTextClass}`}>
        שם רואים דוח שבועי על ההתקדמות ומחברים את הילד או הילדה עם קוד.
      </p>
    </div>
  );
}

/**
 * The signed-out part of the sign-in screen: a child/grown-up switch, then either Google or a
 * username + password (new or existing) for a child, or the way to the parent area for a parent.
 * A parent never signs in here, so a parent's Google account can't become a learner by mistake.
 */
export function SignInPanel({
  theme,
  isBusy,
  showAudienceSwitch,
  isUsernameTaken,
  messages,
  onGoogle,
  onSubmitCredentials,
  onClearMessages,
}: SignInPanelProps) {
  const [audience, setAudience] = useState<Audience>('child');
  const [form, setForm] = useState<CredentialMode | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // A new learner first says who they are (before the account exists); the answer waits in memory
  const [basics, setBasics] = useState<SignupDraft | null>(null);

  const openForm = (next: CredentialMode | null) => {
    onClearMessages();
    if (next !== 'new') {
      setBasics(null);
      clearSignupDraft();
    }
    if (next === 'new') trackFunnel('signup_started');
    setForm(next);
  };

  const finishBasics = (answered: SignupDraft) => {
    trackFunnel('signup_basics_done');
    if (answered.hasParentConsent) trackFunnel('consent_ticked');
    setSignupDraft(answered);
    setBasics(answered);
    setUsername(suggestUsername(answered.name));
  };

  const changeAudience = (next: Audience) => {
    onClearMessages();
    setAudience(next);
  };

  const childContent = (
    <div className="space-y-4">
      <GoogleButton theme={theme} isBusy={isBusy} onGoogle={onGoogle} />

      <div className="flex items-center gap-3 text-xs font-bold opacity-70">
        <div className="h-px flex-1 bg-current" />
        <span>או שם משתמש וסיסמה</span>
        <div className="h-px flex-1 bg-current" />
      </div>

      {form === 'new' && !basics ? (
        <div className={`p-4 rounded-2xl space-y-3 ${theme.cardBgClass}`}>
          <h3 className="text-sm font-extrabold">🆕 קודם נכיר: מי לומד?</h3>
          <LearnerBasicsForm
            theme={theme}
            initial={NEW_LEARNER_DEFAULTS}
            submitLabel="המשך"
            onSubmit={finishBasics}
          />
          <button type="button" onClick={() => openForm(null)} className="text-xs font-bold underline opacity-80 hover:opacity-100">
            חזרה
          </button>
        </div>
      ) : form ? (
        <CredentialsForm
          mode={form}
          theme={theme}
          isBusy={isBusy}
          username={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={() => onSubmitCredentials(form, username, password)}
          onSuggestUsername={form === 'new' && basics ? () => setUsername(suggestUsername(basics.name)) : undefined}
          onBack={() => (form === 'new' ? setBasics(null) : openForm(null))}
        />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <Button theme={theme} variant="secondary" size="lg" className="flex-col !gap-1 whitespace-nowrap" onClick={() => openForm('new')}>
            <span aria-hidden="true" className="text-xl leading-none">🆕</span>
            <span>חדש/ה כאן</span>
          </Button>
          <Button theme={theme} variant="secondary" size="lg" className="flex-col !gap-1 whitespace-nowrap" onClick={() => openForm('existing')}>
            <span aria-hidden="true" className="text-xl leading-none">🔑</span>
            <span>כבר רשום/ה</span>
          </Button>
        </div>
      )}

      {messages}

      {isUsernameTaken && form === 'new' && (
        <Button theme={theme} variant="secondary" className="w-full" onClick={() => openForm('existing')}>
          לכניסה עם השם הזה
        </Button>
      )}
    </div>
  );

  if (!showAudienceSwitch) return childContent;

  return (
    <div className="space-y-4">
      <h3 className="text-base font-extrabold text-center">מי נכנס?</h3>
      <SettingsTabs
        tabs={AUDIENCE_TABS}
        activeId={audience}
        theme={theme}
        idPrefix={TABS_ID}
        onChange={changeAudience}
        ariaLabel="מי נכנס?"
        isLarge
      />
      <div role="tabpanel" id={tabPanelId(TABS_ID, audience)} aria-labelledby={tabButtonId(TABS_ID, audience)}>
        {audience === 'child' ? childContent : <ParentContent theme={theme} />}
      </div>
    </div>
  );
}
