import { Worker } from 'bullmq';
import { context, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { createLogger } from '@myCommerce/logger';
import {
  extractTraceContext,
  paymentJobDuration,
  paymentJobsCompleted,
  paymentJobsFailed,
  paymentJobsProcessed,
} from '@myCommerce/observability';
import { redis, type PaymentJob } from '@myCommerce/queue';

const logger = createLogger('payment-worker');

const tracer = trace.getTracer('payment-worker');

export const paymentWorker = new Worker<PaymentJob>(
  'payments',

  async (job) => {
    const start = performance.now();
    const { orderId, amountCents, requestId, traceContext } = job.data;

    // Extract the producer's trace context from the BullMQ job.
    const parentContext = extractTraceContext(traceContext);

    // Create a CONSUMER span whose parent is the producer span.
    const span = tracer.startSpan(
      'payment.process',
      {
        kind: SpanKind.CONSUMER,
      },
      parentContext,
    );

    // Everything inside this callback runs with
    // payment.process as the active span.
    return context.with(trace.setSpan(parentContext, span), async () => {
      try {
        span.setAttributes({
          'messaging.system': 'bullmq',
          'messaging.operation.type': 'process',
          'messaging.destination.name': 'payments',
          'messaging.message.id': job.id ?? '',
          'order.id': orderId,
          'payment.amount_cents': amountCents,
          'job.id': job.id ?? '',
          'job.attempt': job.attemptsMade + 1,
        });

        logger.info(
          {
            event: 'payment_processing',
            requestId,
            orderId,
            amountCents,
            jobId: job.id,
            attempt: job.attemptsMade + 1,
          },
          'Processing payment',
        );

        // Simulate payment processing.
        await new Promise((resolve) => setTimeout(resolve, 4000));
        // throw new Error("Payment failed");
        paymentJobsCompleted.add(1, {
          queue: 'payments',
        });

        span.setStatus({
          code: SpanStatusCode.OK,
        });

        logger.info(
          {
            event: 'payment_completed',
            requestId,
            orderId,
            jobId: job.id,
          },
          'Payment completed',
        );
      } catch (error) {
        paymentJobsFailed.add(1, {
          queue: 'payments',
        });
        const exception =
          error instanceof Error ? error : new Error(String(error));

        span.recordException(exception);

        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: exception.message,
        });

        logger.error(
          {
            event: 'payment_processing_failed',
            requestId,
            orderId,
            jobId: job.id,
            attempt: job.attemptsMade + 1,
            error: exception.message,
          },
          'Payment processing failed',
        );

        throw error;
      } finally {
        paymentJobsProcessed.add(1, {
          queue: 'payments',
        });
        paymentJobDuration.record(performance.now() - start, {
          queue: 'payments',
        });
        span.end();
      }
    });
  },

  {
    connection: redis,
    concurrency: 5,
  },
);

// Worker lifecycle events.
paymentWorker.on('completed', (job) => {
  logger.info(
    {
      event: 'payment_job_completed',
      jobId: job.id,
      orderId: job.data.orderId,
    },
    'Payment job completed',
  );
});

paymentWorker.on('failed', (job, error) => {
  logger.error(
    {
      event: 'payment_job_failed',
      jobId: job?.id,
      orderId: job?.data.orderId,
      attemptsMade: job?.attemptsMade,
      error: error.message,
    },
    'Payment job failed',
  );
});
