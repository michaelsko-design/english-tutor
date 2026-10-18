import React, { useState } from 'react';
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
import { WordListImporter } from './WordListImporter';
import { WordListSessionNext, WordListSessionRunner } from './WordListSessionRunner';
import { WordListsCard } from './WordListsCard';
import { DockTile } from '../home/DockTile';
import { ExamModalShell } from '../examPrep/ExamModalShell';

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
  const lists = getActiveLists(profile);
  const close = () => setView({ kind: 'none' });
  const startSession = (listId: string) => setView({ kind: 'session', listId, runId: Date.now() });

  const handleSave = (list: CustomWordList) => {
    onUpdateProfile(addWordList(profile, list));
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
              canAdd={canAddList(profile)}
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
        <WordListImporter gender={profile.gender} theme={theme} onSave={handleSave} onClose={() => setView({ kind: 'card' })} />
      )}

      {view.kind === 'session' && sessionList && (
        <WordListSessionRunner
          key={view.runId}
          list={sessionList}
          profile={profile}
          theme={theme}
          onSpeakEnglish={onSpeakEnglish}
          onFinish={(answers, next) => handleFinish(sessionList.id, answers, next)}
          onClose={() => setView({ kind: 'card' })}
        />
      )}
    </>
  );
};
