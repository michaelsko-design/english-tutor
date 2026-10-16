import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CurriculumUnit, VocabularyItem } from '../data/curriculum';
import { LearnerGender } from '../types/learner';
import { ThemeDefinition } from '../themes/themeRegistry';
import { evaluateSpokenSentence } from '../utils/speechSimilarity';
import {
  X,
  BookOpen,
  Volume2,
  Mic,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface VocabularyVaultModalProps {
  units: CurriculumUnit[];
  gender: LearnerGender;
  learnerName: string;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onEarnPracticeReward: (xp: number, diamonds: number) => void;
  onClose: () => void;
}

export const VocabularyVaultModal: React.FC<VocabularyVaultModalProps> = ({
  units,
  gender,
  learnerName,
  theme,
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
      if (!masteredWordsSession[vocab.wordEn]) {
        setMasteredWordsSession((prev) => ({ ...prev, [vocab.wordEn]: true }));
        onEarnPracticeReward(10, 2);
      }
      setFeedbackMsg({
        isCorrect: true,
        text: isGirl
          ? `מעולה ${learnerName}! ביטאת את המילה "${vocab.wordEn}" (זוהה: "${transcript}") בצורה מושלמת! (+10 XP · +2 💎)`
          : `מעולה ${learnerName}! ביטאת את המילה "${vocab.wordEn}" (זוהה: "${transcript}") בצורה מושלמת! (+10 XP · +2 💎)`,
      });
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.7 } });
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

    recognition.start();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div
        className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-current/15 ${theme.pageBgClass}`}
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
            <div className="min-w-0" dir="rtl">
              <h2 className="text-sm sm:text-lg md:text-xl font-extrabold truncate">
                📚 מאגר מילים והגייה ({allVocabWithUnit.length})
              </h2>
              <p className={`text-xs hidden sm:block ${theme.mutedTextClass}`}>
                {isGirl
                  ? 'האזיני לכל מילה באנגלית או הקליטי את עצמך קוראת אותה בקול כדי לצבור XP ויהלומים!'
                  : 'האזן לכל מילה באנגלית או הקלט את עצמך קורא אותה בקול כדי לצבור XP ויהלומים!'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-2 sm:p-2.5 rounded-xl shrink-0 ${theme.secondaryBtnClass}`}
            title="Close Vocabulary Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-4 sm:px-6 pt-3 pb-2 space-y-2.5 shrink-0" dir="rtl">
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
                      <span className="text-lg font-extrabold" dir="ltr">
                        {item.wordEn}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-semibold">
                        {item.partOfSpeech}
                      </span>
                      {isMastered && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-purple-600 dark:text-purple-300 mt-0.5" dir="rtl">
                      {item.translationHe}
                    </p>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${theme.badgeClass}`} dir="rtl">
                    פרק {item.unitNumber}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/5 dark:bg-black/20 text-xs space-y-1">
                  <p className="font-bold" dir="ltr">
                    &ldquo;{item.exampleEn}&rdquo;
                  </p>
                  <p className="opacity-80" dir="rtl">
                    {item.exampleHe}
                  </p>
                </div>

                {/* Audio TTS & Voice Recognition Buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onSpeakEnglish(`${item.wordEn}. ${item.exampleEn}`, 0.95)
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1 ${theme.secondaryBtnClass}`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSpeakEnglish(item.wordEn, 0.65)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold ${theme.secondaryBtnClass}`}
                      title="Listen Slowly"
                    >
                      🐢 Slow
                    </button>
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
                    <span dir="rtl">
                      {isRecordingThis
                        ? 'אמרי את המילה...'
                        : isMastered
                        ? 'תורגל בהצלחה ✓'
                        : 'תרגלי הגייה (+10 XP)'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
