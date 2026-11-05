import { describe, expect, it, vi } from 'vitest';
import { createSpeechStatus, isSameSpeech } from './speechStatus';
import type { TextToSpeechService } from './types';

/** A service whose speak() stays open until the test ends it (or stop() is called). */
function fakeService() {
  const pending: Array<() => void> = [];
  const service: TextToSpeechService = {
    speak: vi.fn(
      () =>
        new Promise<void>((resolve) => {
          pending.push(resolve);
        }),
    ),
    stop: vi.fn(() => {
      pending.splice(0).forEach((resolve) => resolve());
    }),
    isReady: () => true,
  };
  const finishAll = async () => {
    pending.splice(0).forEach((resolve) => resolve());
    await Promise.resolve();
    await Promise.resolve();
  };
  return { service, finishAll };
}

describe('createSpeechStatus', () => {
  it('reports the text and rate being read until it ends', async () => {
    const { service, finishAll } = fakeService();
    const status = createSpeechStatus(service);
    const listener = vi.fn();
    status.subscribe(listener);

    const done = status.speak('Hello there.', { rate: 0.9 });

    expect(status.getCurrent()).toEqual({ text: 'Hello there.', rate: 0.9 });
    await finishAll();
    await done;
    expect(status.getCurrent()).toBeNull();
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('uses the normal rate when none is given', () => {
    const { service } = fakeService();
    const status = createSpeechStatus(service);

    void status.speak('Hello.');

    expect(status.getCurrent()).toEqual({ text: 'Hello.', rate: 0.95 });
  });

  it('clears the reading at once when stopped', () => {
    const { service } = fakeService();
    const status = createSpeechStatus(service);
    void status.speak('A long story.');

    status.stop();

    expect(service.stop).toHaveBeenCalled();
    expect(status.getCurrent()).toBeNull();
  });

  it('keeps showing a newer reading when an older one ends late', async () => {
    const { service, finishAll } = fakeService();
    const status = createSpeechStatus(service);
    void status.speak('First.');
    void status.speak('Second.');

    // The fake doesn't stop the first one, so both resolve here; only the first may clear.
    expect(status.getCurrent()).toEqual({ text: 'Second.', rate: 0.95 });
    await finishAll();
    expect(status.getCurrent()).toBeNull();
  });

  it('does not clear a newer reading when the older promise settles first', async () => {
    let resolveFirst: () => void = () => undefined;
    const service: TextToSpeechService = {
      speak: vi
        .fn()
        .mockImplementationOnce(() => new Promise<void>((resolve) => (resolveFirst = resolve)))
        .mockImplementationOnce(() => new Promise<void>(() => undefined)),
      stop: vi.fn(),
      isReady: () => true,
    };
    const status = createSpeechStatus(service);
    const first = status.speak('First.');
    void status.speak('Second.');

    resolveFirst();
    await first;

    expect(status.getCurrent()).toEqual({ text: 'Second.', rate: 0.95 });
  });

  it('does not notify when stopping while nothing is read', () => {
    const { service } = fakeService();
    const status = createSpeechStatus(service);
    const listener = vi.fn();
    status.subscribe(listener);

    status.stop();

    expect(listener).not.toHaveBeenCalled();
  });

  it('stops notifying a listener after it unsubscribes', () => {
    const { service } = fakeService();
    const status = createSpeechStatus(service);
    const listener = vi.fn();
    const unsubscribe = status.subscribe(listener);

    unsubscribe();
    void status.speak('Hi.');

    expect(listener).not.toHaveBeenCalled();
  });

  it('clears the reading when speak fails', async () => {
    const service: TextToSpeechService = {
      speak: vi.fn().mockRejectedValue(new Error('boom')),
      stop: vi.fn(),
      isReady: () => true,
    };
    const status = createSpeechStatus(service);

    await expect(status.speak('Hi.')).rejects.toThrow('boom');

    expect(status.getCurrent()).toBeNull();
  });
});

describe('isSameSpeech', () => {
  it('matches the same text at the same rate only', () => {
    const current = { text: 'Listen.', rate: 0.95 };

    expect(isSameSpeech(current, 'Listen.', 0.95)).toBe(true);
    expect(isSameSpeech(current, 'Listen.', 0.7)).toBe(false);
    expect(isSameSpeech(current, 'Other.', 0.95)).toBe(false);
    expect(isSameSpeech(null, 'Listen.', 0.95)).toBe(false);
  });

  it('uses the normal rate when none is given', () => {
    expect(isSameSpeech({ text: 'Listen.', rate: 0.95 }, 'Listen.')).toBe(true);
  });
});

describe('enqueue', () => {
  const spoken = (service: TextToSpeechService) => vi.mocked(service.speak).mock.calls.map(([text]) => text);
  const settle = async () => {
    for (let i = 0; i < 5; i += 1) await Promise.resolve();
  };

  it('reads quickly queued words one after another', async () => {
    const { service, finishAll } = fakeService();
    const status = createSpeechStatus(service);

    status.enqueue('He');
    status.enqueue('has');
    status.enqueue('worked');
    expect(spoken(service)).toEqual(['He']);
    expect(status.getCurrent()?.text).toBe('He');

    await finishAll();
    await settle();
    expect(spoken(service)).toEqual(['He', 'has']);
    await finishAll();
    await settle();
    expect(spoken(service)).toEqual(['He', 'has', 'worked']);
    await finishAll();
    await settle();
    expect(status.getCurrent()).toBeNull();
  });

  it('starts a new queue after the previous one finished', async () => {
    const { service, finishAll } = fakeService();
    const status = createSpeechStatus(service);
    status.enqueue('one');
    await finishAll();
    await settle();

    status.enqueue('two');

    expect(spoken(service)).toEqual(['one', 'two']);
  });

  it('drops the waiting words when another reading starts', async () => {
    const { service, finishAll } = fakeService();
    const status = createSpeechStatus(service);
    status.enqueue('one');
    status.enqueue('two');

    void status.speak('feedback');
    await finishAll();
    await settle();

    expect(spoken(service)).toEqual(['one', 'feedback']);
  });

  it('drops the waiting words when stopped, and queues again afterwards', async () => {
    const { service, finishAll } = fakeService();
    const status = createSpeechStatus(service);
    status.enqueue('one');
    status.enqueue('two');

    status.stop();
    await settle();
    expect(spoken(service)).toEqual(['one']);

    status.enqueue('three');
    status.enqueue('four');
    await finishAll();
    await settle();
    expect(spoken(service)).toEqual(['one', 'three', 'four']);
  });

  it('keeps going when a word fails to play', async () => {
    const service: TextToSpeechService = {
      speak: vi.fn().mockRejectedValueOnce(new Error('boom')).mockResolvedValue(undefined),
      stop: vi.fn(),
      isReady: () => true,
    };
    const status = createSpeechStatus(service);

    status.enqueue('bad');
    status.enqueue('good');
    await settle();

    expect(spoken(service)).toEqual(['bad', 'good']);
  });

  it('keeps only the newest waiting words past the cap', async () => {
    const { service, finishAll } = fakeService();
    const status = createSpeechStatus(service);
    for (let i = 0; i < 20; i += 1) status.enqueue(`w${i}`);

    for (let i = 0; i < 20; i += 1) {
      await finishAll();
      await settle();
    }

    const words = spoken(service);
    expect(words[0]).toBe('w0');
    expect(words).toHaveLength(13);
    expect(words[words.length - 1]).toBe('w19');
  });
});

describe('speakSequence', () => {
  it('reads the parts one after another', async () => {
    const { service, finishAll } = fakeService();
    const status = createSpeechStatus(service);
    const done = status.speakSequence([{ text: 'שימו לב:', options: { lang: 'he' } }, { text: 'What is this?' }]);
    expect(service.speak).toHaveBeenLastCalledWith('שימו לב:', { lang: 'he' });
    await finishAll();
    expect(service.speak).toHaveBeenLastCalledWith('What is this?', {});
    await finishAll();
    await done;
    expect(service.speak).toHaveBeenCalledTimes(2);
  });

  it('stops when another reading starts or the reading is stopped', async () => {
    const { service, finishAll } = fakeService();
    const status = createSpeechStatus(service);
    const tapped = status.speakSequence([{ text: 'one' }, { text: 'two' }]);
    void status.speak('a tapped word');
    await finishAll();
    await tapped;
    expect(vi.mocked(service.speak).mock.calls.map(([text]) => text)).not.toContain('two');

    const stopped = status.speakSequence([{ text: 'three' }, { text: 'four' }]);
    status.stop();
    await stopped;
    expect(vi.mocked(service.speak).mock.calls.map(([text]) => text)).not.toContain('four');
  });
});
