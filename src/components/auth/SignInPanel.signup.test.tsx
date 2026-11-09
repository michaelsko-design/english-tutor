import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveTheme } from '../../themes/themeRegistry';
import { clearSignupDraft, takeSignupDraft } from '../../data/signupDraft';
import { SignInPanel } from './SignInPanel';

const theme = resolveTheme('cozy-studio');

function setup() {
  const onSubmitCredentials = vi.fn();
  render(
    <SignInPanel
      theme={theme}
      isBusy={false}
      showAudienceSwitch={false}
      isUsernameTaken={false}
      messages={null}
      onGoogle={vi.fn()}
      onSubmitCredentials={onSubmitCredentials}
      onClearMessages={vi.fn()}
    />
  );
  return { onSubmitCredentials, user: userEvent.setup() };
}

const startNew = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole('button', { name: /חדש\/ה כאן/ }));

describe('SignInPanel: a new learner', () => {
  afterEach(clearSignupDraft);

  it('says who they are first, and the account form comes after', async () => {
    const { user } = setup();
    await startNew(user);

    expect(screen.getByPlaceholderText('למשל: נועה')).toBeInTheDocument();
    expect(screen.queryByLabelText(/שם משתמש/)).not.toBeInTheDocument();
  });

  it('suggests a username made from the name and keeps the answers for the app', async () => {
    const { user } = setup();
    await startNew(user);
    await user.type(screen.getByPlaceholderText('למשל: נועה'), 'נועה');
    await user.click(screen.getByRole('button', { name: 'כיתה י׳' }));
    await user.click(screen.getByRole('button', { name: 'המשך' }));

    expect((screen.getByLabelText(/שם משתמש/) as HTMLInputElement).value).toMatch(/^noa\d{2}$/);
    expect(takeSignupDraft()).toEqual({ name: 'נועה', gender: 'girl', gradeId: 'grade-10', hasParentConsent: false });
  });

  it('waits for a parent in grades 1-7', async () => {
    const { user } = setup();
    await startNew(user);
    await user.type(screen.getByPlaceholderText('למשל: נועה'), 'דני');
    await user.click(screen.getByRole('button', { name: 'כיתה ב׳' }));
    await user.click(screen.getByRole('button', { name: 'המשך' }));

    expect(screen.getByText(/מתחת לגיל 13/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/שם משתמש/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'המשך' }));
    expect(screen.getByLabelText(/שם משתמש/)).toBeInTheDocument();
    expect(takeSignupDraft()).toMatchObject({ gradeId: 'grade-2', hasParentConsent: true });
  });

  it('offers another suggestion', async () => {
    const { user } = setup();
    await startNew(user);
    await user.type(screen.getByPlaceholderText('למשל: נועה'), 'Dan');
    await user.click(screen.getByRole('button', { name: 'כיתה י׳' }));
    await user.click(screen.getByRole('button', { name: 'המשך' }));

    await user.click(screen.getByRole('button', { name: 'שם אחר' }));
    expect((screen.getByLabelText(/שם משתמש/) as HTMLInputElement).value).toMatch(/^dan\d{2}$/);
  });

  it('drops the answers when the learner goes back to sign in instead', async () => {
    const { user } = setup();
    await startNew(user);
    await user.type(screen.getByPlaceholderText('למשל: נועה'), 'נועה');
    await user.click(screen.getByRole('button', { name: 'כיתה י׳' }));
    await user.click(screen.getByRole('button', { name: 'המשך' }));
    await user.click(screen.getByRole('button', { name: 'חזרה' }));
    await user.click(screen.getByRole('button', { name: 'חזרה' }));
    await user.click(screen.getByRole('button', { name: /כבר רשום\/ה/ }));

    expect(takeSignupDraft()).toBeNull();
  });
});
