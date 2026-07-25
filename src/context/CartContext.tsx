import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CatalogProduct } from '../types/catalog';
import type { OrderInfo } from '../types';
import { STORE_ADDRESS } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const CART_TTL = 24 * 60 * 60 * 1000;

export interface CartItem {
  product: CatalogProduct;
  quantity: number;
  size: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: CatalogProduct, size: string) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  totalItems: number;
  totalPrice: number;
  clearCart: () => void;
  orderInfo: OrderInfo;
  setOrderInfo: (info: Partial<OrderInfo>) => void;
  getDeliveryAddress: () => string;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const initialOrder: OrderInfo = {
  name: '',
  phone: '',
  email: '',
  deliveryMode: 'delivery',
  address: '',
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { value: items, setValue: setItems } = useLocalStorage<CartItem[]>('cart-items', [], { ttl: CART_TTL });
  const [orderInfo, setOrderInfoState] = useState<OrderInfo>(initialOrder);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = useCallback((product: CatalogProduct, size: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1, size }];
    });
    setIsCartOpen(true);
  }, [setItems]);

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.size === size)));
  }, [setItems]);

  const updateQuantity = useCallback((productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.size === size)));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.size === size ? { ...i, quantity } : i
      )
    );
  }, [setItems]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const clearCart = useCallback(() => {
    setItems([]);
    setOrderInfoState(initialOrder);
  }, [setItems]);

  const setOrderInfo = useCallback((info: Partial<OrderInfo>) => {
    setOrderInfoState((prev) => ({ ...prev, ...info }));
  }, []);

  const getDeliveryAddress = useCallback(() => {
    if (orderInfo.deliveryMode === 'pickup') return STORE_ADDRESS;
    return orderInfo.address;
  }, [orderInfo.deliveryMode, orderInfo.address]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQuantity,
        totalItems, totalPrice, clearCart,
        orderInfo, setOrderInfo, getDeliveryAddress,
        isCartOpen, openCart, closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
}
