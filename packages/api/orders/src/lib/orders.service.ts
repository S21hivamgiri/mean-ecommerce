import type { Order } from '@myCommerce/models';
import { randomUUID } from 'crypto';
import { OrdersRepository } from './orders.repository';

export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}
  async getOrders(): Promise<Order[]> {
    return this.ordersRepository.findAll();
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.ordersRepository.findById(id);
  }

  async createOrder(userId: string, totalCents: number): Promise<Order> {
    if (totalCents <= 0) {
      throw new Error('Order total must be greater than zero');
    }

    const order: Order = {
      id: randomUUID(),
      userId,
      totalCents,
      status: 'pending',
    };

    return this.ordersRepository.create(order);
  }
}
