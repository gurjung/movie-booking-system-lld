import type { Seat } from "../model/Seat";
import { SeatStatus } from "../enums/SeatStatus";
import { SeatState } from "./SeatState";
import { ReleasedState } from "./ReleasedState";
import { InvalidSeatStateException } from "./InvalidSeatStateException";

export class BookedState implements SeatState {
  public reserve(seat: Seat): void {
    throw new InvalidSeatStateException(`Seat ${seat.getId()} is already booked.`);
  }

  public release(seat: Seat): void {
    seat.setState(new ReleasedState());
  }

  public confirm(seat: Seat): void {
    throw new InvalidSeatStateException(`Seat ${seat.getId()} is already booked and confirmed.`);
  }

  public getStatus(): SeatStatus {
    return SeatStatus.BOOKED;
  }
}
