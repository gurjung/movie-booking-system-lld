import { BookingStatus } from "../enums";
import {
  NotificationService,
  PricingStrategy,
  SeatAllocationStrategy,
} from "../interfaces";
import { PaymentGatewayStrategy } from "../interfaces/PaymentGateway";
import { Booking, Money, PaymentDetails, Seat, Show, User } from "../model";
import { BookingResult } from "../model/BookingResult";
import { BookingRepository } from "../repository/BookingRepository";

export class BookingService {
  private seatAllocator: SeatAllocationStrategy;
  private pricing: PricingStrategy;
  private payment: PaymentGatewayStrategy;
  private repo: BookingRepository;
  private notifier: NotificationService;

  constructor(
    pricing: PricingStrategy,
    seatAllocator: SeatAllocationStrategy,
    payment: PaymentGatewayStrategy,
    repo: BookingRepository,
    notifier: NotificationService,
  ) {
    this.seatAllocator = seatAllocator;
    this.pricing = pricing;
    this.payment = payment;
    this.repo = repo;
    this.notifier = notifier;
  }

  public book(
    user: User,
    show: Show,
    seats: Seat[],
    paymentDetails: PaymentDetails,
  ): BookingResult {
    // calculate total price of seats
    let total = Money.zero();

    for (let seat of seats) {
      let seatPrice = this.pricing.calculatePrice(show, seat, user);
      total = total.add(seatPrice);
    }

    // seat allocation
    const reserved = this.seatAllocator.allocateSeats(show, seats);
    if (!reserved) {
      return BookingResult.fail("Seats unavailable");
    }

    //payment processing
    const paymentResult = this.payment.charge(user, total, paymentDetails);
    if (!paymentResult.isSuccess()) {
      // release the hold seats
      this.seatAllocator.releaseSeats(show, seats);
      const reason = paymentResult.getFailureReason() ?? "Payment failed";

      return BookingResult.fail(reason);
    }

    // do booking and save in db
    const bookingId = "BKG" + Date.now();
    const booking = new Booking(
      bookingId,
      show,
      user,
      seats,
      BookingStatus.CONFIRMED,
      total,
    );

    this.repo.save(booking);

    // notify users
    this.notifier.notify(user, booking);

    return BookingResult.success(booking);
  }
}
