import { findUid, readDocument } from './support/emulator';
import { expect, test } from './support/test';
import {
  completeOnboarding,
  exitMissionButton,
  expectDashboard,
  firstLessonDialog,
  GRADE_LABELS,
  register,
} from './support/app';

test.describe('onboarding, grade 3 and up', () => {
  test('a new grade 4 learner starts on their first mission, and leaving it goes on to the tour', async ({ page, learner }) => {
    await register(page, learner, '/', { name: 'נועה', age: 9 });
    await completeOnboarding(page, { name: 'נועה', age: 9 });

    await page.getByRole('button', { name: 'פתיחת תיבת המתנה' }).click();
    await page.getByRole('button', { name: /משימה ראשונה/ }).click();

    // The mission opened by itself (no lesson screen for the letters, no tour yet)
    await expect(exitMissionButton(page)).toBeVisible({ timeout: 20_000 });
    await expect(firstLessonDialog(page)).toHaveCount(0);
    await exitMissionButton(page).click();

    // Left unfinished: no first win, straight on to the tour and the placement offer
    await expect(page.getByRole('heading', { name: /כל הכבוד/ })).toHaveCount(0);
    await page.getByRole('dialog', { name: 'סיור באפליקציה' }).getByRole('button', { name: 'דילוג' }).click();
    await page.getByRole('button', { name: 'דילוג על מבחן הרמה' }).click();
    await expectDashboard(page);
  });
});

test.describe('onboarding', () => {
  test('a new learner says who they are on the sign-in screen, and it is saved to the cloud', async ({ page, learner }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
    const gate = page.getByRole('dialog', { name: 'התחברות' });
    await gate.getByRole('button', { name: /חדש\/ה כאן/ }).click();

    // Under 13: the form waits for the name, then for a parent's consent
    await gate.getByRole('button', { name: 'המשך' }).click();
    await expect(gate.getByText(/כתבי את השם שלך/)).toBeVisible();
    await gate.getByLabel('איך קוראים לך?').fill('עידו');
    await gate.getByRole('button', { name: /בן/ }).click();
    await gate.getByRole('button', { name: GRADE_LABELS[0] }).click();
    await gate.getByRole('button', { name: 'המשך' }).click();
    await expect(gate.getByText(/צריך שהורה יאשר/)).toBeVisible();
    await gate.getByRole('checkbox', { name: /אני הורה וקראתי/ }).check();
    await gate.getByRole('button', { name: 'המשך' }).click();

    // A username made from the name is offered; the learner picks the secret code
    await expect(gate.getByLabel(/שם משתמש/)).toHaveValue(/^[a-z]+\d{2}$/);
    await gate.getByLabel(/שם משתמש/).fill(learner.username);
    await gate.getByLabel(/^(בחר )?קוד סודי/).fill(learner.pin);
    await gate.getByRole('button', { name: /יצירת חשבון/ }).click();

    // No first-run form: the first launch speaks to a boy, then the home screen shows his grade
    await expect(page.getByText(/ברוך הבא/)).toBeVisible({ timeout: 20_000 });

    // Grade 1: the chest, then the first letters lesson (nothing to answer); finishing it starts the streak
    await page.getByRole('button', { name: 'פתיחת תיבת המתנה' }).click();
    await page.getByRole('button', { name: /נלמד אותיות/ }).click();
    const lesson = firstLessonDialog(page);
    await expect(lesson).toBeVisible();
    await lesson.getByRole('button', { name: 'הבא' }).click();
    await lesson.getByRole('button', { name: /סיימנו/ }).click();
    // The first win: a celebration with the first streak day, and (where the browser can) the reminder ask
    await expect(page.getByRole('heading', { name: /כל הכבוד/ })).toBeVisible();
    await expect(page.getByText(/יום 1 ברצף/)).toBeVisible();    await page.getByRole('button', { name: /^(ממשיכים|לא עכשיו)$/ }).click();
    await page.getByRole('dialog', { name: 'סיור באפליקציה' }).getByRole('button', { name: 'דילוג' }).click();
    await page.getByRole('button', { name: 'דילוג על מבחן הרמה' }).click();
    await expectDashboard(page);
    // The grade label sits in the map peek, which wide screens hide; the map itself is always there
    await expect(page.locator('#mission-map')).toBeVisible();

    const uid = await findUid(learner.username);
    await expect
      .poll(async () => readDocument(`learners/${uid}`))
      .toMatchObject({
        isOnboarded: true,
        name: 'עידו',
        gender: 'boy',
        age: 6,
        gradeId: 'grade-1',
        themeId: 'cozy-studio',
        isShabbatObserver: false,
        hasSeenWelcomeGiftModal: true,
        stats: { streakDays: 1 },
      });
  });
});
