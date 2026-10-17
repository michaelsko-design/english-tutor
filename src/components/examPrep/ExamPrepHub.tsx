import React, { useState } from 'react';
import { ExamAnswer, applyExamResultToProfile, toLocalDateStr } from '../../data/examPrep';
import { ExamPrepPlan, LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { ExamPrepCard } from './ExamPrepCard';
import { ExamPrepPlanView } from './ExamPrepPlanView';
import { ExamPrepSetup } from './ExamPrepSetup';
import { ExamReadyCertificate } from './ExamReadyCertificate';
import { ExamSessionNext, ExamSessionRunner } from './ExamSessionRunner';

interface ExamPrepHubProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

type HubView =
  | { kind: 'none' }
  | { kind: 'setup' }
  | { kind: 'plan' }
  | { kind: 'session'; dayIndex: number; runId: number }
  | { kind: 'certificate' };

/** Feature 18: the dashboard card plus the setup, plan, session and certificate overlays. */
export const ExamPrepHub: React.FC<ExamPrepHubProps> = ({
  profile,
  theme,
  onUpdateProfile,
  onSpeakEnglish,
}) => {
  const [view, setView] = useState<HubView>({ kind: 'none' });
  const todayStr = toLocalDateStr(new Date());
  const plan = profile.examPrep && !profile.examPrep.archivedAt ? profile.examPrep : undefined;
  const close = () => setView({ kind: 'none' });

  const startDay = (dayIndex: number) => setView({ kind: 'session', dayIndex, runId: Date.now() });

  const handleCreate = (newPlan: ExamPrepPlan) => {
    onUpdateProfile({ ...profile, examPrep: newPlan });
    setView({ kind: 'plan' });
  };

  const handleArchive = () => {
    if (!plan) return;
    onUpdateProfile({ ...profile, examPrep: { ...plan, archivedAt: new Date().toISOString() } });
    close();
  };

  const handleFinishSession = (dayIndex: number, answers: ExamAnswer[], next: ExamSessionNext) => {
    const updated = applyExamResultToProfile(profile, dayIndex, answers, new Date());
    onUpdateProfile(updated);
    const earnedCertificate = !plan?.certificateEarnedAt && Boolean(updated.examPrep?.certificateEarnedAt);
    if (earnedCertificate) setView({ kind: 'certificate' });
    else if (next === 'retry') startDay(dayIndex);
    else setView({ kind: 'plan' });
  };

  const sessionDay = view.kind === 'session' ? plan?.days.find((d) => d.dayIndex === view.dayIndex) : undefined;

  return (
    <>
      <ExamPrepCard
        plan={plan}
        gender={profile.gender}
        theme={theme}
        todayStr={todayStr}
        onCreatePlan={() => setView({ kind: 'setup' })}
        onOpenPlan={() => setView({ kind: 'plan' })}
        onStartDay={startDay}
        onShowCertificate={() => setView({ kind: 'certificate' })}
        onArchive={handleArchive}
      />

      {view.kind === 'setup' && (
        <ExamPrepSetup profile={profile} theme={theme} onCreate={handleCreate} onClose={close} />
      )}

      {view.kind === 'plan' && plan && (
        <ExamPrepPlanView
          plan={plan}
          gender={profile.gender}
          theme={theme}
          todayStr={todayStr}
          onStartDay={startDay}
          onShowCertificate={() => setView({ kind: 'certificate' })}
          onNewPlan={() => setView({ kind: 'setup' })}
          onArchive={handleArchive}
          onClose={close}
        />
      )}

      {view.kind === 'session' && plan && sessionDay && (
        <ExamSessionRunner
          key={view.runId}
          plan={plan}
          day={sessionDay}
          profile={profile}
          theme={theme}
          onSpeakEnglish={onSpeakEnglish}
          onFinish={(answers, next) => handleFinishSession(sessionDay.dayIndex, answers, next)}
          onClose={() => setView({ kind: 'plan' })}
        />
      )}

      {view.kind === 'certificate' && plan && (
        <ExamReadyCertificate plan={plan} profile={profile} theme={theme} onClose={() => setView({ kind: 'plan' })} />
      )}
    </>
  );
};
