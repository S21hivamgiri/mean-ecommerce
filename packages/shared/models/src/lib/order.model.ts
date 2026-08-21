export interface Order {
  id: string;
  userId: string;
  totalCents: number;
  status: OrderStatus;
  productId: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'CANCELLED';
