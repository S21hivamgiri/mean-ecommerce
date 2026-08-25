import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('myCommerce.http');
export const httpRequests = meter.createCounter('http.server.requests', {
  description: 'Number of HTTP requests',
});
export const httpErrors = meter.createCounter('http.server.errors', {
  description: 'Number of HTTP errors',
});
export const httpDuration = meter.createHistogram('http.server.duration', {
  description: 'HTTP request duration',
  unit: 'ms',
});