import { Booking } from "./Booking";

export class BookingResult {
  private ok: boolean;
  private booking: Booking | null;
  private errorMessage: string | null;

  private constructor(
    ok: boolean,
    booking: Booking | null,
    errorMessage: string | null,
  ) {
    this.ok = ok;
    this.booking = booking;
    this.errorMessage = errorMessage;
  }

  public isOk(): boolean {
    return this.ok;
  }

  public getBooking(): Booking | null {
    return this.booking;
  }

  public getErrorMessage(): string | null {
    return this.errorMessage;
  }

  public static success(booking: Booking) {
    return new BookingResult(true, booking, null);
  }

  public static fail(errorMessage: string) {
    return new BookingResult(false, null, errorMessage);
  }
}
