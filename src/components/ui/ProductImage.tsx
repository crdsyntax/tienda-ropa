import { useState, useEffect, useRef, type ImgHTMLAttributes } from 'react';
import { isIdbUrl, resolveImageUrl } from '../../services/imageStore';

const FALLBACK_IMG = 'https://placehold.co/200x200/E2E8F0/94A3B8?text=Sin+imagen';

interface ProductImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
}

export function ProductImage({ src, className = '', style, ...props }: ProductImageProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!src || !isIdbUrl(src)) {
      setDataUrl(null);
      return;
    }
    resolveImageUrl(src).then((url) => {
      if (mountedRef.current) setDataUrl(url || null);
    });
  }, [src]);

  const effectiveSrc = isIdbUrl(src) ? (dataUrl || FALLBACK_IMG) : (src || FALLBACK_IMG);

  return (
    <img
      src={effectiveSrc}
      onError={(e) => {
        (e.target as HTMLImageElement).src = FALLBACK_IMG;
      }}
      className={className}
      style={style}
      {...props}
    />
  );
}
