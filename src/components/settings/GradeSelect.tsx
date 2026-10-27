import React, { useId } from 'react';
import { GraduationCap } from 'lucide-react';
import { GradeId, SUPPORTED_GRADES } from '../../types/learner';
import type { ThemeDefinition } from '../../themes/themeRegistry';

interface GradeSelectProps {
  gradeId: GradeId;
  theme: ThemeDefinition;
  onChange: (gradeId: GradeId) => void;
}

const GRADE_GROUPS: { labelHe: string; from: number; to: number }[] = [
  { labelHe: '🏫 יסודי (כיתות א׳–ו׳)', from: 0, to: 6 },
  { labelHe: '🎒 חטיבת ביניים (כיתות ז׳–ט׳)', from: 6, to: 9 },
  { labelHe: '🎓 תיכון ובגרות (כיתות י׳–י״ב)', from: 9, to: 12 },
];

/** The school grade as a dropdown, grouped by school stage */
export const GradeSelect: React.FC<GradeSelectProps> = ({ gradeId, theme, onChange }) => {
  const selectId = useId();
  return (
    <div className="space-y-1.5 lg:col-span-2">
      <label htmlFor={selectId} className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
        <GraduationCap className="w-4 h-4" />
        <span>שכבת לימוד (מותאם אוטומטית לפי הגיל):</span>
      </label>
      <select
        id={selectId}
        value={gradeId}
        onChange={(e) => onChange(e.target.value as GradeId)}
        className={`w-full px-3 py-3 rounded-2xl font-bold text-xs sm:text-sm outline-none ${theme.inputBgClass}`}
      >
        {GRADE_GROUPS.map((group) => (
          <optgroup key={group.labelHe} label={group.labelHe}>
            {SUPPORTED_GRADES.slice(group.from, group.to).map((g) => (
              <option key={g.id} value={g.id} className="text-slate-900 bg-white">
                {g.labelHe} · {g.ministryBand}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};
