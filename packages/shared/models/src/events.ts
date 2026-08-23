export interface PaymentRequestedEvent {
  type: 'payment.requested';

  payload: {
    orderId: string;
    userId: string;
    amountCents: number;
    requestId: string;
  };
}

export type DomainEvent = PaymentRequestedEvent;
