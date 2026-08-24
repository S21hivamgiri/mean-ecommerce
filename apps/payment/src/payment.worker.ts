import { Worker } from 'bullmq';

import { createLogger } from '@myCommerce/logger';
import { extractTraceContext } from '@myCommerce/observability';
import { redis, type PaymentJob } from '@myCommerce/queue';
const logger = createLogger('payment-worker');
import {
  context,
  SpanStatusCode,
  SpanKind,
  trace,
} from '@opentelemetry/api';
const tracer = trace.getTracer('payment-worker');

export const paymentWorker = new Worker<PaymentJob>(
  'payments',

  async (job) => {
  const parentContext = extractTraceContext(job.data.traceContext);

    const span = tracer.startSpan(
      'payment.process',
      {
        kind: SpanKind.CONSUMER,
      },
      parentContext,
    );

    try {
      const { orderId, amountCents, requestId } = job.data;

      await context.with(trace.setSpan(parentContext, span), async () => {
        span.setAttributes({
          'order.id': orderId,
          'payment.amount_cents': amountCents,
          'messaging.system': 'bullmq',
          'messaging.operation.type': 'process',
        });

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
      });
      span.setStatus({
        code: SpanStatusCode.OK,
      });
      logger.info(
        {
          requestId,
          orderId,
          jobId: job.id,
        },
        'Payment completed',
      );
    } catch (error) {
      span.recordException(error as Error);

      span.setStatus({
        code: SpanStatusCode.ERROR,
      });

      throw error;
    } finally {
      span.end();
    }
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
  logger.info({
    event: 'payment_failed',
    jobId: job?.id,
    orderId: job?.data.orderId,
    attemptsMade: job?.attemptsMade,
    error: error.message,
  });
});
