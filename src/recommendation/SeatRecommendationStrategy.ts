import { Screen, Seat } from "../model";
import { SeatType } from "../enums";

export interface SeatRecommendationStrategy {
  recommendSeats(screen: Screen, count: number, preferredType?: SeatType): Seat[];
}
