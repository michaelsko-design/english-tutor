import React from 'react';
import { GraduationCap } from 'lucide-react';
import { GradeId, SUPPORTED_GRADES } from '../../types/learner';
import type { ThemeDefinition } from '../../themes/themeRegistry';

interface GradeChipsProps {
  gradeId: GradeId;
  theme: ThemeDefinition;
  onChange: (gradeId: GradeId) => void;
}

/** "כיתה ד׳" -> "ד׳": the chip shows the letter, the button's label keeps the full name */
const shortLabel = (labelHe: string): string => labelHe.replace('כיתה ', '');

/** The school grade as twelve big chips, one tap each (the onboarding form; settings keep `GradeSelect`) */
export const GradeChips: React.FC<GradeChipsProps> = ({ gradeId, theme, onChange }) => (
  <div className="space-y-1.5 lg:col-span-2">
    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
      <GraduationCap className="w-4 h-4" aria-hidden="true" />
      <span>באיזו כיתה?</span>
    </span>
    <div className="grid grid-cols-6 gap-2" role="group" aria-label="כיתה">
      {SUPPORTED_GRADES.map((grade) => (
        <button
          key={grade.id}
          type="button"
          aria-label={grade.labelHe}
          aria-pressed={grade.id === gradeId}
          onClick={() => onChange(grade.id)}
          className={`min-h-11 rounded-2xl font-extrabold text-sm transition-all ${
            grade.id === gradeId ? theme.primaryBtnClass : theme.secondaryBtnClass
          }`}
        >
          {shortLabel(grade.labelHe)}
        </button>
      ))}
    </div>
  </div>
);
