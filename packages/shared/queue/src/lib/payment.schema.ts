import { z } from 'zod';

export const TraceContextSchema = z.object({
  traceparent: z.string().optional(),
  tracestate: z.string().optional(),
});

export const PaymentJobSchema = z.object({
  orderId: z.string(),
  userId: z.string(),
  amountCents: z.number(),
  requestId: z.string(),
  traceContext: TraceContextSchema.optional(),
});
