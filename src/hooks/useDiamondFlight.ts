import { useSyncExternalStore } from 'react';
import { DiamondFlightState, getDiamondFlightState, subscribeDiamondFlights } from '../services/diamondFlight';

export function useDiamondFlights(): DiamondFlightState {
  return useSyncExternalStore(subscribeDiamondFlights, getDiamondFlightState, getDiamondFlightState);
}

/** The balance the HUD shows: the diamonds still flying toward it are not counted yet. */
export function useShownDiamonds(balance: number): number {
  const { pendingAmount } = useDiamondFlights();
  return Math.max(0, balance - pendingAmount);
}
