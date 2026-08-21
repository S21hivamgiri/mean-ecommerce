import { z } from 'zod';

export const createOrderSchema = z.object({
  userId: z.string().min(1),
  total: z.number().positive(),
});

