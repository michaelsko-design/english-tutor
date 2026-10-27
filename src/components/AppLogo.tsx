import React from 'react';

interface AppLogoProps {
  /** Rendered width and height in px (the PNG is 192px, so up to ~96 stays sharp on 2x screens). */
  size: number;
  className?: string;
}

/** The round EnglishVibe app icon; decorative, since the app name is always written next to it. */
export const AppLogo: React.FC<AppLogoProps> = ({ size, className = '' }) => (
  <img
    src="/icon-192.png"
    alt=""
    aria-hidden="true"
    width={size}
    height={size}
    draggable={false}
    className={`rounded-full shrink-0 ${className}`}
  />
);
