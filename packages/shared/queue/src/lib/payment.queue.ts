import { Queue } from 'bullmq';
import { redis } from './connection.js';

export interface PaymentRequestedEvent {
  type: 'payment.requested';

  payload: {
    orderId: string;
    amountCents: number;
    requestId: string;
  };

  traceContext: {
    traceparent?: string;
    tracestate?: string;
  };
}

export type DomainEvent = PaymentRequestedEvent;

export interface TraceContext {
  traceparent?: string;
  tracestate?: string;
}

export interface PaymentJob {
  orderId: string;
  amountCents: number;
  requestId: string;
  traceContext?: TraceContext;
}

export const paymentQueue = new Queue<PaymentJob>('payments', {
  connection: redis,
});
