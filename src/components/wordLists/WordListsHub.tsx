import React, { Suspense, useState } from 'react';
import {
  WordListAnswer,
  addWordList,
  applyWordListResultToProfile,
  archiveWordList,
  canAddList,
  getActiveLists,
} from '../../data/customWordLists';
import { CustomWordList, LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import type { WordListSessionNext } from './WordListSessionRunner';
import { WordListsCard } from './WordListsCard';
import { DockTile } from '../home/DockTile';
import { ExamModalShell } from '../examPrep/ExamModalShell';
import { lazyNamed } from '../../utils/lazyNamed';
import { ScreenLoading } from '../ScreenLoading';
import { hasFullAccess, maxWordLists } from '../../data/proGate';
import { useProAccess } from '../../hooks/useProAccess';
import { useOpenProUpsell } from '../pro/proUpsellContext';

const WordListImporter = lazyNamed(() => import('./WordListImporter'), 'WordListImporter');
const WordListSessionRunner = lazyNamed(() => import('./WordListSessionRunner'), 'WordListSessionRunner');

interface WordListsHubProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

type HubView = { kind: 'none' } | { kind: 'card' } | { kind: 'import' } | { kind: 'session'; listId: string; runId: number };

/** Feature 10: the home dock tile (Feature 27), the lists card in a sheet, plus the import and practice overlays. */
export const WordListsHub: React.FC<WordListsHubProps> = ({ profile, theme, onUpdateProfile, onSpeakEnglish }) => {
  const [view, setView] = useState<HubView>({ kind: 'none' });
  const proAccess = useProAccess();
  const openProUpsell = useOpenProUpsell();
  const listLimit = maxWordLists(proAccess);
  const lists = getActiveLists(profile);
  const close = () => setView({ kind: 'none' });
  const startSession = (listId: string) => setView({ kind: 'session', listId, runId: Date.now() });

  const handleSave = (list: CustomWordList) => {
    // No room left (the add button is off then): back to the lists, not into a list that wasn't saved
    if (!canAddList(profile, listLimit)) {
      setView({ kind: 'card' });
      return;
    }
    onUpdateProfile(addWordList(profile, list, listLimit));
    startSession(list.id);
  };

  const handleFinish = (listId: string, answers: WordListAnswer[], next: WordListSessionNext) => {
    onUpdateProfile(applyWordListResultToProfile(profile, listId, answers, new Date()).profile);
    if (next === 'retry') startSession(listId);
    else setView({ kind: 'card' });
  };

  const sessionList = view.kind === 'session' ? lists.find((l) => l.id === view.listId) : undefined;

  return (
    <>
      <DockTile emoji="📝" labelHe="רשימות מילים" theme={theme} onClick={() => setView({ kind: 'card' })} />

      {view.kind === 'card' && (
        <ExamModalShell
          theme={theme}
          labelHe="רשימות המילים שלי"
          onClose={close}
          header={<h2 className="font-extrabold text-base sm:text-lg">📝 רשימות המילים שלי</h2>}
        >
          <div className="p-3 sm:p-4">
            <WordListsCard
              lists={lists}
              canAdd={canAddList(profile, listLimit)}
              maxLists={listLimit}
              onAskPro={hasFullAccess(proAccess) ? undefined : () => openProUpsell('lists')}
              gender={profile.gender}
              theme={theme}
              onImport={() => setView({ kind: 'import' })}
              onPractice={startSession}
              onDelete={(listId) => onUpdateProfile(archiveWordList(profile, listId, new Date()))}
            />
          </div>
        </ExamModalShell>
      )}

      {view.kind === 'import' && (
        <Suspense fallback={<ScreenLoading />}>
          <WordListImporter gender={profile.gender} theme={theme} onSave={handleSave} onClose={() => setView({ kind: 'card' })} />
        </Suspense>
      )}

      {view.kind === 'session' && sessionList && (
        <Suspense fallback={<ScreenLoading />}>
          <WordListSessionRunner
            key={view.runId}
            list={sessionList}
            profile={profile}
            theme={theme}
            onSpeakEnglish={onSpeakEnglish}
            onFinish={(answers, next) => handleFinish(sessionList.id, answers, next)}
            onClose={() => setView({ kind: 'card' })}
          />
        </Suspense>
      )}
    </>
  );
};
