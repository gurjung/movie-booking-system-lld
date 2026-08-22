import { Booking } from "../model";

export class BookingRepository {
  private bookings: Map<string, Booking>;

  constructor() {
    this.bookings = new Map<string, Booking>();
  }

  public save(booking: Booking): Booking {
    const bookingId = booking.getId();
    this.bookings.set(bookingId, booking);
    return booking;
  }
}
