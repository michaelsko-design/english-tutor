import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WordPicture } from './WordPicture';

vi.mock('../../hooks/useArtStatus', () => ({ useArtStatus: () => 'loaded' }));

const imageSrc = (container: HTMLElement) => container.querySelector('img')?.getAttribute('src');

describe('WordPicture', () => {
  it("shows the word's own drawing, not the emoji's", () => {
    const { container } = render(<WordPicture wordEn="doll" emoji="🪆" />);
    expect(imageSrc(container)).toBe('/art/icons/vocab-doll.webp');
  });

  it('finds the drawing whatever the case of the word (game words are upper case)', () => {
    const { container } = render(<WordPicture wordEn="APPLE" emoji="🍎" />);
    expect(imageSrc(container)).toBe('/art/icons/vocab-apple.webp');
  });

  it('picks the meaning by the Hebrew word', () => {
    const { container } = render(<WordPicture wordEn="bat" translationHe="עטלף" emoji="🦇" />);
    expect(imageSrc(container)).toBe('/art/icons/vocab-bat-animal.webp');
  });

  it("falls back to the emoji's icon for a word with no drawing", () => {
    const { container } = render(<WordPicture wordEn="ambitious" emoji="🚀" />);
    expect(imageSrc(container)).toBe('/art/icons/ui-rocket@128.webp');
  });

  it('renders nothing without a drawing or an emoji', () => {
    const { container } = render(<WordPicture wordEn="ambitious" />);
    expect(container.innerHTML).toBe('');
  });
});
