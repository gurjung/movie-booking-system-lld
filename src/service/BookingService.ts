import { BookingStatus } from "../enums";
import {
  LoggingService,
  NotificationService,
  PaymentGatewayStrategy,
  PricingStrategy,
  SeatAllocationStrategy,
} from "../interfaces";
import { Booking, Money, PaymentDetails } from "../model";
import { BookingResult } from "../model/BookingResult";
import { BookingRepository } from "../repository/BookingRepository";

export class BookingService {
  private seatAllocator: SeatAllocationStrategy;
  private pricing: PricingStrategy;
  private payment: PaymentGatewayStrategy;
  private repo: BookingRepository;
  private notifier: NotificationService;
  private logger: LoggingService;

  constructor(
    pricing: PricingStrategy,
    seatAllocator: SeatAllocationStrategy,
    payment: PaymentGatewayStrategy,
    repo: BookingRepository,
    notifier: NotificationService,
    logger: LoggingService,
  ) {
    this.seatAllocator = seatAllocator;
    this.pricing = pricing;
    this.payment = payment;
    this.repo = repo;
    this.notifier = notifier;
    this.logger = logger;
  }

  private calculateTotal(booking: Booking): Money {
    const show = booking.getShow();
    const user = booking.getUser();
    let total = 0;

    for (const ticket of booking.getTickets()) {
      const base = ticket.getBasePrice().getAmount();
      const adjustment = this.pricing
        .calculatePrice(show, ticket.getSeat(), user)
        .getAmount();
      total += base + adjustment;
    }

    for (const snack of booking.getSnacks()) {
      if (!snack.isComplimentary()) {
        total += snack.getPrice().getAmount();
      }
    }

    const coupon = booking.getCoupon();
    if (coupon) {
      total -= coupon.getDiscountAmount().getAmount();
    }

    total = Math.max(0, total);
    return new Money(total);
  }

  public book(booking: Booking, paymentDetails: PaymentDetails): BookingResult {
    const user = booking.getUser();
    const show = booking.getShow();
    const seats = booking.getSeats();

    this.logger.info(
      `Booking started for user: ${user.getName()} (ID: ${user.getId()}) for show: ${show.getId()}`,
    );

    const total = this.calculateTotal(booking);
    booking.setAmount(total);

    const reserved = this.seatAllocator.allocateSeats(show, seats);
    if (!reserved) {
      booking.setStatus(BookingStatus.FAILED);
      this.logger.warn(`Seats unavailable for show: ${show.getId()}`);
      return BookingResult.fail("Seats unavailable");
    }

    const paymentResult = this.payment.charge(user, total, paymentDetails);
    if (!paymentResult.isSuccess()) {
      this.seatAllocator.releaseSeats(show, seats);
      booking.setStatus(BookingStatus.FAILED);
      const reason = paymentResult.getFailureReason() ?? "Payment failed";
      this.logger.error(
        `Payment failed for user: ${user.getId()}. Reason: ${reason}`,
      );
      return BookingResult.fail(reason);
    }

    booking.setStatus(BookingStatus.CONFIRMED);
    this.repo.save(booking);
    this.logger.info(
      `Booking confirmed successfully! Booking ID: ${booking.getId()}`,
    );

    this.notifier.notify(user, booking);

    return BookingResult.success(booking);
  }
}
