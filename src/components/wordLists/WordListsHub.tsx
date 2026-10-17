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

interface WordListsHubProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
}

type HubView = { kind: 'none' } | { kind: 'import' } | { kind: 'session'; listId: string; runId: number };

/** Feature 10: the dashboard card plus the import and practice overlays. */
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
    else close();
  };

  const sessionList = view.kind === 'session' ? lists.find((l) => l.id === view.listId) : undefined;

  return (
    <>
      <WordListsCard
        lists={lists}
        canAdd={canAddList(profile)}
        gender={profile.gender}
        theme={theme}
        onImport={() => setView({ kind: 'import' })}
        onPractice={startSession}
        onDelete={(listId) => onUpdateProfile(archiveWordList(profile, listId, new Date()))}
      />

      {view.kind === 'import' && (
        <WordListImporter gender={profile.gender} theme={theme} onSave={handleSave} onClose={close} />
      )}

      {view.kind === 'session' && sessionList && (
        <WordListSessionRunner
          key={view.runId}
          list={sessionList}
          profile={profile}
          theme={theme}
          onSpeakEnglish={onSpeakEnglish}
          onFinish={(answers, next) => handleFinish(sessionList.id, answers, next)}
          onClose={close}
        />
      )}
    </>
  );
};
