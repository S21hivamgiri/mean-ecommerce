import { Queue } from 'bullmq';
import { redis } from './connection.js';

export interface PaymentJob {
  orderId: string;
  userId: string;
  amountCents: number;
}

export const paymentQueue = new Queue<PaymentJob>('payments', {
  connection: redis,
});
