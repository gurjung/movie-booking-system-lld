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
import {
  DefaultPricingStrategy,
  FestivalDiscountPricingStrategy,
  WeekdayPricingStrategy,
  WeekendSurgePricingStrategy,
} from "./serviceimpl/pricing";
import {
  BookingConfirmedEvent,
  EmailNotifier,
  OfferBroadcastEvent,
  PushNotifier,
  ShowReminderEvent,
  SMSNotifier,
} from "./observer";
import { ObservableNotificationService } from "./serviceimpl/notification/ObservableNotificationService";
import {
  BookingInvoker,
  ConfirmPaymentCommand,
  ReserveSeatCommand,
  SelectSeatCommand,
  SendConfirmationCommand,
} from "./command";

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

console.log(
  "\nDEMO SCENARIO 7: Strategy Pattern - Dynamic Pricing Strategies (Dependency Injection)",
);

const weekdaySeat = new Seat("WD-S1", SeatType.NORMAL, 1, 1);
const weekdayScreen = new Screen("SC-WD", "Audi Weekday", [
  new Row("ROW-WD", 1, [weekdaySeat]),
]);
const weekdayShow = new Show(
  "SH-WD",
  movie,
  weekdayScreen,
  new Date("2026-08-26T14:00:00"),
  new Date("2026-08-26T16:30:00"),
);

const weekendSeat = new Seat("WE-S1", SeatType.NORMAL, 1, 1);
const weekendScreen = new Screen("SC-WE", "Audi Weekend", [
  new Row("ROW-WE", 1, [weekendSeat]),
]);
const weekendShow = new Show(
  "SH-WE",
  movie,
  weekendScreen,
  new Date("2026-08-29T19:00:00"),
  new Date("2026-08-29T21:30:00"),
);

const festivalSeat = new Seat("FEST-S1", SeatType.NORMAL, 1, 1);
const festivalScreen = new Screen("SC-FEST", "Audi Festival", [
  new Row("ROW-FEST", 1, [festivalSeat]),
]);
const festivalShow = new Show(
  "SH-FEST",
  movie,
  festivalScreen,
  new Date("2026-11-01T18:00:00"),
  new Date("2026-11-01T20:30:00"),
);

const weekdayBookingService = new BookingService(
  new WeekdayPricingStrategy(20),
  compositeSeatAllocator,
  paymentGateway,
  bookingRepo,
  notifier,
  logger,
);

const weekendBookingService = new BookingService(
  new WeekendSurgePricingStrategy(50),
  compositeSeatAllocator,
  paymentGateway,
  bookingRepo,
  notifier,
  logger,
);

const festivalBookingService = new BookingService(
  new FestivalDiscountPricingStrategy(60),
  compositeSeatAllocator,
  paymentGateway,
  bookingRepo,
  notifier,
  logger,
);

const weekdayBooking = new RegularBookingBuilder(ticketFactory)
  .forShow(weekdayShow)
  .forUser(user)
  .addTicket(weekdaySeat, TicketType.STANDARD)
  .build();

const weekendBooking = new RegularBookingBuilder(ticketFactory)
  .forShow(weekendShow)
  .forUser(user)
  .addTicket(weekendSeat, TicketType.STANDARD)
  .build();

const festivalBooking = new RegularBookingBuilder(ticketFactory)
  .forShow(festivalShow)
  .forUser(user)
  .addTicket(festivalSeat, TicketType.STANDARD)
  .build();

const resWeekday = weekdayBookingService.book(weekdayBooking, paymentDetails);
const resWeekend = weekendBookingService.book(weekendBooking, paymentDetails);
const resFestival = festivalBookingService.book(
  festivalBooking,
  paymentDetails,
);

console.log(
  "Weekday Booking Final Amount (Base 150 - 20 discount):",
  resWeekday.getBooking()?.getAmount().toDisplayString(),
);
console.log(
  "Weekend Booking Final Amount (Base 150 + 50 surge):",
  resWeekend.getBooking()?.getAmount().toDisplayString(),
);
console.log(
  "Festival Booking Final Amount (Base 150 - 60 festival discount):",
  resFestival.getBooking()?.getAmount().toDisplayString(),
);

console.log(
  "\nDEMO SCENARIO 8: Observer Pattern - Multi-Channel Notifications & Dynamic Subscription",
);

const observableNotifier = new ObservableNotificationService();
const emailSub = new EmailNotifier();
const smsSub = new SMSNotifier();
const pushSub = new PushNotifier();

observableNotifier.attach(emailSub);
observableNotifier.attach(smsSub);
observableNotifier.attach(pushSub);

console.log("Attached 3 observers: Email, SMS, Push.");
console.log("Subscribers count:", observableNotifier.getObservers().length);

const observedBookingService = new BookingService(
  new DefaultPricingStrategy(),
  compositeSeatAllocator,
  paymentGateway,
  bookingRepo,
  observableNotifier,
  logger,
);

const observerSeat = new Seat("OBS-S1", SeatType.NORMAL, 1, 1);
const observerScreen = new Screen("SC-OBS", "Audi Observer", [
  new Row("ROW-OBS", 1, [observerSeat]),
]);
const observerShow = new Show(
  "SH-OBS",
  movie,
  observerScreen,
  new Date("2026-08-26T14:00:00"),
  new Date("2026-08-26T16:30:00"),
);

const observerBooking = new RegularBookingBuilder(ticketFactory)
  .forShow(observerShow)
  .forUser(user)
  .addTicket(observerSeat, TicketType.STANDARD)
  .build();

console.log("\n--- Triggering BookingConfirmedEvent via BookingService ---");
observedBookingService.book(observerBooking, paymentDetails);

console.log("\n--- Dispatching ShowReminderEvent directly ---");
const reminderEvent = new ShowReminderEvent(
  "REM-101",
  user,
  observerShow,
  "Starts in 30 minutes! Please arrive early.",
);
observableNotifier.notifyObservers(reminderEvent);

console.log("\n--- Dispatching OfferBroadcastEvent directly ---");
const offerEvent = new OfferBroadcastEvent(
  "OFF-202",
  user,
  "Weekend Blockbuster Dhamaka",
  "DIWALI50",
  50,
);
observableNotifier.notifyObservers(offerEvent);

console.log("\n--- Detaching SMS Observer and testing unsubscription ---");
observableNotifier.detach(smsSub);
console.log(
  "Subscribers count after detaching SMS:",
  observableNotifier.getObservers().length,
);

console.log("Dispatching another reminder (SMS should not receive this):");
observableNotifier.notifyObservers(
  new ShowReminderEvent(
    "REM-102",
    user,
    observerShow,
    "Screen gates are now open.",
  ),
);

console.log(
  "\nDEMO SCENARIO 9: Command Pattern - Transactional Booking Execution via BookingInvoker",
);

const commandInvoker = new BookingInvoker();
const cmdSeat1 = new Seat("CMD-1", SeatType.PREMIUM, 1, 1);
const cmdSeat2 = new Seat("CMD-2", SeatType.PREMIUM, 1, 2);
const targetSeats = [cmdSeat1, cmdSeat2];
const cmdScreen = new Screen("SC-CMD", "Audi Command", [
  new Row("ROW-CMD", 1, targetSeats),
]);
const cmdShow = new Show(
  "SH-CMD",
  movie,
  cmdScreen,
  new Date("2026-08-26T14:00:00"),
  new Date("2026-08-26T16:30:00"),
);

console.log(
  "Candidate Seats for Command Pipeline:",
  targetSeats.map((s) => s.getId()).join(", "),
);

const commandBooking = new RegularBookingBuilder(ticketFactory)
  .forShow(cmdShow)
  .forUser(user)
  .addTicket(targetSeats[0], TicketType.PREMIUM)
  .addTicket(targetSeats[1], TicketType.PREMIUM)
  .build();

const selectCommand = new SelectSeatCommand(targetSeats);
const reserveCommand = new ReserveSeatCommand(
  compositeSeatAllocator,
  cmdShow,
  targetSeats,
);
const paymentCommand = new ConfirmPaymentCommand(
  paymentGateway,
  user,
  new Money(600),
  paymentDetails,
);
const notifyCommand = new SendConfirmationCommand(
  observableNotifier,
  user,
  commandBooking,
);

const executionSuccess = commandInvoker.executePipeline([
  selectCommand,
  reserveCommand,
  paymentCommand,
  notifyCommand,
]);

console.log(
  "Command Pipeline Result:",
  executionSuccess ? "SUCCESS" : "FAILED",
);
console.log(
  "Executed Commands History Stack:",
  commandInvoker
    .getHistory()
    .map((c) => c.getName())
    .join(" -> "),
);
console.log(
  "Are seats still reserved:",
  targetSeats.every((s) => !s.isSeatAvailable()),
);

console.log(
  "\nDEMO SCENARIO 10: Command Pattern - Automatic Rollback on Payment Failure",
);

const rbSeat1 = new Seat("RB-1", SeatType.NORMAL, 1, 1);
const rbSeat2 = new Seat("RB-2", SeatType.NORMAL, 1, 2);
const rollbackSeats = [rbSeat1, rbSeat2];
const rbScreen = new Screen("SC-RB", "Audi Rollback", [
  new Row("ROW-RB", 1, rollbackSeats),
]);
const rbShow = new Show(
  "SH-RB",
  movie,
  rbScreen,
  new Date("2026-08-26T14:00:00"),
  new Date("2026-08-26T16:30:00"),
);

console.log(
  "Target Seats for Rollback Demo:",
  rollbackSeats.map((s) => s.getId()).join(", "),
);
console.log(
  "Initial Seat Availability:",
  rollbackSeats.every((s) => s.isSeatAvailable()),
);

const failingPaymentGateway = new MockPaymentGateway(true);
const rollbackInvoker = new BookingInvoker();

const selectCmdFail = new SelectSeatCommand(rollbackSeats);
const reserveCmdFail = new ReserveSeatCommand(
  compositeSeatAllocator,
  rbShow,
  rollbackSeats,
);
const paymentCmdFail = new ConfirmPaymentCommand(
  failingPaymentGateway,
  user,
  new Money(400),
  paymentDetails,
);

console.log("Executing Command Pipeline with simulated payment failure...");
const failureResult = rollbackInvoker.executePipeline([
  selectCmdFail,
  reserveCmdFail,
  paymentCmdFail,
]);

console.log(
  "Pipeline Outcome:",
  failureResult ? "SUCCESS" : "FAILED (Rolled back)",
);
console.log(
  "History Stack length after rollback:",
  rollbackInvoker.getHistory().length,
);
console.log(
  "Seats Availability restored to true:",
  rollbackSeats.every((s) => s.isSeatAvailable()),
);

const testReReservation = compositeSeatAllocator.allocateSeats(
  rbShow,
  rollbackSeats,
);
console.log(
  "Can seats be reserved again after rollback:",
  testReReservation,
);
if (testReReservation) {
  compositeSeatAllocator.releaseSeats(rbShow, rollbackSeats);
}

console.log(
  "\nDEMO SCENARIO 11: BookingService.bookWithCommands End-to-End Integration",
);

const e2eSeat = new Seat("E2E-1", SeatType.NORMAL, 1, 1);
const e2eScreen = new Screen("SC-E2E", "Audi E2E", [
  new Row("ROW-E2E", 1, [e2eSeat]),
]);
const e2eShow = new Show(
  "SH-E2E",
  movie,
  e2eScreen,
  new Date("2026-08-26T14:00:00"),
  new Date("2026-08-26T16:30:00"),
);

const endToEndBooking = new RegularBookingBuilder(ticketFactory)
  .forShow(e2eShow)
  .forUser(user)
  .addTicket(e2eSeat, TicketType.STANDARD)
  .build();

const commandBookingResult = weekdayBookingService.bookWithCommands(
  endToEndBooking,
  paymentDetails,
);
console.log(
  "BookingService Command Flow Result:",
  commandBookingResult.isOk() ? "SUCCESS" : "FAILED",
);
console.log("Booking ID:", commandBookingResult.getBooking()?.getId());
console.log("Status:", commandBookingResult.getBooking()?.getStatus());

