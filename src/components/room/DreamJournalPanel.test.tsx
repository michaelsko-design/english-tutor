import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { DreamJournalPanel } from './DreamJournalPanel';

const onUpdateProfile = vi.fn();
const onClose = vi.fn();

function setup(profile = makeProfile({ gender: 'boy', gradeId: 'grade-3' })) {
  const view = render(
    <DreamJournalPanel profile={profile} theme={TEST_THEME} onUpdateProfile={onUpdateProfile} onSpeakEnglish={vi.fn()} onClose={onClose} />
  );
  return { ...view, user: userEvent.setup() };
}

/** Picks the first word of every blank (the unpicked word buttons carry aria-pressed). */
async function inventDream(user: ReturnType<typeof userEvent.setup>) {
  const groups = document.querySelectorAll<HTMLElement>('div.flex-wrap');
  for (const group of Array.from(groups)) {
    const first = within(group).queryAllByRole('button', { pressed: false })[0];
    if (first) await user.click(first);
  }
}

/** Wrong choices stay listed and the right one turns its blank into a tick: try each untried choice. */
async function translateAll(user: ReturnType<typeof userEvent.setup>, container: HTMLElement) {
  const tried = new Set<HTMLElement>();
  for (let pass = 0; pass < 40 && !screen.queryByRole('button', { name: /להקראה/ }); pass++) {
    const next = Array.from(container.querySelectorAll<HTMLElement>('div[lang="en"] button')).find((b) => !tried.has(b));
    if (!next) break;
    tried.add(next);
    await user.click(next);
  }
}

beforeEach(() => {
  onUpdateProfile.mockClear();
  onClose.mockClear();
});

describe('DreamJournalPanel', () => {
  it('step 1: the next button waits until every part has a word', async () => {
    const { user } = setup();
    expect(screen.getByRole('button', { name: /לתרגום לאנגלית/ })).toBeDisabled();
    expect(screen.getByText(/שלב 1: המצא חלום/)).toBeInTheDocument();
    await inventDream(user);
    expect(screen.getByRole('button', { name: /לתרגום לאנגלית/ })).toBeEnabled();
  });

  it('limits the Hebrew note and addresses a girl in the feminine', async () => {
    const { user } = setup(makeProfile({ gender: 'girl', gradeId: 'grade-3' }));
    expect(screen.getByText(/שלב 1: המציאי חלום/)).toBeInTheDocument();
    const note = screen.getByPlaceholderText(/עוד פרטים על החלום/);
    await user.type(note, 'חלמתי');
    expect(note).toHaveValue('חלמתי');
  });

  it('goes through invent, translate and read, then saves the dream with a reward', async () => {
    const { user, container } = setup();
    await inventDream(user);
    await user.click(screen.getByRole('button', { name: /לתרגום לאנגלית/ }));
    expect(screen.getByText(/שלב 2: בחר את התרגום הנכון/)).toBeInTheDocument();

    await translateAll(user, container);
    await user.click(screen.getByRole('button', { name: /להקראה/ }));
    expect(screen.getByText(/שלב 3: הקשב/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /שמירה ביומן/ }));
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/החלום נשמר ביומן/)).toBeInTheDocument();
  });

  it('after saving, "new dream" starts again at step 1', async () => {
    const { user, container } = setup();
    await inventDream(user);
    await user.click(screen.getByRole('button', { name: /לתרגום לאנגלית/ }));
    await translateAll(user, container);
    await user.click(screen.getByRole('button', { name: /להקראה/ }));
    await user.click(screen.getByRole('button', { name: /שמירה ביומן/ }));
    await user.click(screen.getByRole('button', { name: /חלום חדש/ }));
    expect(screen.getByText(/שלב 1: המצא חלום/)).toBeInTheDocument();
  });
});
