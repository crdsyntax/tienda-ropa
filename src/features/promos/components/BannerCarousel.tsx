import { useState, useEffect, useCallback, useRef } from 'react';
import type { PromoSlide } from '../../../types';

const PROMOS: PromoSlide[] = [
  {
    id: '1',
    title: 'Hasta 40% OFF',
    subtitle: 'En toda la colección de verano. ¡No te lo pierdas!',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    bgColor: 'from-rose-500 to-pink-600',
    accentColor: 'bg-white text-rose-600',
    ctaText: 'Ver ofertas',
  },
  {
    id: '2',
    title: 'Nueva Colección',
    subtitle: 'Descubre los últimos estilos en moda urbana.',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
    bgColor: 'from-violet-500 to-purple-700',
    accentColor: 'bg-white text-violet-600',
    ctaText: 'Explorar',
  },
  {
    id: '3',
    title: 'Envío Gratis',
    subtitle: 'En compras mayores a $99. Válido solo por tiempo limitado.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200',
    bgColor: 'from-emerald-500 to-teal-600',
    accentColor: 'bg-white text-emerald-600',
    ctaText: 'Comprar ahora',
  },
  {
    id: '4',
    title: '2x1 en Sudaderas',
    subtitle: 'Lleva dos sudaderas por el precio de una esta semana.',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200',
    bgColor: 'from-amber-500 to-orange-600',
    accentColor: 'bg-white text-amber-600',
    ctaText: 'Aprovechar',
  },
];

interface BannerCarouselProps {
  onCtaClick?: () => void;
}

export function BannerCarousel({ onCtaClick }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % PROMOS.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + PROMOS.length) % PROMOS.length);
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goToNext, 5000);
  }, [goToNext]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleManualNav = useCallback((action: () => void) => {
    action();
    resetTimer();
  }, [resetTimer]);

  const slide = PROMOS[current];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-8 group">
      <div className={`relative bg-gradient-to-r ${slide.bgColor} transition-colors duration-500`}>
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 p-6 sm:p-8 md:p-10 z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2">
              {slide.title}
            </h2>
            <p className="text-white/80 text-sm sm:text-base mb-5 max-w-md">
              {slide.subtitle}
            </p>
            <button
              onClick={onCtaClick}
              className={`${slide.accentColor} font-bold px-6 py-2.5 rounded-full text-sm hover:scale-105 transition-transform cursor-pointer shadow-lg`}
            >
              {slide.ctaText}
            </button>
          </div>

          <div className="w-full md:w-2/5 h-48 sm:h-56 md:h-72 flex-shrink-0">
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover select-none"
              draggable={false}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => handleManualNav(goToPrev)}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-all backdrop-blur-sm cursor-pointer"
        aria-label="Promoción anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => handleManualNav(goToNext)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 hover:bg-black/50 transition-all backdrop-blur-sm cursor-pointer"
        aria-label="Siguiente promoción"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {PROMOS.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index);
              resetTimer();
            }}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === current ? 'bg-white w-6' : 'bg-white/40 w-2 hover:bg-white/60'
            }`}
            aria-label={`Ir a promoción ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
