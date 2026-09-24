import { TicketType } from "../enums";
import { TicketFactory } from "../interfaces";
import { Booking, Money, Snack } from "../model";
import { RegularBookingBuilder } from "./RegularBookingBuilder";

export class VIPBookingBuilder extends RegularBookingBuilder {
  constructor(ticketFactory: TicketFactory) {
    super(ticketFactory);
  }

  public override build(): Booking {
    const hasStandardTicket = this.tickets.some(
      (ticket) => ticket.getType() === TicketType.STANDARD,
    );
    if (hasStandardTicket) {
      throw new Error(
        "VIP booking validation failed: STANDARD tickets are not permitted in a VIP booking.",
      );
    }

    const hasVipSnack = this.snacks.some(
      (snack) => snack.getName() === "VIP Welcome Combo",
    );
    if (!hasVipSnack) {
      const vipCombo = new Snack(
        "SNK-VIP",
        "VIP Welcome Combo",
        new Money(200),
        true,
      );
      this.snacks.push(vipCombo);
    }

    return super.build();
  }
}
