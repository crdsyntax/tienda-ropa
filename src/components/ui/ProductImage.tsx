import { useState, useEffect, type ImgHTMLAttributes } from 'react';
import { isIdbUrl, resolveImageUrl } from '../../services/imageStore';

interface ProductImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  fallback?: string;
}

export function ProductImage({ src, fallback = '', className = '', ...props }: ProductImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setResolvedSrc(fallback);
      return;
    }
    if (!isIdbUrl(src)) {
      setResolvedSrc(src);
      return;
    }
    let cancelled = false;
    resolveImageUrl(src).then((url) => {
      if (!cancelled) setResolvedSrc(url);
    });
    return () => { cancelled = true; };
  }, [src, fallback]);

  if (!resolvedSrc && !error) {
    return <div className={`bg-slate-100 ${className}`} />;
  }

  return (
    <img
      src={error ? fallback : resolvedSrc}
      onError={() => setError(true)}
      className={className}
      {...props}
    />
  );
}
