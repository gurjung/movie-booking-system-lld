import { PaymentResult } from "../model/PaymentResult";
import { BasePaymentHandler } from "./BasePaymentHandler";
import { PaymentContext } from "./PaymentContext";

export class WalletDeductionHandler extends BasePaymentHandler {
  public handle(context: PaymentContext): PaymentResult {
    if (context.getUser().getWalletBalance() > 0 && context.getAmount() > 0) {
      context.deductWallet();
    }
    return this.passToNext(context);
  }
}
