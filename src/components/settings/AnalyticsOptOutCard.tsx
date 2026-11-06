import React from 'react';
import { BarChart3 } from 'lucide-react';
import type { LearnerProfile } from '../../types/learner';
import type { ThemeDefinition } from '../../themes/themeRegistry';

interface AnalyticsOptOutCardProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  /** Called with the updated profile (App.handleUpdateProfile) */
  onProfileChange: (updated: LearnerProfile) => void;
}

/** Settings: lets a parent stop the anonymous usage counters and error reports (on by default) */
export const AnalyticsOptOutCard: React.FC<AnalyticsOptOutCardProps> = ({ profile, theme, onProfileChange }) => {
  const isOn = !profile.isAnalyticsOptedOut;

  return (
    <div className="space-y-1.5">
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        onClick={() => onProfileChange({ ...profile, isAnalyticsOptedOut: isOn })}
        className={`w-full min-h-11 p-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-between gap-2 ${theme.secondaryBtnClass}`}
      >
        <span className="flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4" aria-hidden="true" />
          סטטיסטיקות שימוש אנונימיות
        </span>
        <span>{isOn ? 'פועל' : 'כבוי'}</span>
      </button>
      <p className={`text-xs ${theme.mutedTextClass}`}>
        עוזרות לנו לשפר את האפליקציה: מספרים בלבד, בלי שם, בלי טקסט ובלי מעקב מחוץ לאפליקציה. אפשר לכבות בכל רגע.
      </p>
    </div>
  );
};
