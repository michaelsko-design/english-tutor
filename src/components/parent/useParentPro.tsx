import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import type { BillingPeriod } from '../../config/proTier';
import type { ParentLink } from '../../data/parentLink';
import type { ExamPitch } from '../../data/examPitch';
import { parseParentProRoute } from '../../data/parentProRoute';
import { canJoinCheckout, childrenOnSamePlan, findOpenPlan, getChildProStatus, type ChildProStatus } from '../../data/proPlanStatus';
import { useChildEntitlements } from '../../hooks/useChildEntitlements';
import { changeProPlan, type PlanAction } from '../../services/proBillingService';
import { trackFunnel } from '../../services/analytics/funnel';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { ChildProSection } from './ChildProSection';
import { MockPaymentPage } from './MockPaymentPage';
import { ProCheckoutPanel } from './ProCheckoutPanel';
import { ProPaymentReturn } from './ProPaymentReturn';

interface ParentProOptions {
  user: User;
  theme: ThemeDefinition;
  /** The linked children, null while loading */
  links: readonly ParentLink[] | null;
  /** Pro is shown at all (IS_PRO_PLAN_VISIBLE) */
  isEnabled: boolean;
  /** Each child's coming exam or school lists, from their report snapshot; the checkout leads with it */
  examByChild?: Readonly<Record<string, ExamPitch | null>>;
  onNotice: (messageHe: string) => void;
  onError: (messageHe: string | null) => void;
}

/** Where the plan-and-pay screen starts when a child card asks for it (upgrade one child, or renew a plan) */
interface PlanStart {
  period: BillingPeriod;
  childUids: string[];
}

const PLAN_DONE_HE: Record<PlanAction, string> = {
  cancel: 'החידוש בוטל. Pro ממשיך עד סוף התקופה ששולמה.',
  addChild: 'הילד/ה נוסף/ה למנוי. Pro פעיל עכשיו.',
  removeChild: 'הילד/ה הוצא/ה מהמנוי.',
};

const IS_MOCK_GATEWAY = import.meta.env.MODE === 'emulator';

/** Clears the Pro parts of the address, so a refresh doesn't show them again. */
function clearProAddress(): void {
  window.history.replaceState(null, '', `${window.location.pathname}?parent`);
}

/**
 * The parent portal's Pro parts (docs/feature-pro-tier.md, "Phase 2"): each child's Pro line, the
 * plan-and-pay screen, and the page after payment. Returns the pieces for ParentHome to place.
 */
export function useParentPro({ user, theme, links, isEnabled, examByChild, onNotice, onError }: ParentProOptions) {
  const [route, setRoute] = useState(() => parseParentProRoute(window.location.search));
  /** Null: yearly, with every child who can join ticked */
  const [planStart, setPlanStart] = useState<PlanStart | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const plansRef = useRef<HTMLDivElement>(null);
  const childUids = useMemo(() => (isEnabled && links ? links.map((l) => l.childUid) : []), [isEnabled, links]);
  const entitlements = useChildEntitlements(childUids);
  const nowMs = Date.now();

  const statuses: Record<string, ChildProStatus | undefined> = Object.fromEntries(
    childUids.map((uid) => [
      uid,
      entitlements[uid] === undefined ? undefined : getChildProStatus(entitlements[uid], user.uid, entitlements, nowMs),
    ])
  );
  const eligible = (links ?? []).filter((link) => canJoinCheckout(statuses[link.childUid]));
  const openPlan = findOpenPlan(user.uid, entitlements, nowMs);

  const showPlans = (childUids: string[], period: BillingPeriod) => {
    onError(null);
    setPlanStart({ period, childUids });
    plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const changePlan = async (action: PlanAction, subscriptionId: string, childUid?: string) => {
    setIsBusy(true);
    onError(null);
    const result = await changeProPlan(action, subscriptionId, childUid);
    setIsBusy(false);
    if (result.ok) onNotice(PLAN_DONE_HE[action]);
    else onError(result.errorHe);
  };

  const renderChildSection = (link: ParentLink): React.ReactNode => {
    if (!isEnabled) return null;
    const status = statuses[link.childUid];
    return (
      <ChildProSection
        childName={link.childName}
        status={status}
        openPlan={openPlan}
        theme={theme}
        isBusy={isBusy}
        onUpgrade={() => showPlans([link.childUid], 'yearly')}
        onRenew={() => {
          if (status?.kind === 'plan') showPlans(childrenOnSamePlan(status.subscriptionId, entitlements, nowMs), 'yearly');
        }}
        onCancelRenewal={() => {
          if (status?.kind === 'plan') void changePlan('cancel', status.subscriptionId);
        }}
        onAddToPlan={() => {
          if (openPlan) void changePlan('addChild', openPlan.subscriptionId, link.childUid);
        }}
        onRemoveFromPlan={() => {
          if (status?.kind === 'plan') void changePlan('removeChild', status.subscriptionId, link.childUid);
        }}
      />
    );
  };

  const paidId = route.paidCheckoutId;
  const activatedNames = paidId
    ? (links ?? []).filter((l) => entitlements[l.childUid]?.subscriptionId === paidId).map((l) => l.childName)
    : [];

  const topArea =
    isEnabled && (paidId || (IS_MOCK_GATEWAY && route.mockPayCheckoutId)) ? (
      <>
        {paidId && (
          <ProPaymentReturn
            theme={theme}
            isCancelled={route.isPaymentCancelled}
            activatedNames={activatedNames.length > 0 ? activatedNames : null}
            onDismiss={() => {
              clearProAddress();
              setRoute(parseParentProRoute(''));
            }}
          />
        )}
        {IS_MOCK_GATEWAY && route.mockPayCheckoutId && <MockPaymentPage checkoutId={route.mockPayCheckoutId} theme={theme} />}
      </>
    ) : null;

  // Nothing to buy once every linked child has Pro (adding or renewing happens on their cards)
  // Shown once every child's plan is known (the child count starts from it), and only with a child to buy for
  const isEveryPlanKnown = links !== null && links.every((l) => statuses[l.childUid] !== undefined);
  const isPlansShown = isEnabled && isEveryPlanKnown && eligible.length > 0;
  useEffect(() => {
    if (isPlansShown) trackFunnel('pro_plans_view');
  }, [isPlansShown]);
  // A learner's "ask a parent" link scrolls to the plans once, when they first appear: a new parent's
  // child is often connected only after the page loaded, so the plans come later than the list
  const hasScrolledToPlansRef = useRef(false);
  useEffect(() => {
    if (!isPlansShown || !route.hasProIntent || hasScrolledToPlansRef.current) return;
    hasScrolledToPlansRef.current = true;
    plansRef.current?.scrollIntoView({ block: 'start' });
  }, [isPlansShown, route.hasProIntent]);
  // Unless a child card asked for something else: yearly, with every child who can join ticked
  const start = planStart ?? { period: 'yearly' as const, childUids: eligible.map((l) => l.childUid) };
  const plansArea = isPlansShown ? (
    <div ref={plansRef} className="space-y-4 scroll-mt-4">
      <ProCheckoutPanel
        key={`${start.period}:${start.childUids.join(',')}`}
        theme={theme}
        initialPeriod={start.period}
        eligibleChildren={eligible}
        initialChildUids={start.childUids}
        parentEmail={user.email}
        parentName={user.displayName}
        examByChild={examByChild}
      />
    </div>
  ) : null;

  return { renderChildSection, topArea, plansArea };
}
