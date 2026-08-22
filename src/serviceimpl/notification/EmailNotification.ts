import { NotificationService } from "../../interfaces";
import { Booking, Seat, User } from "../../model";

export class EmailNotificationService implements NotificationService {
  public notify(user: User, booking: Booking): void {
    const seatIds: string = booking
      .getSeats()
      .map((seat: Seat) => seat.getId())
      .join(", ");

    console.log(
      "[Email to " +
        user.getEmail() +
        "] Booking " +
        booking.getId() +
        ' confirmed for "' +
        booking.getShow().getMovie().getTitle() +
        '". Seats: ' +
        seatIds +
        ". Amount: " +
        booking.getAmount().toDisplayString(),
    );
  }
}
