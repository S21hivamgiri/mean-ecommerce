import { Order } from '@myCommerce/models';
import { PaymentRequestedEvent } from '@myCommerce/queue';
import { randomUUID } from 'crypto';
import { OrdersRepository } from './orders.repository';
import { InventoryClient } from './infrastructure/client/inventory.client';
import { createLogger } from '@myCommerce/logger';
import { trace } from '@opentelemetry/api';
import { getTraceContext } from '@myCommerce/observability';
import { metrics } from '@opentelemetry/api';

const tracer = trace.getTracer('order-service');
const meter = metrics.getMeter('order-service');
const ordersCreated = meter.createCounter('orders.created', {
  description: 'Number of successfully created orders',
});
const ordersFailed = meter.createCounter('orders.failed', {
  description: 'Number of failed order creations',
});
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
    totalCents: number,
    quantity: number,
    requestId: string,
  ): Promise<Order> {
    if (totalCents <= 0) {
      throw new Error('Order total must be greater than zero');
    }
    const span = tracer.startSpan('order.create');

    await this.inventoryClient.reserve(productId, quantity, requestId);
    const order: Order = {
      id: randomUUID(),
      totalCents,
      productId,
      quantity,
      status: 'PENDING',
    };

    this.logger.info(
      {
        orderId: order.id,
        productId,
        quantity,
        totalCents,
        requestId,
      },
      'Creating order',
    );
    const event: PaymentRequestedEvent = {
      type: 'payment.requested',

      payload: {
        orderId: order.id,
        amountCents: order.totalCents,
        requestId,
      },
      traceContext: getTraceContext(),
    };

    ordersCreated.add(1);
    try {
      const orderResult = await this.ordersRepository.createWithEvent(
        order,
        event,
      );
      span.setAttributes({
        'order.id': orderResult.id,
        'order.quantity': orderResult.quantity,
        'order.total_cents': orderResult.totalCents,
      });
      this.logger.info(
        {
          orderId: orderResult.id,
        },
        'Order created',
      );
      return orderResult;
    } catch (error) {
      span.recordException(error as Error);

      span.setStatus({
        code: 2,
      });
      ordersFailed.add(1);

      throw error;
    } finally {
      span.end();
    }
  }
}
