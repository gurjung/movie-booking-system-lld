import { BookingEvent } from "./events/BookingEvent";

export interface Observer {
  update(event: BookingEvent): void;
}
