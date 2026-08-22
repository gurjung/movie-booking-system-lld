import { SeatAllocationStrategy } from "../../interfaces";
import { Seat, Show } from "../../model";

export class InMemorySeatAllocationStrategy implements SeatAllocationStrategy {
  private bookedSeats: Set<string>;

  constructor() {
    this.bookedSeats = new Set<string>();
  }

  private buildKey(showId: string, seatId: string): string {
    return showId + ":" + seatId;
  }

  public allocateSeats(show: Show, seats: Seat[]): boolean {
    // check phase
    for (const seat of seats) {
      const key = this.buildKey(show.getId(), seat.getId());

      if (this.bookedSeats.has(key)) {
        return false; // someone already holds this seat for this show
      }
    }
    // set phase
    for (const seat of seats) {
      const key = this.buildKey(show.getId(), seat.getId());

      this.bookedSeats.add(key);
    }
    return true;
  }

  public releaseSeats(show: Show, seats: Seat[]): void {
    for (const seat of seats) {
      const key = this.buildKey(show.getId(), seat.getId());

      this.bookedSeats.delete(key);
    }
  }
}
