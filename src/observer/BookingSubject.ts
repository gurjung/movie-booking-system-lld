import { BookingEvent } from "./events/BookingEvent";
import { Observer } from "./Observer";
import { Subject } from "./Subject";

export class BookingSubject implements Subject {
  private observers: Observer[] = [];

  public attach(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  public notifyObservers(event: BookingEvent): void {
    const snapshot = [...this.observers];
    for (const observer of snapshot) {
      observer.update(event);
    }
  }

  public getObservers(): Observer[] {
    return [...this.observers];
  }
}
