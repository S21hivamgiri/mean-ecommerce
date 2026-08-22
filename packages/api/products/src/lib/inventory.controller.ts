import type { Request, Response } from 'express';

import { reserveInventorySchema } from './inventory.types';
import {InventoryService} from './inventory.service';

export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  reserve = async (req: Request, res: Response, next: Function) => {
    try {
      const result = reserveInventorySchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({
          message: 'Invalid request',
          errors: result.error.flatten(),
        });

        return;
      }

      const inventory = await this.service.reserve(
        result.data.productId,
        result.data.quantity,
      );

      res.json(inventory);
    } catch (error) {
      next(error);
    }
  };
}
