export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: ProductImage[];
  brand: string;
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
}

export interface PromoSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  bgColor: string;
  accentColor: string;
  ctaText: string;
}

export type DeliveryMode = 'delivery' | 'pickup';

export interface OrderInfo {
  name: string;
  phone: string;
  email: string;
  deliveryMode: DeliveryMode;
  address: string;
}

export const STORE_ADDRESS = 'Av. Principal #1234, Col. Centro, Ciudad de México, CP 06000';
export const STORE_EMAIL = 'contacto@tiendaropa.com';
export const STORE_PHONE = '+52 55 1234 5678';
export const STORE_MAPS_URL = 'https://www.google.com/maps?q=19.4326,-99.1332';
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/tiendaropa',
  facebook: 'https://facebook.com/tiendaropa',
  x: 'https://x.com/tiendaropa',
} as const;
