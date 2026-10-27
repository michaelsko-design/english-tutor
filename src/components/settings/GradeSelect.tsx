import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, GraduationCap } from 'lucide-react';
import { GradeId, SUPPORTED_GRADES } from '../../types/learner';
import type { ThemeDefinition } from '../../themes/themeRegistry';

interface GradeSelectProps {
  gradeId: GradeId;
  theme: ThemeDefinition;
  onChange: (gradeId: GradeId) => void;
}

const GRADE_GROUPS: { labelHe: string; from: number; to: number; headerClass: string }[] = [
  { labelHe: '🏫 יסודי', from: 0, to: 6, headerClass: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
  { labelHe: '🎒 חטיבת ביניים', from: 6, to: 9, headerClass: 'bg-sky-500/20 text-sky-700 dark:text-sky-300' },
  { labelHe: '🎓 תיכון', from: 9, to: 12, headerClass: 'bg-violet-500/20 text-violet-700 dark:text-violet-300' },
];

/** The school grade as a dropdown whose list is split into school stages with clear headers */
export const GradeSelect: React.FC<GradeSelectProps> = ({ gradeId, theme, onChange }) => {
  const baseId = useId();
  const labelId = `${baseId}-label`;
  const listId = `${baseId}-list`;
  const optionId = (id: GradeId) => `${baseId}-opt-${id}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<GradeId>(gradeId);

  const selected = SUPPORTED_GRADES.find((g) => g.id === gradeId);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handlePointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.getElementById(optionId(activeId))?.scrollIntoView({ block: 'nearest' });
    // optionId only depends on baseId
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeId]);

  const open = () => {
    setActiveId(gradeId);
    setIsOpen(true);
  };

  const choose = (id: GradeId) => {
    setIsOpen(false);
    onChange(id);
  };

  const moveActive = (step: number) => {
    const index = SUPPORTED_GRADES.findIndex((g) => g.id === activeId);
    const next = Math.min(SUPPORTED_GRADES.length - 1, Math.max(0, index + step));
    setActiveId(SUPPORTED_GRADES[next].id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        open();
      }
      return;
    }
    if (e.key === 'ArrowDown') moveActive(1);
    else if (e.key === 'ArrowUp') moveActive(-1);
    else if (e.key === 'Home') setActiveId(SUPPORTED_GRADES[0].id);
    else if (e.key === 'End') setActiveId(SUPPORTED_GRADES[SUPPORTED_GRADES.length - 1].id);
    else if (e.key === 'Enter' || e.key === ' ') choose(activeId);
    else if (e.key === 'Escape' || e.key === 'Tab') setIsOpen(false);
    else return;
    if (e.key !== 'Tab') e.preventDefault();
  };

  return (
    <div ref={rootRef} className="space-y-1.5 lg:col-span-2 relative">
      <span id={labelId} className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
        <GraduationCap className="w-4 h-4" />
        <span>כיתה (מותאם אוטומטית לפי הגיל):</span>
      </span>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-labelledby={labelId}
        aria-activedescendant={isOpen ? optionId(activeId) : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
        className={`w-full min-h-12 px-4 py-3 rounded-2xl font-extrabold text-sm flex items-center justify-between gap-2 outline-none ${theme.inputBgClass}`}
      >
        <span>{selected?.labelHe}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className={`absolute z-30 inset-x-0 mt-1 max-h-72 overflow-y-auto rounded-2xl border border-current/15 shadow-xl p-1.5 ${theme.cardBgClass}`}
        >
          {GRADE_GROUPS.map((group) => (
            <li key={group.labelHe} role="presentation">
              <div
                role="presentation"
                className={`mt-1 first:mt-0 mb-1 px-3 py-1.5 rounded-xl text-xs font-extrabold tracking-wide ${group.headerClass}`}
              >
                {group.labelHe}
              </div>
              <ul role="group" aria-label={group.labelHe} className="space-y-0.5">
                {SUPPORTED_GRADES.slice(group.from, group.to).map((g) => {
                  const isSelected = g.id === gradeId;
                  return (
                    <li
                      key={g.id}
                      id={optionId(g.id)}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => choose(g.id)}
                      onPointerEnter={() => setActiveId(g.id)}
                      className={`min-h-11 px-3 rounded-xl flex items-center justify-between cursor-pointer font-bold text-sm ${
                        g.id === activeId ? 'bg-black/10 dark:bg-white/10' : ''
                      }`}
                    >
                      <span>{g.labelHe}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-500" aria-hidden="true" />}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
