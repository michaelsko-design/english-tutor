/**
 * Build-time HTML for the public landing site. The pages (home/, terms/, privacy/, refunds/ at the
 * repo root) are plain HTML with `<!--site:name-->` markers; the `site-pages` Vite plugin replaces
 * each marker with the block below, so prices, contact details and legal text have one source.
 * Runs in Node (vite.config.ts) and in the unit tests, never in the browser.
 */
import { marked } from 'marked';
import { APP_NAME } from '../config/appInfo';
import { PRIVACY_NOTICE_SECTIONS } from '../config/privacyNotice';
import {
  APP_ENTRY_URL,
  BUSINESS,
  CONTACT,
  EXTRA_CHILD_MONTHLY,
  FAQ,
  FREE_PLAN_FEATURES,
  FREE_START_LINE_HE,
  LEGAL_PAGES_LIVE,
  PRICE_ROWS,
  PRO_PLAN_FEATURES,
} from './siteContent';

export const TERMS_DOC_PATH = 'docs/legal/pro-legal-drafts.md';
export const REFUNDS_DOC_PATH = 'docs/legal/Service and Refund Policy.md';

/** Reads a repo file (path relative to the repo root) as UTF-8 text */
export type ReadRepoText = (relativePath: string) => string;

const MARKER_PATTERN = /<!--site:([a-z-]+)-->/g;

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Replaces every `<!--site:name-->`; an unknown name fails the build instead of shipping a hole */
export function fillSiteMarkers(html: string, blocks: Readonly<Record<string, () => string>>): string {
  return html.replace(MARKER_PATTERN, (_marker, name: string) => {
    const render = blocks[name];
    if (!render) throw new Error(`site-pages: no block named "${name}"`);
    return render();
  });
}

/**
 * The part of a markdown file from the line that starts with `startHeading` up to (not including)
 * the next `---` rule or the end of the file, without the heading line itself.
 */
export function extractMarkdownSection(markdown: string, startHeading: string): string {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex((line) => line.startsWith(startHeading));
  if (start < 0) throw new Error(`site-pages: heading "${startHeading}" not found`);
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.trim() === '---');
  return (end < 0 ? rest : rest.slice(0, end)).join('\n').trim();
}

/** Our own legal drafts, so the HTML is trusted; marked only turns it into tags */
export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false, gfm: true });
}

function renderFeatureList(features: readonly string[]): string {
  return `<ul class="site-plan-features">${features.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

/** The Pro cards show the one-child price; the table below has every family size */
const ONE_CHILD_PRICE_HE = 'המחיר לילד/ה אחד/ת';

interface PlanCard {
  name: string;
  price: string;
  per: string;
  /** Who the price is for (the Pro prices are for one child) */
  seats?: string;
  note: string;
  isFeatured?: boolean;
}

function renderPlanCard(plan: PlanCard, features: readonly string[]): string {
  const badge = plan.isFeatured ? '<span class="site-plan-badge">הכי משתלם</span>' : '';
  return [
    `<div class="site-plan${plan.isFeatured ? ' site-plan-featured' : ''}">`,
    badge,
    `<p class="site-plan-name">${plan.name}</p>`,
    `<p class="site-price">${plan.price}<span>${plan.per}</span></p>`,
    plan.seats ? `<p class="site-plan-seats">${plan.seats}</p>` : '',
    `<p class="site-plan-note">${plan.note}</p>`,
    renderFeatureList(features),
    '</div>',
  ].join('');
}

function renderPricing(): string {
  const rows = PRICE_ROWS.map(
    (row) =>
      `<tr><td>${row.seats === 1 ? 'ילד/ה אחד/ת' : `${row.seats} ילדים`}</td><td>${row.monthly}</td><td>${row.yearly}</td></tr>`,
  ).join('');
  return [
    '<div class="site-price-cards">',
    renderPlanCard({ name: 'חינם', price: '₪0', per: '', note: `${escapeHtml(FREE_START_LINE_HE)}.` }, FREE_PLAN_FEATURES),
    renderPlanCard(
      {
        name: '<bdi>Pro</bdi> חודשי',
        price: PRICE_ROWS[0].monthly,
        per: ' לחודש',
        seats: ONE_CHILD_PRICE_HE,
        note: `כל ילד/ה נוסף/ת: ${EXTRA_CHILD_MONTHLY} לחודש. מתחדש כל חודש, ומבטלים בלחיצה בפורטל ההורים, בלי חיובים נוספים. כרטיס אשראי.`,
      },
      PRO_PLAN_FEATURES,
    ),
    renderPlanCard(
      {
        name: '<bdi>Pro</bdi> שנתי',
        price: PRICE_ROWS[0].yearly,
        per: ' לשנה',
        seats: ONE_CHILD_PRICE_HE,
        note: `ל-${PRICE_ROWS.length} ילדים: ${PRICE_ROWS[PRICE_ROWS.length - 1].yearly} לשנה. תשלום אחד, לא מתחדש מעצמו. כרטיס אשראי, <bdi>Bit</bdi>, <bdi>Apple Pay</bdi> או <bdi>Google Pay</bdi>.`,
        isFeatured: true,
      },
      PRO_PLAN_FEATURES,
    ),
    '</div>',
    '<table class="site-table" aria-label="המחיר לפי מספר הילדים במנוי">',
    '<thead><tr><th scope="col">ילדים במנוי</th><th scope="col">חודשי</th><th scope="col">שנתי</th></tr></thead>',
    `<tbody>${rows}</tbody></table>`,
  ].join('');
}

function renderFaq(): string {
  return FAQ.map(
    (item) =>
      `<details class="site-faq"><summary>${escapeHtml(item.questionHe)}</summary><p>${escapeHtml(item.answerHe)}</p></details>`,
  ).join('');
}

function renderContact(): string {
  return [
    '<ul class="site-contact">',
    `<li>אימייל: <a href="mailto:${CONTACT.email}" dir="ltr">${CONTACT.email}</a></li>`,
    `<li>טלפון: <a href="${CONTACT.phoneHref}" dir="ltr">${CONTACT.phoneDisplay}</a></li>`,
    `<li>${escapeHtml(CONTACT.responseHoursHe)}.</li>`,
    '</ul>',
  ].join('');
}

function renderLegalLinks(): string {
  if (!LEGAL_PAGES_LIVE) return '';
  return '<nav class="site-legal-links" aria-label="מסמכים"><a href="/terms/">תנאי שימוש ומנוי</a><a href="/privacy/">פרטיות ומידע</a><a href="/refunds/">מדיניות שירות וביטולים</a></nav>';
}

function renderFooter(): string {
  return [
    '<footer class="site-footer"><div class="site-wrap">',
    `<p><strong><bdi>${APP_NAME}</bdi></strong> מופעלת על ידי ${escapeHtml(BUSINESS.nameHe)}, ${escapeHtml(BUSINESS.registrationHe)}, ${escapeHtml(BUSINESS.addressHe)}.</p>`,
    renderContact(),
    renderLegalLinks(),
    '</div></footer>',
  ].join('');
}

/** Drafts stay out of search and say so until the lawyer approves them */
function renderLegalHead(): string {
  return LEGAL_PAGES_LIVE ? '' : '<meta name="robots" content="noindex, nofollow" />';
}

function renderDraftBanner(): string {
  return LEGAL_PAGES_LIVE
    ? ''
    : '<p class="site-draft" role="note">טיוטה לבדיקה משפטית. הנוסח עוד עשוי להשתנות.</p>';
}

function renderPrivacy(): string {
  return PRIVACY_NOTICE_SECTIONS.map(
    (section) =>
      `<h2>${escapeHtml(section.titleHe)}</h2>${section.bodyHe.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}`,
  ).join('');
}

function stripTitle(markdown: string): string {
  return markdown.replace(/\r\n/g, '\n').replace(/^# .*\n+/, '');
}

/** Every block the site's pages can use */
export function buildSiteBlocks(readRepoText: ReadRepoText): Readonly<Record<string, () => string>> {
  return {
    'app-link': () => APP_ENTRY_URL,
    'free-line': () => escapeHtml(FREE_START_LINE_HE),
    pricing: renderPricing,
    faq: renderFaq,
    contact: renderContact,
    'email-link': () => `<a href="mailto:${CONTACT.email}" dir="ltr">${CONTACT.email}</a>`,
    footer: renderFooter,
    'legal-head': renderLegalHead,
    'draft-banner': renderDraftBanner,
    terms: () => markdownToHtml(extractMarkdownSection(readRepoText(TERMS_DOC_PATH), '## 1. תנאי שימוש')),
    privacy: renderPrivacy,
    refunds: () => markdownToHtml(stripTitle(readRepoText(REFUNDS_DOC_PATH))),
  };
}
