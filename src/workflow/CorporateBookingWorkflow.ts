import { Coupon, PaymentDetails, Seat, Show, User } from "../model";
import { BookingWorkflow } from "./BookingWorkflow";
import { PaymentContext } from "../chain/PaymentContext";
import { SeatAllocationStrategy, NotificationService, LoggingService } from "../interfaces";
import { BookingRepository } from "../repository/BookingRepository";
import { PaymentHandler } from "../chain/PaymentHandler";

export class CorporateBookingWorkflow extends BookingWorkflow {
  private baseSeatPrice: number;
  private corporateDiscountPercentage: number;

  constructor(
    seatAllocator: SeatAllocationStrategy,
    paymentHandler: PaymentHandler,
    notifier: NotificationService,
    logger: LoggingService,
    repo: BookingRepository,
    baseSeatPrice: number = 200,
    corporateDiscountPercentage: number = 15,
  ) {
    super(seatAllocator, paymentHandler, notifier, logger, repo);
    this.baseSeatPrice = baseSeatPrice;
    this.corporateDiscountPercentage = corporateDiscountPercentage;
  }

  protected validateRequest(user: User, show: Show, seats: Seat[]): void {
    if (!seats || seats.length < 5) {
      throw new Error("Corporate booking requires a minimum of 5 seats.");
    }
    if (!user.getEmail().includes("@")) {
      throw new Error("Invalid email address for corporate booking.");
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
    const discountedTotal = rawTotal * (1 - this.corporateDiscountPercentage / 100);
    const ctx = new PaymentContext(discountedTotal, user, coupon, paymentDetails);
    const result = this.paymentHandler.handle(ctx);

    if (!result.isSuccess()) {
      throw new Error(result.getFailureReason() ?? "Corporate payment authorization failed.");
    }
    this.lastCalculatedAmount = ctx.getAmount();
  }
}
