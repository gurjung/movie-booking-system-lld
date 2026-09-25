import { BookingStatus, TicketType } from "../enums";
import { BookingBuilder, TicketFactory } from "../interfaces";
import { Booking, Coupon, Money, Seat, Show, Snack, User } from "../model";
import { Ticket } from "../tickets";

export class RegularBookingBuilder implements BookingBuilder {
  protected ticketFactory: TicketFactory;
  protected show: Show | null;
  protected user: User | null;
  protected tickets: Ticket[];
  protected snacks: Snack[];
  protected coupon: Coupon | null;
  protected loyaltyPoints: number;
  protected specialRequests: string[];

  constructor(ticketFactory: TicketFactory) {
    this.ticketFactory = ticketFactory;
    this.show = null;
    this.user = null;
    this.tickets = [];
    this.snacks = [];
    this.coupon = null;
    this.loyaltyPoints = 0;
    this.specialRequests = [];
  }

  public forShow(show: Show): BookingBuilder {
    this.show = show;
    return this;
  }

  public forUser(user: User): BookingBuilder {
    this.user = user;
    return this;
  }

  public addTicket(seat: Seat, ticketType: TicketType): BookingBuilder {
    const ticket = this.ticketFactory.createTicket(ticketType, seat);
    this.tickets.push(ticket);
    return this;
  }

  public addSnack(snack: Snack): BookingBuilder {
    this.snacks.push(snack);
    return this;
  }

  public applyCoupon(coupon: Coupon): BookingBuilder {
    this.coupon = coupon;
    return this;
  }

  public withLoyaltyPoints(points: number): BookingBuilder {
    this.loyaltyPoints = points;
    return this;
  }

  public withSpecialRequest(text: string): BookingBuilder {
    this.specialRequests.push(text);
    return this;
  }

  protected validate(): void {
    if (!this.show) {
      throw new Error("Validation Error: Show must be set before building booking.");
    }
    if (!this.user) {
      throw new Error("Validation Error: User must be set before building booking.");
    }
    if (this.tickets.length === 0) {
      throw new Error("Validation Error: At least one ticket must be added to the booking.");
    }
  }

  protected generateBookingId(): string {
    return "BKG" + Date.now();
  }

  protected createBookingInstance(
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
  ): Booking {
    return new Booking(
      id,
      show,
      user,
      seats,
      status,
      amount,
      tickets,
      snacks,
      coupon,
      loyaltyPoints,
      specialRequests,
    );
  }

  protected reset(): void {
    this.show = null;
    this.user = null;
    this.tickets = [];
    this.snacks = [];
    this.coupon = null;
    this.loyaltyPoints = 0;
    this.specialRequests = [];
  }

  public build(): Booking {
    this.validate();

    const bookingId = this.generateBookingId();
    const seats = this.tickets.map((ticket) => ticket.getSeat());

    const booking = this.createBookingInstance(
      bookingId,
      this.show!,
      this.user!,
      seats,
      BookingStatus.PENDING,
      Money.zero(),
      [...this.tickets],
      [...this.snacks],
      this.coupon,
      this.loyaltyPoints,
      [...this.specialRequests],
    );

    this.reset();

    return booking;
  }
}
