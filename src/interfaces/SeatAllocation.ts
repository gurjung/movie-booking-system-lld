import { Seat, Show } from "../model";

export interface SeatAllocationStrategy {
  allocateSeats(show: Show, seats: Seat[]): boolean;
  releaseSeats(show: Show, seats: Seat[]): void;
}
