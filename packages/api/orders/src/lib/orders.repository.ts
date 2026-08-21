import type { Order } from '@myCommerce/models';
import { PrismaClient } from '@prisma/client';
import { OrderStatus } from '@myCommerce/models';

export class OrdersRepository {
  constructor(
    private readonly prisma: PrismaClient
  ) {}

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

  async create(order: Order): Promise<Order> {
    const createdOrder = await this.prisma.order.create({
      data: {
        id: order.id,
        userId: order.userId,
        totalCents: order.totalCents,
        status: `${order.status}`,
      },
    });

    return this.mapOrder(createdOrder);
  }
}