import type { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import { createOrderSchema } from './orders.types';

export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  getOrders = async (_req: Request, res: Response) => {
    const orders = await this.ordersService.getOrders();

    res.json(orders);
  };

  getOrder = async (req: Request, res: Response) => {
    const order = await this.ordersService.getOrder(req.params.id);

    if (!order) {
      res.status(404).json({
        message: 'Order not found',
      });

      return;
    }

    res.json(order);
  };

  createOrder = async (req: Request, res: Response) => {
    const result = createOrderSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid request',
        errors: result.error.flatten(),
      });

      return;
    }

    const { totalCents, productId, quantity } = result.data;
    const order = await this.ordersService.createOrder(
      productId,
      totalCents,
      quantity,
      (req as Request).requestId,
    );

    res.status(201).json(order);
  };
}
