/**
 * The two links the law asks for on every entry screen (legal audit LAND-01, MISS-01): "ביטול עסקה"
 * (Consumer Protection Law §14ט) and the accessibility statement. Placed only on signed-out screens
 * (the sign-in dialog and the parent portal's sign-in), so gameplay stays uncluttered, and shown only
 * once the legal pages are live (`LEGAL_PAGES_LIVE`), like the landing site's footer links.
 */
import React from 'react';
import { ACCESSIBILITY_PAGE_PATH, CANCEL_PAGE_PATH, LEGAL_PAGES_LIVE } from '../config/appInfo';

/** Standalone links: at least 24px tall (WCAG 2.5.8) */
const LINK_CLASS = 'inline-block py-1 text-xs underline opacity-75 hover:opacity-100';

interface LegalQuickLinksProps {
  /** Tests pass it; the app follows `LEGAL_PAGES_LIVE` */
  isLive?: boolean;
}

export const LegalQuickLinks: React.FC<LegalQuickLinksProps> = ({ isLive = LEGAL_PAGES_LIVE }) => {
  if (!isLive) return null;
  return (
    <>
      <a href={CANCEL_PAGE_PATH} target="_blank" rel="noopener" className={LINK_CLASS}>
        ביטול עסקה
      </a>
      <a href={ACCESSIBILITY_PAGE_PATH} target="_blank" rel="noopener" className={LINK_CLASS}>
        הצהרת נגישות
      </a>
    </>
  );
};
