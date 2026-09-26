import { PricingStrategy } from "../../interfaces";
import { Money, Seat, Show, User } from "../../model";

export class WeekendSurgePricingStrategy implements PricingStrategy {
  private surgeAmount: number;

  constructor(surgeAmount: number = 50) {
    this.surgeAmount = surgeAmount;
  }

  public calculatePrice(show: Show, seat: Seat, user: User): Money {
    const day = show.getStartTime().getDay();
    const isWeekend = day === 0 || day === 5 || day === 6;

    if (isWeekend) {
      return new Money(this.surgeAmount);
    }

    return Money.zero();
  }
}
