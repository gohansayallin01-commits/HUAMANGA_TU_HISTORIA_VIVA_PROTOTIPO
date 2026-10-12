import React, { useState } from 'react';

interface ImageFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  category?: string;
}

export const ImageFallback: React.FC<ImageFallbackProps> = ({
  src,
  alt = 'Atractivo turístico',
  fallbackSrc,
  className = '',
  category,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // SVG de respaldo elegante con identidad andina
  const defaultSvgFallback = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23082A4A"/><path d="M 50 350 L 200 180 L 320 280 L 450 140 L 580 350 Z" fill="%230D3B66"/><path d="M 180 350 L 300 220 L 420 320 L 500 230 L 580 350 Z" fill="%23D8A64C" opacity="0.3"/><circle cx="300" cy="120" r="35" fill="%23F2D493"/><text x="300" y="320" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23FAF8F3" text-anchor="middle">HUAMANGA: TU HISTORIA VIVA</text></svg>`;

  return (
    <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 skeleton-shimmer z-0" />
      )}
      <img
        src={error ? (fallbackSrc || defaultSvgFallback) : src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        {...props}
      />
    </div>
  );
};
