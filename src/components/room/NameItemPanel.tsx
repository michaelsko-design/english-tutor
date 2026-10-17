import React, { useEffect, useMemo, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { RoomItem } from '../../data/room';
import { getSpellingLetters } from '../../data/customWordLists';
import { LearnerGender, ProficiencyTier } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { SpeechEvaluationResult } from '../../utils/speechSimilarity';
import { seededShuffleNotIdentity } from '../../utils/shuffle';
import { getSpeechErrorTextHe, useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { FeedbackBanner, SpellingMagnetDrill, VoiceSpeakDrill } from '../drills';

type NameMode = 'say' | 'spell';

interface NameItemPanelProps {
  item: RoomItem;
  gender: LearnerGender;
  tier: ProficiencyTier;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  /** The learner said or spelled the name; place the item. */
  onNamed: () => void;
  onCancel: () => void;
}

interface Feedback {
  isCorrect: boolean;
  text: string;
}

function hasSpeechRecognition(): boolean {
  const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

/** The gate before placing a room item: say its English name or spell it with letter magnets. */
export const NameItemPanel: React.FC<NameItemPanelProps> = ({
  item,
  gender,
  tier,
  theme,
  onSpeakEnglish,
  onNamed,
  onCancel,
}) => {
  const isGirl = gender === 'girl';
  const [mode, setMode] = useState<NameMode>(() => (hasSpeechRecognition() ? 'say' : 'spell'));
  const [salt] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const letterTiles = useMemo(
    () => seededShuffleNotIdentity(getSpellingLetters(item.nameEn), `${item.id}-${salt}`),
    [item, salt]
  );
  const [tileIndices, setTileIndices] = useState<number[]>([]);
  const [speechEval, setSpeechEval] = useState<SpeechEvaluationResult | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isNamed, setIsNamed] = useState(false);
  const [showHint, setShowHint] = useState(tier === 'explorer');
  const speech = useSpeechRecognition();
  const cancelListening = speech.cancel;

  useEffect(() => {
    setTileIndices([]);
    setSpeechEval(null);
    setFeedback(null);
    cancelListening();
    if (mode === 'spell') onSpeakEnglish(item.nameEn, 0.85);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, cancelListening]);

  const succeed = (text: string) => {
    cancelListening();
    onSpeakEnglish(item.nameEn, 0.95);
    setIsNamed(true);
    setFeedback({ isCorrect: true, text });
  };

  const handleToggleTile = (idx: number) => {
    if (isNamed) return;
    setTileIndices(tileIndices.includes(idx) ? tileIndices.filter((i) => i !== idx) : [...tileIndices, idx]);
  };

  const handleCheckSpelling = () => {
    const built = tileIndices.map((i) => letterTiles[i]).join('');
    if (built.toLowerCase() === getSpellingLetters(item.nameEn).join('').toLowerCase()) {
      succeed(`מעולה! ${item.nameEn} מאוית נכון 🧲`);
    } else {
      setFeedback({
        isCorrect: false,
        text: isGirl ? 'עדיין לא מדויק — האזיני שוב 🔊 ונסי שוב!' : 'עדיין לא מדויק — האזן שוב 🔊 ונסה שוב!',
      });
    }
  };

  const handleStartListening = () => {
    if (isNamed) return;
    setFeedback(null);
    speech.start(item.nameEn, {
      onResult: (transcript, evaluation) => {
        setSpeechEval(evaluation);
        if (evaluation.passed) {
          succeed(`${isGirl ? 'אלופה' : 'אלוף'}! אמרת "${item.nameEn}" 🎙️`);
        } else {
          setFeedback({
            isCorrect: false,
            text: isGirl
              ? `שמענו "${transcript || '...'}". האזיני להשמעה האיטית 🐢 ונסי שוב!`
              : `שמענו "${transcript || '...'}". האזן להשמעה האיטית 🐢 ונסה שוב!`,
          });
        }
      },
      onError: (kind) => setFeedback({ isCorrect: false, text: getSpeechErrorTextHe(kind, gender) }),
    });
  };

  const modeTabs: { id: NameMode; label: string }[] = [
    { id: 'say', label: '🎙️ Say it · אמירה' },
    { id: 'spell', label: '🧲 Spell it · איות' },
  ];

  return (
    <section aria-label={`מניחים ${item.nameHe} בחדר`} className={`p-4 sm:p-5 rounded-3xl space-y-4 ${theme.cardBgClass}`}>
      <div className="flex items-start justify-between gap-3" dir="rtl">
        <div className="flex items-center gap-3">
          <span className="text-4xl leading-none" aria-hidden="true">
            {item.emoji}
          </span>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base">
              {isGirl ? `כדי להניח את ה${item.nameHe} — אמרי או אייתי את השם באנגלית` : `כדי להניח את ה${item.nameHe} — אמור או איית את השם באנגלית`}
            </h3>
            <p className={`text-xs ${theme.mutedTextClass}`}>פירוש: {item.nameHe}</p>
          </div>
        </div>
        {!isNamed && (
          <button type="button" onClick={onCancel} className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 ${theme.secondaryBtnClass}`}>
            ביטול
          </button>
        )}
      </div>

      {!isNamed && (
        <div className="flex flex-wrap items-center gap-2" dir="rtl">
          {modeTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              aria-pressed={mode === tab.id}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold ${mode === tab.id ? theme.primaryBtnClass : theme.secondaryBtnClass}`}
            >
              {tab.label}
            </button>
          ))}
          {mode === 'spell' && (
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${theme.secondaryBtnClass}`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHint ? `${item.nameEn}` : 'רמז 💡'}</span>
            </button>
          )}
        </div>
      )}

      {mode === 'say' ? (
        <VoiceSpeakDrill
          targetEn={item.nameEn}
          targetHe={item.nameHe}
          speechEval={speechEval}
          isListening={speech.isListening}
          isCompleted={isNamed}
          gender={gender}
          theme={theme}
          onSpeakEnglish={onSpeakEnglish}
          onStartListening={handleStartListening}
          onSkip={() => setMode('spell')}
        />
      ) : (
        <SpellingMagnetDrill
          targetEn={item.nameEn}
          letterTiles={letterTiles}
          translationHe={item.nameHe}
          selectedIndices={tileIndices}
          isCompleted={isNamed}
          onToggleTile={handleToggleTile}
          onReset={() => setTileIndices([])}
          onCheck={handleCheckSpelling}
          onListen={() => onSpeakEnglish(item.nameEn, 0.85)}
          theme={theme}
        />
      )}

      {feedback && (
        <FeedbackBanner
          isCorrect={feedback.isCorrect}
          text={feedback.text}
          showNext={isNamed}
          nextLabel="להניח בחדר ✨"
          onNext={onNamed}
          theme={theme}
        />
      )}
    </section>
  );
};
