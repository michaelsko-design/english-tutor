import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { User } from 'firebase/auth';
import type { BillingPeriod } from '../../config/proTier';
import type { ParentLink } from '../../data/parentLink';
import type { ExamPitch } from '../../data/examPitch';
import { parseParentProRoute } from '../../data/parentProRoute';
import { canJoinCheckout, canStartTrial, childrenOnSamePlan, findOpenPlan, getChildProStatus, type ChildProStatus } from '../../data/proPlanStatus';
import { useChildEntitlements } from '../../hooks/useChildEntitlements';
import {
  changeProPlan,
  quoteProCancellation,
  startProTrial,
  type CancelQuote,
  type PlanAction,
  type PlanChangeOptions,
} from '../../services/proBillingService';
import { trackFunnel } from '../../services/analytics/funnel';
import type { ThemeDefinition } from '../../themes/themeRegistry';
import { ChildProSection, formatDateHe } from './ChildProSection';
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
  cancelWithRefund: 'הביטול נקלט. ההחזר יגיע לאמצעי התשלום בתוך 14 יום (ואם אי אפשר, נתאם איתכם העברה בנקאית).',
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
  /** After a payment: the family's one full refund is still open (by plan id), so the summary states the rule that applies */
  const [fullRefundByPlan, setFullRefundByPlan] = useState<Readonly<Record<string, boolean>>>({});
  const fullRefundAskedRef = useRef<string | null>(null);
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
  /** A monthly plan this parent pays that will charge again (the parent account can't be deleted under it); null while loading */
  const hasRenewingPlan =
    links === null || Object.values(statuses).some((status) => status === undefined)
      ? null
      : Object.values(statuses).some((status) => status?.kind === 'plan' && status.isPayer && status.isRenewing);

  const showPlans = (childUids: string[], period: BillingPeriod) => {
    onError(null);
    setPlanStart({ period, childUids });
    plansRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const changePlan = async (action: PlanAction, subscriptionId: string, options: PlanChangeOptions = {}) => {
    setIsBusy(true);
    onError(null);
    const result = await changeProPlan(action, subscriptionId, options);
    setIsBusy(false);
    if (result.ok) onNotice(PLAN_DONE_HE[action]);
    else onError(result.errorHe);
  };

  const startTrial = async (link: ParentLink) => {
    setIsBusy(true);
    onError(null);
    const result = await startProTrial(link.childUid);
    setIsBusy(false);
    if (!result.ok) {
      onError(result.errorHe);
      return;
    }
    trackFunnel('pro_trial_start');
    onNotice(`שבוע Pro חינם פעיל עבור ${link.childName} עד ${formatDateHe(result.value)}.`);
  };

  const loadCancelQuote = async (subscriptionId: string): Promise<CancelQuote | null> => {
    onError(null);
    const result = await quoteProCancellation(subscriptionId);
    if (result.ok) return result.value;
    onError(result.errorHe);
    return null;
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
        canStartTrial={canStartTrial(entitlements[link.childUid])}
        onStartTrial={() => void startTrial(link)}
        onUpgrade={() => showPlans([link.childUid], 'yearly')}
        onRenew={() => {
          if (status?.kind === 'plan') showPlans(childrenOnSamePlan(status.subscriptionId, entitlements, nowMs), 'yearly');
        }}
        onCancelRenewal={() => {
          if (status?.kind === 'plan') void changePlan('cancel', status.subscriptionId);
        }}
        onLoadCancelQuote={() => (status?.kind === 'plan' ? loadCancelQuote(status.subscriptionId) : Promise.resolve(null))}
        onCancelWithRefund={() => {
          if (status?.kind === 'plan') void changePlan('cancelWithRefund', status.subscriptionId);
        }}
        onAddToPlan={() => {
          if (!openPlan) return;
          void changePlan('addChild', openPlan.subscriptionId, {
            childUid: link.childUid,
            ...(openPlan.nextMonthlyAgorot != null ? { confirmedAmountAgorot: openPlan.nextMonthlyAgorot } : {}),
          });
        }}
        onRemoveFromPlan={() => {
          if (status?.kind === 'plan') void changePlan('removeChild', status.subscriptionId, { childUid: link.childUid });
        }}
      />
    );
  };

  const paidId = route.paidCheckoutId;
  const paidEntitlement = paidId ? Object.values(entitlements).find((e) => e?.subscriptionId === paidId) ?? null : null;
  const paidPlan =
    paidEntitlement?.billingPeriod && paidEntitlement.seatLimit
      ? { period: paidEntitlement.billingPeriod, seats: paidEntitlement.seatLimit, periodEnd: paidEntitlement.periodEnd }
      : null;
  const isPaidPlanKnown = paidPlan !== null;
  useEffect(() => {
    if (!paidId || !isPaidPlanKnown || fullRefundAskedRef.current === paidId) return;
    fullRefundAskedRef.current = paidId;
    // A failed check leaves the summary's plain wording (the rule, once per family), so no error is shown
    void quoteProCancellation(paidId).then((result) => {
      if (!result.ok || result.value.mode === 'none') return;
      const isFullRefund = result.value.mode === 'full_refund';
      setFullRefundByPlan((prev) => ({ ...prev, [paidId]: isFullRefund }));
    });
  }, [paidId, isPaidPlanKnown]);
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
            paidPlan={paidPlan}
            hasFullRefund={fullRefundByPlan[paidId] ?? null}
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

  return { renderChildSection, topArea, plansArea, hasRenewingPlan };
}
