import { User, Money, PaymentDetails, PaymentResult } from "../model";

export interface PaymentGatewayStrategy {
  charge(
    user: User,
    amount: Money,
    paymentMethod: PaymentDetails,
  ): PaymentResult;
}
