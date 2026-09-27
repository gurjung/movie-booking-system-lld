import { SeatType, TicketType } from "../enums";
import {
  Address,
  Money,
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
import { WeekdayPricingStrategy } from "../serviceimpl/pricing";
import {
  EmailNotifier,
  PushNotifier,
} from "../observer";
import { ObservableNotificationService } from "../serviceimpl/notification/ObservableNotificationService";
import {
  BookingInvoker,
  ConfirmPaymentCommand,
  ReserveSeatCommand,
  SelectSeatCommand,
  SendConfirmationCommand,
} from "../command";

export function runCommandDemos(): void {
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

  observableNotifier.attach(new EmailNotifier());
  observableNotifier.attach(new PushNotifier());

  const weekdayBookingService = new BookingService(
    new WeekdayPricingStrategy(20),
    compositeSeatAllocator,
    paymentGateway,
    bookingRepo,
    observableNotifier,
    logger,
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
}
