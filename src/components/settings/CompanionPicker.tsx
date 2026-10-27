import React from 'react';
import { Sparkles } from 'lucide-react';
import type { CompanionId } from '../../types/learner';
import { resolveTheme, type ThemeDefinition } from '../../themes/themeRegistry';
import { COMPANION_REGISTRY, getPickableCompanionIds } from '../../themes/companionRegistry';
import { Companion } from '../companion/Companion';

const PREVIEW_PX = 48;

interface CompanionPickerProps {
  /** The theme in use, with the mascot shown now */
  theme: ThemeDefinition;
  onChange: (companionId: CompanionId) => void;
}

/** Any mascot on any theme: each is shown on the current theme's background. */
export const CompanionPicker: React.FC<CompanionPickerProps> = ({ theme, onChange }) => (
  <div className="space-y-1.5">
    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
      <Sparkles className="w-4 h-4" />
      <span>הדמות המלווה:</span>
    </span>
    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
      {getPickableCompanionIds(theme.companion.id).map((companionId) => {
        const companion = COMPANION_REGISTRY[companionId];
        const isSelected = companionId === theme.companion.id;
        return (
          <button
            key={companionId}
            type="button"
            onClick={() => onChange(companionId)}
            aria-pressed={isSelected}
            aria-label={companion.name}
            className={`px-1 py-2 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-1 border border-current/20 ${
              theme.pageBgClass
            } ${isSelected ? 'ring-2 ring-offset-2 ring-fuchsia-500' : 'opacity-75 hover:opacity-100'}`}
          >
            <Companion theme={resolveTheme(theme.id, companionId)} pose="idle" size={PREVIEW_PX} hasShadow={false} />
            <span className="font-extrabold text-xs leading-tight break-words max-w-full" dir="ltr" lang="en">
              {companion.name}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
