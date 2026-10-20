import React, { useState } from 'react';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import type { VoicePreference } from '../../utils/ttsVoice';
import { getTtsService } from '../../services/tts';
import { DEMO_SENTENCE, DEMO_SENTENCE_RATE } from '../../services/tts/demoPhrases';
import { MAX_TTS_CHARS } from '../../services/tts/ttsText';
import { useSpeechToggle, useStopSpeechOnLeave } from '../../hooks/useSpeech';
import { SpeakIcon, STOP_SPEECH_LABEL, STOP_SPEECH_TEXT } from '../SpeakIcon';

interface VoiceLabCardProps {
  voicePreference: VoicePreference;
  theme: ThemeDefinition;
}

/** Plays a sample sentence, or any typed text, in the chosen read-aloud voice. */
export const VoiceLabCard: React.FC<VoiceLabCardProps> = ({ voicePreference, theme }) => {
  const [customText, setCustomText] = useState('');

  const speak = (text: string, rate?: number) => {
    if (!text.trim()) return;
    void getTtsService().speak(text, { rate, voice: voicePreference });
  };
  const demoSpeech = useSpeechToggle(speak, DEMO_SENTENCE, DEMO_SENTENCE_RATE);
  const customSpeech = useSpeechToggle(speak, customText, DEMO_SENTENCE_RATE);
  useStopSpeechOnLeave();

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={demoSpeech.toggle}
        className={`w-full p-2.5 rounded-2xl text-xs sm:text-sm font-bold ${theme.secondaryBtnClass}`}
      >
        {demoSpeech.isSpeaking ? `⏹ ${STOP_SPEECH_TEXT}` : '🔊 שמעו דוגמה'}
      </button>
      {/* Not a <form>: the card sits inside the settings form, and Enter must not save the settings. */}
      <div className="flex gap-2">
        <input
          dir="ltr" lang="en"
          value={customText}
          maxLength={MAX_TTS_CHARS}
          onChange={(event) => setCustomText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            customSpeech.toggle();
          }}
          placeholder="Type a sentence to hear it"
          aria-label="משפט באנגלית להקראה"
          className="flex-1 min-w-0 px-3 py-2 rounded-xl text-sm bg-white/70 dark:bg-black/30 border border-current/10"
        />
        <button
          type="button"
          onClick={customSpeech.toggle}
          aria-label={customSpeech.isSpeaking ? STOP_SPEECH_LABEL : 'הקראה'}
          className={`px-3 py-2 rounded-xl ${theme.secondaryBtnClass}`}
        >
          <SpeakIcon isSpeaking={customSpeech.isSpeaking} />
        </button>
      </div>
    </div>
  );
};
