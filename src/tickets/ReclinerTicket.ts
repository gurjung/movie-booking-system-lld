import { SeatType, TicketType } from "../enums";
import { Money, Seat } from "../model";
import { Ticket } from "./Ticket";

export class ReclinerTicket extends Ticket {
  constructor(seat: Seat) {
    super(seat);
  }

  public getType(): TicketType {
    return TicketType.RECLINER;
  }

  public getBasePrice(): Money {
    return new Money(500);
  }

  public getAmenities(): string[] {
    return [
      "Motorized Luxury Recliner",
      "In-Seat Waiter Service",
      "Complimentary Blanket & Pillow",
    ];
  }

  public getAllowedSeatTypes(): SeatType[] {
    return [SeatType.PREMIUM, SeatType.VIP];
  }
}
