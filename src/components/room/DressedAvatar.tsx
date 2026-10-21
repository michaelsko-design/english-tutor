import React from 'react';
import { WardrobeItem, WardrobeLayer } from '../../data/wardrobe';
import { EmojiIcon } from '../art/EmojiIcon';

interface DressedAvatarProps {
  avatarEmoji: string;
  /** Worn items the avatar can wear (see getWornItems) */
  worn: WardrobeItem[];
  /** Sets the avatar size; every layer is sized in em from it */
  fontSize: string;
}

/** Accessories sit on the head (the avatar's icon, or its emoji); their size and offset are in em of the head. */
const ACCESSORY_STYLES: Partial<Record<WardrobeLayer, React.CSSProperties>> = {
  head: { top: '-0.38em', fontSize: '0.62em' },
  face: { top: '0.32em', fontSize: '0.5em' },
  neck: { bottom: '-0.3em', fontSize: '0.45em' },
};

/** Clothes stack under the head like a paper doll (person avatars only). */
const BODY_STYLES: Partial<Record<WardrobeLayer, React.CSSProperties>> = {
  torso: { fontSize: '0.75em', marginTop: '-0.12em' },
  legs: { fontSize: '0.62em', marginTop: '-0.22em' },
  feet: { fontSize: '0.45em', marginTop: '-0.2em' },
};

const FULL_SIZE = '1em';

/** The avatar with its outfit drawn on top and below it, all as drawn icons where they exist. */
export const DressedAvatar: React.FC<DressedAvatarProps> = ({ avatarEmoji, worn, fontSize }) => {
  const accessories = worn.filter((item) => item.layer in ACCESSORY_STYLES);
  const clothes = worn.filter((item) => item.layer in BODY_STYLES);

  return (
    <span className="relative inline-flex flex-col items-center leading-none" style={{ fontSize }}>
      <span className="relative z-10 inline-block">
        <EmojiIcon emoji={avatarEmoji} size={FULL_SIZE} />
        {accessories.map((item) => (
          <span
            key={item.id}
            className="absolute left-1/2 -translate-x-1/2 z-20"
            style={ACCESSORY_STYLES[item.layer]}
            aria-hidden="true"
          >
            <EmojiIcon emoji={item.emoji} size={FULL_SIZE} />
          </span>
        ))}
      </span>
      {clothes.map((item) => (
        <span key={item.id} className="block" style={BODY_STYLES[item.layer]} aria-hidden="true">
          <EmojiIcon emoji={item.emoji} size={FULL_SIZE} />
        </span>
      ))}
    </span>
  );
};
