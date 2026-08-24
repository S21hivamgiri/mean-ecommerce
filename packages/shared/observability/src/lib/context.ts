// Telemetry Helper
import { context, propagation, type Context } from '@opentelemetry/api';

export interface TraceContext {
  traceparent?: string;
  tracestate?: string;
}

export function getTraceContext(): TraceContext {
  const carrier: Record<string, string> = {};

  propagation.inject(context.active(), carrier);

  return {
    traceparent: carrier.traceparent,
    tracestate: carrier.tracestate,
  };
}