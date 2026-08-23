import { Order, PaymentRequestedEvent } from '@myCommerce/models';
import { randomUUID } from 'crypto';
import { OrdersRepository } from './orders.repository';
import { InventoryClient } from './infrastructure/client/inventory.client';
import { createLogger } from '@myCommerce/logger';

export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly inventoryClient: InventoryClient,
  ) {}

  logger = createLogger('order-api');

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
    requestId: string,
  ): Promise<Order> {
    if (totalCents <= 0) {
      throw new Error('Order total must be greater than zero');
    }

    await this.inventoryClient.reserve(productId, quantity, requestId);
    const order: Order = {
      id: randomUUID(),
      userId,
      totalCents,
      productId,
      quantity,
      status: 'PENDING',
    };

    this.logger.info(
      {
        orderId: order.id,
        userId,
        productId,
        quantity,
        totalCents,
      },
      'Creating order',
    );
    const event: PaymentRequestedEvent = {
      type: 'payment.requested',

      payload: {
        orderId: order.id,
        userId: order.userId,
        amountCents: order.totalCents,
      },
    };
    this.logger.info(
      {
        orderId: order.id,
      },
      'Order created',
    );
    return this.ordersRepository.createWithEvent(order, event);
  }
}
