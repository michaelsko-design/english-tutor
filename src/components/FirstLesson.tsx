import React, { useMemo } from 'react';
import type { ThemeDefinition } from '../themes/themeRegistry';
import { getFirstLesson } from '../data/firstLesson';
import { DEFAULT_SPEECH_RATE, getTtsService } from '../services/tts';
import { DEFAULT_VOICE_PREFERENCE } from '../utils/ttsVoice';
import { useStopSpeechOnLeave } from '../hooks/useSpeech';
import { MiniLesson } from './mission/MiniLesson';

interface FirstLessonProps {
  theme: ThemeDefinition;
  /** `isFinished` is false when the learner closed the lesson before the end */
  onDone: (isFinished: boolean) => void;
}

/**
 * The first thing a grade 1–2 learner does after the welcome chest: the letters lesson (A, B, C),
 * with each letter and its picture words read aloud and nothing to answer. Finishing it is the
 * learner's first win (App starts the streak and shows the first-win screen).
 */
export const FirstLesson: React.FC<FirstLessonProps> = ({ theme, onDone }) => {
  useStopSpeechOnLeave();
  const lesson = useMemo(getFirstLesson, []);

  const speakEnglish = (text: string, rate = DEFAULT_SPEECH_RATE) => {
    void getTtsService().speak(text, { rate, voice: DEFAULT_VOICE_PREFERENCE });
  };

  return (
    <div className={`min-h-screen w-full ${theme.pageBgClass} flex items-center justify-center p-3 sm:p-6`}>
      <div
        role="dialog"
        aria-label="השיעור הראשון"
        className={`w-full max-w-2xl rounded-3xl overflow-hidden ${theme.cardBgClass}`}
      >
        <MiniLesson
          lesson={lesson}
          seed="first-lesson"
          theme={theme}
          onSpeakEnglish={speakEnglish}
          readsAloud
          readsHebrewAloud
          doneLabel="סיימנו! 🎉"
          onDone={() => onDone(true)}
          onClose={() => onDone(false)}
          closeLabel="יציאה מהשיעור"
        />
      </div>
    </div>
  );
};
