export interface Order {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
}

export type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled';
