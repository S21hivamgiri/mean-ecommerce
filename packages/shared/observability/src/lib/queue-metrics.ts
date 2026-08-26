import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('myCommerce.queue');

export const paymentJobsCompleted = meter.createCounter(
  'payment_jobs_completed',
  {
    description: 'Number of successfully completed payment jobs',
  },
);

export const paymentJobsFailed = meter.createCounter('payment_jobs_failed', {
  description: 'Number of failed payment jobs',
});

export const paymentJobsProcessed = meter.createCounter(
  'payment_jobs_processed',
  {
    description: 'Number of processed payment jobs',
  },
);

export const paymentJobDuration = meter.createHistogram(
  'payment_job_duration',
  {
    description: 'Payment job processing duration',
    unit: 'ms',
  },
);
