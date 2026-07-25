import type { ReactNode } from 'react';
import { LayoutDashboard, Package, Warehouse, ShoppingCart } from 'lucide-react';
import type { Section } from './types';

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export const CATEGORIES = [
  'Camisetas',
  'Pantalones',
  'Chaquetas',
  'Vestidos',
  'Sudaderas',
  'Shorts',
  'Accesorios',
];

export const NAV_ITEMS: { id: Section; label: string; icon: ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'products', label: 'Productos', icon: <Package size={18} /> },
  { id: 'inventory', label: 'Inventario', icon: <Warehouse size={18} /> },
  { id: 'orders', label: 'Pedidos', icon: <ShoppingCart size={18} /> },
];

export const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  draft: 'bg-slate-100 text-slate-500 border-slate-300',
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  shipped: 'bg-blue-50 text-blue-600 border-blue-200',
  delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  cancelled: 'bg-red-50 text-red-500 border-red-200',
};

export const STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  draft: 'Borrador',
  pending: 'Pendiente',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};
