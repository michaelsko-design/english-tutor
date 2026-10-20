import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import {
  getLessonCards,
  LessonCardKind,
  LessonExample,
  LessonQuickTry,
  MiniLesson as MiniLessonData,
  splitHighlight,
} from '../../data/miniLessons';
import { MultipleChoiceOption } from '../../data/missionExercises';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { CompanionPose } from '../../themes/themeArt';
import { seededShuffle } from '../../utils/shuffle';
import { isolateEnglishRuns } from '../../utils/bidi';
import { Companion } from '../companion/Companion';
import { isSameSpeech } from '../../services/tts';
import { toggleSpeech, useCurrentSpeech } from '../../hooks/useSpeech';
import { SpeakIcon } from '../SpeakIcon';
import { FeedbackBanner, HebrewSpeakButton, MultipleChoiceOptions } from '../drills';
import { speakHebrew } from '../../services/tts';

export const LESSON_COMPANION_SIZE = 96;
/** The read-aloud rate of lesson examples, the same as the drills' (one rendered clip each) */
const LESSON_SPEAK_RATE = 0.95;

interface MiniLessonProps {
  lesson: MiniLessonData;
  /** Seeds the quick-try option order */
  seed: string;
  theme: ThemeDefinition;
  onSpeakEnglish: (text: string, rate?: number) => void;
  /** Opened again from the steps: no skip link (the X and the last button go back) */
  isReview?: boolean;
  /** Read the first example aloud when the examples open (grades 1–3) */
  readsAloud?: boolean;
  /** Read the Hebrew idea and quick-try aloud as they open (grades 1–2, Feature 47) */
  readsHebrewAloud?: boolean;
  /** The last button's label: start the practice, or go back to the question */
  doneLabel: string;
  onDone: () => void;
  onClose: () => void;
  closeLabel: string;
}

const CARD_TITLE_HE: Record<LessonCardKind, string> = {
  idea: '📖 שיעור קצרצר',
  examples: '🎧 דוגמאות',
  try: '✨ נסו בעצמכם',
};

/**
 * Feature 42: the mini-lesson before a mission's questions. The companion teaches the topic on
 * up to three cards (the idea, examples to hear, one quick try). Nothing here is scored.
 */
export const MiniLesson: React.FC<MiniLessonProps> = ({
  lesson,
  seed,
  theme,
  onSpeakEnglish,
  readsAloud = false,
  readsHebrewAloud = false,
  isReview = false,
  doneLabel,
  onDone,
  onClose,
  closeLabel,
}) => {
  const cards = getLessonCards(lesson);
  const [cardIdx, setCardIdx] = useState(0);
  const [quickTryPick, setQuickTryPick] = useState<number | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isFirstCard = useRef(true);
  const card = cards[cardIdx];
  const isLastCard = cardIdx === cards.length - 1;

  const quickTryOptions = useMemo(() => toOptions(lesson.quickTry, seed), [lesson.quickTry, seed]);
  const pickedOption = quickTryPick === null ? null : quickTryOptions[quickTryPick];

  // A new card moves the screen reader (and keyboard) to its heading; the first card keeps the dialog's focus.
  useEffect(() => {
    if (isFirstCard.current) {
      isFirstCard.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [cardIdx]);

  // Early readers hear the first example when the examples open
  useEffect(() => {
    if (readsAloud && card === 'examples') onSpeakEnglish(lesson.examples[0].en, LESSON_SPEAK_RATE);
    if (readsHebrewAloud && card === 'idea') void speakHebrew(lesson.ideaHe);
    if (readsHebrewAloud && card === 'try' && lesson.quickTry) void speakHebrew(lesson.quickTry.promptHe);
    // Only when the card opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, readsAloud, readsHebrewAloud]);

  const pose = getLessonPose(card, pickedOption);

  return (
    <div className="relative px-4 sm:px-8 pt-4 pb-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onClose}
          className={`min-w-11 min-h-11 flex items-center justify-center rounded-xl ${theme.secondaryBtnClass}`}
          aria-label={closeLabel}
        >
          <X className="w-4 h-4" />
        </button>
        <LessonDots count={cards.length} current={cardIdx} theme={theme} />
        {isReview ? (
          <span className="min-w-11" aria-hidden="true" />
        ) : (
          <button
            type="button"
            onClick={onDone}
            className={`min-h-11 px-3 rounded-xl text-xs font-extrabold ${theme.mutedTextClass} hover:underline`}
          >
            דילוג ←
          </button>
        )}
      </div>

      <div className="flex flex-col items-center text-center gap-2">
        <Companion theme={theme} pose={pose} size={LESSON_COMPANION_SIZE} />
        <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${theme.badgeClass}`}>{CARD_TITLE_HE[card]}</span>
      </div>

      <div key={card} className="animate-lesson-card space-y-4">
        {card === 'idea' && <IdeaCard lesson={lesson} theme={theme} headingRef={headingRef} />}
        {card === 'examples' && (
          <ExamplesCard examples={lesson.examples} theme={theme} headingRef={headingRef} onSpeakEnglish={onSpeakEnglish} />
        )}
        {card === 'try' && lesson.quickTry && (
          <QuickTryCard
            quickTry={lesson.quickTry}
            options={quickTryOptions}
            pickedIdx={quickTryPick}
            onPick={(idx) => {
              setQuickTryPick(idx);
              // A Hebrew option (a word's meaning) isn't read with the English voice
              const { textEn } = quickTryOptions[idx];
              if (/[A-Za-z]/.test(textEn)) onSpeakEnglish(textEn, LESSON_SPEAK_RATE);
            }}
            readsAloud={readsHebrewAloud}
            onSpeakEnglish={onSpeakEnglish}
            theme={theme}
            headingRef={headingRef}
          />
        )}
      </div>

      <div className="flex items-center gap-3 pt-1">
        {cardIdx > 0 && (
          <button
            type="button"
            onClick={() => setCardIdx(cardIdx - 1)}
            className={`btn-chunky min-h-12 px-4 rounded-2xl text-sm font-extrabold ${theme.secondaryBtnClass}`}
          >
            הקודם
          </button>
        )}
        <button
          type="button"
          onClick={() => (isLastCard ? onDone() : setCardIdx(cardIdx + 1))}
          className={`btn-chunky flex-1 min-h-12 py-3.5 rounded-2xl text-base sm:text-lg font-extrabold flex items-center justify-center gap-2 ${theme.primaryBtnClass}`}
        >
          <span>{isLastCard ? doneLabel : 'הבא'}</span>
          {!isLastCard && <ArrowRight className="w-4 h-4 rotate-180" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
};

function toOptions(quickTry: LessonQuickTry | undefined, seed: string): MultipleChoiceOption[] {
  if (!quickTry) return [];
  const options: MultipleChoiceOption[] = [
    { textEn: quickTry.correct, isCorrect: true, explanationHe: quickTry.explainHe },
    { textEn: quickTry.wrong, isCorrect: false, explanationHe: quickTry.explainHe },
  ];
  return seededShuffle(options, `${seed}-lesson`);
}

/** Thinks over the idea, stands by the examples, waves at the quick try, then cheers or says oops. */
function getLessonPose(card: LessonCardKind, picked: MultipleChoiceOption | null): CompanionPose {
  if (card === 'idea') return 'think';
  if (card === 'examples') return 'idle';
  if (!picked) return 'wave';
  return picked.isCorrect ? 'cheer' : 'oops';
}

const LessonDots: React.FC<{ count: number; current: number; theme: ThemeDefinition }> = ({ count, current, theme }) => (
  <div className="flex items-center gap-1.5" role="img" aria-label={`כרטיס ${current + 1} מתוך ${count}`}>
    {Array.from({ length: count }, (_, idx) => (
      <span
        key={idx}
        className={`h-2.5 rounded-full transition-all ${
          idx === current ? `w-6 bg-current ${theme.accentTextClass}` : idx < current ? 'w-2.5 bg-emerald-500' : 'w-2.5 bg-current opacity-25'
        }`}
      />
    ))}
  </div>
);

interface CardProps {
  theme: ThemeDefinition;
  headingRef: React.RefObject<HTMLHeadingElement>;
}

const IdeaCard: React.FC<CardProps & { lesson: MiniLessonData }> = ({ lesson, theme, headingRef }) => (
  <>
    <h2 ref={headingRef} tabIndex={-1} className="text-2xl md:text-3xl font-extrabold leading-tight text-center outline-none">
      {isolateEnglishRuns(lesson.titleHe)}
    </h2>
    <div className="flex items-start justify-center gap-2 max-w-xl mx-auto">
      <p className="text-base md:text-lg font-bold leading-relaxed text-center">{isolateEnglishRuns(lesson.ideaHe)}</p>
      <HebrewSpeakButton text={lesson.ideaHe} label="הקשבה להסבר" />
    </div>
    {lesson.pattern && (
      <div className="flex justify-center">
        <span
          dir="ltr"
          lang="en"
          className={`px-5 py-3 rounded-2xl text-lg md:text-xl font-extrabold shadow-md ${theme.cardBgClass} border-2 border-current/15`}
        >
          {lesson.pattern}
        </span>
      </div>
    )}
    {lesson.recapParts && (
      <ul className="space-y-2 max-w-md mx-auto">
        {lesson.recapParts.map((part) => (
          <li key={part.titleHe} className={`p-3 rounded-2xl ${theme.cardBgClass} flex flex-wrap items-center justify-between gap-2`}>
            <span className="font-extrabold text-sm">{isolateEnglishRuns(part.titleHe)}</span>
            {part.pattern && (
              <span dir="ltr" lang="en" className={`text-sm font-extrabold ${theme.accentTextClass}`}>
                {part.pattern}
              </span>
            )}
          </li>
        ))}
      </ul>
    )}
    {lesson.tipHe && (
      <p className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-sm font-bold max-w-xl mx-auto">
        <span className="font-extrabold">⚠️ טעות נפוצה: </span>
        {isolateEnglishRuns(lesson.tipHe)}
      </p>
    )}
  </>
);

const ExamplesCard: React.FC<
  CardProps & { examples: LessonExample[]; onSpeakEnglish: (text: string, rate?: number) => void }
> = ({ examples, theme, headingRef, onSpeakEnglish }) => {
  const currentSpeech = useCurrentSpeech();
  return (
    <>
      <h2 ref={headingRef} tabIndex={-1} className="text-lg font-extrabold text-center outline-none">
        לחצו על משפט כדי לשמוע אותו
      </h2>
      <ul className="space-y-3">
        {examples.map((example) => {
          const { before, match, after } = splitHighlight(example.en, example.highlight);
          const isSpeaking = isSameSpeech(currentSpeech, example.en, LESSON_SPEAK_RATE);
          return (
            <li key={example.en}>
              <button
                type="button"
                onClick={() => toggleSpeech(isSpeaking, onSpeakEnglish, example.en, LESSON_SPEAK_RATE)}
                aria-pressed={isSpeaking}
                className={`btn-chunky w-full text-start p-4 rounded-2xl flex items-start gap-3 ${theme.cardBgClass}`}
              >
                <span className="flex-1 space-y-1">
                  <span dir="ltr" lang="en" className="block text-base md:text-lg font-extrabold leading-snug text-left">
                    {example.emoji && (
                      <span className="me-2" aria-hidden="true">
                        {example.emoji}
                      </span>
                    )}
                    {before}
                    <mark className={`bg-transparent underline decoration-4 underline-offset-4 ${theme.accentTextClass}`}>
                      {match}
                    </mark>
                    {after}
                  </span>
                  <span className={`block text-sm font-bold ${theme.mutedTextClass}`}>{example.he}</span>
                </span>
                <SpeakIcon isSpeaking={isSpeaking} className="w-5 h-5 shrink-0 mt-1 opacity-70" />
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

const QuickTryCard: React.FC<
  CardProps & {
    quickTry: LessonQuickTry;
    options: MultipleChoiceOption[];
    pickedIdx: number | null;
    onPick: (idx: number) => void;
    readsAloud: boolean;
    onSpeakEnglish: (text: string, rate?: number) => void;
  }
> = ({ quickTry, options, pickedIdx, onPick, theme, headingRef, readsAloud, onSpeakEnglish }) => {
  const picked = pickedIdx === null ? null : options[pickedIdx];
  return (
    <>
      <div className="flex items-start justify-center gap-2">
        <h2 ref={headingRef} tabIndex={-1} className="text-lg md:text-xl font-extrabold text-center outline-none">
          {isolateEnglishRuns(quickTry.promptHe)}
        </h2>
        <HebrewSpeakButton text={quickTry.promptHe} label="הקשבה לשאלה" />
      </div>
      {quickTry.questionEn && (
        <p
          dir="ltr"
          lang="en"
          className={`p-4 rounded-2xl text-lg md:text-xl font-extrabold text-center ${theme.cardBgClass}`}
        >
          {quickTry.questionEn}
        </p>
      )}
      <MultipleChoiceOptions
        options={options}
        selectedIdx={pickedIdx}
        onSelect={onPick}
        theme={theme}
        onSpeakEnglish={onSpeakEnglish}
      />
      {picked && (
        <FeedbackBanner
          isCorrect={picked.isCorrect}
          text={isolateEnglishRuns(quickTry.explainHe)}
          showNext={false}
          nextLabel=""
          onNext={() => undefined}
          theme={theme}
          readsAloud={readsAloud}
        />
      )}
    </>
  );
};
