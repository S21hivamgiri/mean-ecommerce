import { z } from 'zod';

export const reserveInventorySchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});
