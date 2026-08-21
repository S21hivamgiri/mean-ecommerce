import type { Request, Response } from 'express';
import { OrdersService } from './orders.service';
import { createOrderSchema } from './orders.types';

export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  getOrders = (_req: Request, res: Response) => {
    const orders = this.ordersService.getOrders();

    res.json(orders);
  };

  getOrder = (req: Request, res: Response) => {
    const order = this.ordersService.getOrder(req.params.id);

    if (!order) {
      res.status(404).json({
        message: 'Order not found',
      });

      return;
    }

    res.json(order);
  };

  createOrder = (req: Request, res: Response) => {
    const result = createOrderSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: 'Invalid request',
        errors: result.error.flatten(),
      });

      return;
    }

    const { userId, total } = result.data;

    const order = this.ordersService.createOrder(userId, total);

    res.status(201).json(order);
  };
}
