import { paymentQueue, PaymentJobSchema } from '@myCommerce/queue';
import { OutboxRepository } from './outbox.repository';
import { SpanStatusCode, SpanKind, trace } from '@opentelemetry/api';

const tracer = trace.getTracer('outbox-worker');

export class OutboxWorker {
  constructor(private readonly repository: OutboxRepository) {}

  async process() {
    const span = tracer.startSpan('payment.publish', {
      kind: SpanKind.PRODUCER,
    });

    const events = await this.repository.getUnprocessedEvents();

    for (const event of events) {
      try {
        switch (event.type) {
          case 'payment.requested': {
            const payload = PaymentJobSchema.parse(event.payload);
            try {
              await paymentQueue.add('process-payment', payload, {
                attempts: 3,

                backoff: {
                  type: 'exponential',
                  delay: 1000,
                },

                /*
                 * Important:
                 * use the outbox event ID as a unique
                 * job identifier.
                 */
                jobId: event.id,
              });
              span.setStatus({
                code: SpanStatusCode.OK,
              });
            } catch (error) {
              span.recordException(error as Error);

              span.setStatus({
                code: SpanStatusCode.ERROR,
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
