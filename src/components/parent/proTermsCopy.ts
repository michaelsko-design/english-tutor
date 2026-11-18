import type { BillingPeriod } from '../../config/proTier';

/** How each plan renews: the same words before sign-in and under the checkout total */
export const RENEWAL_LINE_HE: Readonly<Record<BillingPeriod, string>> = {
  monthly: 'מתחדש כל חודש עד שמבטלים. אפשר לבטל בכל עת כאן בפורטל.',
  yearly: 'תשלום אחד לשנה. לא מתחדש מעצמו.',
};
