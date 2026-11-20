import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PRO_PRICES_AGOROT } from '../config/proTier';
import { MAX_ACTIVE_LISTS } from '../data/customWordLists';
import { PRIVACY_NOTICE_SECTIONS } from '../config/privacyNotice';
import {
  ACCESSIBILITY_DOC_PATH,
  buildSiteBlocks,
  escapeHtml,
  extractMarkdownSection,
  fillSiteMarkers,
  REFUNDS_DOC_PATH,
  TERMS_DOC_PATH,
} from './renderSite';
import {
  APP_ENTRY_URL,
  BUSINESS,
  CONTACT,
  EXTRA_CHILD_MONTHLY,
  FAQ,
  FREE_PLAN_FEATURES,
  PRO_PLAN_FEATURES,
  SHOW_PHONE_ON_SITE,
  PRO_WORD_LISTS,
  FREE_START_LINE_HE,
  LEGAL_PAGES_LIVE,
  PRICE_ROWS,
  formatIsraeliPhone,
  formatShekels,
} from './siteContent';

const REPO_ROOT = resolve(__dirname, '../..');
const readRepoText = (path: string): string => readFileSync(resolve(REPO_ROOT, path), 'utf8');
const SITE_PAGES = ['home', 'terms', 'privacy', 'refunds', 'accessibility'] as const;
const blocks = buildSiteBlocks(readRepoText);

describe('siteContent', () => {
  it('formats agorot as shekels', () => {
    expect(formatShekels(3900)).toBe('₪39');
    expect(formatShekels(6450)).toBe('₪64.50');
    expect(() => formatShekels(-1)).toThrow();
  });

  it('gives every plan card six feature rows, the count the cards subgrid lines up (home-more.css)', () => {
    expect(FREE_PLAN_FEATURES).toHaveLength(6);
    expect(PRO_PLAN_FEATURES).toHaveLength(6);
  });

  it('formats the support number as a local Israeli phone', () => {
    expect(formatIsraeliPhone('972529282667')).toBe('052-9282667');
    expect(() => formatIsraeliPhone('0529282667')).toThrow();
  });

  it('shows exactly the prices the checkout charges', () => {
    expect(PRICE_ROWS).toHaveLength(4);
    for (const row of PRICE_ROWS) {
      expect(row.monthly).toBe(formatShekels(PRO_PRICES_AGOROT[row.seats].monthly));
      expect(row.yearly).toBe(formatShekels(PRO_PRICES_AGOROT[row.seats].yearly));
    }
    expect(PRICE_ROWS[0]).toMatchObject({ monthly: '₪39', yearly: '₪349' });
    expect(EXTRA_CHILD_MONTHLY).toBe('₪25');
  });

  it("states Pro's word-list limit as the app enforces it", () => {
    expect(PRO_WORD_LISTS).toBe(MAX_ACTIVE_LISTS);
  });

  it('shows only real app screens that exist', () => {
    const home = readFileSync(resolve(REPO_ROOT, 'home/index.html'), 'utf-8');
    const screens = [...home.matchAll(/\/site\/screens\/([a-z-]+\.webp)/g)].map((match) => match[1]);
    expect(screens.length).toBeGreaterThan(0);
    for (const file of new Set(screens)) expect(existsSync(resolve(REPO_ROOT, 'public/site/screens', file)), file).toBe(true);
  });

  it('tags every link into the app with its source', () => {
    expect(APP_ENTRY_URL).toBe('/?src=landing');
  });
});

describe('renderSite', () => {
  it('escapes HTML', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;');
  });

  it('fails on an unknown marker', () => {
    expect(() => fillSiteMarkers('<!--site:nope-->', blocks)).toThrow(/nope/);
  });

  it('extracts a markdown section up to the next rule', () => {
    const markdown = '# T\n\n## A\nfirst\n\n---\n\n## B\nsecond';
    expect(extractMarkdownSection(markdown, '## A')).toBe('first');
    expect(extractMarkdownSection(markdown, '## B')).toBe('second');
    expect(() => extractMarkdownSection(markdown, '## C')).toThrow();
  });

  it("covers Grow's site check on the home page: every price, address and the phone", () => {
    const home = fillSiteMarkers(readRepoText('home/index.html'), blocks);
    for (const row of PRICE_ROWS) {
      expect(home).toContain(row.monthly);
      expect(home).toContain(row.yearly);
    }
    expect(SHOW_PHONE_ON_SITE).toBe(true);
    expect(home).toContain(CONTACT.phoneDisplay);
    expect(home).toContain(CONTACT.phoneHref);
    expect(home).toContain(CONTACT.email);
    expect(home).toContain(BUSINESS.addressHe);
    expect(home).toContain(BUSINESS.registrationHe);
    expect(home).toContain(FREE_START_LINE_HE);
    expect(home).toContain('href="/?src=landing"');
  });

  it('keeps the tag of an ad or shared link that opens the home page', () => {
    expect(readRepoText('home/index.html')).toContain('<script type="module" src="/src/site/keepSourceTag.ts"></script>');
    expect(readRepoText('src/site/keepSourceTag.ts')).toContain('captureAttribution(window.location.search)');
  });

  it('fills every page with no marker left behind', () => {
    for (const page of SITE_PAGES) {
      const html = fillSiteMarkers(readRepoText(`${page}/index.html`), blocks);
      expect(html, page).not.toMatch(/<!--site:/);
      expect(html, page).toContain('lang="he"');
      expect(html, page).toContain('dir="rtl"');
    }
  });

  it('renders the legal texts from their source documents', () => {
    expect(blocks.terms()).toContain('<h3>1. מי אנחנו</h3>');
    expect(blocks.terms()).not.toContain('Questions for the legal review');
    expect(blocks.refunds()).toContain('3 ימי עסקים');
    expect(blocks.refunds()).toContain('id="cancel"');
    expect(blocks.terms()).not.toContain('48 שעות');
    // No draft placeholder left in the published texts: every "[...]" must be a markdown link
    const termsSource = extractMarkdownSection(readRepoText(TERMS_DOC_PATH), '## 1. תנאי שימוש');
    expect(termsSource).not.toMatch(/\[[^\]]*\](?!\()/);
    expect(readRepoText(REFUNDS_DOC_PATH)).not.toMatch(/\[[^\]]*\](?!\()/);
    expect(readRepoText('home/index.html')).not.toContain('48 שעות');
    expect(blocks.terms()).toContain('href="/privacy/"');
    expect(blocks.refunds()).not.toContain('<h1>');
    for (const section of PRIVACY_NOTICE_SECTIONS) expect(blocks.privacy()).toContain(section.titleHe);
    expect(readRepoText(TERMS_DOC_PATH).length).toBeGreaterThan(0);
    expect(readRepoText(REFUNDS_DOC_PATH).length).toBeGreaterThan(0);
  });

  it('links the approved legal pages from the footer, with no draft banner and open to search', () => {
    expect(LEGAL_PAGES_LIVE).toBe(true);
    for (const path of ['/terms/', '/privacy/', '/refunds/', '/accessibility/', '/refunds/#cancel']) {
      expect(blocks.footer(), path).toContain(`href="${path}"`);
    }
    expect(blocks['legal-head']()).toBe('');
    expect(blocks['draft-banner']()).toBe('');
    expect(blocks['privacy-more']()).toContain('href="/privacy/"');
  });

  it('publishes an accessibility statement with ways to get help', () => {
    const statement = blocks.accessibility();
    expect(statement).toContain('מה עוד לא נגיש');
    expect(statement).toContain(CONTACT.email);
    expect(statement).toContain('3 ימי עסקים');
    expect(readRepoText(ACCESSIBILITY_DOC_PATH)).not.toMatch(/\[[^\]]*\](?!\()/);
  });

  it('says the prices are VAT-exempt and answers how to cancel with the refund rules', () => {
    expect(blocks.pricing()).toContain('פטורים ממע״מ');
    const cancelAnswer = FAQ.find((item) => item.questionHe === 'איך מבטלים מנוי?')?.answerHe ?? '';
    expect(cancelAnswer).toContain('14 יום');
    expect(cancelAnswer).toContain('בטלפון');
    expect(CONTACT.responseHoursHe).toContain('3 ימי עסקים');
  });

  it('gives the refund page a cancellation anchor and a ready cancellation email', () => {
    expect(blocks.refunds()).toContain('id="cancel"');
    expect(blocks.refunds()).toContain('mailto:support@englishvibe.co.il?subject=');
  });
});
