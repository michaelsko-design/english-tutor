import React, { useEffect, useMemo, useState } from 'react';
import { celebrate } from '../../utils/celebrate';
import { RoomActivityReward } from '../../data/roomActivities';
import { applyPhoneSessionResult, buildPhoneSession } from '../../data/voiceMessages';
import { LearnerProfile } from '../../types/learner';
import { ThemeDefinition } from '../../themes/themeRegistry';
import { SpeechEvaluationResult } from '../../utils/speechSimilarity';
import { getSpeechErrorTextHe, useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { FeedbackBanner, VoiceSpeakDrill } from '../drills';
import { ActivityRewardSummary } from './ActivityRewardSummary';
import { RoomPanelFrame } from './RoomPanelFrame';
import { useSpeechToggle } from '../../hooks/useSpeech';
import { SpeakIcon, STOP_SPEECH_LABEL } from '../SpeakIcon';

interface PhonePanelProps {
  profile: LearnerProfile;
  theme: ThemeDefinition;
  onUpdateProfile: (updated: LearnerProfile) => void;
  onSpeakEnglish: (text: string, rate?: number) => void;
  onClose: () => void;
}

type ReplyOutcome = 'sent' | 'skipped';

interface Feedback {
  isCorrect: boolean;
  text: string;
}

/** Feature 12, phase 3: a friend's message arrives and the learner records an English voice reply. */
export const PhonePanel: React.FC<PhonePanelProps> = ({ profile, theme, onUpdateProfile, onSpeakEnglish, onClose }) => {
  const isGirl = profile.gender === 'girl';
  const [salt, setSalt] = useState(() => Math.floor(Math.random() * 1_000_000_000));
  const messages = useMemo(() => buildPhoneSession(profile.gradeId, salt), [profile.gradeId, salt]);
  const [idx, setIdx] = useState(0);
  const [outcomes, setOutcomes] = useState<ReplyOutcome[]>([]);
  const [speechEval, setSpeechEval] = useState<SpeechEvaluationResult | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [reward, setReward] = useState<RoomActivityReward | null | undefined>(undefined);
  const speech = useSpeechRecognition();
  const cancelListening = speech.cancel;

  const message = messages[idx];
  const messageSpeech = useSpeechToggle(onSpeakEnglish, message?.incomingEn ?? '', 0.9);
  const isResolved = outcomes.length > idx;
  const isLast = idx === messages.length - 1;
  const sentCount = outcomes.filter((o) => o === 'sent').length;

  useEffect(() => {
    setSpeechEval(null);
    setFeedback(null);
    cancelListening();
    if (message) onSpeakEnglish(message.incomingEn, 0.9);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, salt, cancelListening]);

  const resolve = (outcome: ReplyOutcome, text: string) => {
    cancelListening();
    setOutcomes((prev) => [...prev.slice(0, idx), outcome]);
    setFeedback({ isCorrect: true, text });
  };

  const handleStartListening = () => {
    if (isResolved) return;
    setFeedback(null);
    speech.start(message.replyEn, {
      onResult: (transcript, evaluation) => {
        setSpeechEval(evaluation);
        if (evaluation.passed) {
          resolve('sent', `ההודעה נשלחה ל־${message.fromName}! דיוק של ${evaluation.scorePercent}% 📨`);
        } else {
          setFeedback({
            isCorrect: false,
            text: isGirl
              ? `שמענו "${transcript || '...'}". האזיני להשמעה האיטית 🐢 ונסי שוב!`
              : `שמענו "${transcript || '...'}". האזן להשמעה האיטית 🐢 ונסה שוב!`,
          });
        }
      },
      onError: (kind) => setFeedback({ isCorrect: false, text: getSpeechErrorTextHe(kind, profile.gender) }),
    });
  };

  const handleNext = () => {
    if (!isLast) {
      setIdx(idx + 1);
      return;
    }
    const result = applyPhoneSessionResult(profile, sentCount, new Date());
    if (result) {
      onUpdateProfile(result.profile);
      if (result.isFullReward) celebrate('medium');
    }
    setReward(result);
  };

  const handleRestart = () => {
    setSalt(Math.floor(Math.random() * 1_000_000_000));
    setIdx(0);
    setOutcomes([]);
    setReward(undefined);
  };

  return (
    <RoomPanelFrame titleHe="📱 הודעות קוליות · Voice Messages" theme={theme} onClose={onClose}>
      {reward !== undefined ? (
        <ActivityRewardSummary
          reward={reward}
          theme={theme}
          gender={profile.gender}
          headlineHe={`שלחת ${sentCount} מתוך ${messages.length} הודעות קוליות 📨`}
          emptyHe={isGirl ? 'לא נשלחו הודעות הפעם — נסי שוב כשתוכלי לדבר 🎙️' : 'לא נשלחו הודעות הפעם — נסה שוב כשתוכל לדבר 🎙️'}
          againLabel="עוד הודעות 📱"
          onAgain={handleRestart}
          onClose={onClose}
        />
      ) : (
        message && (
          <div className="space-y-3">
            <p className={`text-xs font-bold ${theme.mutedTextClass}`}>
              הודעה {idx + 1} מתוך {messages.length} · {isGirl ? 'הקשיבי להודעה והקליטי תשובה באנגלית' : 'הקשב להודעה והקלט תשובה באנגלית'}
            </p>

            {/* Chat */}
            <div className="rounded-3xl p-3 space-y-2 bg-slate-900/90 text-white" dir="ltr" lang="en">
              <div className="flex items-end gap-2 max-w-[85%]">
                <span className="text-2xl leading-none" aria-hidden="true">
                  {message.fromEmoji}
                </span>
                <div className="rounded-2xl rounded-bl-sm px-3 py-2 bg-white/15">
                  <div className="text-xs font-bold opacity-70">{message.fromName}</div>
                  <div className="text-sm font-bold">{message.incomingEn}</div>
                  <div className="text-xs opacity-70" dir="rtl">
                    {message.incomingHe}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={messageSpeech.toggle}
                  className="p-2 rounded-full bg-white/15 shrink-0"
                  aria-label={messageSpeech.isSpeaking ? STOP_SPEECH_LABEL : 'השמעת ההודעה'}
                >
                  <SpeakIcon isSpeaking={messageSpeech.isSpeaking} />
                </button>
              </div>
              {outcomes[idx] === 'sent' && (
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-br-sm px-3 py-2 bg-emerald-500 max-w-[85%]">
                    <div className="text-xs font-bold opacity-80">🎤 Voice message</div>
                    <div className="text-sm font-bold">{message.replyEn}</div>
                  </div>
                </div>
              )}
            </div>

            <VoiceSpeakDrill
              targetEn={message.replyEn}
              targetHe={message.replyHe}
              speechEval={speechEval}
              isListening={speech.isListening}
              isCompleted={isResolved}
              gender={profile.gender}
              theme={theme}
              onSpeakEnglish={onSpeakEnglish}
              onStartListening={handleStartListening}
              onSkip={() => resolve('skipped', 'דילגנו על ההודעה הזאת — לא נשלחה.')}
            />

            {feedback && (
              <FeedbackBanner
                isCorrect={feedback.isCorrect}
                text={feedback.text}
                showNext={isResolved}
                nextLabel={isLast ? 'סיום 🎉' : 'להודעה הבאה'}
                onNext={handleNext}
                theme={theme}
              />
            )}
          </div>
        )
      )}
    </RoomPanelFrame>
  );
};
