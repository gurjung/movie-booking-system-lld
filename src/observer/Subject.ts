import { BookingEvent } from "./events/BookingEvent";
import { Observer } from "./Observer";

export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notifyObservers(event: BookingEvent): void;
}
