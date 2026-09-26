import { Show, User } from "../../model";
import { BookingEvent } from "./BookingEvent";

export class ShowReminderEvent extends BookingEvent {
  private show: Show;
  private reminderMessage: string;

  constructor(
    id: string,
    user: User,
    show: Show,
    reminderMessage: string = "Your show starts in 1 hour!",
  ) {
    super(id, user);
    this.show = show;
    this.reminderMessage = reminderMessage;
  }

  public getShow(): Show {
    return this.show;
  }

  public getReminderMessage(): string {
    return this.reminderMessage;
  }

  public override getEventType(): string {
    return "SHOW_REMINDER";
  }

  public override getDetails(): string {
    return `Reminder for ${this.show.getMovie().getTitle()} in ${this.show.getScreen().getName()} at ${this.show.getStartTime().toLocaleTimeString()} - ${this.reminderMessage}`;
  }
}
