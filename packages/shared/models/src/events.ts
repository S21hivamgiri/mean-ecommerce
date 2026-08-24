export interface PaymentRequestedEvent {
  type: 'payment.requested';

  payload: {
    orderId: string;
    userId: string;
    amountCents: number;
    requestId: string;
  };

  traceContext: {
    traceparent?: string;
    tracestate?: string;
  };
}

export type DomainEvent = PaymentRequestedEvent;
