import { Worker } from 'bullmq';

import { createLogger } from '@myCommerce/logger';
import { redis, type PaymentJob } from '@myCommerce/queue';
const logger = createLogger('payment-worker');

export const paymentWorker = new Worker<PaymentJob>(
  'payments',

  async (job) => {
    const { orderId, amountCents, requestId } = job.data;

    logger.info(
      {
        requestId,
        orderId,
        amountCents,
        jobId: job.id,
      },
      'Processing payment',
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    logger.info(
      {
        requestId,
        orderId,
        jobId: job.id,
      },
      'Payment completed',
    );
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