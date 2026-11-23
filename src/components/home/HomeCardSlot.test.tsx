import React, { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import type { HomeCardId } from '../../data/homeCards';
import { HomeCardSlot, useHomeCardTurn } from './HomeCardSlot';

const Card: React.FC<{ id: HomeCardId; initiallyWants?: boolean }> = ({ id, initiallyWants = true }) => {
  const [wants, setWants] = useState(initiallyWants);
  const isMyTurn = useHomeCardTurn(id, wants);
  return (
    <>
      <button type="button" onClick={() => setWants((w) => !w)}>
        toggle {id}
      </button>
      {isMyTurn && (
        <section aria-label={id}>
          <button type="button" onClick={() => setWants(false)}>
            close {id}
          </button>
        </section>
      )}
    </>
  );
};

const Home: React.FC<{ visitKey: number }> = ({ visitKey }) => (
  <HomeCardSlot visitKey={visitKey}>
    <Card id="parent-nudge" />
    <Card id="home-tip" />
    <Card id="welcome-back" initiallyWants={false} />
  </HomeCardSlot>
);

const shownCards = () => screen.queryAllByRole('region').map((el) => el.getAttribute('aria-label'));

describe('HomeCardSlot', () => {
  it('shows only the highest-priority card that wants to show', () => {
    render(<Home visitKey={0} />);
    expect(shownCards()).toEqual(['home-tip']);
  });

  it('keeps the shown card when a higher card turns up later in the visit', () => {
    render(<Home visitKey={0} />);
    fireEvent.click(screen.getByRole('button', { name: 'toggle welcome-back' }));
    expect(shownCards()).toEqual(['home-tip']);
  });

  it('shows no other card after the shown one is closed, until the next visit', () => {
    const { rerender } = render(<Home visitKey={0} />);
    fireEvent.click(screen.getByRole('button', { name: 'close home-tip' }));
    expect(shownCards()).toEqual([]);

    act(() => rerender(<Home visitKey={1} />));
    expect(shownCards()).toEqual(['parent-nudge']);
  });

  it('lets a card show by itself outside a slot', () => {
    render(<Card id="home-tip" />);
    expect(shownCards()).toEqual(['home-tip']);
  });
});
