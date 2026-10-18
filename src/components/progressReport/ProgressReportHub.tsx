import React, { useState } from 'react';
import { toLocalDateStr } from '../../data/examPrep';
import { buildWeeklyReport, getWeekStart } from '../../data/progressReport';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ProgressReportCard } from './ProgressReportCard';
import { WeeklyReportScreen } from './WeeklyReportScreen';

interface ProgressReportHubProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

/** Feature 9: the dashboard card plus the full weekly report for parents and teachers. */
export const ProgressReportHub: React.FC<ProgressReportHubProps> = ({ profile, theme, onSpeakEnglish }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const todayStr = toLocalDateStr(new Date());
  const thisWeek = buildWeeklyReport(profile, getWeekStart(todayStr), todayStr);

  return (
    <>
      <ProgressReportCard
        report={thisWeek}
        todayStr={todayStr}
        theme={theme}
        onOpenReport={() => setIsReportOpen(true)}
      />
      {isReportOpen && (
        <WeeklyReportScreen
          profile={profile}
          theme={theme}
          todayStr={todayStr}
          onSpeakEnglish={onSpeakEnglish}
          onClose={() => setIsReportOpen(false)}
        />
      )}
    </>
  );
};
