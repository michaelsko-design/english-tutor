import { describe, expect, it } from 'vitest';
import { PRIVACY_UPDATED_HE, SUPPORT_PHONE_DISPLAY, SUPPORT_WHATSAPP_NUMBER } from './appInfo';
import {
  PRIVACY_CONTROLLER_SECTION_TITLE_HE,
  PRIVACY_NOTICE_SECTIONS,
  privacyNoticeSections,
  PRO_PAYMENTS_SECTION_TITLE_HE,
  splitNoticeLine,
} from './privacyNotice';

const titles = (sections: ReturnType<typeof privacyNoticeSections>) => sections.map((section) => section.titleHe);

describe('privacyNoticeSections', () => {
  it('explains Pro payments, after what parents see, once Pro can be bought', () => {
    const shown = titles(privacyNoticeSections(true));
    expect(shown.indexOf(PRO_PAYMENTS_SECTION_TITLE_HE)).toBe(shown.indexOf('מה הורים רואים') + 1);
    expect(privacyNoticeSections(true)).toEqual(PRIVACY_NOTICE_SECTIONS);
  });

  it('leaves the payments section out while Pro cannot be bought', () => {
    expect(titles(privacyNoticeSections(false))).not.toContain(PRO_PAYMENTS_SECTION_TITLE_HE);
  });

  it('opens with the controller, the date, voluntary disclosure and the §13–14 rights', () => {
    const [first] = PRIVACY_NOTICE_SECTIONS;
    const opening = first.bodyHe.join(' ');
    expect(first.titleHe).toBe(PRIVACY_CONTROLLER_SECTION_TITLE_HE);
    expect(opening).toContain(PRIVACY_UPDATED_HE);
    expect(opening).toContain('310720370');
    expect(opening).toContain('אין חובה חוקית');
    const rights = PRIVACY_NOTICE_SECTIONS.find((section) => section.titleHe === 'הזכויות שלכם')?.bodyHe.join(' ') ?? '';
    expect(rights).toMatch(/סעיף 13.*סעיף 14/);
  });

  it('shows no draft brackets, no religious wording and no false "no device id" claim', () => {
    const all = PRIVACY_NOTICE_SECTIONS.flatMap((section) => section.bodyHe).join(' ');
    expect(all).not.toMatch(/[[\]]/);
    expect(all).not.toContain('שומר שבת');
    expect(all).not.toContain('בלי מזהה מכשיר');
  });

  it('keeps the support phone in step with the WhatsApp number', () => {
    expect(SUPPORT_WHATSAPP_NUMBER.slice(3)).toBe(SUPPORT_PHONE_DISPLAY.replace(/\D/g, '').slice(1));
  });

  it('names who handles the payment details, and shows no draft brackets', () => {
    const payments = PRIVACY_NOTICE_SECTIONS.find((section) => section.titleHe === PRO_PAYMENTS_SECTION_TITLE_HE);
    const text = payments?.bodyHe.join(' ') ?? '';
    expect(text).toContain('Grow');
    expect(text).toContain('Make');
    expect(text).not.toMatch(/[[\]]/);
  });

  it('says the statistics switch is in the learner settings, not in the parent portal', () => {
    const stats = PRIVACY_NOTICE_SECTIONS.find((section) => section.titleHe === 'סטטיסטיקות שימוש')?.bodyHe.join(' ') ?? '';
    expect(stats).toContain('בהגדרות של הלומד/ת באפליקציה, בלשונית ״חשבון״');
    expect(stats).toContain('לפורטל ההורים אין הגדרה כזו');
  });
});

describe('splitNoticeLine', () => {
  it('turns a web address into a link and keeps the text around it', () => {
    expect(splitNoticeLine('מדיניות הפרטיות של Grow: https://grow.business/privacy-policy/')).toEqual([
      { kind: 'text', text: 'מדיניות הפרטיות של Grow: ' },
      { kind: 'link', href: 'https://grow.business/privacy-policy/' },
    ]);
  });

  it('leaves a final full stop out of the link, and a line with no address as text', () => {
    expect(splitNoticeLine('ראו https://example.com/a.')).toEqual([
      { kind: 'text', text: 'ראו ' },
      { kind: 'link', href: 'https://example.com/a' },
      { kind: 'text', text: '.' },
    ]);
    expect(splitNoticeLine('בלי קישור')).toEqual([{ kind: 'text', text: 'בלי קישור' }]);
  });
});
