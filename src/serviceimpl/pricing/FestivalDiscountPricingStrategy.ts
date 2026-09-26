import { PricingStrategy } from "../../interfaces";
import { Money, Seat, Show, User } from "../../model";

export class FestivalDiscountPricingStrategy implements PricingStrategy {
  private discountAmount: number;

  constructor(discountAmount: number = 60) {
    this.discountAmount = discountAmount;
  }

  public calculatePrice(show: Show, seat: Seat, user: User): Money {
    return new Money(-this.discountAmount);
  }
}
