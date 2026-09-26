import { NotificationService } from "../../interfaces";
import { Booking, User } from "../../model";
import { BookingSubject } from "../../observer/BookingSubject";
import { BookingConfirmedEvent } from "../../observer/events/BookingConfirmedEvent";

export class ObservableNotificationService
  extends BookingSubject
  implements NotificationService
{
  public notify(user: User, booking: Booking): void {
    const event = new BookingConfirmedEvent(
      `EVT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user,
      booking,
    );
    this.notifyObservers(event);
  }
}
