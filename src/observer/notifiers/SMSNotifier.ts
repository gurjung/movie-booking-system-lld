import { BookingEvent } from "../events/BookingEvent";
import { Observer } from "../Observer";

export class SMSNotifier implements Observer {
  public update(event: BookingEvent): void {
    const user = event.getUser();
    console.log(
      `[SMS] To: ${user.getPhone()} | Type: ${event.getEventType()} | ${event.getDetails()}`,
    );
  }
}
