import { useEffect, useRef, useState } from 'react';
import { AuthUserSummary, LearnerProfile } from '../types/learner';
import { PARENTS_CHANGED_EVENT, buildReportSnapshot, snapshotContentKey } from '../data/parentLink';
import { listParentsOfChild, publishReportSnapshot } from '../services/parentService';

interface ReportSnapshotOptions {
  authUser: AuthUserSummary | null;
  profile: LearnerProfile;
  /** True when the cloud profile has loaded */
  isSynced: boolean;
}

const PUBLISH_DELAY_MS = 15_000;
const RECHECK_PARENTS_MS = 10 * 60 * 1000;

/**
 * Keeps the report snapshot a paired parent reads in step with the profile. Does nothing for a
 * learner with no parent: no snapshot is written until a parent has claimed a code.
 */
export function useReportSnapshotPublisher({ authUser, profile, isSynced }: ReportSnapshotOptions): void {
  const uid = authUser && !authUser.isAnonymous ? authUser.uid : null;
  const [syncedUid, setSyncedUid] = useState<string | null>(null);
  useEffect(() => {
    if (isSynced && uid) setSyncedUid(uid);
  }, [isSynced, uid]);
  const isReady = Boolean(uid && profile.isOnboarded && syncedUid === uid);

  const [hasParent, setHasParent] = useState(false);
  const lastCheckRef = useRef(0);
  const publishedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    publishedKeyRef.current = null;
    setHasParent(false);
  }, [uid]);

  useEffect(() => {
    if (!uid || !isReady) return undefined;
    let isCancelled = false;
    const check = () => {
      lastCheckRef.current = Date.now();
      listParentsOfChild(uid)
        .then((links) => {
          if (!isCancelled) setHasParent(links.length > 0);
        })
        .catch((error: unknown) => console.warn('Checking paired parents failed:', error));
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastCheckRef.current > RECHECK_PARENTS_MS) check();
    };
    check();
    window.addEventListener(PARENTS_CHANGED_EVENT, check);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      isCancelled = true;
      window.removeEventListener(PARENTS_CHANGED_EVENT, check);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [uid, isReady]);

  useEffect(() => {
    if (!uid || !isReady || !hasParent) return undefined;
    const snapshot = buildReportSnapshot(profile, new Date());
    const key = snapshotContentKey(snapshot);
    if (key === publishedKeyRef.current) return undefined;
    const timer = window.setTimeout(() => {
      publishReportSnapshot(uid, snapshot)
        .then(() => {
          publishedKeyRef.current = key;
        })
        .catch((error: unknown) => console.warn('Publishing the parent report failed:', error));
    }, PUBLISH_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [uid, isReady, hasParent, profile]);
}
