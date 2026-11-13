import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MultipleChoiceOptions } from './MultipleChoiceOptions';
import { TEST_THEME } from '../../test/fixtures';

vi.mock('../../hooks/useArtStatus', () => ({ useArtStatus: () => 'loaded' }));

describe('MultipleChoiceOptions', () => {
  it('shows a picture answer as its drawing and names it by its word', () => {
    const { container } = render(
      <MultipleChoiceOptions
        options={[
          { textEn: '🐊', speakEn: 'alligator', pictureId: 'vocab-alligator', isCorrect: true, explanationHe: '' },
          { textEn: 'B', isCorrect: false, explanationHe: '' },
        ]}
        selectedIdx={null}
        onSelect={() => undefined}
        theme={TEST_THEME}
      />
    );

    expect(container.querySelector('img')?.getAttribute('src')).toBe('/art/icons/vocab-alligator.webp');
    expect(screen.getByText('alligator')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
  });
});
