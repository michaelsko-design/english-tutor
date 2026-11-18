import React from 'react';
import { APP_NAME, LANDING_PAGE_PATH } from '../../config/appInfo';
import { quoteProPrice } from '../../config/proTier';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { formatShekels, PaymentMethodsNote } from './ProPlanPicker';
import { RENEWAL_LINE_HE } from './proTermsCopy';

interface ProPriceTeaserProps {
  theme: ThemeDefinition;
}

/**
 * The price and the cancellation terms, shown on a Pro ask link before the parent signs in: a parent
 * who knows the cost before the Google step is less likely to drop at it (backlog: checkout friction).
 */
export const ProPriceTeaser: React.FC<ProPriceTeaserProps> = ({ theme }) => {
  const yearly = quoteProPrice(1, 'yearly');
  const monthly = quoteProPrice(1, 'monthly');
  if (!yearly || !monthly) return null;

  return (
    <section className={`p-4 rounded-2xl space-y-2 text-center ${theme.inputBgClass}`} aria-labelledby="pro-teaser-title" data-testid="pro-price-teaser">
      <h2 id="pro-teaser-title" className="text-base font-extrabold">
        מנוי <bdi dir="ltr" lang="en">{APP_NAME} Pro</bdi> לילד אחד
      </h2>
      <p className="text-2xl font-black">
        {formatShekels(yearly.chargeAgorot)}
        <span className="text-base font-extrabold"> לשנה</span>
      </p>
      <p className="text-sm font-bold">
        כ-{formatShekels(yearly.perMonthAgorot, true)} לחודש, או {formatShekels(monthly.chargeAgorot)} בתשלום חודשי
      </p>
      <p className={`text-xs font-bold ${theme.mutedTextClass}`}>לשני ילדים ומעלה המחיר לכל ילד יורד.</p>
      <ul className="text-xs font-bold space-y-1">
        <li>שנתי: {RENEWAL_LINE_HE.yearly}</li>
        <li>חודשי: {RENEWAL_LINE_HE.monthly}</li>
      </ul>
      <PaymentMethodsNote period="yearly" className={theme.mutedTextClass} />
      <p className="text-xs">
        <a href={`${LANDING_PAGE_PATH}#pricing`} target="_blank" rel="noopener noreferrer" className="underline">
          כל המחירים ושאלות נפוצות
        </a>
      </p>
    </section>
  );
};
