import { useCallback, useEffect, useRef, useState } from 'react';
import { LearnerGender } from '../types/learner';
import { evaluateSpokenSentence, SpeechEvaluationResult } from '../utils/speechSimilarity';

export type SpeechErrorKind = 'unsupported' | 'not-allowed' | 'no-speech';

export interface SpeechHandlers {
  onResult: (transcript: string, evaluation: SpeechEvaluationResult) => void;
  onError: (kind: SpeechErrorKind) => void;
}

/** Hebrew message for a microphone problem, addressed by the learner's gender. */
export function getSpeechErrorTextHe(kind: SpeechErrorKind, gender: LearnerGender): string {
  const isGirl = gender === 'girl';
  if (kind === 'unsupported') {
    return isGirl
      ? 'הדפדפן שלך אינו תומך בזיהוי דיבור קולי. אנא השתמשי בדפדפן Chrome או Edge, או לחצי על כפתור הדילוג למטה.'
      : 'הדפדפן שלך אינו תומך בזיהוי דיבור קולי. אנא השתמש בדפדפן Chrome או Edge, או לחץ על כפתור הדילוג למטה.';
  }
  if (kind === 'not-allowed') {
    return isGirl
      ? 'הגישה למיקרופון חסומה בדפדפן. אשרי גישה למיקרופון בשורת הכתובת ונסי שוב!'
      : 'הגישה למיקרופון חסומה בדפדפן. אשר גישה למיקרופון בשורת הכתובת ונסה שוב!';
  }
  return isGirl
    ? 'לא הצלחנו לשמוע אותך בבירור במיקרופון. לחצי שוב על הכפתור וקראי את המשפט בקול רם וברור!'
    : 'לא הצלחנו לשמוע אותך בבירור במיקרופון. לחץ שוב על הכפתור וקרא את המשפט בקול רם וברור!';
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type RecognitionInstance = any;

function getRecognitionApi(): (new () => RecognitionInstance) | undefined {
  const w = window as unknown as {
    SpeechRecognition?: new () => RecognitionInstance;
    webkitSpeechRecognition?: new () => RecognitionInstance;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

/**
 * Web Speech recognition for the voice drills: listens once in en-US and scores the transcript
 * against the target sentence with `evaluateSpokenSentence`.
 */
export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<RecognitionInstance | null>(null);

  /** Stops listening without calling the handlers (e.g. when the step changes). */
  const cancel = useCallback(() => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    setIsListening(false);
    if (!recognition) return;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    try {
      recognition.abort();
    } catch {
      // already stopped
    }
  }, []);

  useEffect(() => cancel, [cancel]);

  const start = (target: string, handlers: SpeechHandlers) => {
    const RecognitionApi = getRecognitionApi();
    if (!RecognitionApi) {
      setIsListening(false);
      handlers.onError('unsupported');
      return;
    }

    cancel();
    const recognition = new RecognitionApi();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      setIsListening(false);
      const transcript: string = event.results?.[0]?.[0]?.transcript || '';
      handlers.onResult(transcript, evaluateSpokenSentence(target, transcript));
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      const errCode = event?.error || '';
      handlers.onError(errCode === 'not-allowed' || errCode === 'service-not-allowed' ? 'not-allowed' : 'no-speech');
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) recognitionRef.current = null;
      setIsListening(false);
    };

    setIsListening(true);
    recognition.start();
  };

  return { isListening, start, cancel };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
