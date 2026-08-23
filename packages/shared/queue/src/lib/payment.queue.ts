import { Queue } from 'bullmq';
import { redis } from './connection.js';
import { Prisma } from '@prisma/client';
export interface PaymentJob extends Prisma.JsonObject {
  orderId: string;
  userId: string;
  amountCents: number;
}

export const paymentQueue = new Queue<PaymentJob>('payments', {
  connection: redis,
});
