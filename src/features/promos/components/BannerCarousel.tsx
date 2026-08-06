import { useState, useEffect, useCallback, useRef } from 'react';
import type { PromoSlide } from '../../../types';
import { productsService } from '../../products/services/productsService';
import { ProductImage } from '../../../components/ui/ProductImage';

interface BannerCarouselProps {
  onCtaClick?: () => void;
}

export function BannerCarousel({ onCtaClick }: BannerCarouselProps) {
  const [promos, setPromos] = useState<PromoSlide[]>([]);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    productsService.getPromos().then(setPromos).catch(() => {});
  }, []);

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % promos.length);
  }, [promos.length]);

  const goToPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + promos.length) % promos.length);
  }, [promos.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goToNext, 5000);
  }, [goToNext]);

  useEffect(() => {
    if (promos.length === 0) return;
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [promos.length, resetTimer]);

  if (promos.length === 0) return null;

  const slide = promos[current];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      <div className={`relative flex bg-gradient-to-r ${slide.bgColor} min-h-[200px] sm:min-h-[280px] lg:min-h-[340px] items-center`}>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full px-6 sm:px-10 lg:px-16 py-8 sm:py-12 gap-6">
          <div className="text-white max-w-lg">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {slide.title}
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-2 leading-relaxed">
              {slide.subtitle}
            </p>
            <button
              onClick={onCtaClick}
              className={`mt-4 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95 cursor-pointer ${slide.accentColor}`}
            >
              {slide.ctaText}
            </button>
          </div>
          <div className="flex items-center justify-center w-24 h-24 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full bg-white/10 backdrop-blur-sm overflow-hidden shrink-0">
            <ProductImage
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => { goToPrev(); resetTimer(); }}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all backdrop-blur-sm cursor-pointer z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => { goToNext(); resetTimer(); }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all backdrop-blur-sm cursor-pointer z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {promos.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); resetTimer(); }}
            className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
              i === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
