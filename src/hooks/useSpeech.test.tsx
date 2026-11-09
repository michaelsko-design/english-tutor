import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getTtsService } from '../services/tts';
import { toggleSpeech, useStopSpeechOnButtonPress, useStopSpeechOnChange } from './useSpeech';

const READING = { text: 'Hello', rate: 0.9 };

function Harness({ onSpeak }: { onSpeak: () => void }) {
  useStopSpeechOnButtonPress();
  return (
    <>
      <button type="button">next</button>
      <button type="button" onClick={() => toggleSpeech(false, onSpeak, READING.text, READING.rate)}>
        listen
      </button>
      <p>plain text</p>
    </>
  );
}

function ChangeHarness({ stepKey }: { stepKey: number }) {
  useStopSpeechOnChange(stepKey);
  return null;
}

describe('stopping the reading', () => {
  afterEach(() => vi.restoreAllMocks());

  it('stops the reading when a button is pressed', () => {
    const service = getTtsService();
    vi.spyOn(service, 'getCurrent').mockReturnValue(READING);
    const stop = vi.spyOn(service, 'stop');
    const { getByText } = render(<Harness onSpeak={vi.fn()} />);

    fireEvent.click(getByText('next'));

    expect(stop).toHaveBeenCalledTimes(1);
  });

  it('leaves the reading alone when something other than a button is pressed', () => {
    const service = getTtsService();
    vi.spyOn(service, 'getCurrent').mockReturnValue(READING);
    const stop = vi.spyOn(service, 'stop');
    const { getByText } = render(<Harness onSpeak={vi.fn()} />);

    fireEvent.click(getByText('plain text'));

    expect(stop).not.toHaveBeenCalled();
  });

  it('does not restart a reading that the same press just stopped', () => {
    const service = getTtsService();
    vi.spyOn(service, 'getCurrent').mockReturnValue(READING);
    const onSpeak = vi.fn();
    const { getByText } = render(<Harness onSpeak={onSpeak} />);

    fireEvent.click(getByText('listen'));

    expect(onSpeak).not.toHaveBeenCalled();
  });

  it('starts a reading when nothing was being read', async () => {
    // Let the previous test's press finish (the "just stopped" marker clears after the press)
    await new Promise((resolve) => setTimeout(resolve, 0));
    vi.spyOn(getTtsService(), 'getCurrent').mockReturnValue(null);
    const onSpeak = vi.fn();
    const { getByText } = render(<Harness onSpeak={onSpeak} />);

    fireEvent.click(getByText('listen'));

    expect(onSpeak).toHaveBeenCalledWith(READING.text, READING.rate);
  });

  it('stops the reading when the step key changes', () => {
    const stop = vi.spyOn(getTtsService(), 'stop');
    const { rerender } = render(<ChangeHarness stepKey={0} />);
    stop.mockClear();

    rerender(<ChangeHarness stepKey={1} />);

    expect(stop).toHaveBeenCalledTimes(1);
  });
});
