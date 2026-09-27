import { SeatType } from "../enums";
import {
  Address,
  Coupon,
  Money,
  Movie,
  PaymentDetails,
  Screen,
  Seat,
  Show,
  User,
} from "../model";
import { BookingRepository } from "../repository/BookingRepository";
import { Logger } from "../serviceimpl/Logger";
import { EmailNotificationService } from "../serviceimpl/notification/EmailNotification";
import { MockPaymentGateway } from "../serviceimpl/payment-gateway/MockPaymentGateway";
import { InMemorySeatAllocationStrategy } from "../serviceimpl/seatAllocation/InMemorySeatAllocation";
import {
  CouponValidationHandler,
  FinalPaymentGatewayHandler,
  PaymentChainBuilder,
  PaymentContext,
  TaxComputationHandler,
  WalletDeductionHandler,
} from "../chain";
import {
  CorporateBookingWorkflow,
  RegularBookingWorkflow,
} from "../workflow";

export function runChainAndWorkflowDemos(): void {
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

  const logger = Logger.getInstance();
  const seatAllocator = new InMemorySeatAllocationStrategy();
  const paymentGateway = new MockPaymentGateway();
  const failingPaymentGateway = new MockPaymentGateway(true);
  const bookingRepo = new BookingRepository();
  const notifier = new EmailNotificationService();

  console.log(
    "\nDEMO SCENARIO 13: Chain of Responsibility - Payment Processing Pipeline",
  );

  const customerUser = new User(
    "U2",
    "Aman",
    "aman@example.com",
    "9876543210",
    userAddress,
    150,
  );

  const paymentCoupon = new Coupon("SAVE50", new Money(50));

  const paymentChain = new PaymentChainBuilder()
    .add(new CouponValidationHandler())
    .add(new WalletDeductionHandler())
    .add(new TaxComputationHandler())
    .add(new FinalPaymentGatewayHandler(paymentGateway))
    .build();

  const initialAmount = 500;
  const payContext = new PaymentContext(
    initialAmount,
    customerUser,
    paymentCoupon,
    paymentDetails,
  );

  console.log("Initial Amount:", initialAmount);
  console.log("User Initial Wallet Balance:", customerUser.getWalletBalance());
  console.log("Coupon Available:", paymentCoupon.getCode());

  const chainResult = paymentChain.handle(payContext);
  console.log("Payment Chain Execution Result:", chainResult.isSuccess() ? "SUCCESS" : "FAILED");
  console.log("Remaining Wallet Balance after deduction:", customerUser.getWalletBalance());
  console.log("Final Amount Charged by Gateway (with 18% tax on balance):", payContext.getAmount());

  const walletCoveredUser = new User(
    "U3",
    "Simran",
    "simran@example.com",
    "9123456780",
    userAddress,
    500,
  );
  const fullWalletContext = new PaymentContext(
    200,
    walletCoveredUser,
    undefined,
    paymentDetails,
  );
  const fullWalletResult = paymentChain.handle(fullWalletContext);
  console.log(
    "Full Wallet Coverage Result (amount reaches 0 before gateway):",
    fullWalletResult.isSuccess() ? "SUCCESS" : "FAILED",
  );
  console.log("Transaction ID:", fullWalletResult.getTransactionId());
  console.log("Simran Remaining Wallet:", walletCoveredUser.getWalletBalance());

  console.log(
    "\nDEMO SCENARIO 14: Template Method - Regular vs Corporate Booking Workflows",
  );

  const regularSeats = [
    new Seat("REG-1", SeatType.NORMAL, 1, 1),
    new Seat("REG-2", SeatType.NORMAL, 1, 2),
  ];
  const regScreen = new Screen("SC-REG", "Audi Regular", regularSeats);
  const regShow = new Show(
    "SH-REG",
    movie,
    regScreen,
    new Date("2026-08-27T18:00:00"),
    new Date("2026-08-27T20:30:00"),
  );

  const regularWorkflow = new RegularBookingWorkflow(
    seatAllocator,
    paymentChain,
    notifier,
    logger,
    bookingRepo,
    250,
  );

  const regularBookingResult = regularWorkflow.processBooking(
    user,
    regShow,
    regularSeats,
    paymentCoupon,
    paymentDetails,
  );

  console.log(
    "Regular Booking Workflow Result:",
    regularBookingResult.isOk() ? "SUCCESS" : "FAILED",
  );
  console.log("Booking ID:", regularBookingResult.getBooking()?.getId());
  console.log(
    "Seats Status after confirmation:",
    regularSeats.map((s) => `${s.getId()}: ${s.getState().getStatus()}`).join(", "),
  );

  const excessSeats = [
    new Seat("EX-1", SeatType.NORMAL, 1, 1),
    new Seat("EX-2", SeatType.NORMAL, 1, 2),
    new Seat("EX-3", SeatType.NORMAL, 1, 3),
    new Seat("EX-4", SeatType.NORMAL, 1, 4),
    new Seat("EX-5", SeatType.NORMAL, 1, 5),
    new Seat("EX-6", SeatType.NORMAL, 1, 6),
    new Seat("EX-7", SeatType.NORMAL, 1, 7),
  ];

  const excessBookingResult = regularWorkflow.processBooking(
    user,
    regShow,
    excessSeats,
  );
  console.log("Excess Seats Booking Result:", excessBookingResult.isOk() ? "SUCCESS" : "FAILED");
  console.log("Validation Failure Message:", excessBookingResult.getErrorMessage());

  const corporateUser = new User(
    "U-CORP",
    "Acme Corp",
    "events@acmecorp.com",
    "9888877777",
    userAddress,
    0,
  );

  const corporateSeats = [
    new Seat("CRP-1", SeatType.PREMIUM, 1, 1),
    new Seat("CRP-2", SeatType.PREMIUM, 1, 2),
    new Seat("CRP-3", SeatType.PREMIUM, 1, 3),
    new Seat("CRP-4", SeatType.PREMIUM, 1, 4),
    new Seat("CRP-5", SeatType.PREMIUM, 1, 5),
  ];

  const corpScreen = new Screen("SC-CORP", "Audi Corporate", corporateSeats);
  const corpShow = new Show(
    "SH-CORP",
    movie,
    corpScreen,
    new Date("2026-08-28T10:00:00"),
    new Date("2026-08-28T13:00:00"),
  );

  const corporateWorkflow = new CorporateBookingWorkflow(
    seatAllocator,
    paymentChain,
    notifier,
    logger,
    bookingRepo,
    300,
    20,
  );

  const underThresholdSeats = [
    new Seat("MIN-1", SeatType.PREMIUM, 1, 1),
    new Seat("MIN-2", SeatType.PREMIUM, 1, 2),
  ];
  const underThresholdResult = corporateWorkflow.processBooking(
    corporateUser,
    corpShow,
    underThresholdSeats,
  );
  console.log(
    "Corporate Booking Below Minimum Threshold Result:",
    underThresholdResult.isOk() ? "SUCCESS" : "FAILED",
  );
  console.log("Validation Failure Message:", underThresholdResult.getErrorMessage());

  const corporateBookingResult = corporateWorkflow.processBooking(
    corporateUser,
    corpShow,
    corporateSeats,
    undefined,
    paymentDetails,
  );
  console.log(
    "Corporate Bulk Booking (5 seats, 20% discount) Result:",
    corporateBookingResult.isOk() ? "SUCCESS" : "FAILED",
  );
  console.log("Corporate Booking ID:", corporateBookingResult.getBooking()?.getId());
  console.log(
    "Corporate Seats Status:",
    corporateSeats.map((s) => `${s.getId()}: ${s.getState().getStatus()}`).join(", "),
  );

  console.log(
    "\nDEMO SCENARIO 15: Workflow Failure & Automatic Seat Rollback",
  );

  const rollbackTestSeats = [
    new Seat("FAIL-1", SeatType.NORMAL, 1, 1),
    new Seat("FAIL-2", SeatType.NORMAL, 1, 2),
  ];

  const failScreen = new Screen("SC-FAIL", "Audi Fail", rollbackTestSeats);
  const failShow = new Show(
    "SH-FAIL",
    movie,
    failScreen,
    new Date("2026-08-29T19:00:00"),
    new Date("2026-08-29T21:30:00"),
  );

  const failingChain = new PaymentChainBuilder()
    .add(new CouponValidationHandler())
    .add(new FinalPaymentGatewayHandler(failingPaymentGateway))
    .build();

  const failingWorkflow = new RegularBookingWorkflow(
    seatAllocator,
    failingChain,
    notifier,
    logger,
    bookingRepo,
    200,
  );

  console.log(
    "Seats status before workflow run:",
    rollbackTestSeats.map((s) => `${s.getId()}: ${s.getState().getStatus()}`).join(", "),
  );

  const failedResult = failingWorkflow.processBooking(
    user,
    failShow,
    rollbackTestSeats,
    undefined,
    paymentDetails,
  );

  console.log(
    "Workflow Execution Result with Failing Payment:",
    failedResult.isOk() ? "SUCCESS" : "FAILED",
  );
  console.log("Error Message:", failedResult.getErrorMessage());
  console.log(
    "Seats status after rollback:",
    rollbackTestSeats.map((s) => `${s.getId()}: ${s.getState().getStatus()}`).join(", "),
  );
  console.log(
    "Are seats available to be re-booked:",
    rollbackTestSeats.every((s) => s.isSeatAvailable()),
  );

  const recoveredResult = regularWorkflow.processBooking(
    user,
    failShow,
    rollbackTestSeats,
    undefined,
    paymentDetails,
  );
  console.log(
    "Re-booking after rollback Result:",
    recoveredResult.isOk() ? "SUCCESS" : "FAILED",
  );
  console.log(
    "Seats status after recovery booking:",
    rollbackTestSeats.map((s) => `${s.getId()}: ${s.getState().getStatus()}`).join(", "),
  );
}
