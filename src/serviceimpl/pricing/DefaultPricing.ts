import { SeatType } from "../../enums";
import { PricingStrategy } from "../../interfaces";
import { Show, Seat, User, Money } from "../../model";

export class DefaultPricingStrategy implements PricingStrategy {
  public calculatePrice(show: Show, seat: Seat, user: User): Money {
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

    return new Money(price);
  }
}
