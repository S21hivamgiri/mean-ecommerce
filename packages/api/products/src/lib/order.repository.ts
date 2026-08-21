import type { Order } from '@myCommerce/models';

export class OrdersRepository {
  private orders: Order[] = [];

  findAll(): Order[] {
    return this.orders;
  }

  findById(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }

  create(order: Order): Order {
    this.orders.push(order);

    return order;
  }
}
