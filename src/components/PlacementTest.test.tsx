import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PLACEMENT_QUESTION_COUNT } from '../data/placementTest';
import { makeProfile, TEST_THEME } from '../test/fixtures';
import { PlacementTest } from './PlacementTest';

const onFinish = vi.fn();
const onClose = vi.fn();

function setup(mode: 'onboarding' | 'on-demand' = 'on-demand') {
  render(
    <PlacementTest
      profile={makeProfile({ gender: 'boy', gradeId: 'grade-3' })}
      theme={TEST_THEME}
      mode={mode}
      onFinish={onFinish}
      onClose={onClose}
    />
  );
  return userEvent.setup();
}

beforeEach(() => {
  onFinish.mockClear();
  onClose.mockClear();
});

describe('PlacementTest', () => {
  it('asks whether the learner reads English first', () => {
    setup();
    expect(screen.getByText('האם אתה יודע לקרוא באנגלית?')).toBeInTheDocument();
  });

  it('a learner who cannot read yet gets the letters-first result', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'עוד לא' }));
    expect(screen.getByText(/מהאותיות/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /עדכן לפי ההמלצה|נמשיך|המשך/ }));
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish.mock.calls[0][1]).toBe(true);
  });

  it('skip closes the test while onboarding', async () => {
    const user = setup('onboarding');
    await user.click(screen.getByRole('button', { name: 'דילוג על מבחן הרמה' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('the intro can be declined with "not now"', async () => {
    const user = setup();
    await user.click(screen.getByText('כן, אני יודע לקרוא'));
    expect(screen.getByText(/מבחן רמה קצר/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'לא עכשיו' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('runs all the questions and reports a result', async () => {
    const user = setup();
    await user.click(screen.getByText('כן, אני יודע לקרוא'));
    await user.click(await screen.findByRole('button', { name: /בוא נתחיל/ }, { timeout: 20000 }));
    for (let i = 0; i < PLACEMENT_QUESTION_COUNT; i++) {
      await user.click(await screen.findByRole('button', { name: /לא יודע/ }));
      await user.click(screen.getByRole('button', { name: i === PLACEMENT_QUESTION_COUNT - 1 ? /לתוצאות/ : /הבא/ }));
    }
    await waitFor(() => expect(screen.queryByRole('button', { name: /לא יודע/ })).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'השאר את ההגדרות שלי' }));
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish.mock.calls[0][1]).toBe(false);
  }, 40000);
});
