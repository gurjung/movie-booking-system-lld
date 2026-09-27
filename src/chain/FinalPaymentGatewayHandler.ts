import { PaymentResult } from "../model/PaymentResult";
import { PaymentDetails } from "../model/PaymentDetails";
import { Money } from "../model/Money";
import { PaymentGatewayStrategy } from "../interfaces/PaymentGateway";
import { BasePaymentHandler } from "./BasePaymentHandler";
import { PaymentContext } from "./PaymentContext";

export class FinalPaymentGatewayHandler extends BasePaymentHandler {
  private gateway: PaymentGatewayStrategy;

  constructor(gateway: PaymentGatewayStrategy) {
    super();
    this.gateway = gateway;
  }

  public handle(context: PaymentContext): PaymentResult {
    if (context.getAmount() <= 0) {
      return PaymentResult.success("WALLET_OR_COUPON_FULL_COVERAGE");
    }

    const details = context.getPaymentDetails() ?? new PaymentDetails("DEFAULT");
    return this.gateway.charge(
      context.getUser(),
      new Money(context.getAmount()),
      details,
    );
  }
}
