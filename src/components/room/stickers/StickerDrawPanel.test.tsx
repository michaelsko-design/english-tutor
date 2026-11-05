import { forwardRef, useImperativeHandle } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_DRAWN_STICKERS, STICKER_PASS_ID } from '../../../data/stickers';
import { makeProfile, TEST_THEME } from '../../../test/fixtures';
import type { LearnerProfile } from '../../../types/learner';
import { StickerDrawPanel } from './StickerDrawPanel';

const saveStickerImage = vi.hoisted(() => vi.fn());
const speech = vi.hoisted(() => ({ isListening: false, start: vi.fn(), cancel: vi.fn() }));

vi.mock('../../../services/stickerImages', () => ({ saveStickerImage }));
vi.mock('../../../hooks/useSpeechRecognition', () => ({
  useSpeechRecognition: () => speech,
  getSpeechErrorTextHe: () => 'לא שמענו',
}));
vi.mock('./StickerCanvas', () => ({
  StickerCanvas: forwardRef(
    (
      p: { strokes: unknown[]; color: string; brushWidth: number; isEraser: boolean; onStrokesChange: (s: unknown[]) => void },
      ref
    ) => {
      useImperativeHandle(ref, () => ({ exportPng: () => 'data:image/png;base64,iVBORw0KGgo=' }));
      return (
        <div>
          <button type="button" onClick={() => p.onStrokesChange([...p.strokes, { color: p.color, width: p.brushWidth, isEraser: p.isEraser, points: [[1, 1]] }])}>
            draw
          </button>
          <span>{`strokes:${p.strokes.length} color:${p.color} brush:${p.brushWidth} eraser:${p.isEraser}`}</span>
        </div>
      );
    }
  ),
}));

const onUpdateProfile = vi.fn();
const onSpeakEnglish = vi.fn();
const onDone = vi.fn();

const withPass = (extra: Partial<LearnerProfile> = {}) => makeProfile({ gender: 'girl', unlockedRewardIds: [STICKER_PASS_ID], ...extra });

function setup(profile: LearnerProfile = withPass()) {
  render(<StickerDrawPanel profile={profile} theme={TEST_THEME} onUpdateProfile={onUpdateProfile} onSpeakEnglish={onSpeakEnglish} onDone={onDone} />);
  return userEvent.setup();
}

const save = () => screen.getByRole('button', { name: /שמירה באלבום/ });
const nameBox = () => screen.getByLabelText(/איך קוראים למדבקה/);

beforeEach(() => {
  [onUpdateProfile, onSpeakEnglish, onDone, speech.start, saveStickerImage].forEach((fn) => fn.mockReset());
  saveStickerImage.mockResolvedValue(undefined);
  speech.isListening = false;
});

describe('StickerDrawPanel', () => {
  it('cannot save without a drawing and a valid name', async () => {
    const user = setup();
    expect(save()).toBeDisabled();
    await user.type(nameBox(), 'happy sun');
    expect(save()).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'draw' }));
    expect(save()).toBeEnabled();
  });

  it('keeps only letters and spaces in the name', async () => {
    const user = setup();
    await user.type(nameBox(), 'su9n!');
    expect(nameBox()).toHaveValue('sun');
  });

  it('changes colour, brush and eraser, and the colour turns the eraser off', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'צבע כחול' }));
    await user.click(screen.getByRole('button', { name: /עבה/ }));
    expect(screen.getByText(/color:#3b82f6 brush:34 eraser:false/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /מחק/ }));
    expect(screen.getByText(/eraser:true/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'צבע ירוק' }));
    expect(screen.getByText(/eraser:false/)).toBeInTheDocument();
  });

  it('undoes the last stroke and clears all of them', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'draw' }));
    await user.click(screen.getByRole('button', { name: 'draw' }));
    await user.click(screen.getAllByRole('button', { name: 'ביטול' })[0]);
    expect(screen.getByText(/strokes:1 /)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'ניקוי' }));
    expect(screen.getByText(/strokes:0 /)).toBeInTheDocument();
  });

  it('saves the sticker, stores the picture, reads the name aloud and closes', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'draw' }));
    await user.type(nameBox(), 'happy sun');
    await user.click(save());
    expect(saveStickerImage).toHaveBeenCalledTimes(1);
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(onUpdateProfile.mock.calls[0][0].room.drawnStickers).toHaveLength(1);
    expect(onSpeakEnglish).toHaveBeenCalledWith('happy sun', 0.9);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('still saves when storing the picture fails', async () => {
    saveStickerImage.mockRejectedValue({ code: 'unavailable' });
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'draw' }));
    await user.type(nameBox(), 'sun');
    await user.click(save());
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
  });

  it('explains why a drawing was not saved: no pass', async () => {
    const user = setup(makeProfile({ gender: 'girl' }));
    await user.click(screen.getByRole('button', { name: 'draw' }));
    await user.type(nameBox(), 'sun');
    await user.click(save());
    expect(screen.getByText(/צריך את כרטיס סטודיו המדבקות/)).toBeInTheDocument();
    expect(onUpdateProfile).not.toHaveBeenCalled();
  });

  it('explains why a drawing was not saved: the album is full', async () => {
    const drawn = Array.from({ length: MAX_DRAWN_STICKERS }, (_, i) => ({ id: `drawn-${i}`, nameEn: 'sun', createdAt: '2026-11-01T00:00:00.000Z' }));
    const profile = withPass({ room: { placements: {}, namedItemIds: [], updatedAt: '', drawnStickers: drawn } } as never);
    const user = setup(profile);
    await user.click(screen.getByRole('button', { name: 'draw' }));
    await user.type(nameBox(), 'sun');
    await user.click(save());
    expect(screen.getByText(/האלבום מלא — מחקי/)).toBeInTheDocument();
  });

  it('writes the name from the microphone', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'אמירת השם במיקרופון' }));
    const handlers = speech.start.mock.calls[0][1] as { onResult: (t: string) => void; onError: (k: string) => void };
    handlers.onResult('Happy Sun 7!');
    expect(await screen.findByDisplayValue('Happy Sun')).toBeInTheDocument();
  });

  it('shows a microphone error', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'אמירת השם במיקרופון' }));
    (speech.start.mock.calls[0][1] as { onError: (k: string) => void }).onError('no-speech');
    expect(await screen.findByText('לא שמענו')).toBeInTheDocument();
  });

  it('cancels', async () => {
    const user = setup();
    const cancelButtons = screen.getAllByRole('button', { name: 'ביטול' });
    await user.click(cancelButtons[cancelButtons.length - 1]);
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
