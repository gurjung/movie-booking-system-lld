import { PricingStrategy } from "../../interfaces";
import { Money, Seat, Show, User } from "../../model";

export class VIPPricingStrategy implements PricingStrategy {
  private static readonly VIP_SURCHARGE: number = 100;

  public calculatePrice(show: Show, seat: Seat, user: User): Money {
    return new Money(VIPPricingStrategy.VIP_SURCHARGE);
  }
}
