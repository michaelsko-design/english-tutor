import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { describeVoices, type VoicePreference } from '../../utils/ttsVoice';
import { getTtsService, type TtsEngine } from '../../services/tts';
import { DEMO_SENTENCE, DEMO_SENTENCE_RATE, DEMO_WORD, DEMO_WORD_RATE } from '../../services/tts/demoPhrases';
import { MAX_TTS_CHARS } from '../../services/tts/ttsText';

interface VoiceLabCardProps {
  voicePreference: VoicePreference;
  theme: ThemeDefinition;
}

interface PlaybackResult {
  engine: TtsEngine;
  latencyMs: number;
  deviceVoice?: string;
}

const ENGINE_LABEL_HE: Record<TtsEngine, string> = {
  clip: 'הקלטה מוכנה',
  live: 'קול אונליין',
  device: 'קול המכשיר',
};

/** Plays a slow word, a sentence and any typed text, and shows which voice read it and how fast. */
export const VoiceLabCard: React.FC<VoiceLabCardProps> = ({ voicePreference, theme }) => {
  const [customText, setCustomText] = useState('');
  const [result, setResult] = useState<PlaybackResult | null>(null);

  const play = (text: string, rate: number) => {
    if (!text.trim()) return;
    const startedAt = performance.now();
    setResult(null);
    void getTtsService().speak(text, {
      rate,
      voice: voicePreference,
      onPlaybackStart: (engine) =>
        setResult({
          engine,
          latencyMs: Math.round(performance.now() - startedAt),
          deviceVoice: engine === 'device' ? describeVoices(voicePreference).picked ?? 'default voice' : undefined,
        }),
    });
  };

  return (
    <div className="space-y-2 p-3 rounded-2xl border border-current/10 bg-black/5 dark:bg-white/5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => play(DEMO_WORD, DEMO_WORD_RATE)}
          className={`p-2.5 rounded-2xl text-xs sm:text-sm font-bold ${theme.secondaryBtnClass}`}
        >
          🐢 מילה לאט: <bdi>{DEMO_WORD}</bdi>
        </button>
        <button
          type="button"
          onClick={() => play(DEMO_SENTENCE, DEMO_SENTENCE_RATE)}
          className={`p-2.5 rounded-2xl text-xs sm:text-sm font-bold ${theme.secondaryBtnClass}`}
        >
          🔊 שמעו משפט לדוגמה
        </button>
      </div>
      {/* Not a <form>: the card sits inside the settings form, and Enter must not save the settings. */}
      <div className="flex gap-2">
        <input
          dir="ltr"
          value={customText}
          maxLength={MAX_TTS_CHARS}
          onChange={(event) => setCustomText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            play(customText, DEMO_SENTENCE_RATE);
          }}
          placeholder="Type a sentence to hear it"
          aria-label="משפט באנגלית להקראה"
          className="flex-1 min-w-0 px-3 py-2 rounded-xl text-sm bg-white/70 dark:bg-black/30 border border-current/10"
        />
        <button
          type="button"
          onClick={() => play(customText, DEMO_SENTENCE_RATE)}
          aria-label="הקראה"
          className={`px-3 py-2 rounded-xl ${theme.secondaryBtnClass}`}
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs opacity-75 min-h-[1rem]" aria-live="polite">
        {result && (
          <>
            {ENGINE_LABEL_HE[result.engine]} · <bdi>{result.latencyMs} ms</bdi>
            {result.deviceVoice && (
              <>
                {' '}
                · <bdi>{result.deviceVoice}</bdi>
              </>
            )}
          </>
        )}
      </p>
    </div>
  );
};
