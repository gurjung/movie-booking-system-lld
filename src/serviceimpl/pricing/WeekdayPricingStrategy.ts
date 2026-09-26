import { PricingStrategy } from "../../interfaces";
import { Money, Seat, Show, User } from "../../model";

export class WeekdayPricingStrategy implements PricingStrategy {
  private discountAmount: number;

  constructor(discountAmount: number = 20) {
    this.discountAmount = discountAmount;
  }

  public calculatePrice(show: Show, seat: Seat, user: User): Money {
    const day = show.getStartTime().getDay();
    const isWeekday = day >= 1 && day <= 4;

    if (isWeekday) {
      return new Money(-this.discountAmount);
    }

    return Money.zero();
  }
}
