import { User } from "../model";

export abstract class BookingEvent {
  private id: string;
  private timestamp: Date;
  private user: User;

  constructor(id: string, user: User, timestamp: Date = new Date()) {
    this.id = id;
    this.user = user;
    this.timestamp = timestamp;
  }

  public getId(): string {
    return this.id;
  }

  public getUser(): User {
    return this.user;
  }

  public getTimestamp(): Date {
    return this.timestamp;
  }

  public abstract getEventType(): string;
  public abstract getDetails(): string;
}
