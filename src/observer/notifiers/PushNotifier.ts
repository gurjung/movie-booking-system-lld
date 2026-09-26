import { BookingEvent } from "../events/BookingEvent";
import { Observer } from "../Observer";

export class PushNotifier implements Observer {
  public update(event: BookingEvent): void {
    const user = event.getUser();
    console.log(
      `[PUSH NOTIFICATION] User: ${user.getName()} (ID: ${user.getId()}) | Type: ${event.getEventType()} | ${event.getDetails()}`,
    );
  }
}
