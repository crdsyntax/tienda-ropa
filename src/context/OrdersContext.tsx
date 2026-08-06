import { createContext, useContext, useCallback, type ReactNode } from 'react';
import type { Order, OrderPayment } from '../types/order';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ORDERS_KEY = 'cottonshop_orders_v1';

export interface NewOrderInput {
  customer: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  items: Order['items'];
  paymentMethod: string;
  payment?: OrderPayment;
  address: string;
}

interface OrdersContextType {
  orders: Order[];
  registerOrder: (input: NewOrderInput) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  clearOrders: () => void;
}

const OrdersContext = createContext<OrdersContextType | null>(null);

function buildId(orders: Order[]): string {
  const next = orders.reduce((max, o) => {
    const n = Number(o.id.replace(/^\D+/, ''));
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0) + 1;
  return `ORD-${String(next).padStart(3, '0')}`;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const { value: orders, setValue: setOrders } = useLocalStorage<Order[]>(ORDERS_KEY, []);

  const registerOrder = useCallback((input: NewOrderInput): Order => {
    const order: Order = {
      id: buildId(orders),
      customer: input.customer,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      date: new Date().toISOString(),
      total: input.total,
      status: 'pending',
      items: input.items,
      paymentMethod: input.paymentMethod,
      payment: input.payment,
      address: input.address,
    };
    setOrders((prev) => [...prev, order]);
    return order;
  }, [orders, setOrders]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }, [setOrders]);

  const clearOrders = useCallback(() => {
    setOrders([]);
  }, [setOrders]);

  return (
    <OrdersContext.Provider value={{ orders, registerOrder, updateOrderStatus, clearOrders }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders(): OrdersContextType {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders debe usarse dentro de un OrdersProvider');
  }
  return context;
}