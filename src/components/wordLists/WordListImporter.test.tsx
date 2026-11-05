import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_ITEMS_PER_LIST } from '../../data/customWordLists';
import { TEST_THEME } from '../../test/fixtures';
import type { CustomWordList } from '../../types/learner';
import { WordListImporter } from './WordListImporter';

vi.mock('../../hooks/useGradeCurricula', () => ({ useGradeCurricula: () => ({ status: 'ready', retry: vi.fn() }) }));

const onSave = vi.fn();
const onClose = vi.fn();

function setup(gender: 'girl' | 'boy' = 'girl') {
  render(<WordListImporter gender={gender} theme={TEST_THEME} onSave={onSave} onClose={onClose} />);
  return userEvent.setup();
}

const box = () => screen.getByRole('textbox', { name: /המילים מהדף/ });
const saveButton = () => screen.getByRole('button', { name: /שמירת הרשימה|צריך לפחות/ });

// userEvent treats "{" and "[" as key syntax, so paste is used for the worksheet text
async function paste(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.click(box());
  await user.paste(text);
}

beforeEach(() => {
  onSave.mockClear();
  onClose.mockClear();
});

describe('WordListImporter', () => {
  it('cannot save until there are enough items', () => {
    setup();
    expect(saveButton()).toBeDisabled();
    expect(saveButton()).toHaveTextContent('צריך לפחות 3');
  });

  it('reads one word or sentence per line and shows a preview with the counts', async () => {
    const user = setup();
    await paste(user, '1. window - חלון\n2. blanket - שמיכה\n3. pillow\nI sleep in my bed every night.');
    expect(screen.getByText(/נמצאו 4 פריטים \(3 מילים, 1 משפטים\)/)).toBeInTheDocument();
    const preview = screen.getByRole('list', { name: 'תצוגה מקדימה' });
    expect(preview).toHaveTextContent('window');
    expect(preview).toHaveTextContent('חלון');
    expect(saveButton()).toBeEnabled();
  });

  it('says which lines were left out and why', async () => {
    const user = setup();
    await paste(user, 'window\nwindow\nblanket\npillow\n!!!');
    expect(screen.getByText('שורות שלא נכנסו לרשימה:')).toBeInTheDocument();
  });

  it('saves the list with the typed title', async () => {
    const user = setup();
    await user.type(screen.getByRole('textbox', { name: /שם הרשימה/ }), 'מבחן פרקים');
    await paste(user, 'window\nblanket\npillow');
    await user.click(saveButton());
    expect(onSave).toHaveBeenCalledTimes(1);
    const list = onSave.mock.calls[0][0] as CustomWordList;
    expect(list.title).toBe('מבחן פרקים');
    expect(list.items.map((i) => i.textEn)).toEqual(['window', 'blanket', 'pillow']);
  });

  it('saves with the default title when none is typed', async () => {
    const user = setup();
    await paste(user, 'window\nblanket\npillow');
    await user.click(saveButton());
    expect((onSave.mock.calls[0][0] as CustomWordList).title.length).toBeGreaterThan(0);
  });

  it('stops at the maximum list length and reports the rest', async () => {
    const user = setup();
    const words = Array.from({ length: MAX_ITEMS_PER_LIST + 2 }, (_, i) => `word${String.fromCharCode(97 + (i % 26))}${String.fromCharCode(97 + Math.floor(i / 26))}`);
    await paste(user, words.join('\n'));
    expect(screen.getByText(new RegExp(`נמצאו ${MAX_ITEMS_PER_LIST} פריטים`))).toBeInTheDocument();
    expect(screen.getByText('שורות שלא נכנסו לרשימה:')).toBeInTheDocument();
  });

  it('uses masculine copy for a boy', () => {
    setup('boy');
    expect(screen.getByText(/העתק את הרשימה/)).toBeInTheDocument();
  });

  it('closes', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /סגירה|סגור/ }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
