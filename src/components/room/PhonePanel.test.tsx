import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PHONE_SESSION_SIZE } from '../../data/voiceMessages';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { PhonePanel } from './PhonePanel';

const speech = vi.hoisted(() => ({
  isListening: false,
  start: vi.fn(),
  cancel: vi.fn(),
}));

vi.mock('../../hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: () => speech,
  getSpeechErrorTextHe: () => 'לא הצלחנו לשמוע',
}));

const onUpdateProfile = vi.fn();
const onClose = vi.fn();
const onSpeakEnglish = vi.fn();

function setup() {
  render(
    <PhonePanel profile={makeProfile({})} theme={TEST_THEME} onUpdateProfile={onUpdateProfile} onSpeakEnglish={onSpeakEnglish} onClose={onClose} />
  );
  return userEvent.setup();
}

const mic = () => screen.getByRole('button', { name: 'לחצי ודברי' });
const skip = () => screen.getByRole('button', { name: /מעבר להאזנה בלבד/ });

type Handlers = {
  onResult: (t: string, e: { passed: boolean; scorePercent: number; wordResults: unknown[] }) => void;
  onError: (k: string) => void;
};
const lastHandlers = () => speech.start.mock.calls[speech.start.mock.calls.length - 1][1] as Handlers;

beforeEach(() => {
  speech.isListening = false;
  speech.start.mockClear();
  speech.cancel.mockClear();
  onUpdateProfile.mockClear();
  onClose.mockClear();
  onSpeakEnglish.mockClear();
});

describe('PhonePanel', () => {
  it('reads the first message aloud and shows its position', () => {
    setup();
    expect(onSpeakEnglish).toHaveBeenCalledTimes(1);
    expect(screen.getByText(new RegExp(`הודעה 1 מתוך ${PHONE_SESSION_SIZE}`))).toBeInTheDocument();
  });

  it('sends the reply when the speech check passes, and moves on', async () => {
    const user = setup();
    await user.click(mic());
    lastHandlers().onResult('hello', { passed: true, scorePercent: 92, wordResults: [] });
    expect(await screen.findByText(/ההודעה נשלחה/)).toBeInTheDocument();
    expect(screen.getByText(/Voice message/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'להודעה הבאה' }));
    expect(screen.getByText(new RegExp(`הודעה 2 מתוך ${PHONE_SESSION_SIZE}`))).toBeInTheDocument();
  });

  it('asks to try again when the reply was not close enough', async () => {
    const user = setup();
    await user.click(mic());
    lastHandlers().onResult('', { passed: false, scorePercent: 10, wordResults: [] });
    expect(await screen.findByText(/האזיני להשמעה האיטית/)).toBeInTheDocument();
    expect(mic()).toBeEnabled();
  });

  it('shows the recognition error text', async () => {
    const user = setup();
    await user.click(mic());
    lastHandlers().onError('no-speech');
    expect(await screen.findByText('לא הצלחנו לשמוע')).toBeInTheDocument();
  });

  it('skips a message without sending it', async () => {
    const user = setup();
    await user.click(skip());
    expect(await screen.findByText(/דילגנו על ההודעה הזאת/)).toBeInTheDocument();
    expect(screen.queryByText(/Voice message/)).not.toBeInTheDocument();
  });

  it('finishes a session of sent replies with a reward, then starts again', async () => {
    const user = setup();
    for (let i = 0; i < PHONE_SESSION_SIZE; i++) {
      await user.click(mic());
      lastHandlers().onResult('ok', { passed: true, scorePercent: 90, wordResults: [] });
      await user.click(await screen.findByRole('button', { name: i === PHONE_SESSION_SIZE - 1 ? /סיום/ : 'להודעה הבאה' }));
    }
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(screen.getByText(new RegExp(`שלחת ${PHONE_SESSION_SIZE} מתוך ${PHONE_SESSION_SIZE}`))).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /עוד הודעות/ }));
    expect(screen.getByText(new RegExp(`הודעה 1 מתוך ${PHONE_SESSION_SIZE}`))).toBeInTheDocument();
  });

  it('gives no reward when every message was skipped', async () => {
    const user = setup();
    for (let i = 0; i < PHONE_SESSION_SIZE; i++) {
      await user.click(skip());
      await user.click(await screen.findByRole('button', { name: i === PHONE_SESSION_SIZE - 1 ? /סיום/ : 'להודעה הבאה' }));
    }
    expect(onUpdateProfile).not.toHaveBeenCalled();
    expect(screen.getByText(/לא נשלחו הודעות הפעם/)).toBeInTheDocument();
  });
});
