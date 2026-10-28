import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { makeProfile } from '../../test/fixtures';
import { SettingsView } from './SettingsView';
import { ProAccessContext } from '../../hooks/useProAccess';
import { getProAccess } from '../../data/proGate';

vi.mock('../../services/firebase', () => ({
  auth: { currentUser: null },
  isFirebaseConfigured: false,
  getAppCheckToken: async () => null,
}));
vi.mock('./AccountPrivacyCard', () => ({ AccountPrivacyCard: () => <div>account-card</div> }));
vi.mock('./ParentLinkCard', () => ({ ParentLinkCard: () => <div>parent-card</div> }));
vi.mock('./StreakReminderCard', () => ({ StreakReminderCard: () => <div>reminder-card</div> }));
vi.mock('./VoiceLabCard', () => ({ VoiceLabCard: () => <div>voice-card</div> }));

function renderSettings(overrides = {}, proAccess = getProAccess(false)) {
  const onProfileChange = vi.fn();
  const onClose = vi.fn();
  const profile = makeProfile({ name: 'נועה', age: 14, gender: 'girl', gradeId: 'grade-8', ...overrides });
  render(
    <ProAccessContext.Provider value={proAccess}>
      <SettingsView
        profile={profile}
        onProfileChange={onProfileChange}
        onClose={onClose}
        onSignOut={async () => {}}
        onDeleteAccount={async () => ({ ok: true, value: undefined })}
      />
    </ProAccessContext.Provider>
  );
  return { onProfileChange, onClose, profile };
}

describe('SettingsView', () => {
  it('shows the profile tab first and no save button', () => {
    renderSettings();

    expect(screen.getByRole('tab', { name: /פרופיל/ })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: /פרופיל/ })).toBeVisible();
    expect(screen.queryByRole('button', { name: /שמירת שינויים/ })).not.toBeInTheDocument();
  });

  it('switches tabs and shows only that tab\'s panel', async () => {
    const user = userEvent.setup();
    renderSettings();

    await user.click(screen.getByRole('tab', { name: /חברים/ }));

    expect(screen.getByRole('tabpanel', { name: /חברים/ })).toBeVisible();
    expect(screen.queryByRole('tabpanel', { name: /פרופיל/ })).not.toBeInTheDocument();
  });

  it('previews a Pro theme for a free learner without saving it', async () => {
    const user = userEvent.setup();
    const { onProfileChange } = renderSettings({ themeId: 'cozy-studio' }, getProAccess(false, true));

    await user.click(screen.getByRole('tab', { name: /עיצוב/ }));
    await user.click(screen.getByRole('button', { name: /^Pop, זמין ב-Pro$/ }));

    expect(screen.getByText(/תצוגה מקדימה/)).toBeInTheDocument();
    expect(onProfileChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'חזרה לעיצוב שלי' }));
    expect(screen.queryByText(/תצוגה מקדימה/)).not.toBeInTheDocument();
    expect(onProfileChange).not.toHaveBeenCalled();
  });

  it('saves a free theme at once for a free learner', async () => {
    const user = userEvent.setup();
    const { onProfileChange } = renderSettings({ themeId: 'cozy-studio' }, getProAccess(false, true));

    await user.click(screen.getByRole('tab', { name: /עיצוב/ }));
    await user.click(screen.getByRole('button', { name: /^Street$/ }));

    expect(onProfileChange).toHaveBeenCalledWith(expect.objectContaining({ themeId: 'urban-night' }));
  });

  it('saves a new theme at once', async () => {
    const user = userEvent.setup();
    const { onProfileChange } = renderSettings();

    await user.click(screen.getByRole('tab', { name: /עיצוב/ }));
    const themeButtons = screen.getAllByRole('button', { pressed: false });
    await user.click(themeButtons[0]);

    expect(onProfileChange).toHaveBeenCalledTimes(1);
  });

  it('saves a chosen mascot, which stays on the current theme', async () => {
    const user = userEvent.setup();
    const { onProfileChange } = renderSettings({ themeId: 'cozy-studio' });

    await user.click(screen.getByRole('tab', { name: /עיצוב/ }));
    expect(screen.getByRole('button', { name: 'Mochi the Cat' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Comet (Star Fox)' }));

    expect(onProfileChange).toHaveBeenCalledTimes(1);
    expect(onProfileChange.mock.calls[0][0]).toMatchObject({ themeId: 'cozy-studio', companionId: 'comet' });
  });

  it('saves a different grade from the dropdown', async () => {
    const user = userEvent.setup();
    const { onProfileChange } = renderSettings();

    await user.click(screen.getByRole('combobox', { name: /כיתה/ }));
    await user.click(screen.getByRole('option', { name: 'כיתה ט׳' }));

    expect(onProfileChange).toHaveBeenCalledTimes(1);
    expect(onProfileChange.mock.calls[0][0]).toMatchObject({ gradeId: 'grade-9', schoolGradeId: 'grade-9' });
  });

  it('does not save when the choice is already the saved one', async () => {
    const user = userEvent.setup();
    const { onProfileChange } = renderSettings();

    await user.click(screen.getByRole('combobox', { name: /כיתה/ }));
    await user.click(screen.getByRole('option', { name: 'כיתה ח׳' }));

    expect(onProfileChange).not.toHaveBeenCalled();
  });

  it('does not save an empty name and says why', async () => {
    const user = userEvent.setup();
    const { onProfileChange } = renderSettings();

    const nameInput = screen.getByRole('textbox');
    await user.clear(nameInput);
    await user.tab();

    expect(onProfileChange).not.toHaveBeenCalled();
    expect(screen.getByText(/כתבי את השם שלך/)).toBeInTheDocument();
  });

  it('saves a changed name when the field loses focus', async () => {
    const user = userEvent.setup();
    const { onProfileChange } = renderSettings();

    const nameInput = screen.getByRole('textbox');
    await user.clear(nameInput);
    await user.type(nameInput, 'מיכל');
    await user.tab();

    expect(onProfileChange).toHaveBeenCalledTimes(1);
    expect(onProfileChange.mock.calls[0][0]).toMatchObject({ name: 'מיכל' });
  });

  it('waits for a parent before turning the friends hub on for a child', async () => {
    const user = userEvent.setup();
    const { onProfileChange } = renderSettings({ age: 10 });

    await user.click(screen.getByRole('tab', { name: /חברים/ }));
    await user.click(screen.getByRole('button', { name: /מרכז החברים כבוי/ }));
    expect(onProfileChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('checkbox', { name: /אני הורה ומאשר/ }));
    expect(onProfileChange).toHaveBeenCalledTimes(1);
  });

  it('saves a pending name before going back', async () => {
    const user = userEvent.setup();
    const { onProfileChange, onClose } = renderSettings();

    const nameInput = screen.getByRole('textbox');
    await user.clear(nameInput);
    await user.type(nameInput, 'דנה');
    await user.click(screen.getByRole('button', { name: 'חזרה לדשבורד' }));

    expect(onProfileChange).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalled();
  });
});
