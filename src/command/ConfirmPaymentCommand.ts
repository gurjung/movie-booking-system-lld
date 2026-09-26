import { PaymentGatewayStrategy } from "../interfaces";
import { Money, PaymentDetails, PaymentResult, User } from "../model";
import { Command } from "./Command";

export class ConfirmPaymentCommand implements Command {
  private paymentGateway: PaymentGatewayStrategy;
  private user: User;
  private amount: Money;
  private paymentDetails: PaymentDetails;
  private paymentResult: PaymentResult | null = null;

  constructor(
    paymentGateway: PaymentGatewayStrategy,
    user: User,
    amount: Money,
    paymentDetails: PaymentDetails,
  ) {
    this.paymentGateway = paymentGateway;
    this.user = user;
    this.amount = amount;
    this.paymentDetails = paymentDetails;
  }

  public execute(): boolean {
    this.paymentResult = this.paymentGateway.charge(
      this.user,
      this.amount,
      this.paymentDetails,
    );
    return this.paymentResult.isSuccess();
  }

  public undo(): void {
    if (this.paymentResult && this.paymentResult.isSuccess()) {
      this.paymentResult = null;
    }
  }

  public getPaymentResult(): PaymentResult | null {
    return this.paymentResult;
  }

  public getName(): string {
    return "ConfirmPaymentCommand";
  }
}
