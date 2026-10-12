import React, { useEffect, useState } from 'react';
import { ImageFallback } from './ImageFallback';
import { getImageAsBlobURL } from '../../services/imageStorage';

/** Prefijo usado en attraction.images para referenciar un Blob guardado en IndexedDB. */
export const STORED_PREFIX = 'idb:';

export function isStoredRef(src?: string): boolean {
  return typeof src === 'string' && src.startsWith(STORED_PREFIX);
}

export function toStoredRef(imageId: string): string {
  return `${STORED_PREFIX}${imageId}`;
}

export function storedRefToImageId(src: string): string {
  return src.slice(STORED_PREFIX.length);
}

interface StoredAttractionImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  category?: string;
}

/**
 * Muestra una imagen de atractivo que puede ser:
 * - una ruta estática (public/images/attractions/…) o URL externa, o
 * - una referencia `idb:<imageId>` resuelta desde IndexedDB como Blob.
 * La URL temporal del Blob se libera al desmontar el componente.
 */
export const StoredAttractionImage: React.FC<StoredAttractionImageProps> = ({
  src,
  alt = 'Atractivo turístico',
  className = '',
  fallbackSrc,
  category,
  ...props
}) => {
  const [resolved, setResolved] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setResolved(null);
    setNotFound(false);
    if (!isStoredRef(src)) return;

    let active = true;
    let createdUrl: string | null = null;

    getImageAsBlobURL(storedRefToImageId(src as string)).then((url) => {
      if (!active) {
        if (url) URL.revokeObjectURL(url);
        return;
      }
      if (url) {
        createdUrl = url;
        setResolved(url);
      } else {
        setNotFound(true);
      }
    });

    return () => {
      active = false;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [src]);

  if (!isStoredRef(src)) {
    return (
      <ImageFallback
        src={src}
        alt={alt}
        className={className}
        fallbackSrc={fallbackSrc}
        category={category}
        {...props}
      />
    );
  }

  if (notFound) {
    return (
      <ImageFallback alt={alt} className={className} fallbackSrc={fallbackSrc} category={category} {...props} />
    );
  }

  if (!resolved) {
    return (
      <div className={`relative overflow-hidden bg-slate-200 ${className}`}>
        <div className="absolute inset-0 skeleton-shimmer z-0" />
      </div>
    );
  }

  return (
    <ImageFallback
      src={resolved}
      alt={alt}
      className={className}
      fallbackSrc={fallbackSrc}
      category={category}
      {...props}
    />
  );
};

export default StoredAttractionImage;
