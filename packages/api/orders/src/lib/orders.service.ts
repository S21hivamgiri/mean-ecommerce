import type { Order } from '@myCommerce/models';
import { randomUUID } from 'crypto';
import { OrdersRepository } from './orders.repository';

export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  getOrders(): Order[] {
    return this.ordersRepository.findAll();
  }

  getOrder(id: string): Order | undefined {
    return this.ordersRepository.findById(id);
  }

  createOrder(userId: string, total: number): Order {
    if (total <= 0) {
      throw new Error('Order total must be greater than zero');
    }

    const order: Order = {
      id: randomUUID(),
      userId,
      total,
      status: 'pending',
    };

    return this.ordersRepository.create(order);
  }
}
