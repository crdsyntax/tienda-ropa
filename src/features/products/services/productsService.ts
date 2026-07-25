import type { CatalogProduct } from '../../../types/catalog';
import type { PromoSlide } from '../../../types';

interface CatalogDataFile {
  version: string;
  updatedAt: string;
  products: CatalogProduct[];
  promos: PromoSlide[];
}

const STORAGE_KEY = 'cottonshop_products';

async function fetchFromJson(): Promise<CatalogDataFile> {
  const res = await fetch('/data/productos.json');
  if (!res.ok) {
    throw new Error(`Error al cargar el catálogo: ${res.statusText}`);
  }
  return res.json();
}

function loadLocalProducts(): CatalogProduct[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    /* ignore */
  }
  return null;
}

export const productsService = {
  async getProducts(): Promise<CatalogProduct[]> {
    const local = loadLocalProducts();
    if (local) return local;
    const data = await fetchFromJson();
    return data.products;
  },

  async getProductById(id: string): Promise<CatalogProduct | undefined> {
    const local = loadLocalProducts();
    if (local) return local.find((p) => p.id === id);
    const data = await fetchFromJson();
    return data.products.find((p) => p.id === id);
  },

  async getProductsByBrand(brand: string): Promise<CatalogProduct[]> {
    const local = loadLocalProducts();
    if (local) return local.filter((p) => p.brand === brand);
    const data = await fetchFromJson();
    return data.products.filter((p) => p.brand === brand);
  },

  async getPromos(): Promise<PromoSlide[]> {
    const data = await fetchFromJson();
    return data.promos;
  },
};
