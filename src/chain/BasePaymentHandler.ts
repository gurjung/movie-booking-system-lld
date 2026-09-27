import { PaymentResult } from "../model/PaymentResult";
import { PaymentContext } from "./PaymentContext";
import { PaymentHandler } from "./PaymentHandler";

export abstract class BasePaymentHandler implements PaymentHandler {
  protected next: PaymentHandler | null = null;

  public setNext(next: PaymentHandler): void {
    this.next = next;
  }

  public abstract handle(context: PaymentContext): PaymentResult;

  protected passToNext(context: PaymentContext): PaymentResult {
    if (this.next) {
      return this.next.handle(context);
    }
    return PaymentResult.success();
  }
}
