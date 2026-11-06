import { useEffect } from 'react';
import { trackEvent } from '../services/analytics';
import type { FeatureEvent } from '../services/analytics/events';

/** Counts one "feature opened" each time `isOpen` turns true (anonymous counter, no content) */
export function useTrackFeature(event: FeatureEvent, isOpen: boolean): void {
  useEffect(() => {
    if (isOpen) trackEvent(event);
  }, [event, isOpen]);
}
