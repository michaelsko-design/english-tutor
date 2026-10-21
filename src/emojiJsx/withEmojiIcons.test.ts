import { describe, expect, it } from 'vitest';
import { splitIconEmoji } from '../utils/emojiSegments';
import { RAW_EMOJI_PROP, withEmojiIcons } from './withEmojiIcons';

describe('splitIconEmoji', () => {
  it('is null for text without a drawn emoji', () => {
    expect(splitIconEmoji('שלום')).toBeNull();
    expect(splitIconEmoji('')).toBeNull();
    expect(splitIconEmoji('🦄 unicorn')).toBeNull();
  });

  it('splits text around drawn emoji, keeping the order', () => {
    expect(splitIconEmoji('בחדר 🛏️ ושם 📱!')).toEqual([
      { kind: 'text', text: 'בחדר ' },
      { kind: 'emoji', emoji: '🛏️' },
      { kind: 'text', text: ' ושם ' },
      { kind: 'emoji', emoji: '📱' },
      { kind: 'text', text: '!' },
    ]);
  });

  it('finds an emoji at the very start and end, and two in a row', () => {
    expect(splitIconEmoji('🛏️📱')).toEqual([
      { kind: 'emoji', emoji: '🛏️' },
      { kind: 'emoji', emoji: '📱' },
    ]);
  });

  it('matches an emoji with or without its variation selector', () => {
    expect(splitIconEmoji('❤')).toEqual([{ kind: 'emoji', emoji: '❤' }]);
    expect(splitIconEmoji('❤️')).toEqual([{ kind: 'emoji', emoji: '❤️' }]);
  });
});

describe('withEmojiIcons', () => {
  it('leaves props alone for components, plain-text tags and text without emoji', () => {
    const props = { children: 'hi 🛏️' };
    expect(withEmojiIcons(() => null, props)).toBe(props);
    expect(withEmojiIcons('option', props)).toBe(props);
    expect(withEmojiIcons('span', { children: 'hello' })).toEqual({ children: 'hello' });
  });

  it('swaps drawn emoji in the string children of a DOM element, without changing the props it was given', () => {
    const props = { className: 'x', children: 'a 🛏️' };
    const result = withEmojiIcons<unknown>('p', props) as { className: string; children: unknown[] };
    expect(result.className).toBe('x');
    expect(result.children).toHaveLength(2);
    expect(result.children[0]).toBe('a ');
    expect(props.children).toBe('a 🛏️');
  });

  it('swaps inside an array of children and keeps the other children', () => {
    const element = { tag: 'b' };
    const result = withEmojiIcons<unknown>('p', { children: ['x 📱', element] }) as { children: unknown[] };
    expect(result.children[1]).toBe(element);
    expect(Array.isArray(result.children[0])).toBe(true);
  });

  it('keeps the text of an element marked raw (the fallback inside EmojiIcon)', () => {
    const props = { [RAW_EMOJI_PROP]: '', children: '🛏️' };
    expect(withEmojiIcons('span', props)).toBe(props);
  });
});
