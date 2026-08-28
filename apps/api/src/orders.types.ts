import { z } from 'zod';

export const createOrderSchema = z.object({
  productId: z.string().min(1),
  totalCents: z.number().int().positive(),
  quantity: z.number().int().positive(),
});
