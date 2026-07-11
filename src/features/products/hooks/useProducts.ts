import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../../../types';
import { productsService } from '../services/productsService';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsService.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

interface UseProductDetailReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export function useProductDetail(id: string): UseProductDetailReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const data = await productsService.getProductById(id);
        if (!cancelled) {
          setProduct(data ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar el producto');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    fetchProduct();
    return () => { cancelled = true; };
  }, [id]);

  return { product, loading, error };
}
