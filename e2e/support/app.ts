import { expect, Locator, Page } from '@playwright/test';
import { TestLearner } from './emulator';

/** How long a cloud round trip (sign-in, the first profile load) may take */
const CLOUD_TIMEOUT_MS = 20_000;

export interface OnboardingChoices {
  name: string;
  /** The age picks the grade (6 → grade 1, 9 → grade 4) */
  age: number;
}

async function submitAuthForm(page: Page, learner: TestLearner, mode: 'login' | 'register') {
  const gate = page.getByRole('dialog', { name: 'התחברות' });
  await gate.getByRole('button', { name: mode === 'register' ? 'פתיחת חשבון חדש' : 'התחברות לחשבון קיים' }).click();
  await gate.getByLabel(/Username or Email/).fill(learner.username);
  await gate.getByLabel(/קוד סודי \/ סיסמה/).fill(learner.pin);
  await gate.getByRole('button', { name: mode === 'register' ? /יצירת חשבון/ : /התחברות וסנכרון/ }).click();
}

/** Opens a new account from the sign-in gate. */
export async function register(page: Page, learner: TestLearner): Promise<void> {
  await page.goto('/');
  await submitAuthForm(page, learner, 'register');
}

/** Signs an existing account in from the sign-in gate. */
export async function signIn(page: Page, learner: TestLearner): Promise<void> {
  await page.goto('/');
  await submitAuthForm(page, learner, 'login');
}

/** Fills the first-run profile form (a learner under 13, so a parent consents). */
export async function completeOnboarding(page: Page, choices: OnboardingChoices): Promise<void> {
  const nameInput = page.getByLabel('איך קוראים לך?');
  await expect(nameInput).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
  await nameInput.fill(choices.name);
  await page.getByLabel('גיל', { exact: true }).selectOption(String(choices.age));
  await page.getByRole('checkbox', { name: /אני הורה וקראתי/ }).check();
  await page.getByRole('button', { name: /שמירה וכניסה לדשבורד/ }).click();
}

/** The welcome chest, the app tour and the placement-test offer, skipped. */
export async function skipFirstLaunch(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'פתיחת תיבת המתנה' }).click();
  await page.getByRole('button', { name: /סיור קצר/ }).click();
  await page.getByRole('dialog', { name: 'סיור באפליקציה' }).getByRole('button', { name: 'דילוג' }).click();
  await page.getByRole('button', { name: 'דילוג על מבחן הרמה' }).click();
  await expectDashboard(page);
}

/** Register, onboard and skip the first-launch steps: a learner on the home screen. */
export async function startAsNewLearner(page: Page, learner: TestLearner, choices: OnboardingChoices): Promise<void> {
  await register(page, learner);
  await completeOnboarding(page, choices);
  await skipFirstLaunch(page);
}

/** The profile button: in the home HUD on wide screens, in the bottom bar on phones */
function profileButton(page: Page): Locator {
  return page.getByRole('button', { name: /^פרופיל( והגדרות)?$/ }).filter({ visible: true }).first();
}

export async function expectDashboard(page: Page): Promise<void> {
  await expect(profileButton(page)).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
}

/** The diamonds shown on the home HUD ("50 יהלומי פסטל. פתיחת החנות") */
export async function readHudDiamonds(page: Page): Promise<number> {
  const label = await page.getByRole('button', { name: /פתיחת החנות/ }).getAttribute('aria-label');
  const match = label?.match(/\d+/);
  if (!match) throw new Error(`no diamonds in "${label}"`);
  return Number(match[0]);
}

/** Opens the settings on the account tab (sign-out and account deletion). */
export async function openSettings(page: Page): Promise<void> {
  await profileButton(page).click();
  await page.getByRole('tab', { name: /חשבון/ }).click();
  await expect(page.getByRole('button', { name: 'התנתקות מהחשבון' })).toBeVisible();
}

export async function signOutFromSettings(page: Page): Promise<void> {
  await openSettings(page);
  await page.getByRole('button', { name: 'התנתקות מהחשבון' }).click();
  await expect(page.getByRole('dialog', { name: 'התחברות' })).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
}
