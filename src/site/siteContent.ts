/**
 * The public landing site's facts (/home/, /terms/, /privacy/, /refunds/): prices, business and
 * contact details. Prices come from the checkout's own table, so the site can never show a price the
 * server would not charge. Grow's site check needs every plan, the phone and the address on the site.
 */
import { APP_NAME, PRIVACY_CONTACT_EMAIL, SUPPORT_WHATSAPP_NUMBER } from '../config/appInfo';
import { FREE_WORD_LISTS, MAX_PRO_SEATS, PRO_PRICES_AGOROT, type ProSeatCount } from '../config/proTier';

/**
 * Off until the lawyer approves the drafts (backlog: "Pro legal texts"). While off, the legal pages
 * are built but not linked from the landing page, carry `noindex`, and show a draft banner.
 */
export const LEGAL_PAGES_LIVE = false;

/** The free tier never asks for a card: Pro is bought by a parent, in the parent portal only */
export const FREE_START_LINE_HE = 'מתחילים חינם, ללא צורך בכרטיס אשראי';

/** Every link from the site into the app carries this, so the funnel can tell where sign-ups came from */
export const APP_ENTRY_URL = '/?src=landing';

export const BUSINESS = {
  nameHe: 'SHK טכנולוגיות',
  /** Osek Patur: no VAT, receipts (not tax invoices) */
  registrationHe: 'עוסק פטור 310720370',
  addressHe: 'החיטה 323, מאור',
} as const;

const PHONE_LOCAL_DIGITS_START = 3; // 972|52...: the country code is three digits

/** 972529282667 → 052-9282667 */
export function formatIsraeliPhone(internationalDigits: string): string {
  if (!/^972\d{8,9}$/.test(internationalDigits)) {
    throw new Error(`formatIsraeliPhone: expected 972 and 8-9 digits, got "${internationalDigits}"`);
  }
  const local = `0${internationalDigits.slice(PHONE_LOCAL_DIGITS_START)}`;
  return `${local.slice(0, 3)}-${local.slice(3)}`;
}

export const CONTACT = {
  email: PRIVACY_CONTACT_EMAIL,
  phoneDisplay: formatIsraeliPhone(SUPPORT_WHATSAPP_NUMBER),
  phoneHref: `tel:+${SUPPORT_WHATSAPP_NUMBER}`,
  responseHoursHe: 'מענה לכל פנייה בתוך 48 שעות',
} as const;

const AGOROT_PER_SHEKEL = 100;

/** 3900 → "₪39"; 6450 → "₪64.50" */
export function formatShekels(agorot: number): string {
  if (!Number.isInteger(agorot) || agorot < 0) throw new Error(`formatShekels: bad amount ${agorot}`);
  const whole = Math.floor(agorot / AGOROT_PER_SHEKEL);
  const rest = agorot % AGOROT_PER_SHEKEL;
  return rest === 0 ? `₪${whole}` : `₪${whole}.${String(rest).padStart(2, '0')}`;
}

export interface PriceRow {
  seats: ProSeatCount;
  monthly: string;
  yearly: string;
}

const SEAT_COUNTS: readonly ProSeatCount[] = [1, 2, 3, 4];

export const PRICE_ROWS: readonly PriceRow[] = SEAT_COUNTS.map((seats) => ({
  seats,
  monthly: formatShekels(PRO_PRICES_AGOROT[seats].monthly),
  yearly: formatShekels(PRO_PRICES_AGOROT[seats].yearly),
}));

/** The extra child's monthly price, as the plan picker words it ("₪25 לכל ילד נוסף") */
export const EXTRA_CHILD_MONTHLY = formatShekels(PRO_PRICES_AGOROT[2].monthly - PRO_PRICES_AGOROT[1].monthly);

/**
 * Pro's active word lists (`MAX_ACTIVE_LISTS` in data/customWordLists.ts; not imported, since that
 * module pulls in the curriculum loader and this file runs in vite.config.ts). A test keeps them equal.
 */
export const PRO_WORD_LISTS = 10;

export const FREE_PLAN_FEATURES: readonly string[] = [
  'היחידות הראשונות של כל כיתה',
  `עד ${FREE_WORD_LISTS} רשימות מילים מבית הספר`,
  'טעימה מתוכנית ההכנה למבחן',
  'משחקי מילים והחדר האישי',
];

export const PRO_PLAN_FEATURES: readonly string[] = [
  'כל היחידות של כל הכיתות',
  'הכנה מלאה למבחנים, עד יום המבחן',
  `עד ${PRO_WORD_LISTS} רשימות מילים פעילות`,
  'כל העולמות וכל החברים',
  `אחים ואחיות באותו מנוי (עד ${MAX_PRO_SEATS} ילדים)`,
];

export interface FaqItem {
  questionHe: string;
  answerHe: string;
}

export const FAQ: readonly FaqItem[] = [
  {
    questionHe: 'לאילו כיתות זה מתאים?',
    answerHe: 'לכיתות א׳ עד י״ב. מבחן רמה קצר בהתחלה מתאים את נקודת הפתיחה לרמה של הילד/ה.',
  },
  {
    questionHe: 'מה אפשר לעשות בחינם?',
    answerHe: `${FREE_START_LINE_HE}. בחינם פתוחות היחידות הראשונות של כל כיתה, תרגול של עד 2 רשימות מילים מבית הספר, משחקי מילים והחדר האישי. המנוי פותח את כל היחידות, הכנה מלאה למבחנים ועד 10 רשימות מילים פעילות.`,
  },
  {
    questionHe: 'צריך להוריד אפליקציה?',
    answerHe: `לא. ${APP_NAME} עובדת בדפדפן, בטלפון, בטאבלט ובמחשב. אפשר להוסיף אותה למסך הבית כמו אפליקציה רגילה.`,
  },
  {
    questionHe: 'הילד/ה צריכים לדעת לקרוא עברית?',
    answerHe: 'בכיתות א׳–ב׳ ההוראות בעברית מוקראות בקול, כך שגם מי שעוד לא קורא/ת בעצמו/ה יכול/ה לשחק.',
  },
  {
    questionHe: 'זה בטוח לילדים?',
    answerHe: 'אין פרסומות, אין צ׳אט פתוח ואין טקסט חופשי בין ילדים. מתחת לגיל 13 מרכז החברים כבוי עד שהורה מפעיל אותו.',
  },
  {
    questionHe: 'איך מבטלים מנוי?',
    answerHe: 'מנוי חודשי מבטלים בלחיצה אחת בפורטל ההורים, או באימייל אלינו. אחרי הביטול אין חיובים נוספים. מנוי שנתי משולם פעם אחת ולא מתחדש מעצמו.',
  },
  {
    questionHe: 'איך משלמים?',
    answerHe: 'רק הורה משלם, דרך פורטל ההורים, בעמוד התשלום המאובטח של Grow. מנוי חודשי: כרטיס אשראי. מנוי שנתי: כרטיס אשראי, Bit, Apple Pay או Google Pay. פרטי הכרטיס לא מגיעים אלינו.',
  },
];
