import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getTtsService } from '../services/tts';
import { getSpeechErrorTextHe, useSpeechRecognition } from './useSpeechRecognition';

class FakeRecognition {
  static instances: FakeRecognition[] = [];
  lang = '';
  interimResults = true;
  maxAlternatives = 0;
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onend: (() => void) | null = null;
  onstart: (() => void) | null = null;
  onaudiostart: (() => void) | null = null;
  start = vi.fn();
  abort = vi.fn();
  constructor() {
    FakeRecognition.instances.push(this);
  }
}

const win = window as unknown as Record<string, unknown>;

beforeEach(() => {
  FakeRecognition.instances = [];
  win.webkitSpeechRecognition = FakeRecognition;
});

afterEach(() => {
  delete win.webkitSpeechRecognition;
  delete win.SpeechRecognition;
});

describe('getSpeechErrorTextHe', () => {
  it('addresses the learner by gender for every kind', () => {
    for (const kind of ['unsupported', 'not-allowed', 'no-speech'] as const) {
      expect(getSpeechErrorTextHe(kind, 'girl')).not.toBe(getSpeechErrorTextHe(kind, 'boy'));
    }
    expect(getSpeechErrorTextHe('not-allowed', 'girl')).toContain('אשרי');
    expect(getSpeechErrorTextHe('not-allowed', 'boy')).toContain('אשר ');
  });
});

describe('useSpeechRecognition', () => {
  it('reports unsupported browsers without listening', () => {
    delete win.webkitSpeechRecognition;
    const handlers = { onResult: vi.fn(), onError: vi.fn() };
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start('hello', handlers));
    expect(handlers.onError).toHaveBeenCalledWith('unsupported');
    expect(result.current.isListening).toBe(false);
  });

  it('listens once in en-US and scores the transcript', () => {
    const handlers = { onResult: vi.fn(), onError: vi.fn() };
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start('I like apples', handlers));
    const [recognition] = FakeRecognition.instances;
    expect(recognition.lang).toBe('en-US');
    expect(recognition.start).toHaveBeenCalled();
    act(() => recognition.onaudiostart?.());
    expect(result.current.isListening).toBe(true);

    act(() => recognition.onresult?.({ results: [[{ transcript: 'I like apples' }]] }));
    expect(handlers.onResult).toHaveBeenCalledWith('I like apples', expect.objectContaining({}));
    expect(result.current.isListening).toBe(false);
  });

  it('treats an empty result as an empty transcript', () => {
    const handlers = { onResult: vi.fn(), onError: vi.fn() };
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start('hello', handlers));
    act(() => FakeRecognition.instances[0].onresult?.({}));
    expect(handlers.onResult).toHaveBeenCalledWith('', expect.anything());
  });

  it('maps microphone errors', () => {
    const handlers = { onResult: vi.fn(), onError: vi.fn() };
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start('hello', handlers));
    act(() => FakeRecognition.instances[0].onerror?.({ error: 'not-allowed' }));
    expect(handlers.onError).toHaveBeenLastCalledWith('not-allowed');

    act(() => result.current.start('hello', handlers));
    act(() => FakeRecognition.instances[1].onerror?.({ error: 'service-not-allowed' }));
    expect(handlers.onError).toHaveBeenLastCalledWith('not-allowed');

    act(() => result.current.start('hello', handlers));
    act(() => FakeRecognition.instances[2].onerror?.(undefined));
    expect(handlers.onError).toHaveBeenLastCalledWith('no-speech');
  });

  it('stops listening when the recognition ends by itself, and says it heard nothing', () => {
    const handlers = { onResult: vi.fn(), onError: vi.fn() };
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start('hello', handlers));
    act(() => FakeRecognition.instances[0].onend?.());
    expect(result.current.isListening).toBe(false);
    expect(handlers.onError).toHaveBeenCalledTimes(1);
    expect(handlers.onError).toHaveBeenCalledWith('no-speech');
  });

  it('does not report an ending after a result or an error', () => {
    const handlers = { onResult: vi.fn(), onError: vi.fn() };
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start('hello', handlers));
    act(() => FakeRecognition.instances[0].onresult?.({ results: [[{ transcript: 'hello' }]] }));
    act(() => FakeRecognition.instances[0].onend?.());
    expect(handlers.onError).not.toHaveBeenCalled();

    act(() => result.current.start('hello', handlers));
    act(() => FakeRecognition.instances[1].onerror?.({ error: 'network' }));
    act(() => FakeRecognition.instances[1].onend?.());
    expect(handlers.onError).toHaveBeenCalledTimes(1);
  });

  it('is starting until the microphone records, then listening', () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start('hello', { onResult: vi.fn(), onError: vi.fn() }));
    expect(result.current.isStarting).toBe(true);
    expect(result.current.isListening).toBe(false);

    act(() => FakeRecognition.instances[0].onstart?.());
    expect(result.current.isStarting).toBe(false);
    expect(result.current.isListening).toBe(true);

    act(() => FakeRecognition.instances[0].onend?.());
    expect(result.current.isStarting).toBe(false);
    expect(result.current.isListening).toBe(false);
  });

  it('stops the reading and holds read-aloud while the mic is open', async () => {
    const tts = getTtsService();
    const { result, unmount } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start('hello', { onResult: vi.fn(), onError: vi.fn() }));
    expect(tts.isMicOpen()).toBe(true);

    act(() => FakeRecognition.instances[0].onresult?.({ results: [[{ transcript: 'hello' }]] }));
    expect(tts.isMicOpen()).toBe(false);

    act(() => result.current.start('hello', { onResult: vi.fn(), onError: vi.fn() }));
    act(() => FakeRecognition.instances[1].onerror?.({ error: 'no-speech' }));
    expect(tts.isMicOpen()).toBe(false);

    act(() => result.current.start('hello', { onResult: vi.fn(), onError: vi.fn() }));
    act(() => result.current.cancel());
    expect(tts.isMicOpen()).toBe(false);

    act(() => result.current.start('hello', { onResult: vi.fn(), onError: vi.fn() }));
    act(() => result.current.start('hello', { onResult: vi.fn(), onError: vi.fn() }));
    expect(tts.isMicOpen()).toBe(true);
    unmount();
    expect(tts.isMicOpen()).toBe(false);
  });

  it('cancel aborts without calling the handlers, even when abort throws, and unmount cancels', () => {
    const handlers = { onResult: vi.fn(), onError: vi.fn() };
    const { result, unmount } = renderHook(() => useSpeechRecognition());
    act(() => result.current.cancel());
    act(() => result.current.start('hello', handlers));
    const first = FakeRecognition.instances[0];
    first.abort.mockImplementation(() => {
      throw new Error('already stopped');
    });
    act(() => result.current.cancel());
    expect(first.abort).toHaveBeenCalled();
    expect(first.onresult).toBeNull();
    expect(result.current.isListening).toBe(false);

    act(() => result.current.start('hello', handlers));
    const second = FakeRecognition.instances[1];
    unmount();
    expect(second.abort).toHaveBeenCalled();
    expect(handlers.onResult).not.toHaveBeenCalled();
  });

  it('prefers the standard SpeechRecognition constructor', () => {
    class Standard extends FakeRecognition {}
    win.SpeechRecognition = Standard;
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.start('hello', { onResult: vi.fn(), onError: vi.fn() }));
    expect(FakeRecognition.instances[0]).toBeInstanceOf(Standard);
  });
});
