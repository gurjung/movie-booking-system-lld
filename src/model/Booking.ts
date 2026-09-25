import { BookingStatus } from "../enums";
import { Ticket } from "../tickets/Ticket";
import { Coupon } from "./Coupon";
import { Money } from "./Money";
import { Seat } from "./Seat";
import { Show } from "./Show";
import { Snack } from "./Snack";
import { User } from "./User";

export class Booking {
  private id: string;
  private show: Show;
  private user: User;
  private seats: Seat[];
  private status: BookingStatus;
  private amount: Money;
  private tickets: Ticket[];
  private snacks: Snack[];
  private coupon: Coupon | null;
  private loyaltyPoints: number;
  private specialRequests: string[];

  constructor(
    id: string,
    show: Show,
    user: User,
    seats: Seat[],
    status: BookingStatus,
    amount: Money,
    tickets: Ticket[],
    snacks: Snack[],
    coupon: Coupon | null,
    loyaltyPoints: number,
    specialRequests: string[],
  ) {
    this.id = id;
    this.show = show;
    this.user = user;
    this.seats = seats;
    this.status = status;
    this.amount = amount;
    this.tickets = tickets;
    this.snacks = snacks;
    this.coupon = coupon;
    this.loyaltyPoints = loyaltyPoints;
    this.specialRequests = specialRequests;
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

  public getTickets(): Ticket[] {
    return this.tickets;
  }

  public setTickets(tickets: Ticket[]): void {
    this.tickets = tickets;
  }

  public getSnacks(): Snack[] {
    return this.snacks;
  }

  public setSnacks(snacks: Snack[]): void {
    this.snacks = snacks;
  }

  public getCoupon(): Coupon | null {
    return this.coupon;
  }

  public setCoupon(coupon: Coupon | null): void {
    this.coupon = coupon;
  }

  public getLoyaltyPoints(): number {
    return this.loyaltyPoints;
  }

  public setLoyaltyPoints(loyaltyPoints: number): void {
    this.loyaltyPoints = loyaltyPoints;
  }

  public getSpecialRequests(): string[] {
    return this.specialRequests;
  }

  public setSpecialRequests(specialRequests: string[]): void {
    this.specialRequests = specialRequests;
  }
}
