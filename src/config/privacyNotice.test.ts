import { describe, expect, it } from 'vitest';
import { PRIVACY_NOTICE_SECTIONS, privacyNoticeSections, PRO_PAYMENTS_SECTION_TITLE_HE } from './privacyNotice';

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

  it('names who handles the payment details, and shows no draft brackets', () => {
    const payments = PRIVACY_NOTICE_SECTIONS.find((section) => section.titleHe === PRO_PAYMENTS_SECTION_TITLE_HE);
    const text = payments?.bodyHe.join(' ') ?? '';
    expect(text).toContain('Grow');
    expect(text).toContain('Make');
    expect(text).not.toMatch(/[[\]]/);
  });
});
