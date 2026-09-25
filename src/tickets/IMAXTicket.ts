import { SeatType, TicketType } from "../enums";
import { Money, Seat } from "../model";
import { Ticket } from "./Ticket";

export class IMAXTicket extends Ticket {
  constructor(seat: Seat) {
    super(seat);
  }

  public getType(): TicketType {
    return TicketType.IMAX;
  }

  public getBasePrice(): Money {
    return new Money(400);
  }

  public getAmenities(): string[] {
    return [
      "IMAX Curved Screen",
      "Laser Projection",
      "12-Channel Immersive Sound",
    ];
  }

  public getAllowedSeatTypes(): SeatType[] {
    return [SeatType.NORMAL, SeatType.PREMIUM, SeatType.VIP];
  }
}
