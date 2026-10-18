import React from 'react';
import { useArtStatus } from '../../hooks/useArtStatus';

interface ArtImageProps {
  src: string;
  /** Size and position classes for the box; the box keeps its size whatever happens. */
  className?: string;
  imgClassName?: string;
  /** Inline style for the picture only (not the fallback), e.g. a CSS filter */
  imgStyle?: React.CSSProperties;
  alt?: string;
  /** Shown when the file is missing. Nothing is shown while it loads. */
  fallback?: React.ReactNode;
}

/**
 * A generated picture that may not exist yet (Feature 25): no broken-image icon and no layout
 * jump. The box is sized by the caller; it stays empty while loading and shows the fallback
 * when the file is missing.
 */
export const ArtImage: React.FC<ArtImageProps> = ({
  src,
  className = '',
  imgClassName = '',
  imgStyle,
  alt = '',
  fallback = null,
}) => {
  const status = useArtStatus(src);

  return (
    <div className={`relative ${className}`}>
      {status === 'loaded' && (
        <img
          src={src}
          alt={alt}
          aria-hidden={alt === '' ? true : undefined}
          draggable={false}
          decoding="async"
          style={imgStyle}
          className={`absolute inset-0 w-full h-full object-contain select-none ${imgClassName}`}
        />
      )}
      {status === 'missing' && fallback}
    </div>
  );
};
