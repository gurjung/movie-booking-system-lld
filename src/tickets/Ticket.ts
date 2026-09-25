import { SeatType, TicketType } from "../enums";
import { Money, Seat } from "../model";

export abstract class Ticket {
  private seat: Seat;

  constructor(seat: Seat) {
    this.seat = seat;
    const allowedTypes = this.getAllowedSeatTypes();
    if (!allowedTypes.includes(seat.getType())) {
      throw new Error(
        `Seat type '${seat.getType()}' is not valid for ticket '${this.getType()}'. Allowed types: ${allowedTypes.join(", ")}`,
      );
    }
  }

  public getSeat(): Seat {
    return this.seat;
  }

  public abstract getType(): TicketType;
  public abstract getBasePrice(): Money;
  public abstract getAmenities(): string[];
  public abstract getAllowedSeatTypes(): SeatType[];
}
