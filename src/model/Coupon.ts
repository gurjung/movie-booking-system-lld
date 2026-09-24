import { Money } from "./Money";

export class Coupon {
  private code: string;
  private discountAmount: Money;

  constructor(code: string, discountAmount: Money) {
    this.code = code;
    this.discountAmount = discountAmount;
  }

  public getCode(): string {
    return this.code;
  }

  public setCode(code: string): void {
    this.code = code;
  }

  public getDiscountAmount(): Money {
    return this.discountAmount;
  }

  public setDiscountAmount(discountAmount: Money): void {
    this.discountAmount = discountAmount;
  }
}
