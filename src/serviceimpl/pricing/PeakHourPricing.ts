import { SeatType } from "../../enums";
import { PricingStrategy } from "../../interfaces";
import { Money, Seat, Show, User } from "../../model";

export class PeakHourPricingStrategy implements PricingStrategy {
  calculatePrice(show: Show, seat: Seat, user: User): Money {
    let price = 0;

    switch (seat.getType()) {
      case SeatType.NORMAL:
        price = 150;
        break;

      case SeatType.PREMIUM:
        price = 250;
        break;

      case SeatType.VIP:
        price = 400;
        break;
    }

    const hour = show.getStartTime().getHours();

    if (hour >= 18 && hour < 22) {
      price = price * 1.2;
    }

    return new Money(price);
  }
}
