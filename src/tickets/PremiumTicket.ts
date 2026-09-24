import { SeatType, TicketType } from "../enums";
import { Money, Seat } from "../model";
import { Ticket } from "./Ticket";

export class PremiumTicket extends Ticket {
  constructor(seat: Seat) {
    super(seat);
  }

  public getType(): TicketType {
    return TicketType.PREMIUM;
  }

  public getBasePrice(): Money {
    return new Money(250);
  }

  public getAmenities(): string[] {
    return ["Extra Legroom", "Dolby Atmos 7.1", "Push-back Seats"];
  }

  public getAllowedSeatTypes(): SeatType[] {
    return [SeatType.PREMIUM, SeatType.VIP];
  }
}
