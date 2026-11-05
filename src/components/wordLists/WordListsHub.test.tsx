import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import type { CustomWordList } from '../../types/learner';
import { WordListsHub } from './WordListsHub';

const proState = vi.hoisted(() => ({ isPro: false }));
const openProUpsell = vi.hoisted(() => vi.fn());

vi.mock('../../hooks/useProAccess', () => ({ useProAccess: () => ({ ...proState }) }));
vi.mock('../../data/proGate', () => ({
  hasFullAccess: () => proState.isPro,
  maxWordLists: () => (proState.isPro ? 10 : 1),
}));
vi.mock('../pro/proUpsellContext', () => ({ useOpenProUpsell: () => openProUpsell }));
vi.mock('./WordListImporter', () => ({
  WordListImporter: ({ onClose }: { onClose: () => void }) => (
    <button type="button" onClick={onClose}>
      importer-stub
    </button>
  ),
}));
vi.mock('./WordListSessionRunner', () => ({
  WordListSessionRunner: ({ list, onClose }: { list: CustomWordList; onClose: () => void }) => (
    <button type="button" onClick={onClose}>
      {`session-${list.id}`}
    </button>
  ),
}));

const LIST: CustomWordList = {
  id: 'l1',
  title: 'פירות',
  createdAt: '2026-11-01T10:00:00.000Z',
  bestScore: 80,
  items: [
    { id: 'w1', textEn: 'apple', kind: 'word' },
    { id: 'w2', textEn: 'pear', kind: 'word' },
    { id: 'w3', textEn: 'plum', kind: 'word' },
  ],
};

const onUpdateProfile = vi.fn();

function setup(lists: CustomWordList[] = [LIST]) {
  render(
    <WordListsHub
      profile={makeProfile({ customWordLists: lists })}
      theme={TEST_THEME}
      onUpdateProfile={onUpdateProfile}
      onSpeakEnglish={vi.fn()}
    />
  );
  return userEvent.setup();
}

const openSheet = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: 'רשימות מילים' }));

beforeEach(() => {
  proState.isPro = false;
  onUpdateProfile.mockClear();
  openProUpsell.mockClear();
});

describe('WordListsHub', () => {
  it('shows only the dock tile until it is tapped, then lists the saved lists', async () => {
    const user = setup();
    expect(screen.queryByText('פירות')).not.toBeInTheDocument();
    await openSheet(user);
    expect(screen.getByText('פירות')).toBeInTheDocument();
    expect(screen.getByText(/3 פריטים/)).toBeInTheDocument();
  });

  it('archives a list after the delete confirmation', async () => {
    const user = setup();
    await openSheet(user);
    await user.click(screen.getByRole('button', { name: 'מחיקת פירות' }));
    await user.click(screen.getByRole('button', { name: 'למחוק?' }));
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(onUpdateProfile.mock.calls[0][0].customWordLists[0]).toMatchObject({ id: 'l1', items: [] });
    expect(onUpdateProfile.mock.calls[0][0].customWordLists[0].archivedAt).toBeTruthy();
  });

  it('starts a practice session and returns to the lists when it closes', async () => {
    const user = setup();
    await openSheet(user);
    await user.click(screen.getByRole('button', { name: /תרגול/ }));
    await user.click(await screen.findByRole('button', { name: 'session-l1' }));
    expect(screen.getByText('פירות')).toBeInTheDocument();
  });

  it('opens the importer from the lists card and returns', async () => {
    const user = setup([]);
    await openSheet(user);
    await user.click(screen.getAllByRole('button', { name: /ייבוא|הוספת|הדבקת/ })[0]);
    await user.click(await screen.findByRole('button', { name: 'importer-stub' }));
    expect(screen.getByRole('button', { name: 'רשימות מילים' })).toBeInTheDocument();
  });

  it('offers Pro when the free list limit is reached', async () => {
    const user = setup();
    await openSheet(user);
    await user.click(screen.getByRole('button', { name: /Pro|פרו/ }));
    expect(openProUpsell).toHaveBeenCalledWith('lists');
  });
});
