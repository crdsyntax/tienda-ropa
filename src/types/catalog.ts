import type { PromoSlide } from './index';

export interface CatalogProduct {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  originalPrice: number | null;
  currency: string;
  images: string[];
  brand: string;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  status: 'active' | 'draft';
}

export interface CatalogData {
  version: string;
  updatedAt: string;
  products: CatalogProduct[];
  promos: PromoSlide[];
}
