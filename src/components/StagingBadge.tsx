import { IS_STAGING_BUILD } from '../config/environment';

interface StagingBadgeProps {
  /** Overrides the build flag (tests) */
  isStaging?: boolean;
}

/** A small fixed label on staging builds, so the test site is never mistaken for the live app. */
export function StagingBadge({ isStaging = IS_STAGING_BUILD }: StagingBadgeProps) {
  if (!isStaging) return null;
  return (
    <div
      role="status"
      dir="ltr"
      lang="en"
      className="pointer-events-none fixed bottom-2 left-2 z-[9999] rounded-md bg-amber-500 px-2 py-0.5 text-xs font-bold tracking-wide text-black shadow-md opacity-90"
    >
      STAGING
    </div>
  );
}
