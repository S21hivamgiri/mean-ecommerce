export interface PaymentRequestedEvent {
  type: 'payment.requested';

  payload: {
    orderId: string;
    userId: string;
    amountCents: number;
  };
}

export type DomainEvent = PaymentRequestedEvent;
