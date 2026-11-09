import { expect, Locator, Page } from '@playwright/test';
import { TestLearner } from './emulator';

/** How long a cloud round trip (sign-in, the first profile load) may take */
const CLOUD_TIMEOUT_MS = 20_000;

export interface OnboardingChoices {
  name: string;
  /** The age picks the grade (6 → grade 1, 9 → grade 4) */
  age: number;
}

/** The chip labels of the onboarding form, grade 1 to 12 */
export const GRADE_LABELS = [
  'כיתה א׳', 'כיתה ב׳', 'כיתה ג׳', 'כיתה ד׳', 'כיתה ה׳', 'כיתה ו׳',
  'כיתה ז׳', 'כיתה ח׳', 'כיתה ט׳', 'כיתה י׳', 'כיתה י״א', 'כיתה י״ב',
];
const FIRST_GRADE_AGE = 6;
export const ONBOARDING_SUBMIT = /יאללה/;

const NAVIGATION_TIMEOUT_MS = 60_000;

/** Opens a page; the first load can time out while the dev server compiles under load, so it retries once. */
async function openPage(page: Page, url: string): Promise<void> {
  const options = { waitUntil: 'domcontentloaded', timeout: NAVIGATION_TIMEOUT_MS } as const;
  try {
    await page.goto(url, options);
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes('Timeout')) throw error;
    await page.goto(url, options);
  }
}

const DEFAULT_CHOICES: OnboardingChoices = { name: 'נועה', age: 9 };

/** The grade chip's accessible name for a learner of this age (age = grade + 5) */
const gradeLabelForAge = (age: number): string => GRADE_LABELS[age - FIRST_GRADE_AGE];

/** A new learner says who they are on the sign-in screen, before the account exists. */
async function fillWhoAreYou(gate: Locator, choices: OnboardingChoices): Promise<void> {
  await gate.getByLabel('איך קוראים לך?').fill(choices.name);
  await gate.getByRole('button', { name: gradeLabelForAge(choices.age) }).click();
  // Only a learner under the parent-approval age is asked for a parent's consent
  const consent = gate.getByRole('checkbox', { name: /אני הורה וקראתי/ });
  if (await consent.isVisible()) await consent.check();
  await gate.getByRole('button', { name: 'המשך' }).click();
}

async function submitAuthForm(
  page: Page,
  learner: TestLearner,
  mode: 'login' | 'register',
  choices: OnboardingChoices = DEFAULT_CHOICES
) {
  const gate = page.getByRole('dialog', { name: 'התחברות' });
  await gate.getByRole('button', { name: mode === 'register' ? /חדש\/ה כאן/ : /כבר רשום\/ה/ }).click();
  if (mode === 'register') await fillWhoAreYou(gate, choices);
  await gate.getByLabel(/שם משתמש/).fill(learner.username);
  await gate.getByLabel(/^(בחר )?קוד סודי/).fill(learner.pin);
  await gate.getByRole('button', { name: mode === 'register' ? /יצירת חשבון/ : /^כניסה$/ }).click();
}

/**
 * Opens a new account from the sign-in gate (`url` is where the page starts, e.g. an invite link).
 * The learner answers "who are you" there, so the first-run form is skipped.
 */
export async function register(
  page: Page,
  learner: TestLearner,
  url = '/',
  choices: OnboardingChoices = DEFAULT_CHOICES
): Promise<void> {
  await openPage(page, url);
  await submitAuthForm(page, learner, 'register', choices);
}

/** Signs an existing account in from the sign-in gate. */
export async function signIn(page: Page, learner: TestLearner, url = '/'): Promise<void> {
  await openPage(page, url);
  await submitAuthForm(page, learner, 'login');
}

/**
 * Gets past the first-run profile: nothing to do when the learner already answered on the sign-in
 * screen (the welcome chest is up); otherwise (a guest or Google account) fills the first-run form.
 */
export async function completeOnboarding(page: Page, choices: OnboardingChoices): Promise<void> {
  const nameInput = page.getByLabel('איך קוראים לך?');
  const welcomeChest = page.getByRole('button', { name: 'פתיחת תיבת המתנה' });
  await expect(nameInput.or(welcomeChest)).toBeVisible({ timeout: CLOUD_TIMEOUT_MS });
  if (await welcomeChest.isVisible()) return;
  await nameInput.fill(choices.name);
  // The form asks for the grade (age = grade + 5); the chip's accessible name is the full grade label
  await page.getByRole('button', { name: gradeLabelForAge(choices.age) }).click();
  // Only a learner under the parent-approval age is asked for a parent's consent
  const consent = page.getByRole('checkbox', { name: /אני הורה וקראתי/ });
  if (await consent.isVisible()) await consent.check();
  await page.getByRole('button', { name: ONBOARDING_SUBMIT }).click();
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
  await register(page, learner, '/', choices);
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
