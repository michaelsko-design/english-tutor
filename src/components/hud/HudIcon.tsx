import React from 'react';

/** The drawn icons of the counters (public/art/icons): the same look as the rest of the art on every device. */
export type HudIconName = 'star' | 'gem' | 'flame' | 'trophy';

const ICON_FILE_BY_NAME: Record<HudIconName, string> = {
  star: 'room-star',
  gem: 'ui-gem',
  flame: 'ui-flame',
  trophy: 'room-trophy',
};

interface HudIconProps {
  name: HudIconName;
  /** Size classes, e.g. "w-5 h-5" */
  className: string;
  /** Grey, for a missed star */
  isGreyed?: boolean;
}

export const HudIcon: React.FC<HudIconProps> = ({ name, className, isGreyed = false }) => (
  <img
    src={`/art/icons/${ICON_FILE_BY_NAME[name]}.webp`}
    alt=""
    aria-hidden="true"
    width={256}
    height={256}
    draggable={false}
    decoding="async"
    className={`${className} object-contain select-none ${isGreyed ? 'grayscale opacity-50' : ''}`}
  />
);
