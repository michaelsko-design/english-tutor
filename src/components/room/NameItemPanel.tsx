import React, { useEffect, useMemo, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { NameableItem } from '../../data/room';
import { NamingMethod } from '../../data/wardrobe';
import { getSpellingLetters } from '../../data/customWordLists';
import { MultipleChoiceOption } from '../../data/missionExercises';
import { LearnerGender } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { SpeechEvaluationResult } from '../../utils/speechSimilarity';
import { seededShuffle, seededShuffleNotIdentity } from '../../utils/shuffle';
import { getSpellingHintHe } from '../../utils/hints';
import { spellSlots } from '../../utils/letterSlots';
import { getSpeechErrorTextHe, useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { FeedbackBanner, MultipleChoiceOptions, SpellingMagnetDrill, VoiceSpeakDrill } from '../drills';
import { ItemIcon } from './ItemIcon';
import { Button } from '../ui/Button';

interface NameItemPanelProps {
  item: NameableItem;
  gender: LearnerGender;
  theme: ThemeDefinition;
  /** Ways the learner may name the item, in tab order; 'choose' needs `distractorNames` */
  modes?: NamingMethod[];
  /** Other English names for the 'choose' mode */
  distractorNames?: string[];
  /** What naming unlocks, e.g. "כדי להניח בחדר: ספה" */
  goalHe: string;
  nextLabel: string;
  onSpeakEnglish: (text: string, rate?: number) => void;
  /** The learner named the item; `method` says how. */
  onNamed: (method: NamingMethod) => void;
  onCancel: () => void;
}

interface Feedback {
  isCorrect: boolean;
  text: string;
}

const MODE_TABS: Record<NamingMethod, string> = {
  say: '🎙️ Say it · אמירה',
  spell: '🧲 Spell it · איות',
  choose: '👆 Pick it · בחירה',
};

const MODE_VERBS: Record<NamingMethod, [girl: string, boy: string]> = {
  say: ['אמרי', 'אמור'],
  spell: ['אייתי', 'איית'],
  choose: ['בחרי', 'בחר'],
};

function hasSpeechRecognition(): boolean {
  const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

/** "אמרי, אייתי או בחרי" — the allowed ways to name the item, addressed by gender. */
function joinVerbs(modes: NamingMethod[], isGirl: boolean): string {
  const verbs = modes.map((mode) => MODE_VERBS[mode][isGirl ? 0 : 1]);
  return verbs.length > 1 ? `${verbs.slice(0, -1).join(', ')} או ${verbs[verbs.length - 1]}` : verbs[0];
}

/** The gate before using an item: say its English name, spell it with letter magnets, or pick it. */
export const NameItemPanel: React.FC<NameItemPanelProps> = ({
  item,
  gender,
  theme,
  modes = ['say', 'spell'],
  distractorNames = [],
  goalHe,
  nextLabel,
  onSpeakEnglish,
  onNamed,
  onCancel,
}) => {
  const isGirl = gender === 'girl';
  const [mode, setMode] = useState<NamingMethod>(
    () => modes.find((m) => m !== 'say' || hasSpeechRecognition()) ?? modes[0]
  );
  const [salt] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const letterTiles = useMemo(
    () => seededShuffleNotIdentity(getSpellingLetters(item.nameEn), `${item.id}-${salt}`),
    [item, salt]
  );
  const choiceOptions = useMemo<MultipleChoiceOption[]>(
    () =>
      seededShuffle(
        [
          { textEn: item.nameEn, isCorrect: true, explanationHe: `נכון! ${item.nameHe} = ${item.nameEn}` },
          ...distractorNames.map((name) => ({
            textEn: name,
            isCorrect: false,
            explanationHe: isGirl ? 'לא זה — הקשיבי שוב ונסי שוב 🔊' : 'לא זה — הקשב שוב ונסה שוב 🔊',
          })),
        ],
        `${item.id}-choose-${salt}`
      ),
    [item, distractorNames, isGirl, salt]
  );
  const [letterSlots, setLetterSlots] = useState<(number | null)[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [speechEval, setSpeechEval] = useState<SpeechEvaluationResult | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isNamed, setIsNamed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const speech = useSpeechRecognition();
  const cancelListening = speech.cancel;

  useEffect(() => {
    setLetterSlots([]);
    setSelectedIdx(null);
    setSpeechEval(null);
    setFeedback(null);
    cancelListening();
    if (mode !== 'say') onSpeakEnglish(item.nameEn, 0.85);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, cancelListening]);

  const succeed = (text: string) => {
    cancelListening();
    onSpeakEnglish(item.nameEn, 0.95);
    setIsNamed(true);
    setFeedback({ isCorrect: true, text });
  };

  const handleLetterSlotsChange = (nextSlots: (number | null)[]) => {
    if (isNamed) return;
    setLetterSlots(nextSlots);
  };

  const handleCheckSpelling = () => {
    const built = spellSlots(letterSlots, letterTiles);
    if (built.toLowerCase() === getSpellingLetters(item.nameEn).join('').toLowerCase()) {
      succeed(`מעולה! ${item.nameEn} מאוית נכון 🧲`);
    } else {
      setFeedback({
        isCorrect: false,
        text: isGirl ? 'עדיין לא מדויק — האזיני שוב 🔊 ונסי שוב!' : 'עדיין לא מדויק — האזן שוב 🔊 ונסה שוב!',
      });
    }
  };

  const handleChoose = (idx: number) => {
    if (isNamed) return;
    setSelectedIdx(idx);
    const chosen = choiceOptions[idx];
    if (chosen.isCorrect) succeed(chosen.explanationHe);
    else setFeedback({ isCorrect: false, text: chosen.explanationHe });
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

  const fallbackFromSay = modes.find((m) => m !== 'say');

  return (
    <section aria-label={goalHe} className={`p-4 sm:p-5 rounded-3xl space-y-4 ${theme.cardBgClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ItemIcon item={item} size="2.25rem" />
          <div>
            <h3 className="font-extrabold text-sm sm:text-base">
              {goalHe} — {joinVerbs(modes, isGirl)} את השם באנגלית
            </h3>
            <p className={`text-xs ${theme.mutedTextClass}`}>פירוש: {item.nameHe}</p>
          </div>
        </div>
        {!isNamed && (
          <Button theme={theme} variant="secondary" size="sm" className="shrink-0" onClick={onCancel}>
            ביטול
          </Button>
        )}
      </div>

      {!isNamed && (modes.length > 1 || mode === 'spell') && (
        <div className="flex flex-wrap items-center gap-2">
          {modes.length > 1 &&
            modes.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                aria-pressed={mode === tab}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold ${mode === tab ? theme.primaryBtnClass : theme.secondaryBtnClass}`}
              >
                {MODE_TABS[tab]}
              </button>
            ))}
          {mode === 'spell' && (
            <Button theme={theme} variant="secondary" size="sm" onClick={() => setShowHint(!showHint)}>
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHint ? getSpellingHintHe(getSpellingLetters(item.nameEn)) : 'רמז 💡'}</span>
            </Button>
          )}
        </div>
      )}

      {mode === 'say' && (
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
          onSkip={() => fallbackFromSay && setMode(fallbackFromSay)}
        />
      )}

      {mode === 'spell' && (
        <SpellingMagnetDrill
          targetEn={item.nameEn}
          letterTiles={letterTiles}
          translationHe={item.nameHe}
          slots={letterSlots}
          isCompleted={isNamed}
          onChangeSlots={handleLetterSlotsChange}
          onReset={() => setLetterSlots([])}
          onCheck={handleCheckSpelling}
          listenEn={item.nameEn}
          listenRate={0.85}
          onSpeakEnglish={onSpeakEnglish}
          theme={theme}
        />
      )}

      {mode === 'choose' && (
        <MultipleChoiceOptions
          options={choiceOptions}
          selectedIdx={selectedIdx}
          onSelect={handleChoose}
          theme={theme}
          onSpeakEnglish={onSpeakEnglish}
        />
      )}

      {feedback && (
        <FeedbackBanner
          isCorrect={feedback.isCorrect}
          text={feedback.text}
          showNext={isNamed}
          nextLabel={nextLabel}
          onNext={() => onNamed(mode)}
          theme={theme}
        />
      )}
    </section>
  );
};
