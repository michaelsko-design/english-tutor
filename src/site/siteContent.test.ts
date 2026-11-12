import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PRO_PRICES_AGOROT } from '../config/proTier';
import { PRIVACY_NOTICE_SECTIONS } from '../config/privacyNotice';
import {
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
  FREE_START_LINE_HE,
  LEGAL_PAGES_LIVE,
  PRICE_ROWS,
  formatIsraeliPhone,
  formatShekels,
} from './siteContent';

const REPO_ROOT = resolve(__dirname, '../..');
const readRepoText = (path: string): string => readFileSync(resolve(REPO_ROOT, path), 'utf8');
const SITE_PAGES = ['home', 'terms', 'privacy', 'refunds'] as const;
const blocks = buildSiteBlocks(readRepoText);

describe('siteContent', () => {
  it('formats agorot as shekels', () => {
    expect(formatShekels(3900)).toBe('₪39');
    expect(formatShekels(6450)).toBe('₪64.50');
    expect(() => formatShekels(-1)).toThrow();
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

  it("covers Grow's site check on the home page: every price, phone, address", () => {
    const home = fillSiteMarkers(readRepoText('home/index.html'), blocks);
    for (const row of PRICE_ROWS) {
      expect(home).toContain(row.monthly);
      expect(home).toContain(row.yearly);
    }
    expect(home).toContain(CONTACT.phoneDisplay);
    expect(home).toContain(CONTACT.email);
    expect(home).toContain(BUSINESS.addressHe);
    expect(home).toContain(BUSINESS.registrationHe);
    expect(home).toContain(FREE_START_LINE_HE);
    expect(home).toContain('href="/?src=landing"');
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
    expect(blocks.refunds()).toContain('48 שעות');
    expect(blocks.refunds()).not.toContain('<h1>');
    for (const section of PRIVACY_NOTICE_SECTIONS) expect(blocks.privacy()).toContain(section.titleHe);
    expect(readRepoText(TERMS_DOC_PATH).length).toBeGreaterThan(0);
    expect(readRepoText(REFUNDS_DOC_PATH).length).toBeGreaterThan(0);
  });

  it('keeps draft legal pages unlinked and out of search until approved', () => {
    if (LEGAL_PAGES_LIVE) return;
    expect(blocks.footer()).not.toContain('/terms/');
    expect(blocks['legal-head']()).toContain('noindex');
    expect(blocks['draft-banner']()).toContain('טיוטה');
  });
});
