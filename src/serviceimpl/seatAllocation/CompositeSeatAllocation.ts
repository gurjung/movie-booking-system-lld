import { SeatAllocationStrategy } from "../../interfaces";
import { Seat, Show } from "../../model";

export class CompositeSeatAllocationStrategy implements SeatAllocationStrategy {
  public allocateSeats(show: Show, seats: Seat[]): boolean {
    const screen = show.getScreen();
    const seatIds = seats.map((seat) => seat.getId());
    return screen.reserveSeats(seatIds);
  }

  public releaseSeats(show: Show, seats: Seat[]): void {
    const screen = show.getScreen();
    const seatIds = seats.map((seat) => seat.getId());
    screen.releaseSeats(seatIds);
  }
}
