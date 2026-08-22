import { Seat, Show, User, Money } from "../model";

export interface PricingStrategy {
  calculatePrice(show: Show, seat: Seat, user: User): Money;
}
