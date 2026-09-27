import { PaymentHandler } from "./PaymentHandler";

export class PaymentChainBuilder {
  private head: PaymentHandler | null = null;
  private tail: PaymentHandler | null = null;

  public add(handler: PaymentHandler): PaymentChainBuilder {
    if (!this.head) {
      this.head = handler;
      this.tail = handler;
    } else {
      this.tail!.setNext(handler);
      this.tail = handler;
    }
    return this;
  }

  public build(): PaymentHandler {
    if (!this.head) {
      throw new Error("Cannot build an empty payment chain.");
    }
    return this.head;
  }
}
