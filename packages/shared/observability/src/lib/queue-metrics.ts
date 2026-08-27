import { metrics } from '@opentelemetry/api';
import type { Queue } from 'bullmq';

export function registerPaymentQueueMetrics(queue: Queue) {
  const meter = metrics.getMeter('myCommerce.queue');

  meter
    .createObservableGauge('payment_queue_waiting', {
      description: 'Number of payment jobs waiting',
      unit: '{job}',
    })
    .addCallback(async (result) => {
      result.observe(await queue.getWaitingCount());
    });

  meter
    .createObservableGauge('payment_queue_active', {
      description: 'Number of active payment jobs',
      unit: '{job}',
    })
    .addCallback(async (result) => {
      result.observe(await queue.getActiveCount());
    });

  meter
    .createObservableGauge('payment_queue_completed', {
      description: 'Number of completed payment jobs',
      unit: '{job}',
    })
    .addCallback(async (result) => {
      result.observe(await queue.getCompletedCount());
    });

  meter
    .createObservableGauge('payment_queue_failed', {
      description: 'Number of failed payment jobs',
      unit: '{job}',
    })
    .addCallback(async (result) => {
      result.observe(await queue.getFailedCount());
    });
}
const meter = metrics.getMeter('myCommerce.queue');

export const paymentQueueWaiting = meter.createObservableGauge(
  'payment_queue_waiting',
  {
    description: 'Number of payment jobs waiting in BullMQ',
    unit: '{job}',
  },
);

export const paymentQueueActive = meter.createObservableGauge(
  'payment_queue_active',
  {
    description: 'Number of active payment jobs',
    unit: '{job}',
  },
);

export const paymentQueueCompleted = meter.createObservableGauge(
  'payment_queue_completed',
  {
    description: 'Number of completed payment jobs retained by BullMQ',
    unit: '{job}',
  },
);

export const paymentQueueFailed = meter.createObservableGauge(
  'payment_queue_failed',
  {
    description: 'Number of failed payment jobs retained by BullMQ',
    unit: '{job}',
  },
);
