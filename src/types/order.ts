export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  quantity: number;
  price: number;
}

export interface OrderPayment {
  methodId: string;
  methodLabel: string;
  userData: Record<string, string>;
}

export interface Order {
  id: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  paymentMethod: string;
  payment?: OrderPayment;
  address: string;
}