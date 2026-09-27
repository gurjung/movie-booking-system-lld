import { PaymentResult } from "../model/PaymentResult";
import { BasePaymentHandler } from "./BasePaymentHandler";
import { PaymentContext } from "./PaymentContext";

export class CouponValidationHandler extends BasePaymentHandler {
  public handle(context: PaymentContext): PaymentResult {
    if (context.hasValidCoupon()) {
      context.applyDiscount();
    }
    return this.passToNext(context);
  }
}
