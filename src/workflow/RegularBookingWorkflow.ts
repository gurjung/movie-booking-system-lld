import { Coupon, PaymentDetails, Seat, Show, User } from "../model";
import { BookingWorkflow } from "./BookingWorkflow";
import { PaymentContext } from "../chain/PaymentContext";
import { SeatAllocationStrategy, NotificationService, LoggingService } from "../interfaces";
import { BookingRepository } from "../repository/BookingRepository";
import { PaymentHandler } from "../chain/PaymentHandler";

export class RegularBookingWorkflow extends BookingWorkflow {
  private baseSeatPrice: number;

  constructor(
    seatAllocator: SeatAllocationStrategy,
    paymentHandler: PaymentHandler,
    notifier: NotificationService,
    logger: LoggingService,
    repo: BookingRepository,
    baseSeatPrice: number = 200,
  ) {
    super(seatAllocator, paymentHandler, notifier, logger, repo);
    this.baseSeatPrice = baseSeatPrice;
  }

  protected validateRequest(user: User, show: Show, seats: Seat[]): void {
    if (!seats || seats.length === 0) {
      throw new Error("Regular booking must contain at least 1 seat.");
    }
    if (seats.length > 6) {
      throw new Error("Regular booking cannot exceed maximum limit of 6 seats.");
    }
    for (const seat of seats) {
      if (!seat.isSeatAvailable()) {
        throw new Error(`Seat ${seat.getId()} is not available for booking.`);
      }
    }
  }

  protected processPayment(
    user: User,
    show: Show,
    seats: Seat[],
    coupon?: Coupon,
    paymentDetails?: PaymentDetails,
  ): void {
    const rawTotal = seats.length * this.baseSeatPrice;
    const ctx = new PaymentContext(rawTotal, user, coupon, paymentDetails);
    const result = this.paymentHandler.handle(ctx);

    if (!result.isSuccess()) {
      throw new Error(result.getFailureReason() ?? "Payment transaction failed.");
    }
    this.lastCalculatedAmount = ctx.getAmount();
  }
}
