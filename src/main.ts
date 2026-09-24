import { SeatType, TicketType } from "./enums";
import {
  Address,
  Coupon,
  Money,
  Movie,
  PaymentDetails,
  Screen,
  Seat,
  Show,
  Snack,
  User,
} from "./model";
import { BookingRepository } from "./repository/BookingRepository";
import { BookingService } from "./service/BookingService";
import { Logger } from "./serviceimpl/Logger";
import { EmailNotificationService } from "./serviceimpl/notification/EmailNotification";
import { MockPaymentGateway } from "./serviceimpl/payment-gateway/MockPaymentGateway";
import { PeakHourPricingStrategy } from "./serviceimpl/pricing/PeakHourPricing";
import { VIPPricingStrategy } from "./serviceimpl/pricing/VIPPricingStrategy";
import { SimpleTicketFactory } from "./serviceimpl/RegistryTicketFactory";
import { RegularBookingBuilder } from "./serviceimpl/RegularBookingBuilder";
import { InMemorySeatAllocationStrategy } from "./serviceimpl/seatAllocation/InMemorySeatAllocation";
import { VIPBookingBuilder } from "./serviceimpl/VIPBookingBuilder";

const movie = new Movie(
  "M1",
  "Spiderman: Across the Spider-Verse",
  148,
  "Sci-Fi",
  "English",
  "U/A",
);

const s1 = new Seat("S1", SeatType.NORMAL, 1, 1);
const s2 = new Seat("S2", SeatType.PREMIUM, 1, 2);
const s3 = new Seat("S3", SeatType.PREMIUM, 2, 1);
const s4 = new Seat("S4", SeatType.VIP, 2, 2);
const s5 = new Seat("S5", SeatType.NORMAL, 3, 1);

const screen = new Screen("SC1", "Audi 1", [s1, s2, s3, s4, s5]);

const startTime = new Date("2026-08-22T18:00:00");
const endTime = new Date("2026-08-22T20:30:00");
const show = new Show("SH1", movie, screen, startTime, endTime);

const userAddress = new Address(
  "123 Model Town",
  "Ludhiana",
  "Punjab",
  "141001",
);
const user = new User(
  "U1",
  "Gurjung",
  "gurjung997@gmail.com",
  "9999999999",
  userAddress,
);
const paymentDetails = new PaymentDetails("UPI");

const ticketFactory = new SimpleTicketFactory();
const logger = Logger.getInstance();
const seatAllocator = new InMemorySeatAllocationStrategy();
const paymentGateway = new MockPaymentGateway();
const bookingRepo = new BookingRepository();
const notifier = new EmailNotificationService();

const regularBookingService = new BookingService(
  new PeakHourPricingStrategy(),
  seatAllocator,
  paymentGateway,
  bookingRepo,
  notifier,
  logger,
);

const vipBookingService = new BookingService(
  new VIPPricingStrategy(),
  seatAllocator,
  paymentGateway,
  bookingRepo,
  notifier,
  logger,
);

console.log(
  "DEMO SCENARIO 1: Regular Booking (Standard + Premium + Snack + Coupon)",
);

const regularBuilder = new RegularBookingBuilder(ticketFactory);
const regularBooking = regularBuilder
  .forShow(show)
  .forUser(user)
  .addTicket(s1, TicketType.STANDARD)
  .addTicket(s2, TicketType.PREMIUM)
  .addSnack(
    new Snack("SNK-1", "Popcorn & Soft Drink Combo", new Money(180), false),
  )
  .applyCoupon(new Coupon("DISCOUNT50", new Money(50)))
  .withLoyaltyPoints(100)
  .withSpecialRequest("Please provide aisle seats if possible")
  .build();

const regularResult = regularBookingService.book(
  regularBooking,
  paymentDetails,
);

if (regularResult.isOk()) {
  const b = regularResult.getBooking();
  console.log("Regular Booking Result: SUCCESS");
  console.log("Booking ID:", b?.getId());
  console.log("Tickets Count:", b?.getTickets().length);
  console.log("Snacks Count:", b?.getSnacks().length);
  console.log("Coupon Applied:", b?.getCoupon()?.getCode());
  console.log("Final Amount:", b?.getAmount().toDisplayString());
} else {
  console.log(
    "Regular Booking Result: FAILED, Error:",
    regularResult.getErrorMessage(),
  );
}

console.log(
  "DEMO SCENARIO 2: VIP Booking (Premium + Recliner + Auto Complimentary Snack)",
);

const vipBuilder = new VIPBookingBuilder(ticketFactory);
const vipBooking = vipBuilder
  .forShow(show)
  .forUser(user)
  .addTicket(s3, TicketType.PREMIUM)
  .addTicket(s4, TicketType.RECLINER)
  .withSpecialRequest("VIP lounge access")
  .build();

console.log("VIP Snacks detected prior to booking:");
for (const snack of vipBooking.getSnacks()) {
  console.log(
    ` - ${snack.getName()} (Complimentary: ${snack.isComplimentary()}, Price: ${snack.getPrice().toDisplayString()})`,
  );
}

const vipResult = vipBookingService.book(vipBooking, paymentDetails);

if (vipResult.isOk()) {
  const b = vipResult.getBooking();
  console.log("VIP Booking Result: SUCCESS");
  console.log("Booking ID:", b?.getId());
  console.log("Tickets Count:", b?.getTickets().length);
  console.log("Final Amount:", b?.getAmount().toDisplayString());
} else {
  console.log(
    "VIP Booking Result: FAILED, Error:",
    vipResult.getErrorMessage(),
  );
}

console.log(
  "DEMO SCENARIO 3: VIP Booking Validation Error (Attempting STANDARD ticket)",
);

try {
  const invalidVipBuilder = new VIPBookingBuilder(ticketFactory);
  invalidVipBuilder
    .forShow(show)
    .forUser(user)
    .addTicket(s5, TicketType.STANDARD)
    .build();

  console.log("Error: Expected validation failure, but booking was built!");
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.log("Validation caught successfully:");
  console.log(` -> ${message}`);
}
