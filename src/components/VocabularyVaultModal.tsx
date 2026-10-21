import React, { useEffect, useRef, useState } from 'react';
import { ModalPortal } from './ModalPortal';
import { useDialog } from '../hooks/useDialog';
import { celebrate } from '../utils/celebrate';
import { CurriculumUnit, VocabularyItem } from '../data/curriculum';
import { LearnerGender } from '../types/learner';
import { ThemeDefinition } from '../themes/themeRegistry';
import { evaluateSpokenSentence } from '../utils/speechSimilarity';
import {
  X,
  BookOpen,
  Mic,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { isolateLtr, formatVibeGain } from '../utils/bidi';
import { isSameSpeech } from '../services/tts';
import { toggleSpeech, useCurrentSpeech, useStopSpeechOnLeave } from '../hooks/useSpeech';
import { SpeakIcon, STOP_SPEECH_LABEL, STOP_SPEECH_TEXT } from './SpeakIcon';
import { Button } from './ui/Button';
import { VibeAmount } from './ui/VibeAmount';

/** The reward inside a Hebrew sentence, isolated so "+10 XP" doesn't flip */
const VAULT_REWARD_LABEL = `${formatVibeGain(10)} · ${isolateLtr('+2 💎')}`;

interface VocabularyVaultModalProps {
  units: CurriculumUnit[];
  gender: LearnerGender;
  learnerName: string;
  theme: ThemeDefinition;
  gradeLabel?: string;
  ministryBand?: string;
  onSpeakEnglish: (text: string, rate?: number) => void;
  /** Rewards a word once per word per day; false when it earned nothing */
  onEarnPracticeReward: (wordEn: string, xp: number, diamonds: number) => boolean;
  onClose: () => void;
}

export const VocabularyVaultModal: React.FC<VocabularyVaultModalProps> = ({
  units,
  gender,
  learnerName,
  theme,
  gradeLabel,
  ministryBand,
  onSpeakEnglish,
  onEarnPracticeReward,
  onClose,
}) => {
  const isGirl = gender === 'girl';
  const [selectedUnitNum, setSelectedUnitNum] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [practicingWord, setPracticingWord] = useState<string | null>(null);
  const [masteredWordsSession, setMasteredWordsSession] = useState<Record<string, boolean>>({});
  const [feedbackMsg, setFeedbackMsg] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const allVocabWithUnit: Array<VocabularyItem & { unitNumber: number; unitTitleHe: string }> =
    units.flatMap((u) =>
      u.missions.flatMap((m) =>
        m.vocabulary.map((v) => ({
          ...v,
          unitNumber: u.unitNumber,
          unitTitleHe: u.titleHe,
        }))
      )
    );

  const filteredVocab = allVocabWithUnit.filter((item) => {
    if (selectedUnitNum !== 'all' && item.unitNumber !== selectedUnitNum) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.wordEn.toLowerCase().includes(q) ||
      item.translationHe.includes(q) ||
      item.exampleEn.toLowerCase().includes(q)
    );
  });

  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(dialogRef, { onClose });
  useStopSpeechOnLeave();
  const currentSpeech = useCurrentSpeech();

  // Closing the Vault mid-word stops listening, so no result arrives after it closed
  const recognitionRef = useRef<{ abort: () => void } | null>(null);
  useEffect(() => () => recognitionRef.current?.abort(), []);

  const handlePracticeWord = (vocab: VocabularyItem) => {
    setPracticingWord(vocab.wordEn);
    setFeedbackMsg(null);

    const SpeechRecognitionApi =
      (window as unknown as {
        SpeechRecognition?: unknown;
        webkitSpeechRecognition?: unknown;
      }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition;

    const completeWordMastery = (transcript: string) => {
      setPracticingWord(null);
      const isRewarded = onEarnPracticeReward(vocab.wordEn, 10, 2);
      setMasteredWordsSession((prev) => ({ ...prev, [vocab.wordEn]: true }));
      // The reward comes once per word a day (and for up to 20 words a day)
      const rewardNote = isRewarded ? `(${VAULT_REWARD_LABEL})` : '(הפרס על המילה הזו כבר נאסף היום)';
      setFeedbackMsg({
        isCorrect: true,
        text: `מעולה ${learnerName}! ביטאת את המילה "${vocab.wordEn}" (זוהה: "${transcript}") בצורה מושלמת! ${rewardNote}`,
      });
      celebrate('small');
    };

    if (!SpeechRecognitionApi) {
      setPracticingWord(null);
      setFeedbackMsg({
        isCorrect: false,
        text: isGirl
          ? 'הדפדפן שלך אינו תומך בזיהוי דיבור קולי. אנא השתמשי בדפדפן Chrome או Edge כדי לתרגל הגייה במיקרופון.'
          : 'הדפדפן שלך אינו תומך בזיהוי דיבור קולי. אנא השתמש בדפדפן Chrome או Edge כדי לתרגל הגייה במיקרופון.',
      });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognitionApi as any)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript: string = event.results?.[0]?.[0]?.transcript || '';
      const evalResult = evaluateSpokenSentence(vocab.wordEn, transcript);
      if (evalResult.passed) {
        completeWordMastery(transcript);
      } else {
        setPracticingWord(null);
        setFeedbackMsg({
          isCorrect: false,
          text: isGirl
            ? `שמענו "${transcript || '...'}" במקום "${vocab.wordEn}" — האזיני שוב למילה ונסי פעם נוספת!`
            : `שמענו "${transcript || '...'}" במקום "${vocab.wordEn}" — האזן שוב למילה ונסה פעם נוספת!`,
        });
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      setPracticingWord(null);
      const errCode = event?.error || '';
      if (errCode === 'not-allowed' || errCode === 'service-not-allowed') {
        setFeedbackMsg({
          isCorrect: false,
          text: isGirl
            ? 'הגישה למיקרופון חסומה בדפדפן. אשרי גישה למיקרופון ונסי שוב!'
            : 'הגישה למיקרופון חסומה בדפדפן. אשר גישה למיקרופון ונסה שוב!',
        });
      } else {
        setFeedbackMsg({
          isCorrect: false,
          text: isGirl
            ? `לא הצלחנו לשמוע את המילה "${vocab.wordEn}". לחצי שוב על המיקרופון ואמרי אותה בקול ברור!`
            : `לא הצלחנו לשמוע את המילה "${vocab.wordEn}". לחץ שוב על המיקרופון ואמור אותה בקול ברור!`,
        });
      }
    };

    recognitionRef.current?.abort();
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="כספת המילים"
        className={`outline-none w-full max-w-4xl max-h-[90dvh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-current/15 ${theme.pageBgClass}`}
      >
        {/* Modal Header */}
        <div
          className={`px-4 sm:px-6 py-3 sm:py-4 ${theme.hudBgClass} flex items-center justify-between gap-3 shrink-0`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 ${theme.primaryBtnClass}`}
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg md:text-xl font-extrabold truncate">
                📚 מאגר מילים והגייה · {gradeLabel || ''} {ministryBand && <bdi>({ministryBand})</bdi>} ({allVocabWithUnit.length})
              </h2>
              <p className={`text-xs hidden sm:block ${theme.mutedTextClass}`}>
                {isGirl
                  ? 'האזיני לכל מילה באנגלית או הקליטי את עצמך קוראת אותה בקול כדי לצבור Vibe ויהלומים!'
                  : 'האזן לכל מילה באנגלית או הקלט את עצמך קורא אותה בקול כדי לצבור Vibe ויהלומים!'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
            aria-label="סגירה"
              title="סגירה"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-4 sm:px-6 pt-3 pb-2 space-y-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Unit Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedUnitNum('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  selectedUnitNum === 'all'
                    ? theme.primaryBtnClass
                    : theme.secondaryBtnClass
                }`}
              >
                כל הפרקים ({allVocabWithUnit.length})
              </button>
              {units.map((u) => (
                <button
                  key={u.unitNumber}
                  type="button"
                  onClick={() => setSelectedUnitNum(u.unitNumber)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                    selectedUnitNum === u.unitNumber
                      ? theme.primaryBtnClass
                      : theme.secondaryBtnClass
                  }`}
                >
                  {u.badgeEmoji} פרק {u.unitNumber}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש מילה באנגלית או בעברית..."
                dir="auto"
                className={`w-full pr-9 pl-3 py-2 rounded-xl text-xs font-bold outline-none ${theme.inputBgClass}`}
              />
            </div>
          </div>

          {feedbackMsg && (
            <div
              className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center gap-2 ${
                feedbackMsg.isCorrect
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-300'
              }`}
            >
              <Sparkles
                className={`w-4 h-4 shrink-0 ${
                  feedbackMsg.isCorrect ? 'text-emerald-500' : 'text-rose-500'
                }`}
              />
              <span>{feedbackMsg.text}</span>
            </div>
          )}
        </div>

        {/* Scrollable Vocabulary Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredVocab.map((item) => {
            const isMastered = masteredWordsSession[item.wordEn];
            const isRecordingThis = practicingWord === item.wordEn;
            const listenText = `${item.wordEn}. ${item.exampleEn}`;
            const isListenSpeaking = isSameSpeech(currentSpeech, listenText, 0.95);
            const isSlowSpeaking = isSameSpeech(currentSpeech, item.wordEn, 0.65);

            return (
              <div
                key={`${item.unitNumber}-${item.wordEn}`}
                className={`rounded-2xl p-4 ${theme.cardBgClass} flex flex-col justify-between gap-3 transition-all ${
                  isMastered ? 'ring-2 ring-emerald-500/60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold" dir="ltr" lang="en">
                        {item.emoji ? `${item.emoji} ` : ''}
                        {item.wordEn}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-semibold">
                        {item.partOfSpeech}
                      </span>
                      {isMastered && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-purple-600 dark:text-purple-300 mt-0.5">
                      {item.translationHe}
                    </p>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${theme.badgeClass}`}>
                    פרק {item.unitNumber}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/5 dark:bg-black/20 text-xs space-y-1">
                  <p className="font-bold" dir="ltr" lang="en">
                    &ldquo;{item.exampleEn}&rdquo;
                  </p>
                  <p className="opacity-80">
                    {item.exampleHe}
                  </p>
                </div>

                {/* Audio TTS & Voice Recognition Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Button theme={theme} variant="secondary" size="sm" onClick={() => toggleSpeech(isListenSpeaking, onSpeakEnglish, listenText, 0.95)}>
                      <SpeakIcon isSpeaking={isListenSpeaking} className="w-3.5 h-3.5" />
                      <span>{isListenSpeaking ? STOP_SPEECH_TEXT : 'Listen'}</span>
                    </Button>
                    <Button theme={theme} variant="secondary" size="sm" onClick={() => toggleSpeech(isSlowSpeaking, onSpeakEnglish, item.wordEn, 0.65)} title={isSlowSpeaking ? STOP_SPEECH_LABEL : 'Listen Slowly'} aria-label={isSlowSpeaking ? STOP_SPEECH_LABEL : undefined} dir="ltr" lang="en">
                      {isSlowSpeaking ? '⏹' : '🐢 Slow'}
                    </Button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePracticeWord(item)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 ${
                      isRecordingThis
                        ? 'bg-rose-500 text-white animate-pulse'
                        : theme.primaryBtnClass
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>
                      {isRecordingThis
                        ? isGirl
                          ? 'אמרי את המילה...'
                          : 'אמור את המילה...'
                        : isMastered
                        ? 'תורגל בהצלחה ✓'
                        : (
                          <>
                            {isGirl ? 'תרגלי הגייה' : 'תרגל הגייה'} (<VibeAmount amount={10} hasPlus />)
                          </>
                        )}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};
