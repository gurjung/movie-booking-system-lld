import { User, Coupon, PaymentDetails } from "../model";

export class PaymentContext {
  private amount: number;
  private user: User;
  private coupon?: Coupon;
  private paymentDetails?: PaymentDetails;

  constructor(
    amount: number,
    user: User,
    coupon?: Coupon,
    paymentDetails?: PaymentDetails,
  ) {
    this.amount = amount;
    this.user = user;
    this.coupon = coupon;
    this.paymentDetails = paymentDetails;
  }

  public getAmount(): number {
    return this.amount;
  }

  public setAmount(amount: number): void {
    this.amount = amount;
  }

  public getUser(): User {
    return this.user;
  }

  public getCoupon(): Coupon | undefined {
    return this.coupon;
  }

  public getPaymentDetails(): PaymentDetails | undefined {
    return this.paymentDetails;
  }

  public hasValidCoupon(): boolean {
    return !!this.coupon;
  }

  public applyDiscount(): void {
    if (this.coupon) {
      const discount = this.coupon.getDiscountAmount().getAmount();
      this.amount = Math.max(0, this.amount - discount);
    }
  }

  public deductWallet(): void {
    const balance = this.user.getWalletBalance();
    const deduction = Math.min(this.amount, balance);
    this.amount = Math.max(0, this.amount - deduction);
    this.user.setWalletBalance(balance - deduction);
  }

  public applyTax(): void {
    this.amount = Math.round(this.amount * 1.18 * 100) / 100;
  }
}
