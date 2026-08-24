import type { Order } from '@myCommerce/models';
import { PrismaClient } from '@prisma/client';
import { OrderStatus } from '@myCommerce/models';
import { DomainEvent } from '@myCommerce/queue';

export class OrdersRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private mapOrder(order: any): Order {
    return {
      ...order,
      status: order.status as OrderStatus,
    };
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order) => this.mapOrder(order));
  }

  async findById(id: string): Promise<Order | undefined> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });

    return order ? this.mapOrder(order) : undefined;
  }

  async createWithEvent(order: Order, event: DomainEvent): Promise<Order> {
    return this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          id: order.id,
          userId: order.userId,
          productId: order.productId,
          quantity: order.quantity,
          totalCents: order.totalCents,
          status: order.status,
        },
      });

      await tx.outboxEvent.create({
        data: {
          type: event.type,
          payload: event.payload,
        },
      });

      return this.mapOrder(createdOrder);
    });
  }
}
