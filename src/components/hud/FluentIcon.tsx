import React from 'react';

/** Microsoft Fluent Emoji 3D art (MIT, public/art/emoji/LICENSE): the same look on every device. */
export type FluentIconName = 'star' | 'gem' | 'flame' | 'trophy';

interface FluentIconProps {
  name: FluentIconName;
  /** Size classes, e.g. "w-5 h-5" */
  className: string;
  /** Grey, for a missed star */
  isGreyed?: boolean;
}

export const FluentIcon: React.FC<FluentIconProps> = ({ name, className, isGreyed = false }) => (
  <img
    src={`/art/emoji/${name}.png`}
    alt=""
    aria-hidden="true"
    width={256}
    height={256}
    draggable={false}
    decoding="async"
    className={`${className} object-contain select-none ${isGreyed ? 'grayscale opacity-50' : ''}`}
  />
);
