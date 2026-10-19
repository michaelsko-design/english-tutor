import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import type { VoicePreference } from '../../utils/ttsVoice';
import { getTtsService } from '../../services/tts';
import { DEMO_SENTENCE, DEMO_SENTENCE_RATE } from '../../services/tts/demoPhrases';
import { MAX_TTS_CHARS } from '../../services/tts/ttsText';

interface VoiceLabCardProps {
  voicePreference: VoicePreference;
  theme: ThemeDefinition;
}

/** Plays a sample sentence, or any typed text, in the chosen read-aloud voice. */
export const VoiceLabCard: React.FC<VoiceLabCardProps> = ({ voicePreference, theme }) => {
  const [customText, setCustomText] = useState('');

  const play = (text: string) => {
    if (!text.trim()) return;
    void getTtsService().speak(text, { rate: DEMO_SENTENCE_RATE, voice: voicePreference });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => play(DEMO_SENTENCE)}
        className={`w-full p-2.5 rounded-2xl text-xs sm:text-sm font-bold ${theme.secondaryBtnClass}`}
      >
        🔊 שמעו דוגמה
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
            play(customText);
          }}
          placeholder="Type a sentence to hear it"
          aria-label="משפט באנגלית להקראה"
          className="flex-1 min-w-0 px-3 py-2 rounded-xl text-sm bg-white/70 dark:bg-black/30 border border-current/10"
        />
        <button
          type="button"
          onClick={() => play(customText)}
          aria-label="הקראה"
          className={`px-3 py-2 rounded-xl ${theme.secondaryBtnClass}`}
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
