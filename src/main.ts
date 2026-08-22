import { SeatType } from "./enums";
import {
  Movie,
  Seat,
  Screen,
  Show,
  Address,
  User,
  PaymentDetails,
  BookingResult,
} from "./model";
import { BookingRepository } from "./repository/BookingRepository";
import { BookingService } from "./service/BookingService";
import { EmailNotificationService } from "./serviceimpl/notification/EmailNotification";
import { MockPaymentGateway } from "./serviceimpl/payment-gateway/MockPaymentGateway";
import { DefaultPricingStrategy } from "./serviceimpl/pricing/DefaultPricing";
import { InMemorySeatAllocationStrategy } from "./serviceimpl/seatAllocation/InMemorySeatAllocation";

// movie
const movie1 = new Movie("M1", "Spiderman", 148, "Sci-Fi", "English", "U/A");

// seats
const s1 = new Seat("S1", SeatType.PREMIUM, 1, 1);
const s2 = new Seat("S2", SeatType.PREMIUM, 1, 2);

// screen
const screen1 = new Screen("SC1", "Screen 1", [s1, s2]);

// start and end time
const startTime = new Date("2026-08-22T18:00:00");
const endTime = new Date("2026-08-22T20:30:00");

// show or screening
const show = new Show("SH1", movie1, screen1, startTime, endTime);

// user details
const u1Address: Address = new Address(
  "123 Model Town",
  "Ludhiana",
  "Punjab",
  "141001",
);

const u1 = new User(
  "U1",
  "Gurjung",
  "gurjung997@gmail.com",
  "9999999999",
  u1Address,
);

const bookingService: BookingService = new BookingService(
  new DefaultPricingStrategy(),
  new InMemorySeatAllocationStrategy(),
  new MockPaymentGateway(),
  new BookingRepository(),
  new EmailNotificationService(),
);

// ---- Run a booking ----
const paymentDetails: PaymentDetails = new PaymentDetails("UPI");
const result: BookingResult = bookingService.book(
  u1,
  show,
  [s1, s2],
  paymentDetails,
);

if (result.isOk()) {
  const booking = result.getBooking();
  console.log(
    "Booking successful:",
    booking?.getId(),
    booking?.getAmount().toDisplayString(),
  );
} else {
  console.log("Booking failed:", result.getErrorMessage());
}
