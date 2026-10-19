import React, { useMemo, useState } from 'react';
import { celebrate } from '../../utils/celebrate';
import { Volume2 } from 'lucide-react';
import {
  DreamFrame,
  DreamWord,
  MAX_NOTE_LENGTH,
  fillFrame,
  getJournalEntries,
  getTranslationChoices,
  isSameTranslation,
  pickDreamFrames,
  saveDreamEntry,
} from '../../data/dreamJournal';
import { RoomActivityReward } from '../../data/roomActivities';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { SpeechEvaluationResult } from '../../utils/speechSimilarity';
import { getSpeechErrorTextHe, useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { VoiceSpeakDrill } from '../drills';
import { ActivityRewardSummary } from './ActivityRewardSummary';
import { DreamJournalList } from './DreamJournalList';
import { RoomPanelFrame } from './RoomPanelFrame';

interface DreamJournalPanelProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onClose: () => void;
}

type JournalStep = 'invent' | 'translate' | 'read' | 'done';

/** "frameIdx-blankIdx" keys for the per-blank picks, answers and mistakes. */
const blankKey = (frameIdx: number, blankIdx: number) => `${frameIdx}-${blankIdx}`;

/** Feature 12, phase 4: invent a dream in Hebrew, translate it into English, read it aloud, save it. */
export const DreamJournalPanel: React.FC<DreamJournalPanelProps> = ({
  profile,
  theme,
  onUpdateProfile,
  onSpeakEnglish,
  onClose,
}) => {
  const isGirl = profile.gender === 'girl';
  const isTyping = profile.preferredTier === 'master';
  const [salt, setSalt] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const frames = useMemo(() => pickDreamFrames(profile.gradeId, salt), [profile.gradeId, salt]);
  const [step, setStep] = useState<JournalStep>('invent');
  const [picks, setPicks] = useState<Record<string, DreamWord>>({});
  const [noteHe, setNoteHe] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [missed, setMissed] = useState<Record<string, boolean>>({});
  /** The latest wrong translation choice per blank, shown until the right one is picked */
  const [wrongChoices, setWrongChoices] = useState<Record<string, string>>({});
  const [speechEval, setSpeechEval] = useState<SpeechEvaluationResult | null>(null);
  const [wasReadAloud, setWasReadAloud] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [reward, setReward] = useState<RoomActivityReward | null>(null);
  const speech = useSpeechRecognition();

  const blankKeys = frames.flatMap((frame, f) => frame.blanks.map((_, b) => blankKey(f, b)));
  const wordsOf = (frameIdx: number, lang: 'en' | 'he') =>
    frames[frameIdx].blanks.map((_, b) => picks[blankKey(frameIdx, b)]?.[lang]);
  const dreamHe = frames.map((frame, f) => fillFrame(frame.he, wordsOf(f, 'he'))).join(' ');
  const dreamEn = frames.map((frame, f) => fillFrame(frame.en, wordsOf(f, 'en'))).join(' ');
  const firstTryCount = blankKeys.filter((key) => !missed[key]).length;

  const handlePick = (key: string, word: DreamWord) => setPicks({ ...picks, [key]: word });

  const handleChoose = (key: string, choice: string) => {
    if (solved[key]) return;
    onSpeakEnglish(choice, 0.9);
    if (choice === picks[key].en) {
      setSolved({ ...solved, [key]: true });
      return;
    }
    setMissed({ ...missed, [key]: true });
    setWrongChoices({ ...wrongChoices, [key]: choice });
  };

  const handleCheckTyped = () => {
    const nextSolved = { ...solved };
    const nextMissed = { ...missed };
    blankKeys.forEach((key) => {
      if (isSameTranslation(answers[key] || '', picks[key].en)) nextSolved[key] = true;
      else nextMissed[key] = true;
    });
    setSolved(nextSolved);
    setMissed(nextMissed);
  };

  const handleStartListening = () => {
    setSpeechError(null);
    speech.start(dreamEn, {
      onResult: (_, evaluation) => {
        setSpeechEval(evaluation);
        if (evaluation.passed) setWasReadAloud(true);
      },
      onError: (kind) => setSpeechError(getSpeechErrorTextHe(kind, profile.gender)),
    });
  };

  const handleSave = () => {
    speech.cancel();
    const result = saveDreamEntry(profile, { textEn: dreamEn, textHe: dreamHe, noteHe }, wasReadAloud, new Date());
    onUpdateProfile(result.profile);
    if (result.isFullReward) celebrate('medium');
    setReward(result);
    setStep('done');
  };

  const handleNewDream = () => {
    setSalt(Math.floor(Math.random() * 1_000_000_000));
    setStep('invent');
    setPicks({});
    setNoteHe('');
    setAnswers({});
    setSolved({});
    setMissed({});
    setWrongChoices({});
    setSpeechEval(null);
    setWasReadAloud(false);
    setReward(null);
  };

  const renderInvent = (frame: DreamFrame, f: number) => (
    <div key={frame.id} className="space-y-2">
      <p className="text-sm font-extrabold">{fillFrame(frame.he, wordsOf(f, 'he'))}</p>
      {frame.blanks.map((words, b) => (
        <div key={b} className="flex flex-wrap gap-1.5">
          {words.map((word) => {
            const isPicked = picks[blankKey(f, b)]?.en === word.en;
            return (
              <button
                key={word.en}
                type="button"
                onClick={() => handlePick(blankKey(f, b), word)}
                aria-pressed={isPicked}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold ${isPicked ? theme.primaryBtnClass : theme.secondaryBtnClass}`}
              >
                {word.emoji} {word.he}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );

  const renderTranslate = (frame: DreamFrame, f: number) => (
    <div key={frame.id} className="space-y-2 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
      <p className="text-xs font-bold">{fillFrame(frame.he, wordsOf(f, 'he'))}</p>
      <p className="text-sm font-extrabold" dir="ltr" lang="en">
        {fillFrame(
          frame.en,
          frame.blanks.map((_, b) => (solved[blankKey(f, b)] ? picks[blankKey(f, b)].en : undefined))
        )}
      </p>
      {frame.blanks.map((_, b) => {
        const key = blankKey(f, b);
        const picked = picks[key];
        return (
          <div key={key} className="flex flex-wrap items-center gap-1.5" dir="ltr" lang="en">
            <span className="text-xs font-bold" dir="rtl">
              {picked.emoji} {picked.he} =
            </span>
            {solved[key] ? (
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-300">✓ {picked.en}</span>
            ) : isTyping ? (
              <input
                value={answers[key] || ''}
                onChange={(e) => setAnswers({ ...answers, [key]: e.target.value })}
                aria-label={`התרגום של ${picked.he}`}
                className={`px-2.5 py-1.5 rounded-xl text-sm font-bold w-44 ${theme.inputBgClass} ${missed[key] ? 'ring-2 ring-rose-400' : ''}`}
                dir="ltr" lang="en"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
              />
            ) : (
              getTranslationChoices(frame, b, picked, `${key}-${salt}`).map((choice) => (
                <button
                  key={choice}
                  type="button"
                  onClick={() => handleChoose(key, choice)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold ${theme.secondaryBtnClass} ${
                    wrongChoices[key] === choice ? 'ring-2 ring-rose-400 opacity-60' : ''
                  }`}
                >
                  {choice}
                </button>
              ))
            )}
            {!solved[key] && !isTyping && wrongChoices[key] && (
              <span className="text-xs font-bold text-rose-600 dark:text-rose-300" dir="rtl" role="status">
                {`"${wrongChoices[key]}" ${isGirl ? 'זו לא המילה, נסי שוב' : 'זו לא המילה, נסה שוב'}`}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );

  const isInvented = blankKeys.every((key) => picks[key]);
  const isTranslated = blankKeys.every((key) => solved[key]);
  const entries = getJournalEntries(profile);

  return (
    <RoomPanelFrame titleHe="🛏️ יומן החלומות · Dream Journal" theme={theme} onClose={onClose}>
      {step === 'invent' && (
        <div className="space-y-3">
          <p className={`text-xs ${theme.mutedTextClass}`}>
            {isGirl
              ? 'שלב 1: המציאי חלום — בחרי מילה לכל חלק, ואפשר לכתוב עוד פרטים בעברית.'
              : 'שלב 1: המצא חלום — בחר מילה לכל חלק, ואפשר לכתוב עוד פרטים בעברית.'}
          </p>
          {frames.map(renderInvent)}
          <textarea
            value={noteHe}
            onChange={(e) => setNoteHe(e.target.value.slice(0, MAX_NOTE_LENGTH))}
            placeholder="עוד פרטים על החלום (בעברית, לא חובה)"
            rows={2}
            className={`w-full px-3 py-2 rounded-2xl text-xs ${theme.inputBgClass}`}
          />
          <button
            type="button"
            disabled={!isInvented}
            onClick={() => setStep('translate')}
            className={`w-full py-2.5 rounded-2xl font-extrabold text-sm ${theme.primaryBtnClass} disabled:opacity-40`}
          >
            לתרגום לאנגלית ←
          </button>
          <DreamJournalList entries={entries} theme={theme} onSpeakEnglish={onSpeakEnglish} />
        </div>
      )}

      {step === 'translate' && (
        <div className="space-y-3">
          <p className={`text-xs ${theme.mutedTextClass}`}>
            {isTyping
              ? isGirl
                ? 'שלב 2: כתבי באנגלית את התרגום של כל מילה.'
                : 'שלב 2: כתוב באנגלית את התרגום של כל מילה.'
              : isGirl
                ? 'שלב 2: בחרי את התרגום הנכון לכל מילה.'
                : 'שלב 2: בחר את התרגום הנכון לכל מילה.'}
          </p>
          {frames.map(renderTranslate)}
          {isTyping && !isTranslated && (
            <button type="button" onClick={handleCheckTyped} className={`w-full py-2.5 rounded-2xl font-extrabold text-sm ${theme.secondaryBtnClass}`}>
              בדיקה ✓
            </button>
          )}
          {isTranslated && (
            <button type="button" onClick={() => setStep('read')} className={`w-full py-2.5 rounded-2xl font-extrabold text-sm ${theme.primaryBtnClass}`}>
              תרגמת את החלום! להקראה ←
            </button>
          )}
        </div>
      )}

      {step === 'read' && (
        <div className="space-y-3">
          <p className={`text-xs ${theme.mutedTextClass}`}>
            {isGirl ? 'שלב 3: הקשיבי לחלום שלך באנגלית, ונסי להקריא אותו (לא חובה).' : 'שלב 3: הקשב לחלום שלך באנגלית, ונסה להקריא אותו (לא חובה).'}
          </p>
          <button
            type="button"
            onClick={() => onSpeakEnglish(dreamEn, 0.85)}
            className={`w-full p-3 rounded-2xl text-sm font-extrabold flex items-center gap-2 ${theme.secondaryBtnClass}`}
            dir="ltr" lang="en"
          >
            <Volume2 className="w-4 h-4 shrink-0" />
            <span className="text-left">{dreamEn}</span>
          </button>
          <VoiceSpeakDrill
            targetEn={dreamEn}
            speechEval={speechEval}
            isListening={speech.isListening}
            isCompleted={wasReadAloud}
            gender={profile.gender}
            theme={theme}
            onSpeakEnglish={onSpeakEnglish}
            onStartListening={handleStartListening}
            onSkip={handleSave}
          />
          {speechError && <p className="text-xs font-bold text-rose-600">{speechError}</p>}
          {wasReadAloud && <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-300">🎙️ הקראה מעולה!</p>}
          <button type="button" onClick={handleSave} className={`w-full py-2.5 rounded-2xl font-extrabold text-sm ${theme.primaryBtnClass}`}>
            שמירה ביומן 📔
          </button>
        </div>
      )}

      {step === 'done' && (
        <ActivityRewardSummary
          reward={reward}
          theme={theme}
          gender={profile.gender}
          headlineHe={`החלום נשמר ביומן 📔 · ${firstTryCount}/${blankKeys.length} מילים תורגמו בניסיון ראשון`}
          emptyHe=""
          againLabel="חלום חדש 🌙"
          onAgain={handleNewDream}
          onClose={onClose}
        />
      )}
    </RoomPanelFrame>
  );
};
