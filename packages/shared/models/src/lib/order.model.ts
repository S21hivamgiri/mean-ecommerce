export interface Order {
  id: string;
  userId: string;
  totalCents: number;
  status: OrderStatus;
}

export type OrderStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled';
