import React, { Suspense, useState } from 'react';
import { ExamAnswer, applyExamResultToProfile, getNextSession, isExamPast, toLocalDateStr } from '../../data/examPrep';
import { ExamPrepPlan, LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { DockTile } from '../home/DockTile';
import { ExamModalShell } from './ExamModalShell';
import { ExamPrepCard } from './ExamPrepCard';
import type { ExamSessionNext } from './ExamSessionRunner';
import { lazyNamed } from '../../utils/lazyNamed';
import { ScreenLoading } from '../ScreenLoading';

const ExamPrepSetup = lazyNamed(() => import('./ExamPrepSetup'), 'ExamPrepSetup');
const ExamPrepPlanView = lazyNamed(() => import('./ExamPrepPlanView'), 'ExamPrepPlanView');
const ExamReadyCertificate = lazyNamed(() => import('./ExamReadyCertificate'), 'ExamReadyCertificate');
const ExamSessionRunner = lazyNamed(() => import('./ExamSessionRunner'), 'ExamSessionRunner');

interface ExamPrepHubProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

type HubView =
  | { kind: 'none' }
  | { kind: 'card' }
  | { kind: 'setup' }
  | { kind: 'plan' }
  | { kind: 'session'; dayIndex: number; runId: number }
  | { kind: 'certificate' };

/**
 * Feature 18: the home dock tile (Feature 27), the card in a sheet, plus the setup, plan,
 * session and certificate overlays. The tile's dot marks a study session waiting today.
 */
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

  const hasSessionWaiting = Boolean(plan && !isExamPast(plan, todayStr) && getNextSession(plan, todayStr));

  const sessionDay = view.kind === 'session' ? plan?.days.find((d) => d.dayIndex === view.dayIndex) : undefined;

  return (
    <>
      <DockTile
        emoji="📅"
        labelHe="הכנה למבחן"
        theme={theme}
        onClick={() => setView({ kind: 'card' })}
        hasNews={hasSessionWaiting}
        newsLabelHe="תרגול של היום מחכה"
      />

      {view.kind === 'card' && (
        <ExamModalShell theme={theme} labelHe="הכנה למבחן" onClose={close} header={<h2 className="font-extrabold text-base sm:text-lg">📅 הכנה למבחן</h2>}>
          <div className="p-3 sm:p-4">
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
          </div>
        </ExamModalShell>
      )}

      {view.kind === 'setup' && (
        <Suspense fallback={<ScreenLoading />}>
          <ExamPrepSetup profile={profile} theme={theme} onCreate={handleCreate} onClose={() => setView({ kind: 'card' })} />
        </Suspense>
      )}

      {view.kind === 'plan' && plan && (
        <Suspense fallback={<ScreenLoading />}>
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
        </Suspense>
      )}

      {view.kind === 'session' && plan && sessionDay && (
        <Suspense fallback={<ScreenLoading />}>
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
        </Suspense>
      )}

      {view.kind === 'certificate' && plan && (
        <Suspense fallback={<ScreenLoading />}>
          <ExamReadyCertificate plan={plan} profile={profile} theme={theme} onClose={() => setView({ kind: 'plan' })} />
        </Suspense>
      )}
    </>
  );
};
