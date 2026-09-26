import { Booking, User } from "../../model";
import { BookingEvent } from "./BookingEvent";

export class BookingConfirmedEvent extends BookingEvent {
  private booking: Booking;

  constructor(id: string, user: User, booking: Booking) {
    super(id, user);
    this.booking = booking;
  }

  public getBooking(): Booking {
    return this.booking;
  }

  public override getEventType(): string {
    return "BOOKING_CONFIRMED";
  }

  public override getDetails(): string {
    return `Booking confirmed: ${this.booking.getId()} for ${this.booking.getShow().getMovie().getTitle()} | Seats: ${this.booking.getSeats().map((s) => s.getId()).join(", ")} | Total: ${this.booking.getAmount().toDisplayString()}`;
  }
}
