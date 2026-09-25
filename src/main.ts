import { SeatType, TicketType } from "./enums";
import {
  Address,
  Coupon,
  Money,
  Movie,
  PaymentDetails,
  Row,
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
import { SimpleTicketFactory } from "./serviceimpl/SimpleTicketFactory";
import { RegularBookingBuilder } from "./serviceimpl/RegularBookingBuilder";
import { InMemorySeatAllocationStrategy } from "./serviceimpl/seatAllocation/InMemorySeatAllocation";
import { CompositeSeatAllocationStrategy } from "./serviceimpl/seatAllocation/CompositeSeatAllocation";
import { VIPBookingBuilder } from "./serviceimpl/VIPBookingBuilder";
import {
  ComboWrapDecorator,
  ExtraButterDecorator,
  GlutenFreePackagingDecorator,
  LargeSizeDecorator,
  Nachos,
  Popcorn,
  Soda,
} from "./snacks";

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
  "\nDEMO SCENARIO 2: VIP Booking (Premium + Recliner + Auto Complimentary Snack)",
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
  "\nDEMO SCENARIO 3: VIP Booking Validation Error (Attempting STANDARD ticket)",
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

console.log("\nDEMO SCENARIO 4: Decorator Pattern for Snack Add-ons");

const basePopcorn = new Popcorn();
console.log(`Base Snack: ${basePopcorn.getDescription()}`);
console.log(`Base Price: ${basePopcorn.getPrice().toDisplayString()}`);
console.log(`Base Prep Time: ${basePopcorn.getPrepTime()} mins`);
console.log(
  `Base Dietary Tags: ${Array.from(basePopcorn.getDietaryTags()).join(", ")}`,
);

const decoratedCombo = new ComboWrapDecorator(
  new ExtraButterDecorator(new LargeSizeDecorator(basePopcorn)),
);

console.log(`\nDecorated Snack: ${decoratedCombo.getDescription()}`);
console.log(`Total Price: ${decoratedCombo.getPrice().toDisplayString()}`);
console.log(`Aggregated Prep Time: ${decoratedCombo.getPrepTime()} mins`);
console.log(
  `Aggregated Dietary Tags: ${Array.from(decoratedCombo.getDietaryTags()).join(", ")}`,
);

const gfNachos = new GlutenFreePackagingDecorator(new Nachos());
console.log(`\nGluten-Free Nachos: ${gfNachos.getDescription()}`);
console.log(`Price: ${gfNachos.getPrice().toDisplayString()}`);
console.log(
  `Dietary Tags: ${Array.from(gfNachos.getDietaryTags()).join(", ")}`,
);

console.log("\nDEMO SCENARIO 5: Composite Pattern for Theater Layout");

const rowA = new Row("ROW-A", 1, [
  new Seat("A1", SeatType.VIP, 1, 1),
  new Seat("A2", SeatType.VIP, 1, 2),
  new Seat("A3", SeatType.VIP, 1, 3),
  new Seat("A4", SeatType.VIP, 1, 4),
  new Seat("A5", SeatType.VIP, 1, 5),
]);

const rowB = new Row("ROW-B", 2, [
  new Seat("B1", SeatType.PREMIUM, 2, 1),
  new Seat("B2", SeatType.PREMIUM, 2, 2),
  new Seat("B3", SeatType.PREMIUM, 2, 3),
  new Seat("B4", SeatType.PREMIUM, 2, 4),
  new Seat("B5", SeatType.PREMIUM, 2, 5),
]);

const rowC = new Row("ROW-C", 3, [
  new Seat("C1", SeatType.NORMAL, 3, 1),
  new Seat("C2", SeatType.NORMAL, 3, 2),
  new Seat("C3", SeatType.NORMAL, 3, 3),
  new Seat("C4", SeatType.NORMAL, 3, 4),
  new Seat("C5", SeatType.NORMAL, 3, 5),
]);

const compositeScreen = new Screen("SC-COMPOSITE", "IMAX Screen 1", [
  rowA,
  rowB,
  rowC,
]);

console.log(`Screen: ${compositeScreen.getName()}`);
console.log(`Total Capacity: ${compositeScreen.getTotalCount()} seats`);
console.log(`Initial Available: ${compositeScreen.getAvailableCount()} seats`);
console.log(
  `Initial Occupancy: ${(compositeScreen.getOccupancyRate() * 100).toFixed(1)}%`,
);

const requestedVipSeats = compositeScreen.findAvailableSeats(
  4,
  true,
  SeatType.VIP,
);
console.log(
  `Found 4 Contiguous VIP Seats: ${requestedVipSeats.map((s) => s.getId()).join(", ")}`,
);

const reservationSuccess = compositeScreen.reserveSeats(
  requestedVipSeats.map((s) => s.getId()),
);
console.log(`Atomic Reservation Success: ${reservationSuccess}`);
console.log(
  `Available After Reservation: ${compositeScreen.getAvailableCount()} seats`,
);
console.log(
  `Occupancy After Reservation: ${(compositeScreen.getOccupancyRate() * 100).toFixed(1)}%`,
);

compositeScreen.applyPriceAdjustment(
  (seat) => seat.getType() === SeatType.VIP,
  50,
);
console.log(
  `Total Screen Price Modifier Sum after VIP +50 uplift: ${compositeScreen.getPriceSum()}`,
);

console.log(
  "\nDEMO SCENARIO 6: Integrated Booking Flow with Decorated Snacks & Composite Screen",
);

const compositeShow = new Show(
  "SH-COMP",
  movie,
  compositeScreen,
  startTime,
  endTime,
);
const compositeSeatAllocator = new CompositeSeatAllocationStrategy();
const compositeBookingService = new BookingService(
  new PeakHourPricingStrategy(),
  compositeSeatAllocator,
  paymentGateway,
  bookingRepo,
  notifier,
  logger,
);

const candidateSeats = compositeScreen.findAvailableSeats(
  2,
  true,
  SeatType.PREMIUM,
);
console.log(
  `Allocating Seats via Screen Composite: ${candidateSeats.map((s) => s.getId()).join(", ")}`,
);

const integratedBooking = new RegularBookingBuilder(ticketFactory)
  .forShow(compositeShow)
  .forUser(user)
  .addTicket(candidateSeats[0], TicketType.PREMIUM)
  .addTicket(candidateSeats[1], TicketType.PREMIUM)
  .addSnack(decoratedCombo)
  .addSnack(new Soda())
  .build();

const integratedResult = compositeBookingService.book(
  integratedBooking,
  paymentDetails,
);

if (integratedResult.isOk()) {
  const b = integratedResult.getBooking();
  console.log("Integrated Booking: SUCCESS");
  console.log("Booking ID:", b?.getId());
  console.log(
    "Snacks Ordered:",
    b
      ?.getSnacks()
      .map((s) => `${s.getDescription()} (${s.getPrice().toDisplayString()})`)
      .join("; "),
  );
  console.log("Final Amount Charged:", b?.getAmount().toDisplayString());
  console.log(
    `Screen Occupancy Now: ${(compositeScreen.getOccupancyRate() * 100).toFixed(1)}%`,
  );
} else {
  console.log(
    "Integrated Booking: FAILED, Error:",
    integratedResult.getErrorMessage(),
  );
}
