import { PaymentGatewayStrategy } from "../../interfaces/PaymentGateway";
import { Money, PaymentDetails, PaymentResult, User } from "../../model";

export class MockPaymentGateway implements PaymentGatewayStrategy {
  public charge(
    user: User,
    amount: Money,
    details: PaymentDetails,
  ): PaymentResult {
    // Simulated success.
    const transactionId: string = "TXN-" + Date.now();
    return new PaymentResult(true, transactionId, null);
  }
}
