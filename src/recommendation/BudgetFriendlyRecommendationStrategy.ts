import { SeatRecommendationStrategy } from "./SeatRecommendationStrategy";
import { Screen, Seat } from "../model";
import { SeatType } from "../enums";

export class BudgetFriendlyRecommendationStrategy
  implements SeatRecommendationStrategy
{
  public recommendSeats(
    screen: Screen,
    count: number,
    preferredType?: SeatType,
  ): Seat[] {
    if (count <= 0) {
      return [];
    }

    const availableSeats = screen
      .getSeats()
      .filter((seat) => {
        if (!seat.isSeatAvailable()) {
          return false;
        }
        if (preferredType && seat.getType() !== preferredType) {
          return false;
        }
        return true;
      })
      .sort((a, b) => a.getPriceModifier() - b.getPriceModifier());

    return availableSeats.slice(0, count);
  }
}
