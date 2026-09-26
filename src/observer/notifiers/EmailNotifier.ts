import { BookingEvent } from "../events/BookingEvent";
import { Observer } from "../Observer";

export class EmailNotifier implements Observer {
  public update(event: BookingEvent): void {
    const user = event.getUser();
    console.log(
      `[EMAIL] To: ${user.getEmail()} | Type: ${event.getEventType()} | ${event.getDetails()}`,
    );
  }
}
