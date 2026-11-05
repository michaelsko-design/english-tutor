import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { RoomItem } from '../../data/room';
import { TEST_THEME } from '../../test/fixtures';
import { RoomInventory } from './RoomInventory';

vi.mock('./ItemIcon', () => ({ ItemIcon: () => <span>icon</span> }));

const PLANT = { id: 'room-plant', emoji: '🪴', nameEn: 'plant', nameHe: 'עציץ', slotKind: 'floor' } as RoomItem;
const SOFA = { id: 'room-sofa', emoji: '🛋️', nameEn: 'sofa', nameHe: 'ספה', slotKind: 'floor' } as RoomItem;
const DRAWN = { id: 'drawn-1', emoji: '', nameEn: 'happy sun', nameHe: '', slotKind: 'board', isDrawnSticker: true } as RoomItem;
const onSelectItem = vi.fn();

function setup(props: { placed?: string[]; selected?: string | null; gender?: 'girl' | 'boy'; items?: RoomItem[] } = {}) {
  render(
    <RoomInventory
      items={props.items ?? [PLANT, SOFA, DRAWN]}
      placedItemIds={props.placed ?? []}
      selectedItemId={props.selected ?? null}
      gender={props.gender ?? 'girl'}
      theme={TEST_THEME}
      onSelectItem={onSelectItem}
    />
  );
  return userEvent.setup();
}

describe('RoomInventory', () => {
  it('lists the items and counts those waiting for a place', () => {
    setup({ placed: ['room-plant'] });
    expect(screen.getByText('2 מחכים למקום')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /עציץ.*בחדר/ })).toBeInTheDocument();
    expect(screen.getAllByText('חדש')).toHaveLength(2);
  });

  it('shows no count when everything is placed', () => {
    setup({ items: [PLANT], placed: ['room-plant'] });
    expect(screen.queryByText(/מחכים למקום/)).not.toBeInTheDocument();
  });

  it('shows a drawn sticker by its English name', () => {
    setup();
    expect(screen.getByText('happy sun')).toHaveAttribute('dir', 'ltr');
  });

  it('selects an item and marks the selected one', async () => {
    const user = setup({ selected: 'room-sofa' });
    expect(screen.getByRole('button', { name: /ספה/ })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: /עציץ/ }));
    expect(onSelectItem).toHaveBeenCalledWith('room-plant');
  });

  it('uses masculine instructions for a boy', () => {
    setup({ gender: 'boy' });
    expect(screen.getByText(/בחר פריט, ואז מקום מהבהב/)).toBeInTheDocument();
  });
});
