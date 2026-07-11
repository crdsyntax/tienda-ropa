import { useState, useRef, useCallback, type ReactNode } from 'react';

export interface CarouselImage {
  id: string;
  url: string;
  alt: string;
}

interface CarouselProps {
  images: CarouselImage[];
  maxVisible?: number;
  renderItem: (image: CarouselImage, index: number) => ReactNode;
}

export function Carousel({ images, maxVisible = 5, renderItem }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleImages = images.slice(0, maxVisible);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? visibleImages.length - 1 : prev - 1));
  }, [visibleImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === visibleImages.length - 1 ? 0 : prev + 1));
  }, [visibleImages.length]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
    touchEnd.current = null;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEnd.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    touchStart.current = null;
    touchEnd.current = null;
  }, [goToNext, goToPrevious]);

  if (visibleImages.length === 0) return null;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="overflow-hidden rounded-xl touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {visibleImages.map((image, index) => (
            <div key={image.id} className="w-full flex-shrink-0">
              {renderItem(image, index)}
            </div>
          ))}
        </div>
      </div>

      {visibleImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors backdrop-blur-sm cursor-pointer"
            aria-label="Imagen anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors backdrop-blur-sm cursor-pointer"
            aria-label="Siguiente imagen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {visibleImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {visibleImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                index === currentIndex ? 'bg-white scale-110' : 'bg-white/50'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
