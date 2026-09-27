import type { Seat } from "../model/Seat";
import { SeatStatus } from "../enums/SeatStatus";
import { SeatState } from "./SeatState";
import { HeldState } from "./HeldState";
import { InvalidSeatStateException } from "./InvalidSeatStateException";

export class AvailableState implements SeatState {
  public reserve(seat: Seat): void {
    seat.setState(new HeldState());
  }

  public release(seat: Seat): void {
    throw new InvalidSeatStateException(`Seat ${seat.getId()} is already available and cannot be released.`);
  }

  public confirm(seat: Seat): void {
    throw new InvalidSeatStateException(`Seat ${seat.getId()} is available and cannot be confirmed without reserving.`);
  }

  public getStatus(): SeatStatus {
    return SeatStatus.AVAILABLE;
  }
}
