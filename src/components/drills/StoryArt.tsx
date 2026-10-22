import React from 'react';
import { getStoryArt } from '../../themes/themeArt';
import { useArtStatus } from '../../hooks/useArtStatus';

interface StoryArtProps {
  missionId: string;
}

/**
 * The story step's spot illustration (Feature 25), /art/stories/<missionId>.webp. Shows nothing
 * until the file exists. The mission runner preloads it at the start, so it is known by now.
 */
export const StoryArt: React.FC<StoryArtProps> = ({ missionId }) => {
  const src = getStoryArt(missionId);
  const status = useArtStatus(src);
  if (status !== 'loaded') return null;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      className="w-full max-h-60 object-cover rounded-2xl shadow-md select-none short:hidden"
    />
  );
};
