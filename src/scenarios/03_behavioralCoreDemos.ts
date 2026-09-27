import { SeatType, TicketType } from "../enums";
import {
  Address,
  Movie,
  PaymentDetails,
  Row,
  Screen,
  Seat,
  Show,
  User,
} from "../model";
import { BookingRepository } from "../repository/BookingRepository";
import { BookingService } from "../service/BookingService";
import { Logger } from "../serviceimpl/Logger";
import { MockPaymentGateway } from "../serviceimpl/payment-gateway/MockPaymentGateway";
import { SimpleTicketFactory } from "../serviceimpl/SimpleTicketFactory";
import { RegularBookingBuilder } from "../serviceimpl/RegularBookingBuilder";
import { CompositeSeatAllocationStrategy } from "../serviceimpl/seatAllocation/CompositeSeatAllocation";
import {
  DefaultPricingStrategy,
  FestivalDiscountPricingStrategy,
  WeekdayPricingStrategy,
  WeekendSurgePricingStrategy,
} from "../serviceimpl/pricing";
import {
  EmailNotifier,
  OfferBroadcastEvent,
  PushNotifier,
  ShowReminderEvent,
  SMSNotifier,
} from "../observer";
import { ObservableNotificationService } from "../serviceimpl/notification/ObservableNotificationService";

export function runBehavioralCoreDemos(): void {
  const movie = new Movie(
    "M1",
    "Spiderman: Across the Spider-Verse",
    148,
    "Sci-Fi",
    "English",
    "U/A",
  );

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
  const compositeSeatAllocator = new CompositeSeatAllocationStrategy();
  const paymentGateway = new MockPaymentGateway();
  const bookingRepo = new BookingRepository();
  const observableNotifier = new ObservableNotificationService();

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
    observableNotifier,
    logger,
  );

  const weekendBookingService = new BookingService(
    new WeekendSurgePricingStrategy(50),
    compositeSeatAllocator,
    paymentGateway,
    bookingRepo,
    observableNotifier,
    logger,
  );

  const festivalBookingService = new BookingService(
    new FestivalDiscountPricingStrategy(60),
    compositeSeatAllocator,
    paymentGateway,
    bookingRepo,
    observableNotifier,
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
}
