import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { HomeCardId, pickHomeCard } from '../../data/homeCards';

interface HomeCardSlotValue {
  pickedId: HomeCardId | null;
  setWanting: (id: HomeCardId, wantsToShow: boolean) => void;
}

const HomeCardSlotContext = createContext<HomeCardSlotValue | null>(null);

interface HomeCardSlotProps {
  /** Changes when a new visit starts (coming back home from a mission) */
  visitKey: number;
  children: React.ReactNode;
}

/** Lets one optional home card show per visit (`data/homeCards.ts`) */
export const HomeCardSlot: React.FC<HomeCardSlotProps> = ({ visitKey, children }) => {
  const [wanting, setWantingSet] = useState<ReadonlySet<HomeCardId>>(() => new Set());
  const [lockedId, setLockedId] = useState<HomeCardId | null>(null);

  // A new visit: the card shown last time no longer holds the place
  useEffect(() => {
    setLockedId(null);
  }, [visitKey]);

  const pickedId = pickHomeCard(wanting, lockedId);

  useEffect(() => {
    if (lockedId === null && pickedId !== null) setLockedId(pickedId);
  }, [lockedId, pickedId]);

  const setWanting = useCallback((id: HomeCardId, wantsToShow: boolean) => {
    setWantingSet((prev) => {
      if (prev.has(id) === wantsToShow) return prev;
      const next = new Set(prev);
      if (wantsToShow) next.add(id);
      else next.delete(id);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ pickedId, setWanting }), [pickedId, setWanting]);
  return <HomeCardSlotContext.Provider value={value}>{children}</HomeCardSlotContext.Provider>;
};

/**
 * Whether this card may show now. Call it before any early return. Outside a `HomeCardSlot` (a card's own tests),
 * the card shows whenever it wants to.
 */
export function useHomeCardTurn(id: HomeCardId, wantsToShow: boolean): boolean {
  const slot = useContext(HomeCardSlotContext);
  const setWanting = slot?.setWanting;

  useEffect(() => {
    if (!setWanting) return undefined;
    setWanting(id, wantsToShow);
    return () => setWanting(id, false);
  }, [setWanting, id, wantsToShow]);

  if (!slot) return wantsToShow;
  return wantsToShow && slot.pickedId === id;
}
