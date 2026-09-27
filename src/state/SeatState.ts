import type { Seat } from "../model/Seat";
import { SeatStatus } from "../enums/SeatStatus";

export interface SeatState {
  reserve(seat: Seat): void;
  release(seat: Seat): void;
  confirm(seat: Seat): void;
  getStatus(): SeatStatus;
}
