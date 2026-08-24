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

export function extractTraceContext(traceContext?: TraceContext): Context {
  if (!traceContext) {
    return context.active();
  }

  const carrier: Record<string, string> = {};

  if (traceContext.traceparent) {
    carrier.traceparent = traceContext.traceparent;
  }

  if (traceContext.tracestate) {
    carrier.tracestate = traceContext.tracestate;
  }

  return propagation.extract(context.active(), carrier);
}