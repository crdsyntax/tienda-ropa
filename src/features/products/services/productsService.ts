import type { Product } from '../../../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Camiseta Básica Algodón',
    description: 'Camiseta de algodón 100% orgánico, corte relajado ideal para el día a día.',
    price: 29.99,
    originalPrice: 39.99,
    currency: 'USD',
    images: [
      { id: '1a', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', alt: 'Camiseta blanca frontal' },
      { id: '1b', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600', alt: 'Camiseta blanca lateral' },
      { id: '1c', url: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=600', alt: 'Camiseta blanca detalle' },
    ],
    brand: 'UrbanStyle',
    category: 'Camisetas',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanco', 'Negro', 'Gris'],
    inStock: true,
  },
  {
    id: '2',
    title: 'Jeans Slim Fit Clásicos',
    description: 'Jeans de corte slim con acabado lavado suave. Tela stretch para mayor comodidad.',
    price: 79.99,
    currency: 'USD',
    images: [
      { id: '2a', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', alt: 'Jeans azul frontal' },
      { id: '2b', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', alt: 'Jeans azul lateral' },
      { id: '2c', url: 'https://images.unsplash.com/photo-1475178626620-a4d074967571?w=600', alt: 'Jeans azul detalle' },
      { id: '2d', url: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600', alt: 'Jeans azul trasero' },
    ],
    brand: 'DenimCo',
    category: 'Pantalones',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Azul Oscuro', 'Azul Claro', 'Negro'],
    inStock: true,
  },
  {
    id: '3',
    title: 'Chaqueta Bomber Premium',
    description: 'Chaqueta bomber con forro interior acolchado. Diseño moderno con cierre frontal.',
    price: 149.99,
    originalPrice: 199.99,
    currency: 'USD',
    images: [
      { id: '3a', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', alt: 'Chaqueta bomber verde' },
      { id: '3b', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600', alt: 'Chaqueta bomber lateral' },
      { id: '3c', url: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600', alt: 'Chaqueta bomber detalle' },
    ],
    brand: 'UrbanStyle',
    category: 'Chaquetas',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Verde Oliva', 'Negro', 'Azul Marino'],
    inStock: true,
  },
  {
    id: '4',
    title: 'Vestido Floral Verano',
    description: 'Vestido ligero con estampado floral, perfecto para la temporada de verano.',
    price: 64.99,
    currency: 'USD',
    images: [
      { id: '4a', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600', alt: 'Vestido floral frontal' },
      { id: '4b', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600', alt: 'Vestido floral modelo' },
    ],
    brand: 'FloraMode',
    category: 'Vestidos',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Rosa', 'Azul', 'Verde'],
    inStock: true,
  },
  {
    id: '5',
    title: 'Sudadera Oversized Premium',
    description: 'Sudadera de algodón franelilla, corte oversized con capucha ajustable.',
    price: 89.99,
    originalPrice: 110.00,
    currency: 'USD',
    images: [
      { id: '5a', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600', alt: 'Sudadera gris frontal' },
      { id: '5b', url: 'https://images.unsplash.com/photo-1578768079470-aa178a9f65f0?w=600', alt: 'Sudadera gris lateral' },
      { id: '5c', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600', alt: 'Sudadera gris detalle' },
      { id: '5d', url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600', alt: 'Sudadera gris espalda' },
      { id: '5e', url: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a92?w=600', alt: 'Sudadera gris lifestyle' },
    ],
    brand: 'UrbanStyle',
    category: 'Sudaderas',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Gris', 'Negro', 'Blanco'],
    inStock: true,
  },
  {
    id: '6',
    title: 'Shorts Deportivos Performance',
    description: 'Shorts deportivos con tecnología de secado rápido y bolsillos con cierre.',
    price: 44.99,
    currency: 'USD',
    images: [
      { id: '6a', url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600', alt: 'Shorts negro frontal' },
      { id: '6b', url: 'https://images.unsplash.com/photo-1562886889-41e5d808fd72?w=600', alt: 'Shorts negro detalle' },
    ],
    brand: 'SportFit',
    category: 'Shorts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Gris', 'Azul'],
    inStock: true,
  },
];

export const productsService = {
  async getProducts(): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_PRODUCTS;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_PRODUCTS.find((p) => p.id === id);
  },

  async getProductsByBrand(brand: string): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return MOCK_PRODUCTS.filter((p) => p.brand === brand);
  },
};
