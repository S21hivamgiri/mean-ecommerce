import { Order, PaymentRequestedEvent } from '@myCommerce/models';
import { randomUUID } from 'crypto';
import { OrdersRepository } from './orders.repository';
import { InventoryClient } from '../clients/inventory.client';

export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly inventoryClient: InventoryClient,
  ) {}
  async getOrders(): Promise<Order[]> {
    return this.ordersRepository.findAll();
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.ordersRepository.findById(id);
  }

  async createOrder(
    productId: string,
    userId: string,
    totalCents: number,
    quantity: number,
  ): Promise<Order> {
    if (totalCents <= 0) {
      throw new Error('Order total must be greater than zero');
    }

    await this.inventoryClient.reserve(productId, quantity);
    const order: Order = {
      id: randomUUID(),
      userId,
      totalCents,
      productId,
      quantity,
      status: 'PENDING',
    };

     const event: PaymentRequestedEvent = {
       type: 'payment.requested',

       payload: {
         orderId: order.id,
         userId: order.userId,
         amountCents: order.totalCents,
       },
     };

     return this.ordersRepository.createWithEvent(order, event);
  }
}
