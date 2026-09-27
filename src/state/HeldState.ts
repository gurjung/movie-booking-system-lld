import type { Seat } from "../model/Seat";
import { SeatStatus } from "../enums/SeatStatus";
import { SeatState } from "./SeatState";
import { BookedState } from "./BookedState";
import { ReleasedState } from "./ReleasedState";
import { InvalidSeatStateException } from "./InvalidSeatStateException";

export class HeldState implements SeatState {
  public reserve(seat: Seat): void {
    throw new InvalidSeatStateException(`Seat ${seat.getId()} is already held.`);
  }

  public release(seat: Seat): void {
    seat.setState(new ReleasedState());
  }

  public confirm(seat: Seat): void {
    seat.setState(new BookedState());
  }

  public getStatus(): SeatStatus {
    return SeatStatus.HELD;
  }
}
