export type PaymentMethod = "CARD" | "UPI" | "WALLET";

export class PaymentDetails {
  private method: PaymentMethod;

  constructor(method: PaymentMethod) {
    this.method = method;
  }

  public getMethod(): PaymentMethod {
    return this.method;
  }
}
