import { PaymentGatewayStrategy } from "../../interfaces/PaymentGateway";
import { Money, PaymentDetails, PaymentResult, User } from "../../model";

export class MockPaymentGateway implements PaymentGatewayStrategy {
  private shouldFail: boolean;

  constructor(shouldFail: boolean = false) {
    this.shouldFail = shouldFail;
  }

  public setShouldFail(shouldFail: boolean): void {
    this.shouldFail = shouldFail;
  }

  public charge(
    user: User,
    amount: Money,
    details: PaymentDetails,
  ): PaymentResult {
    if (this.shouldFail) {
      return new PaymentResult(
        false,
        null,
        "Payment declined: insufficient funds",
      );
    }

    const transactionId: string = "TXN-" + Date.now();
    return new PaymentResult(true, transactionId, null);
  }
}
