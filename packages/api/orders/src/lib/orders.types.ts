import { z } from 'zod';

export const createOrderSchema = z.object({
  userId: z.string().min(1),
  totalCents: z.number().int().positive(),
});
