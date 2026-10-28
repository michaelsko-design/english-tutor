import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import type { BillingPeriod } from '../../config/proTier';
import type { ParentLink } from '../../data/parentLink';
import { parseParentProRoute } from '../../data/parentProRoute';
import { canJoinCheckout, childrenOnSamePlan, findOpenPlan, getChildProStatus, type ChildProStatus } from '../../data/proPlanStatus';
import { useChildEntitlements } from '../../hooks/useChildEntitlements';
import { changeProPlan, type PlanAction } from '../../services/proBillingService';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { ChildProSection } from './ChildProSection';
import { MockPaymentPage } from './MockPaymentPage';
import { ProCheckoutPanel } from './ProCheckoutPanel';
import { ProPaymentReturn } from './ProPaymentReturn';
import { ProPlanPicker, type ProPlanChoice } from './ProPlanPicker';

interface ParentProOptions {
  user: User;
  theme: ThemeDefinition;
  /** The linked children, null while loading */
  links: readonly ParentLink[] | null;
  /** Pro is shown at all (IS_PRO_PLAN_VISIBLE) */
  isEnabled: boolean;
  onNotice: (messageHe: string) => void;
  onError: (messageHe: string | null) => void;
}

interface CheckoutStep {
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
 * plan picker and checkout, and the page after payment. Returns the pieces for ParentHome to place.
 */
export function useParentPro({ user, theme, links, isEnabled, onNotice, onError }: ParentProOptions) {
  const [route, setRoute] = useState(() => parseParentProRoute(window.location.search));
  const [checkout, setCheckout] = useState<CheckoutStep | null>(null);
  /** Children the parent picked from their cards ("upgrade"), ticked first at checkout */
  const [preselect, setPreselect] = useState<string[]>([]);
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

  // A learner's "ask a parent" link opens the plans
  const isLoaded = links !== null;
  useEffect(() => {
    if (isEnabled && isLoaded && route.hasProIntent) plansRef.current?.scrollIntoView({ block: 'start' });
  }, [isEnabled, isLoaded, route.hasProIntent]);

  const showPlans = (childUidsFirst: string[], checkoutPeriod: BillingPeriod | null) => {
    onError(null);
    setPreselect(childUidsFirst);
    setCheckout(checkoutPeriod ? { period: checkoutPeriod, childUids: childUidsFirst } : null);
    plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleContinue = (choice: ProPlanChoice) => {
    const ordered = [...preselect, ...eligible.map((l) => l.childUid).filter((uid) => !preselect.includes(uid))];
    setCheckout({ period: choice.period, childUids: ordered.slice(0, choice.children) });
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
        onUpgrade={() => showPlans([link.childUid], null)}
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
  const plansArea = isEnabled && isEveryPlanKnown && eligible.length > 0 ? (
    <div ref={plansRef} className="space-y-4 scroll-mt-4">
      {checkout ? (
        <ProCheckoutPanel
          key={`${checkout.period}:${checkout.childUids.join(',')}`}
          theme={theme}
          period={checkout.period}
          eligibleChildren={eligible}
          initialChildUids={checkout.childUids}
          parentEmail={user.email}
          onBack={() => setCheckout(null)}
        />
      ) : (
        <ProPlanPicker
          key={preselect.join(',')}
          theme={theme}
          initialChildren={preselect.length || eligible.length || 1}
          onContinue={handleContinue}
        />
      )}
    </div>
  ) : null;

  return { renderChildSection, topArea, plansArea };
}
