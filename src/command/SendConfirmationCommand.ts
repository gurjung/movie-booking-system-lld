import { Booking, User } from "../model";
import { BookingConfirmedEvent } from "../observer/events/BookingConfirmedEvent";
import { Subject } from "../observer/Subject";
import { Command } from "./Command";

export class SendConfirmationCommand implements Command {
  private subject: Subject;
  private user: User;
  private booking: Booking;
  private sent: boolean = false;

  constructor(subject: Subject, user: User, booking: Booking) {
    this.subject = subject;
    this.user = user;
    this.booking = booking;
  }

  public execute(): boolean {
    const event = new BookingConfirmedEvent(
      `EVT-${Date.now()}`,
      this.user,
      this.booking,
    );
    this.subject.notifyObservers(event);
    this.sent = true;
    return true;
  }

  public undo(): void {
    if (this.sent) {
      this.sent = false;
    }
  }

  public isSent(): boolean {
    return this.sent;
  }

  public getName(): string {
    return "SendConfirmationCommand";
  }
}
