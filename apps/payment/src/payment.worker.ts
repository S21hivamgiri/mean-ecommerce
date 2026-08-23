import { Worker } from 'bullmq';

import { redis, type PaymentJob } from '@myCommerce/queue';

export const paymentWorker = new Worker<PaymentJob>(
  'payments',

  async (job) => {
    console.log(`Processing payment for order ${job.data.orderId}`);

    console.log(`Amount: ${job.data.amountCents} cents`);

    // Simulate payment processing
   await new Promise((resolve) => setTimeout(resolve, 5000));
   // throw new Error('Payment provider unavailable');
    console.log(`Payment completed for ${job.data.orderId}`);
  },

  {
    connection: redis,
    concurrency: 5,
  },
);
paymentWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});
paymentWorker.on('failed', (job, error) => {
  console.error({
    event: 'payment_failed',
    jobId: job?.id,
    orderId: job?.data.orderId,
    attemptsMade: job?.attemptsMade,
    error: error.message,
  });
});