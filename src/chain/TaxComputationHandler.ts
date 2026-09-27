import { PaymentResult } from "../model/PaymentResult";
import { BasePaymentHandler } from "./BasePaymentHandler";
import { PaymentContext } from "./PaymentContext";

export class TaxComputationHandler extends BasePaymentHandler {
  public handle(context: PaymentContext): PaymentResult {
    if (context.getAmount() > 0) {
      context.applyTax();
    }
    return this.passToNext(context);
  }
}
