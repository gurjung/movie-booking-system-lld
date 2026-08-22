import { BookingStatus } from "../enums";
import { Money } from "./Money";
import { Seat } from "./Seat";
import { Show } from "./Show";
import { User } from "./User";

export class Booking {
  private id: string;
  private show: Show;
  private user: User;
  private seats: Seat[];
  private status: BookingStatus;
  private amount: Money;

  constructor(
    id: string,
    show: Show,
    user: User,
    seats: Seat[],
    status: BookingStatus,
    amount: Money,
  ) {
    this.id = id;
    this.show = show;
    this.user = user;
    this.seats = seats;
    this.status = status;
    this.amount = amount;
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getShow(): Show {
    return this.show;
  }

  public setShow(show: Show): void {
    this.show = show;
  }

  public getUser(): User {
    return this.user;
  }

  public setUser(user: User): void {
    this.user = user;
  }

  public getSeats(): Seat[] {
    return this.seats;
  }

  public setSeats(seats: Seat[]): void {
    this.seats = seats;
  }

  public getStatus(): BookingStatus {
    return this.status;
  }

  public setStatus(status: BookingStatus): void {
    this.status = status;
  }

  public getAmount(): Money {
    return this.amount;
  }

  public setAmount(amount: Money): void {
    this.amount = amount;
  }
}
