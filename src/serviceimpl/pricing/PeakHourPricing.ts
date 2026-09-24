import { PricingStrategy } from "../../interfaces";
import { Money, Seat, Show, User } from "../../model";

export class PeakHourPricingStrategy implements PricingStrategy {
  private static readonly PEAK_SURCHARGE: number = 50;

  public calculatePrice(show: Show, seat: Seat, user: User): Money {
    const hour = show.getStartTime().getHours();

    if (hour >= 18 && hour < 22) {
      return new Money(PeakHourPricingStrategy.PEAK_SURCHARGE);
    }

    return Money.zero();
  }
}
