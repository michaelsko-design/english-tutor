import React, { useEffect, useState } from 'react';
import { UserCheck } from 'lucide-react';
import { GradeId, LearnerGender, getAgeForGrade } from '../types/learner';
import type { ThemeDefinition } from '../themes/themeRegistry';
import { PARENT_APPROVAL_AGE } from '../data/friends';
import type { SignupDraft } from '../data/signupDraft';
import { TERMS_PAGE_PATH } from '../config/appInfo';
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

const CONSENT_MISSING_CHILD_HE = 'מתחת לגיל 13 צריך שהורה יאשר את תנאי השימוש ואת מדיניות הפרטיות (סמנו את התיבה למטה).';
const CONSENT_MISSING_TEEN_HE = 'כדי להמשיך צריך לאשר את תנאי השימוש ואת מדיניות הפרטיות (סמנו את התיבה למטה).';

const nameMissingHe = (gender: LearnerGender): string =>
  gender === 'girl' ? 'כתבי את השם שלך כדי שנוכל להתחיל 😊' : 'כתוב את השם שלך כדי שנוכל להתחיל 😊';

/**
 * Who is learning: name, girl or boy, and school grade, plus the agreement to the terms and the
 * privacy notice (legal audit TOS-04): a parent agrees for grades 1-7 (under 13), the learner agrees
 * with the parents' knowledge from grade 8. Shared by the sign-in screen (before the account exists)
 * and the first-run page.
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
    if (!hasParentConsent) {
      setErrorMsg(isChild ? CONSENT_MISSING_CHILD_HE : CONSENT_MISSING_TEEN_HE);
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
        <GradeChips
          gradeId={gradeId}
          theme={theme}
          onChange={(nextGradeId) => {
            // The box says who agrees (a parent under 13, the learner from 13): crossing that line clears it
            const isNextChild = getAgeForGrade(nextGradeId) < PARENT_APPROVAL_AGE;
            if (isNextChild !== isChild) setHasParentConsent(false);
            setGradeId(nextGradeId);
          }}
        />

        {/* The agreement to the terms and the privacy notice: a parent's under 13, the learner's from 13 */}
        <label className="lg:col-span-2 flex items-start gap-2 p-3 rounded-2xl border border-current/15 text-xs sm:text-sm font-bold">
          <input
            type="checkbox"
            checked={hasParentConsent}
            onChange={(e) => {
              setHasParentConsent(e.target.checked);
              setErrorMsg('');
            }}
            className="mt-0.5 w-5 h-5 shrink-0"
          />
          <span>
            {isChild ? 'אני הורה או אפוטרופוס/ית, קראתי ואני מסכים/ה ל' : 'קראתי ואני מסכים/ה ל'}
            <a href={TERMS_PAGE_PATH} target="_blank" rel="noopener" className="underline font-extrabold">
              תנאי השימוש
            </a>
            {' ול'}
            <button type="button" onClick={() => setIsPrivacyOpen(true)} className="underline font-extrabold">
              מדיניות הפרטיות
            </button>
            {isChild ? ', ולכך שההתקדמות תישמר בענן.' : ', בידיעת ההורים שלי ובהסכמתם.'}
          </span>
        </label>

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
