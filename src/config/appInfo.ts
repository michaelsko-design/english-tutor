export const APP_NAME = 'EnglishVibe';

/** The learner's score is called "Vibe" on screen (`stats.xp` in the code). Shown with a full prize; gender-neutral, so it needs no inflection. */
export const VIBE_CHEER_HE = 'יש לך וייב טוב!';

/**
 * The WhatsApp number parents reach us on (international, digits only, e.g. 972501234567), used by
 * the Pro plan picker's "more than 4 children" button. Empty: the button opens WhatsApp with the
 * message and lets the parent pick the chat.
 */
export const SUPPORT_WHATSAPP_NUMBER = '972529282667';

/** The public landing site (home/index.html, static, next to the app; docs/architecture.md §4.32) */
export const LANDING_PAGE_PATH = '/home/';

/** The public terms and privacy pages (built from docs/legal/pro-legal-drafts.md and config/privacyNotice.ts) */
export const TERMS_PAGE_PATH = '/terms/';
export const PRIVACY_PAGE_PATH = '/privacy/';

/** The refund page's cancellation section (Consumer Protection Law §14ט: linked from the home page and the sign-in screens) */
export const CANCEL_PAGE_PATH = '/refunds/#cancel';

/** The accessibility statement (built from docs/legal/accessibility-statement.md) */
export const ACCESSIBILITY_PAGE_PATH = '/accessibility/';

/**
 * Off until the owner approves the legal texts (legal audit Task 7). While off, the legal pages are
 * built but not linked from the landing page or the app's sign-in screens, carry `noindex`, and show
 * a draft banner.
 */
export const LEGAL_PAGES_LIVE = false;

/**
 * The terms a parent accepts at checkout, saved on the checkout as `termsVersion`: the terms' "עודכן
 * לאחרונה" date. Change it with every change to the terms' text.
 */
export const TERMS_VERSION = '2026-11-19';

/**
 * The privacy notice's version (config/privacyNotice.ts), saved next to `TERMS_VERSION` wherever
 * consent is recorded. Change it, and `PRIVACY_UPDATED_HE`, with every change to the notice's text.
 */
export const PRIVACY_VERSION = '2026-11-19';

/** `PRIVACY_VERSION` as the notice's "עודכן לאחרונה" line shows it */
export const PRIVACY_UPDATED_HE = '19 בנובמבר 2026';

/** Where parents send privacy questions and requests (shown in the privacy notice). */
export const PRIVACY_CONTACT_EMAIL = 'support@englishvibe.co.il';

/** The support phone as people read it (the same number as `SUPPORT_WHATSAPP_NUMBER`) */
export const SUPPORT_PHONE_DISPLAY = '052-9282667';

/** The person behind the business, as the terms and the privacy notice name the data controller */
export const BUSINESS_OWNER_HE = 'מיכאל שקולניק, בעל העסק "SHK טכנולוגיות", עוסק פטור מס׳ 310720370, החיטה 323, מאור';
