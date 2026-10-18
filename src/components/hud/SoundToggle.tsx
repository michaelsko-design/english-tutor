import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSfxMuted } from '../../hooks/useSfxMuted';
import { playSfx, setSfxMuted } from '../../utils/sfx';

interface SoundToggleProps {
  className: string;
}

/** Feature 24: mutes the sound effects on this device (spoken English is not affected). */
export const SoundToggle: React.FC<SoundToggleProps> = ({ className }) => {
  const isMuted = useSfxMuted();
  const label = isMuted ? 'הפעלת צלילים' : 'השתקת צלילים';

  const handleToggle = () => {
    setSfxMuted(!isMuted);
    if (isMuted) playSfx('tap');
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`p-1.5 rounded-xl ${className}`}
      title={label}
      aria-label="השתקת צלילים"
      aria-pressed={isMuted}
    >
      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
  );
};
