import type { CatalogProduct } from '../../types/catalog';
import type { Order, OrderItem, OrderStatus } from '../../types/order';

export type BackofficeProduct = CatalogProduct;

export type { Order, OrderItem, OrderStatus };

export type Section = 'dashboard' | 'products' | 'inventory' | 'orders' | 'promos' | 'payment';