import { NotificationService } from "../../interfaces";
import { Booking, Seat, User } from "../../model";

export class EmailNotificationService implements NotificationService {
  public notify(user: User, booking: Booking): void {
    const seatIds: string = booking
      .getSeats()
      .map((seat: Seat) => seat.getId())
      .join(", ");

    console.log(`[Email Notification to: ${user.getEmail()}]`);
    console.log("Subject: Booking Confirmed!");
    console.log("Movie:", booking.getShow().getMovie().getTitle());
    console.log("Seats:", seatIds);
    console.log("Total Amount paid:", booking.getAmount().toDisplayString());
  }
}
