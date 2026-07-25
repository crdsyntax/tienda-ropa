import type { CatalogProduct } from '../../types/catalog';

export type BackofficeProduct = CatalogProduct;

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  paymentMethod: string;
  address: string;
}

export type Section = 'dashboard' | 'products' | 'inventory' | 'orders';
