import { useCallback, useEffect, useRef, useState } from 'react';
import { holdSpeechForMic } from '../services/tts';
import { LearnerGender } from '../types/learner';
import { evaluateSpokenSentence, SpeechEvaluationResult } from '../utils/speechSimilarity';
import { getSpeechRecognitionApi, type SpeechRecognitionLike } from '../utils/speechRecognitionApi';

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

/**
 * Web Speech recognition for the voice drills: listens once in en-US and scores the transcript
 * against the target sentence with `evaluateSpokenSentence`.
 *
 * While the mic is open nothing is read aloud (the mic would hear the app say the answer):
 * opening it stops the reading in progress and holds read-aloud until it closes.
 * `isStarting` covers the moment between the tap and the mic really recording, so the learner
 * isn't told to speak before anything is heard; `isListening` is true only once it records.
 */
export function useSpeechRecognition() {
  const [isStarting, setIsStarting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const releaseSpeechRef = useRef<(() => void) | null>(null);

  const releaseSpeech = useCallback(() => {
    releaseSpeechRef.current?.();
    releaseSpeechRef.current = null;
  }, []);

  const closeMic = useCallback(() => {
    setIsStarting(false);
    setIsListening(false);
    releaseSpeech();
  }, [releaseSpeech]);

  /** Stops listening without calling the handlers (e.g. when the step changes). */
  const cancel = useCallback(() => {
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    closeMic();
    if (!recognition) return;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
    recognition.onstart = null;
    recognition.onaudiostart = null;
    try {
      recognition.abort();
    } catch {
      // already stopped
    }
  }, [closeMic]);

  useEffect(() => cancel, [cancel]);

  const start = (target: string, handlers: SpeechHandlers) => {
    const RecognitionApi = getSpeechRecognitionApi();
    if (!RecognitionApi) {
      closeMic();
      handlers.onError('unsupported');
      return;
    }

    cancel();
    const recognition = new RecognitionApi();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    /** A result or an error was reported; an ending without either means nothing was heard. */
    let isSettled = false;

    const markRecording = () => {
      setIsStarting(false);
      setIsListening(true);
    };
    recognition.onstart = markRecording;
    recognition.onaudiostart = markRecording;

    recognition.onresult = (event) => {
      isSettled = true;
      closeMic();
      const transcript: string = event.results?.[0]?.[0]?.transcript || '';
      handlers.onResult(transcript, evaluateSpokenSentence(target, transcript));
    };

    recognition.onerror = (event) => {
      isSettled = true;
      closeMic();
      const errCode = event?.error || '';
      handlers.onError(errCode === 'not-allowed' || errCode === 'service-not-allowed' ? 'not-allowed' : 'no-speech');
    };

    recognition.onend = () => {
      if (recognitionRef.current === recognition) recognitionRef.current = null;
      closeMic();
      // Some browsers end without a result or an error when they heard nothing: say so, so the
      // learner knows to try again instead of facing a mic that silently went off.
      if (!isSettled) {
        isSettled = true;
        handlers.onError('no-speech');
      }
    };

    releaseSpeechRef.current = holdSpeechForMic();
    setIsStarting(true);
    setIsListening(false);
    recognition.start();
  };

  return { isStarting, isListening, start, cancel };
}
