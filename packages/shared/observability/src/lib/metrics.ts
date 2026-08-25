import { metrics } from '@opentelemetry/api';

import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';

import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

import { resourceFromAttributes } from '@opentelemetry/resources';

import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const serviceName = process.env.OTEL_SERVICE_NAME ?? 'order-api';

const endpoint =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318';

console.log(`[OTEL] Metrics endpoint: ${endpoint}`);

const metricExporter = new OTLPMetricExporter({
  url: `${endpoint}/v1/metrics`,
});

const meterProvider = new MeterProvider({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: serviceName,
  }),

  readers: [
    new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 5_000,
    }),
  ],
});

metrics.setGlobalMeterProvider(meterProvider);

const meter = metrics.getMeter('order-api');

export const testCounter = meter.createCounter('mycommerce_test_counter', {
  description: 'Test metric for verifying OpenTelemetry metrics pipeline',
});

export function startMetrics() {
  console.log(`[OTEL] Metrics started for ${serviceName}`);

  testCounter.add(1);
}
