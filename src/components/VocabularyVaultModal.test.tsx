import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CURRICULUM_BY_GRADE } from '../test/curriculum';
import { TEST_THEME } from '../test/fixtures';
import { VocabularyVaultModal } from './VocabularyVaultModal';

const units = CURRICULUM_BY_GRADE['grade-1'].units;
const words = units.flatMap((u) => u.missions.flatMap((m) => m.vocabulary));
/** A word whose English and Hebrew appear only once in the grade, so a search finds just it */
const isUnique = (w: (typeof words)[number]) =>
  words.filter((o) => o.translationHe === w.translationHe || o.wordEn === w.wordEn).length === 1 &&
  !words.some((o) => o !== w && (o.wordEn.toLowerCase().includes(w.wordEn.toLowerCase()) || o.exampleEn.toLowerCase().includes(w.wordEn.toLowerCase())));
const [target, other] = words.filter(isUnique);

function renderVault() {
  const onClose = vi.fn();
  render(
    <VocabularyVaultModal
      units={units}
      gender="girl"
      learnerName="נועה"
      theme={TEST_THEME}
      onSpeakEnglish={() => {}}
      onEarnPracticeReward={() => true}
      onClose={onClose}
    />
  );
  return { onClose };
}

describe('VocabularyVaultModal', () => {
  it('shows every word of the grade at first', () => {
    renderVault();

    expect(screen.getByRole('dialog', { name: 'כספת המילים' })).toBeInTheDocument();
    expect(screen.getByText(target.translationHe)).toBeInTheDocument();
    expect(screen.getByText(other.translationHe)).toBeInTheDocument();
  });

  it.each([
    ['English', () => target.wordEn.toUpperCase()],
    ['Hebrew', () => target.translationHe],
  ])('finds a word by its %s', async (_lang, query) => {
    const user = userEvent.setup();
    renderVault();

    await user.type(screen.getByRole('textbox', { name: 'חיפוש מילה' }), query());

    expect(screen.getByText(target.translationHe)).toBeInTheDocument();
    expect(screen.queryByText(other.translationHe)).not.toBeInTheDocument();
  });

  it('clears the practice result by itself after a few seconds', async () => {
    class FakeRecognition {
      onresult: ((event: unknown) => void) | null = null;
      start() {
        this.onresult?.({ results: [[{ transcript: target.wordEn }]] });
      }
      abort() {}
    }
    vi.stubGlobal('webkitSpeechRecognition', FakeRecognition);
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderVault();
      await user.type(screen.getByRole('textbox', { name: 'חיפוש מילה' }), target.wordEn);

      // The search also matches other cards' sentences: practice the target's own card
      let card = screen.getByText(target.wordEn, { exact: true }).parentElement;
      while (card && !within(card).queryByRole('button', { name: /תרגלי הגייה/ })) {
        card = card.parentElement;
      }
      await user.click(within(card!).getByRole('button', { name: /תרגלי הגייה/ }));
      expect(screen.getByRole('status')).toHaveTextContent('בצורה מושלמת');

      act(() => {
        vi.advanceTimersByTime(6100);
      });
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
      vi.unstubAllGlobals();
    }
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const { onClose } = renderVault();

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
