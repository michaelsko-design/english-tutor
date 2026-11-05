import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { NameItemPanel } from './NameItemPanel';

vi.mock('./ItemIcon', () => ({ ItemIcon: () => null }));

const ITEM = { id: 'sofa', emoji: '🛋️', nameEn: 'sofa', nameHe: 'ספה' };
const onNamed = vi.fn();
const onCancel = vi.fn();
const onSpeakEnglish = vi.fn();

function setup(props: Partial<React.ComponentProps<typeof NameItemPanel>> = {}) {
  render(
    <NameItemPanel
      item={ITEM}
      gender="boy"
      theme={TEST_THEME}
      modes={['choose']}
      distractorNames={['chair', 'table']}
      goalHe="כדי להניח בחדר: ספה"
      nextLabel="המשך"
      onSpeakEnglish={onSpeakEnglish}
      onNamed={onNamed}
      onCancel={onCancel}
      {...props}
    />
  );
  return userEvent.setup();
}

beforeEach(() => {
  onNamed.mockClear();
  onCancel.mockClear();
  onSpeakEnglish.mockClear();
});

describe('NameItemPanel', () => {
  it('states the goal and the Hebrew meaning, addressed by gender', () => {
    setup();
    expect(screen.getByRole('region', { name: 'כדי להניח בחדר: ספה' })).toBeInTheDocument();
    expect(screen.getByText(/בחר את השם באנגלית/)).toBeInTheDocument();
    expect(screen.getByText('פירוש: ספה')).toBeInTheDocument();
  });

  it('a wrong pick gives a retry hint and does not name the item', async () => {
    const user = setup();
    await user.click(screen.getByText('chair'));
    expect(screen.getByText(/לא זה/)).toBeInTheDocument();
    expect(onNamed).not.toHaveBeenCalled();
  });

  it('the right pick names the item, hides cancel and continues with the method', async () => {
    const user = setup();
    await user.click(screen.getByText('sofa'));
    expect(screen.getByText(/נכון! ספה = sofa/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ביטול' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /המשך/ }));
    expect(onNamed).toHaveBeenCalledWith('choose');
  });

  it('cancel leaves without naming', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'ביטול' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('switches between the naming methods and reads the word aloud for spelling', async () => {
    const user = setup({ modes: ['choose', 'spell'] });
    await user.click(screen.getByRole('button', { name: /Spell it/ }));
    expect(screen.getByRole('button', { name: /Spell it/ })).toHaveAttribute('aria-pressed', 'true');
    expect(onSpeakEnglish).toHaveBeenCalledWith('sofa', 0.85);
    await user.click(screen.getByRole('button', { name: /רמז/ }));
    expect(screen.queryByRole('button', { name: /רמז 💡/ })).not.toBeInTheDocument();
  });

  it('addresses a girl in the feminine', () => {
    setup({ gender: 'girl', modes: ['choose', 'spell'] });
    expect(screen.getByText(/בחרי או אייתי/)).toBeInTheDocument();
  });
});
