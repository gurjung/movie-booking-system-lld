import { SeatType, TicketType } from "../enums";
import { Money, Seat } from "../model";
import { Ticket } from "./Ticket";

export class StandardTicket extends Ticket {
  constructor(seat: Seat) {
    super(seat);
  }

  public getType(): TicketType {
    return TicketType.STANDARD;
  }

  public getBasePrice(): Money {
    return new Money(150);
  }

  public getAmenities(): string[] {
    return ["Standard Screen View", "Regular Audio"];
  }

  public getAllowedSeatTypes(): SeatType[] {
    return [SeatType.NORMAL];
  }
}
