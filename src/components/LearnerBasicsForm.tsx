import React, { useEffect, useState } from 'react';
import { UserCheck } from 'lucide-react';
import { GradeId, LearnerGender, getAgeForGrade } from '../types/learner';
import type { ThemeDefinition } from '../themes/themeRegistry';
import { PARENT_APPROVAL_AGE } from '../data/friends';
import type { SignupDraft } from '../data/signupDraft';
import { PrivacyNoticeDialog } from './privacy/PrivacyNoticeDialog';
import { Button } from './ui/Button';
import { GradeChips } from './settings/GradeChips';
import { GenderField, NameField } from './settings/ProfileFields';

interface LearnerBasicsFormProps {
  theme: ThemeDefinition;
  initial: SignupDraft;
  submitLabel: React.ReactNode;
  /** Classes for the form's layout: a column by default, a two-column grid on the wide first-run page */
  layoutClassName?: string;
  /** Called as the name or gender changes, so a heading can greet the learner by name */
  onPreviewChange?: (preview: { name: string; gender: LearnerGender }) => void;
  onSubmit: (basics: SignupDraft) => void;
}

const nameMissingHe = (gender: LearnerGender): string =>
  gender === 'girl' ? 'כתבי את השם שלך כדי שנוכל להתחיל 😊' : 'כתוב את השם שלך כדי שנוכל להתחיל 😊';

/**
 * Who is learning: name, girl or boy, and school grade, plus a parent's consent for grades 1-7
 * (under 13). Shared by the sign-in screen (before the account exists) and the first-run page.
 */
export const LearnerBasicsForm: React.FC<LearnerBasicsFormProps> = ({
  theme,
  initial,
  submitLabel,
  layoutClassName = 'space-y-4',
  onPreviewChange,
  onSubmit,
}) => {
  const [name, setName] = useState(initial.name);
  const [gender, setGender] = useState<LearnerGender>(initial.gender);
  const [gradeId, setGradeId] = useState<GradeId>(initial.gradeId);
  const [hasParentConsent, setHasParentConsent] = useState(initial.hasParentConsent);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const isChild = getAgeForGrade(gradeId) < PARENT_APPROVAL_AGE;

  useEffect(() => {
    onPreviewChange?.({ name, gender });
  }, [name, gender, onPreviewChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(nameMissingHe(gender));
      return;
    }
    if (isChild && !hasParentConsent) {
      setErrorMsg('מתחת לגיל 13 צריך שהורה יאשר את מדיניות הפרטיות (סמנו את התיבה למטה).');
      return;
    }
    onSubmit({ name: name.trim(), gender, gradeId, hasParentConsent });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={layoutClassName}>
        <NameField
          value={name}
          gender={gender}
          errorMsg={errorMsg}
          theme={theme}
          autoFocus
          onChange={(value) => {
            setName(value);
            setErrorMsg('');
          }}
        />
        <GenderField gender={gender} theme={theme} onGenderChange={setGender} />
        <GradeChips gradeId={gradeId} theme={theme} onChange={setGradeId} />

        {/* A parent's consent when a learner under 13 starts */}
        {isChild && (
          <label className="lg:col-span-2 flex items-start gap-2 p-3 rounded-2xl border border-current/15 text-xs sm:text-sm font-bold">
            <input
              type="checkbox"
              checked={hasParentConsent}
              onChange={(e) => setHasParentConsent(e.target.checked)}
              className="mt-0.5 w-5 h-5 shrink-0"
            />
            <span>
              אני הורה וקראתי את{' '}
              <button type="button" onClick={() => setIsPrivacyOpen(true)} className="underline font-extrabold">
                מדיניות הפרטיות
              </button>
              . אני מסכים/ה שההתקדמות תישמר בענן.
            </span>
          </label>
        )}

        <div className="lg:col-span-2 flex items-center gap-2.5 pt-1">
          <Button theme={theme} size="lg" className="flex-1" type="submit">
            <UserCheck className="w-5 h-5" />
            <span>{submitLabel}</span>
          </Button>
        </div>
      </form>
      {isPrivacyOpen && <PrivacyNoticeDialog theme={theme} onClose={() => setIsPrivacyOpen(false)} />}
    </>
  );
};
