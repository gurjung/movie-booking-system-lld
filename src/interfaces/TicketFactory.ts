import { TicketType } from "../enums";
import { Seat } from "../model";
import { Ticket } from "../tickets";

export interface TicketFactory {
  createTicket(type: TicketType, seat: Seat): Ticket;
}
