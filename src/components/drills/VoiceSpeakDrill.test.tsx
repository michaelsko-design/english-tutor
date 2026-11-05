import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { VoiceSpeakDrill } from './VoiceSpeakDrill';

function renderDrill(props: Partial<React.ComponentProps<typeof VoiceSpeakDrill>> = {}) {
  render(
    <VoiceSpeakDrill
      targetEn="My brother feeds the fish."
      targetHe="אחי מאכיל את הדגים."
      speechEval={null}
      isListening={false}
      isCompleted={false}
      gender="girl"
      theme={TEST_THEME}
      onSpeakEnglish={vi.fn()}
      onStartListening={vi.fn()}
      onSkip={vi.fn()}
      {...props}
    />
  );
}

describe('VoiceSpeakDrill say-it-from-memory (Master)', () => {
  it('shows the sentence normally', () => {
    renderDrill();
    expect(screen.getByRole('button', { name: 'brother' })).toBeInTheDocument();
    expect(screen.queryByTestId('hidden-sentence')).not.toBeInTheDocument();
  });

  it('hides the sentence and its translation until the learner asks to see it', async () => {
    renderDrill({ hideText: true });
    expect(screen.getByTestId('hidden-sentence')).toBeInTheDocument();
    expect(screen.queryByText('brother')).not.toBeInTheDocument();
    expect(screen.queryByText('אחי מאכיל את הדגים.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /slow|איטי/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /הצגת המשפט/ }));
    expect(screen.getByRole('button', { name: 'brother' })).toBeInTheDocument();
    expect(screen.queryByTestId('hidden-sentence')).not.toBeInTheDocument();
  });

  it('shows the sentence once an attempt was scored or the step is done', () => {
    renderDrill({ hideText: true, isCompleted: true });
    expect(screen.queryByTestId('hidden-sentence')).not.toBeInTheDocument();
  });
});
