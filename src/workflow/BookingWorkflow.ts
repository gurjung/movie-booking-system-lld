import { Booking, BookingResult, Coupon, Money, PaymentDetails, Seat, Show, User } from "../model";
import { BookingStatus, SeatStatus } from "../enums";
import { SeatAllocationStrategy, NotificationService, LoggingService } from "../interfaces";
import { BookingRepository } from "../repository/BookingRepository";
import { PaymentHandler } from "../chain/PaymentHandler";

export abstract class BookingWorkflow {
  protected seatAllocator: SeatAllocationStrategy;
  protected paymentHandler: PaymentHandler;
  protected notifier: NotificationService;
  protected logger: LoggingService;
  protected repo: BookingRepository;
  protected lastCalculatedAmount: number = 0;

  constructor(
    seatAllocator: SeatAllocationStrategy,
    paymentHandler: PaymentHandler,
    notifier: NotificationService,
    logger: LoggingService,
    repo: BookingRepository,
  ) {
    this.seatAllocator = seatAllocator;
    this.paymentHandler = paymentHandler;
    this.notifier = notifier;
    this.logger = logger;
    this.repo = repo;
  }

  public processBooking(
    user: User,
    show: Show,
    seats: Seat[],
    coupon?: Coupon,
    paymentDetails?: PaymentDetails,
  ): BookingResult {
    try {
      this.validateRequest(user, show, seats);
      this.allocateSeats(show, seats);

      try {
        this.processPayment(user, show, seats, coupon, paymentDetails);
      } catch (error) {
        this.rollbackSeats(show, seats);
        const reason = error instanceof Error ? error.message : "Payment failed";
        this.logger.error(`Booking workflow failed during payment: ${reason}`);
        return BookingResult.fail(reason);
      }

      this.confirmSeats(seats);
      const booking = this.createBooking(user, show, seats, coupon);
      this.sendConfirmation(user, show, seats, booking);
      return BookingResult.success(booking);
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Booking validation failed";
      this.logger.error(`Booking workflow failed: ${reason}`);
      return BookingResult.fail(reason);
    }
  }

  protected abstract validateRequest(user: User, show: Show, seats: Seat[]): void;

  protected abstract processPayment(
    user: User,
    show: Show,
    seats: Seat[],
    coupon?: Coupon,
    paymentDetails?: PaymentDetails,
  ): void;

  protected allocateSeats(show: Show, seats: Seat[]): void {
    const allocated = this.seatAllocator.allocateSeats(show, seats);
    if (!allocated) {
      throw new Error("Unable to allocate selected seats.");
    }
    for (const seat of seats) {
      seat.reserve();
    }
  }

  protected confirmSeats(seats: Seat[]): void {
    for (const seat of seats) {
      seat.confirm();
    }
  }

  protected rollbackSeats(show: Show, seats: Seat[]): void {
    this.seatAllocator.releaseSeats(show, seats);
    for (const seat of seats) {
      if (seat.getState().getStatus() === SeatStatus.HELD) {
        seat.release();
      }
    }
  }

  protected createBooking(
    user: User,
    show: Show,
    seats: Seat[],
    coupon?: Coupon,
  ): Booking {
    const booking = new Booking(
      "BKG" + Date.now() + Math.floor(Math.random() * 1000),
      show,
      user,
      seats,
      BookingStatus.CONFIRMED,
      new Money(this.lastCalculatedAmount),
      [],
      [],
      coupon ?? null,
      0,
      [],
    );
    this.repo.save(booking);
    return booking;
  }

  protected sendConfirmation(
    user: User,
    show: Show,
    seats: Seat[],
    booking: Booking,
  ): void {
    this.notifier.notify(user, booking);
    this.logger.info(`Booking workflow confirmation sent for booking ${booking.getId()}`);
  }
}
