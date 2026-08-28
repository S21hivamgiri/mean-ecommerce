export interface Order {
  id: string;
  totalCents: number;
  quantity: number;
  status: OrderStatus;
  productId: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
