import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HebrewAudioContext } from '../../data/hebrewAudio';
import { TEST_THEME } from '../../test/fixtures';
import { SentenceBuilderDrill } from './SentenceBuilderDrill';

const GLOSSES: Record<string, string> = { year: 'שנה', new: 'חדש' };
const TRANSLATE_YEAR = { name: 'תרגום המילה year' };

function renderDrill(
  wordHelp: Partial<NonNullable<React.ComponentProps<typeof SentenceBuilderDrill>['wordHelp']>> | undefined,
  onChangeOrder = vi.fn()
) {
  render(
    <SentenceBuilderDrill
      scrambledWords={['This', 'year', 'new']}
      selectedIndices={[]}
      isCompleted={false}
      onChangeOrder={onChangeOrder}
      onReset={vi.fn()}
      onCheck={vi.fn()}
      theme={TEST_THEME}
      wordHelp={
        wordHelp && {
          isActive: true,
          canReveal: (word) => word in GLOSSES,
          revealedGlossFor: () => undefined,
          onReveal: vi.fn(),
          ...wordHelp,
        }
      }
    />
  );
  return { onChangeOrder };
}

describe('SentenceBuilderDrill hint translations', () => {
  it('shows a translate icon only next to words that can be translated while the hint is open', () => {
    renderDrill({});
    expect(screen.getByRole('button', TRANSLATE_YEAR)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'תרגום המילה This' })).not.toBeInTheDocument();
  });

  it('shows no icons when the hint is closed or there is no help', () => {
    renderDrill({ isActive: false });
    expect(screen.queryByRole('button', TRANSLATE_YEAR)).not.toBeInTheDocument();
  });

  it('reveals the word without placing it in the sentence', async () => {
    const user = userEvent.setup();
    const onReveal = vi.fn();
    const { onChangeOrder } = renderDrill({ onReveal });
    await user.click(screen.getByRole('button', TRANSLATE_YEAR));
    expect(onReveal).toHaveBeenCalledWith('year');
    expect(onChangeOrder).not.toHaveBeenCalled();
  });

  it('keeps a revealed translation under the word', () => {
    renderDrill({ isActive: false, revealedGlossFor: (word) => GLOSSES[word] });
    expect(screen.getByText('שנה')).toBeInTheDocument();
  });
});

describe('SentenceBuilderDrill read-aloud (grades 1–2)', () => {
  function renderAloud(isReadingAloud: boolean, onSpeakEnglish = vi.fn(), onChangeOrder = vi.fn()) {
    render(
      <HebrewAudioContext.Provider value={isReadingAloud}>
        <SentenceBuilderDrill
          scrambledWords={['This', 'year', 'new']}
          selectedIndices={[]}
          isCompleted={false}
          onChangeOrder={onChangeOrder}
          onReset={vi.fn()}
          onCheck={vi.fn()}
          theme={TEST_THEME}
          onSpeakEnglish={onSpeakEnglish}
          wordHelp={{
            isActive: false,
            canReveal: () => false,
            revealedGlossFor: (word) => GLOSSES[word],
            onReveal: vi.fn(),
          }}
        />
      </HebrewAudioContext.Provider>
    );
    return { onSpeakEnglish, onChangeOrder };
  }

  it('reads a bank word aloud without placing it in the sentence', async () => {
    const user = userEvent.setup();
    const { onSpeakEnglish, onChangeOrder } = renderAloud(true);
    await user.click(screen.getByRole('button', { name: /הקשבה לתשובה: year/ }));
    expect(onSpeakEnglish).toHaveBeenCalledWith('year', expect.anything());
    expect(onChangeOrder).not.toHaveBeenCalled();
  });

  it('offers a listen button for a revealed translation', () => {
    renderAloud(true);
    expect(screen.getAllByRole('button', { name: 'הקשבה לתרגום' })).toHaveLength(2);
  });

  it('shows no listen buttons for the older grades', () => {
    renderAloud(false);
    expect(screen.queryByRole('button', { name: /הקשבה/ })).not.toBeInTheDocument();
  });
});
