import { TicketType } from "../enums";
import { TicketFactory } from "../interfaces";
import { Seat } from "../model";
import {
  IMAXTicket,
  PremiumTicket,
  ReclinerTicket,
  StandardTicket,
  Ticket,
} from "../tickets";

export class SimpleTicketFactory implements TicketFactory {
  public createTicket(type: TicketType, seat: Seat): Ticket {
    switch (type) {
      case TicketType.STANDARD:
        return new StandardTicket(seat);
      case TicketType.PREMIUM:
        return new PremiumTicket(seat);
      case TicketType.IMAX:
        return new IMAXTicket(seat);
      case TicketType.RECLINER:
        return new ReclinerTicket(seat);
      default:
        throw new Error(`Invalid ticket type: ${type}`);
    }
  }
}

export { SimpleTicketFactory as RegistryTicketFactory };
