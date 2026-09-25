import { SeatType } from "../enums";
import { Seat } from "../model/Seat";

export interface SeatComponent {
  getId(): string;
  getAvailableCount(): number;
  getTotalCount(): number;
  findAvailableSeats(
    count: number,
    contiguousOnly: boolean,
    preferredType?: SeatType,
  ): Seat[];
  reserveSeats(seatIds: string[]): boolean;
  releaseSeats(seatIds: string[]): void;
  getPriceSum(): number;
  applyPriceAdjustment(predicate: (seat: Seat) => boolean, delta: number): void;
  getOccupancyRate(): number;
}
