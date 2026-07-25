import { useState, useCallback } from 'react';
import type { CatalogProduct } from '../../../types/catalog';
import { Carousel, type CarouselImage } from '../../../components/ui/Carousel';
import { ProductImage } from '../../../components/ui/ProductImage';
import { useCart } from '../../../context/CartContext';

interface ProductCardProps {
  product: CatalogProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? '');
  const [addedFeedback, setAddedFeedback] = useState(false);
  const { addItem } = useCart();

  const carouselImages: CarouselImage[] = product.images.slice(0, 5).map((url, i) => ({
    id: `${product.id}-img-${i}`,
    url,
    alt: `${product.name} - Imagen ${i + 1}`,
  }));

  const handleExpand = useCallback((image: CarouselImage) => {
    console.log('Expand image:', image.url);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!selectedSize) return;
    addItem(product, selectedSize);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  }, [addItem, product, selectedSize]);

  const hasDiscount = product.originalPrice != null && product.originalPrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const inStock = product.stock > 0;

  return (
    <>
      <article className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative">
          <Carousel
            images={carouselImages}
            renderItem={(image) => (
              <div className="relative aspect-[3/4] bg-slate-100">
                  <ProductImage
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover select-none"
                    draggable={false}
                  />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpand(image);
                  }}
                  className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/90 shadow-lg hover:bg-white transition-all backdrop-blur-sm cursor-pointer hover:scale-110"
                  aria-label="Expandir imagen"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </button>
              </div>
            )}
          />

          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
            {product.brand}
          </p>
          <h3 className="text-base font-semibold text-slate-900 leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">
                ${product.originalPrice!.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mb-3">
            <span className="text-xs text-slate-400 mb-1.5 block">Talla:</span>
            <div className="flex gap-1.5 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              addedFeedback
                ? 'bg-emerald-500 text-white'
                : inStock
                  ? 'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {addedFeedback ? (
              <span className="inline-flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Agregado
              </span>
            ) : !inStock ? (
              'Agotado'
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Agregar al carrito
              </span>
            )}
          </button>
        </div>
      </article>
    </>
  );
}
