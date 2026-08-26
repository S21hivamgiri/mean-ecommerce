import {
  SpanKind,
  SpanStatusCode,
  context,
  propagation,
  trace,
} from '@opentelemetry/api';

import {
  paymentQueue,
  PaymentJobSchema,
  type PaymentJob,
  type TraceContext,
} from '@myCommerce/queue';

import { OutboxRepository } from './outbox.repository';

const tracer = trace.getTracer('outbox-worker');

export class OutboxWorker {
  constructor(private readonly repository: OutboxRepository) {}

  async process() {
    const events = await this.repository.getUnprocessedEvents();

    for (const event of events) {
      try {
        switch (event.type) {
          case 'payment.requested': {
            const span = tracer.startSpan('payment.publish', {
              kind: SpanKind.PRODUCER,
            });

            try {
              await context.with(
                trace.setSpan(context.active(), span),
                async () => {
                  const traceContext: TraceContext = {};

                  propagation.inject(context.active(), traceContext);

                  const payload: PaymentJob = PaymentJobSchema.parse(
                    event.payload,
                  );

                  const job: PaymentJob = {
                    ...payload,
                    traceContext,
                  };

                  span.setAttributes({
                    'messaging.system': 'bullmq',
                    'messaging.operation.type': 'publish',
                    'messaging.destination.name': 'payments',
                    'messaging.message.id': event.id,
                    'order.id': payload.orderId,
                  });

                  await paymentQueue.add('process-payment', job, {
                    attempts: 3,

                    backoff: {
                      type: 'exponential',
                      delay: 1000,
                    },

                    jobId: event.id,
                  });

                  span.setStatus({
                    code: SpanStatusCode.OK,
                  });
                },
              );
            } catch (error) {
              span.recordException(
                error instanceof Error ? error : new Error(String(error)),
              );

              span.setStatus({
                code: SpanStatusCode.ERROR,
                message: error instanceof Error ? error.message : String(error),
              });

              throw error;
            } finally {
              span.end();
            }

            break;
          }

          default:
            throw new Error(`Unknown event type: ${event.type}`);
        }

        await this.repository.markProcessed(event.id);
      } catch (error) {
        console.error({
          event: 'outbox_processing_failed',
          outboxEventId: event.id,
          eventType: event.type,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }
}
