import React, { useState } from 'react';
import { toLocalDateStr } from '../../data/examPrep';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { DockTile } from '../home/DockTile';
import { WeeklyReportScreen } from './WeeklyReportScreen';

interface ProgressReportHubProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

/** Feature 9: the home dock tile (Feature 27) that opens the weekly report for parents and teachers. */
export const ProgressReportHub: React.FC<ProgressReportHubProps> = ({ profile, theme, onSpeakEnglish }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);

  return (
    <>
      <DockTile emoji="📊" labelHe="דוח להורים" theme={theme} onClick={() => setIsReportOpen(true)} />
      {isReportOpen && (
        <WeeklyReportScreen
          profile={profile}
          theme={theme}
          todayStr={toLocalDateStr(new Date())}
          onSpeakEnglish={onSpeakEnglish}
          onClose={() => setIsReportOpen(false)}
        />
      )}
    </>
  );
};
