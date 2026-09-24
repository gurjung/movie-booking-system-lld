import { PricingStrategy } from "../../interfaces";
import { Show, Seat, User, Money } from "../../model";

export class DefaultPricingStrategy implements PricingStrategy {
  public calculatePrice(show: Show, seat: Seat, user: User): Money {
    return Money.zero();
  }
}
