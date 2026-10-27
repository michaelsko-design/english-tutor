import React, { useEffect, useId, useRef, useState } from 'react';
import { Volume2, X } from 'lucide-react';
import { getRecommendedGradeForAge, type LearnerProfile } from '../../types/learner';
import { THEME_REGISTRY } from '../../themes/themeRegistry';
import { getHebrewCopy } from '../../utils/hebrewGender';
import { DEFAULT_VOICE_PREFERENCE, type VoicePreference } from '../../utils/ttsVoice';
import {
  PARENT_APPROVAL_AGE,
  isFriendsHubEnabled,
  isUsernameSearchable,
} from '../../data/friends';
import { buildSavedProfile, type ProfileDraft } from '../../utils/buildSavedProfile';
import { usernameFromEmail } from '../../utils/username';
import { auth } from '../../services/firebase';
import type { AccountResult } from '../../services/accountService';
import { APP_NAME } from '../../config/appInfo';
import { AppLogo } from '../AppLogo';
import { AccountPrivacyCard } from './AccountPrivacyCard';
import { ParentLinkCard } from './ParentLinkCard';
import { StreakReminderCard } from './StreakReminderCard';
import { VoiceLabCard } from './VoiceLabCard';
import { GradeSelect } from './GradeSelect';
import { FriendsHubFields, GenderAgeFields, NameField, ShabbatToggle, ThemePicker } from './ProfileFields';
import { SettingsTabs, tabButtonId, tabPanelId, type SettingsTabItem } from './SettingsTabs';

type SettingsTabId = 'profile' | 'look' | 'voice' | 'friends' | 'account';

const SETTINGS_TABS: SettingsTabItem<SettingsTabId>[] = [
  { id: 'profile', labelHe: 'פרופיל', icon: '👤' },
  { id: 'look', labelHe: 'עיצוב ושבת', icon: '🎨' },
  { id: 'voice', labelHe: 'הקראה ותזכורת', icon: '🔊' },
  { id: 'friends', labelHe: 'חברים והורים', icon: '👫' },
  { id: 'account', labelHe: 'פרטיות וחשבון', icon: '🔒' },
];

const VOICE_OPTIONS: { id: VoicePreference; labelHe: string }[] = [
  { id: 'female', labelHe: '👩 קול נשי' },
  { id: 'male', labelHe: '👨 קול גברי' },
];

const NAME_SAVE_DELAY_MS = 600;
const SAVED_NOTICE_MS = 2500;

interface SettingsViewProps {
  profile: LearnerProfile;
  /** Called with the updated profile after every change (App.handleUpdateProfile) */
  onProfileChange: (updated: LearnerProfile) => void;
  onClose: () => void;
  onSignOut: () => Promise<void>;
  onDeleteAccount: (friendCode: string | undefined, pin: string) => Promise<AccountResult>;
}

function toDraft(profile: LearnerProfile): ProfileDraft {
  return {
    name: profile.name || '',
    age: profile.age || 12,
    gender: profile.gender || 'girl',
    gradeId: profile.gradeId || getRecommendedGradeForAge(12),
    themeId: profile.themeId || 'cozy-studio',
    isShabbatObserver: profile.isShabbatObserver !== undefined ? profile.isShabbatObserver : true,
    isFriendsHubOn: isFriendsHubEnabled(profile),
    isUsernameSearchOn: isUsernameSearchable(profile),
    voicePreference: profile.voicePreference ?? DEFAULT_VOICE_PREFERENCE,
    hasParentConsent: Boolean(profile.parentalConsentAt),
  };
}

/** What the settings edit; two profiles with the same signature need no save */
function signature(profile: LearnerProfile): string {
  return JSON.stringify([
    toDraft(profile),
    profile.stats?.shabbatShieldActive,
    profile.parentalConsentAt,
  ]);
}

/** The settings screen: tabs, and every change is saved as it is made */
export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onProfileChange,
  onClose,
  onSignOut,
  onDeleteAccount,
}) => {
  const idPrefix = useId();
  const [activeTab, setActiveTab] = useState<SettingsTabId>('profile');
  const [draft, setDraft] = useState<ProfileDraft>(() => toDraft(profile));
  const [isParentApprovingFriends, setIsParentApprovingFriends] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSavedShown, setIsSavedShown] = useState(false);

  const draftRef = useRef(draft);
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const nameTimerRef = useRef<number | undefined>(undefined);
  const savedTimerRef = useRef<number | undefined>(undefined);

  const activeTheme = THEME_REGISTRY[draft.themeId];
  const heb = getHebrewCopy(draft.gender, draft.name || (draft.gender === 'girl' ? 'נועה' : 'עידו'));
  const isChild = draft.age < PARENT_APPROVAL_AGE;
  const isTurningFriendsOnForChild =
    isChild && draft.isFriendsHubOn && !isFriendsHubEnabled(profile);
  const hasUsername = Boolean(usernameFromEmail(auth?.currentUser?.email ?? null));

  useEffect(
    () => () => {
      window.clearTimeout(nameTimerRef.current);
      window.clearTimeout(savedTimerRef.current);
    },
    []
  );

  const save = (next: ProfileDraft, isParentApproved: boolean) => {
    if (!next.name.trim()) {
      setErrorMsg(
        next.gender === 'girl'
          ? 'כתבי את השם שלך כדי שנשמור את השינויים 😊'
          : 'כתוב את השם שלך כדי שנשמור את השינויים 😊'
      );
      return;
    }
    const isChildNow = next.age < PARENT_APPROVAL_AGE;
    const isTurningFriendsOn =
      isChildNow && next.isFriendsHubOn && !isFriendsHubEnabled(profileRef.current);
    if (isTurningFriendsOn && !isParentApproved) return;

    const built = buildSavedProfile(profileRef.current, next, new Date());
    if (signature(built) === signature(profileRef.current)) return;
    onProfileChange(built);
    setIsSavedShown(true);
    window.clearTimeout(savedTimerRef.current);
    savedTimerRef.current = window.setTimeout(() => setIsSavedShown(false), SAVED_NOTICE_MS);
  };

  const commit = (patch: Partial<ProfileDraft>, isParentApproved = isParentApprovingFriends) => {
    const next = { ...draftRef.current, ...patch };
    draftRef.current = next;
    setDraft(next);
    save(next, isParentApproved);
  };

  const handleNameChange = (value: string) => {
    const next = { ...draftRef.current, name: value };
    draftRef.current = next;
    setDraft(next);
    setErrorMsg('');
    window.clearTimeout(nameTimerRef.current);
    nameTimerRef.current = window.setTimeout(() => save(draftRef.current, isParentApprovingFriends), NAME_SAVE_DELAY_MS);
  };

  const flushName = () => {
    if (nameTimerRef.current === undefined) return;
    window.clearTimeout(nameTimerRef.current);
    nameTimerRef.current = undefined;
    save(draftRef.current, isParentApprovingFriends);
  };

  const handleClose = () => {
    flushName();
    onClose();
  };

  const handleAgeChange = (age: number) => commit({ age, gradeId: getRecommendedGradeForAge(age) });

  const handleParentApproval = (isApproving: boolean) => {
    setIsParentApprovingFriends(isApproving);
    if (isApproving) save(draftRef.current, true);
  };

  const panelProps = (id: SettingsTabId) => ({
    id: tabPanelId(idPrefix, id),
    role: 'tabpanel' as const,
    'aria-labelledby': tabButtonId(idPrefix, id),
    hidden: activeTab !== id,
    className: 'space-y-5',
  });

  return (
    <div
      className={`min-h-screen w-full ${activeTheme.pageBgClass} flex items-center justify-center p-3 sm:p-6 md:p-8 transition-colors duration-300`}
    >
      <div className={`w-full max-w-xl rounded-3xl p-5 sm:p-6 md:p-8 ${activeTheme.cardBgClass} space-y-5 relative`}>
        <button
          type="button"
          onClick={handleClose}
          className={`absolute top-4 left-4 min-w-11 min-h-11 flex items-center justify-center rounded-xl ${activeTheme.secondaryBtnClass}`}
          aria-label="חזרה לדשבורד"
          title="חזרה לדשבורד"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1.5">
          <AppLogo size={56} className="mx-auto shadow-lg" />
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/15 text-purple-600 dark:text-purple-300">
            <span>{APP_NAME}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">הגדרות ⚙️</h1>
          <p className={`text-xs sm:text-sm ${activeTheme.mutedTextClass}`}>{heb.onboardingSubtitle}</p>
          <p role="status" aria-live="polite" className="min-h-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {isSavedShown ? 'נשמר ✓' : ''}
          </p>
        </div>

        <SettingsTabs
          tabs={SETTINGS_TABS}
          activeId={activeTab}
          theme={activeTheme}
          idPrefix={idPrefix}
          onChange={setActiveTab}
        />

        <div {...panelProps('profile')}>
          <NameField
            value={draft.name}
            gender={draft.gender}
            errorMsg={errorMsg}
            theme={activeTheme}
            onChange={handleNameChange}
            onBlur={flushName}
          />
          <GenderAgeFields
            gender={draft.gender}
            age={draft.age}
            theme={activeTheme}
            onGenderChange={(gender) => commit({ gender })}
            onAgeChange={handleAgeChange}
          />
          <GradeSelect gradeId={draft.gradeId} theme={activeTheme} onChange={(gradeId) => commit({ gradeId })} />
        </div>

        <div {...panelProps('look')}>
          <ThemePicker themeId={draft.themeId} onChange={(themeId) => commit({ themeId })} />
          <ShabbatToggle
            gender={draft.gender}
            isOn={draft.isShabbatObserver}
            theme={activeTheme}
            onToggle={() => commit({ isShabbatObserver: !draft.isShabbatObserver })}
          />
        </div>

        <div {...panelProps('voice')}>
          <div className="space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
              <Volume2 className="w-4 h-4 text-pink-500" />
              <span>קול ההקראה:</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {VOICE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => commit({ voicePreference: option.id })}
                  aria-pressed={draft.voicePreference === option.id}
                  className={`min-h-11 p-3 rounded-2xl border font-extrabold text-xs sm:text-sm transition-all ${
                    draft.voicePreference === option.id
                      ? 'border-pink-500/60 bg-pink-500/10'
                      : 'border-current/10 bg-black/5 dark:bg-white/5 opacity-80'
                  }`}
                >
                  {option.labelHe}
                </button>
              ))}
            </div>
            <VoiceLabCard voicePreference={draft.voicePreference} theme={activeTheme} />
          </div>
          <div className="space-y-1.5">
            <span className="block text-xs sm:text-sm font-bold">תזכורת יומית:</span>
            <StreakReminderCard profile={profile} theme={activeTheme} />
          </div>
        </div>

        <div {...panelProps('friends')}>
          <FriendsHubFields
            isOn={draft.isFriendsHubOn}
            isChild={isChild}
            isTurningOnForChild={isTurningFriendsOnForChild}
            isParentApproving={isParentApprovingFriends}
            hasUsername={hasUsername}
            isUsernameSearchOn={draft.isUsernameSearchOn}
            theme={activeTheme}
            onToggle={() => {
              setIsParentApprovingFriends(false);
              commit({ isFriendsHubOn: !draft.isFriendsHubOn }, false);
            }}
            onParentApprovalChange={handleParentApproval}
            onUsernameSearchChange={(isUsernameSearchOn) => commit({ isUsernameSearchOn })}
          />
          <div className="space-y-1.5">
            <span className="block text-xs sm:text-sm font-bold">הורים:</span>
            <ParentLinkCard profile={profile} theme={activeTheme} />
          </div>
        </div>

        <div {...panelProps('account')}>
          <div className="space-y-1.5">
            <span className="block text-xs sm:text-sm font-bold">פרטיות וחשבון:</span>
            <AccountPrivacyCard
              profile={profile}
              theme={activeTheme}
              onSignOut={onSignOut}
              onDeleteAccount={onDeleteAccount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
