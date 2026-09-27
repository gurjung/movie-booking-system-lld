# Movie Booking System (Low-Level Design)

A production-ready, clean-architecture Low-Level Design (LLD) implementation of a Movie Booking System in TypeScript. This project demonstrates strict adherence to Object-Oriented Design (OOD) principles, SOLID tenets, and Gang of Four (GoF) design patterns across Creational, Structural, and Behavioral paradigms.

---

## 🏗️ Architecture & Core Principles

The codebase is organized into cleanly decoupled layers separating domain models, behavioral contracts, stateful components, and business orchestrators:

- **Single Responsibility Principle (SRP)**: Each component possesses a singular responsibility. Domain entities encapsulate attributes, strategies compute specific business logic, observers handle notifications, and commands encapsulate transactional actions.
- **Open/Closed Principle (OCP)**: The system is openly extensible via polymorphism without modifying tested source code. Dynamic pricing strategies, snack decorators, notification channels, payment chain handlers, and booking workflows can be added seamlessly.
- **Liskov Substitution Principle (LSP)**: All derived implementations (e.g., ticket variants, snack decorators, composite seat components, pricing strategies, and booking workflows) strictly uphold base contract guarantees.
- **Interface Segregation Principle (ISP)**: Granular interfaces (`ISnack`, `SeatComponent`, `Subject`, `Observer`, `Command`, `SeatState`, `PaymentHandler`, `BookingBuilder`, `TicketFactory`) prevent client dependencies on unused signatures.
- **Dependency Inversion Principle (DIP)**: Orchestrators and workflows depend entirely upon abstractions, with concrete implementations injected via Dependency Injection (DI).

---

## 🧩 Design Patterns Catalog

### 1. Creational Patterns

1. **Simple Factory Pattern (`TicketFactory`, `SimpleTicketFactory`)**:
   - Encapsulates polymorphic instantiation of `Ticket` subclasses (`StandardTicket`, `PremiumTicket`, `IMAXTicket`, `ReclinerTicket`) based on `TicketType`.
   - Validates that the assigned `Seat` conforms to the allowed seat types defined by the ticket variant before instantiation.

2. **Builder Pattern (`BookingBuilder`, `RegularBookingBuilder`, `VIPBookingBuilder`)**:
   - Separates the incremental construction of complex `Booking` objects from their representation.
   - Provides a fluent interface for attaching tickets, snacks, coupons, loyalty points, and special requests.
   - Enforces domain invariants before instantiation (e.g., `VIPBookingBuilder` prevents assignment of standard tickets and automatically injects complimentary welcome snacks).

3. **Singleton Pattern (`Logger` implementing `LoggingService`)**:
   - Provides a globally coordinated, lazily initialized logging instance via `Logger.getInstance()`.
   - Injected into `BookingService` and `BookingWorkflow` via constructor injection to safeguard testability.

---

### 2. Structural Patterns

1. **Decorator Pattern (Snack Customization & Add-ons)**:
   - Dynamically decorates base snacks (`Popcorn`, `Soda`, `Nachos`) with toppings, sizes, and packaging (`LargeSizeDecorator`, `ExtraButterDecorator`, `ComboWrapDecorator`, `GlutenFreePackagingDecorator`).
   - Recursively aggregates cumulative pricing, preparation times, descriptions, and dietary allergen tags (`vegetarian`, `contains-dairy`, `combo-deal`, `gluten-free-certified`) without subclass explosion.

2. **Composite Pattern (Theater Layout & Seat Management)**:
   - Establishes a 3-tier tree hierarchy (`Screen` → `Row` → `Seat`) sharing a common `SeatComponent` interface.
   - Enables uniform operations across individual seats and composite containers: contiguous seat lookup, atomic multi-seat reservation, row-level analytics, screen-wide occupancy calculation, and batch price adjustments.

---

### 3. Behavioral Patterns

1. **Strategy Pattern (Dynamic Pricing, Seat Allocation, Payment Gateways)**:
   - Decouples volatile algorithmic logic from core booking orchestrators.
   - **Pricing Strategies**: `WeekdayPricingStrategy` (weekday concession), `WeekendSurgePricingStrategy` (weekend demand surge), `FestivalDiscountPricingStrategy` (promotional festival discounts), `PeakHourPricingStrategy`, `VIPPricingStrategy`, and `DefaultPricingStrategy`.
   - **Seat Allocation Strategies**: `InMemorySeatAllocationStrategy` and `CompositeSeatAllocationStrategy`.
   - **Seat Recommendation Strategies**: `BestAvailableRecommendationStrategy` (optimal viewing center-aisle selection) and `BudgetFriendlyRecommendationStrategy` (lowest price modifier prioritization).
   - **Payment Gateway Strategies**: `MockPaymentGateway` with failure simulation capability.

2. **Observer Pattern (Real-Time Multi-Channel Notifications)**:
   - Implements a decoupled pub/sub notification backbone.
   - Core contracts: `Subject` and `Observer`.
   - Event hierarchy: `BookingEvent` base class with concrete events (`BookingConfirmedEvent`, `ShowReminderEvent`, `OfferBroadcastEvent`).
   - Observers: `EmailNotifier`, `SMSNotifier`, and `PushNotifier`.
   - Uses snapshot array duplication during event dispatch to ensure thread-safe and iteration-safe dynamic subscription and unsubscription.
   - `ObservableNotificationService` bridges `NotificationService` and `BookingSubject` for zero-overhead integration into `BookingService`.

3. **Command Pattern (Transactional Booking & LIFO Rollback)**:
   - Encapsulates discrete transactional operations as reversible command objects implementing `execute(): boolean` and `undo(): void`.
   - Concrete commands: `SelectSeatCommand`, `ReserveSeatCommand`, `ConfirmPaymentCommand`, and `SendConfirmationCommand`.
   - `BookingInvoker` executes command pipelines and maintains a history stack. Upon any downstream failure (e.g., payment declined), it performs an automatic LIFO rollback, undoing prior commands and restoring reserved seats to available status.

4. **State Pattern (Seat Lifecycle Management & Invariant Enforcement)**:
   - Manages seat status transitions through dedicated state objects implementing `SeatState`:
     - `AvailableState`: Initial status. Allows reservation (`reserve()`); throws `InvalidSeatStateException` on release or confirmation.
     - `HeldState`: Temporary reservation. Transitions to `BookedState` on `confirm()`, or `ReleasedState` on `release()`. Throws exception on duplicate reservation.
     - `BookedState`: Confirmed status. Can transition to `ReleasedState` on cancellation (`release()`); prohibits re-reservation or confirmation.
     - `ReleasedState`: Re-enters the booking lifecycle. Can transition back to `HeldState` on `reserve()`; prohibits duplicate release or confirmation without reservation.
   - The `Seat` context delegates lifecycle operations directly to its active state object, eliminating complex conditional switch/if branching and enforcing strict transition rules.

5. **Chain of Responsibility Pattern (Modular Payment Processing Pipeline)**:
   - Processes booking payment transactions through a decoupled sequence of specialized handlers implementing `PaymentHandler` (`BasePaymentHandler`):
     - `CouponValidationHandler`: Validates and applies promotional coupon discounts to the order total.
     - `WalletDeductionHandler`: Deducts payable balance from the user's available digital wallet. If the wallet covers the full amount, marks transaction complete and bypasses downstream payment gateways.
     - `TaxComputationHandler`: Applies statutory taxes (e.g., 18% GST) to the remaining balance.
     - `FinalPaymentGatewayHandler`: Dispatches any remaining balance to the external payment gateway.
   - `PaymentChainBuilder`: Provides a fluent builder to assemble and link handlers into custom processing pipelines.
   - `PaymentContext`: Stateful transaction context tracked across the pipeline, maintaining current balance, user details, coupon, wallet deductions, and applied taxes.

6. **Template Method Pattern (Structured Booking Workflows)**:
   - Defines the invariant skeleton of a booking lifecycle within `BookingWorkflow.processBooking()`, delegating specific steps to specialized subclasses:
     - Step 1: `validateRequest(user, show, seats)` (Primitive operation / abstract hook)
     - Step 2: `allocateSeats(show, seats)` (Concrete step; reserves seats and transitions seat state to `HeldState`)
     - Step 3: `processPayment(user, show, seats, coupon?, paymentDetails?)` (Primitive operation / abstract hook; delegates to payment chain)
     - Step 4: `confirmSeats(seats)` (Concrete step; transitions seat state to `BookedState`)
     - Step 5: `createBooking(user, show, seats, coupon?)` (Concrete step; generates booking record and persists in repository)
     - Step 6: `sendConfirmation(user, show, seats, booking)` (Concrete step; emits notification)
     - Error Recovery: `rollbackSeats(show, seats)` (Concrete step executed in `catch` block; safely releases held seats to `ReleasedState`)
   - Concrete workflows:
     - `RegularBookingWorkflow`: Enforces regular customer constraints (maximum 6 seats limit) and standard pricing.
     - `CorporateBookingWorkflow`: Enforces corporate bulk booking policies (minimum 5 seats limit) and automatically applies percentage volume discounts (e.g., 20%).

---

## 📂 Project Structure

```text
src/
├── chain/            # Chain of Responsibility pattern (PaymentHandler, BasePaymentHandler, Handlers, Builder, Context)
├── command/          # Command pattern (Command, SelectSeat, ReserveSeat, ConfirmPayment, SendConfirmation, BookingInvoker)
├── enums/            # Domain enumerations (SeatType, TicketType, BookingStatus, SeatStatus, PaymentMethod)
├── interfaces/       # Core contracts, builders, factories, strategies, and notification/logging interfaces
├── model/            # Domain entities (User, Movie, Seat, Row, Screen, Show, Booking, Snack, Coupon, Money, Address, etc.)
├── observer/         # Observer pattern (Subject, Observer, BookingSubject, events, notifiers)
│   ├── events/       # Event hierarchy (BookingEvent, BookingConfirmedEvent, ShowReminderEvent, OfferBroadcastEvent)
│   └── notifiers/    # Concrete observers (EmailNotifier, SMSNotifier, PushNotifier)
├── repository/       # Data persistence abstractions and in-memory store (BookingRepository)
├── scenarios/        # Modularized end-to-end demo suites
│   ├── 01_builderDemos.ts          # Scenarios 1-3: Regular/VIP Builder & Invariant Validation
│   ├── 02_structuralDemos.ts       # Scenarios 4-6: Decorator Snacks & Composite Theater Layout
│   ├── 03_behavioralCoreDemos.ts   # Scenarios 7-8: Strategy Pricing & Observer Notifications
│   ├── 04_commandDemos.ts          # Scenarios 9-11: Command Transaction Pipeline & LIFO Rollback
│   ├── 05_stateDemos.ts            # Scenario 12: Seat Lifecycle Transitions & Error Handling
│   ├── 06_chainAndWorkflowDemos.ts # Scenarios 13-15: Payment Pipeline & Template Method Workflows
│   └── index.ts                    # Scenario module exports
├── service/          # Orchestrators and service layer (BookingService)
├── serviceimpl/      # Concrete implementations
│   ├── Logger.ts                   # Thread-safe Singleton logging service
│   ├── notification/               # EmailNotificationService, ObservableNotificationService
│   ├── payment-gateway/            # MockPaymentGateway with failure simulation
│   ├── pricing/                    # Weekday, WeekendSurge, FestivalDiscount, PeakHour, VIP
│   └── seatAllocation/             # InMemorySeatAllocationStrategy, CompositeSeatAllocationStrategy
├── snacks/           # Decorator pattern snack components and concrete decorators
├── state/            # State pattern (SeatState, Available, Held, Booked, Released, Exceptions)
├── tickets/          # Polymorphic ticket hierarchy (StandardTicket, PremiumTicket, IMAXTicket, ReclinerTicket)
├── workflow/         # Template Method pattern (BookingWorkflow, RegularBookingWorkflow, CorporateBookingWorkflow)
└── main.ts           # Application entry point invoking all modular demo suites
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v8 or higher)

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Run the Application

Execute the end-to-end demonstration runner:

```bash
npm start
```

---

## 🧪 Comprehensive Demo Scenarios

The test suite runs 16 end-to-end scenarios covering all implemented design patterns:

| #      | Pattern / Category       | Scenario Description                                                                                                 |
| ------ | ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **1**  | Builder Pattern          | Regular Booking with Standard + Premium tickets, snacks, and coupon discount.                                        |
| **2**  | Builder Pattern          | VIP Booking with Premium + Recliner tickets and auto-injected complimentary snack.                                   |
| **3**  | Builder Pattern          | VIP Booking validation error handling when attempting to add a Standard ticket.                                      |
| **4**  | Decorator Pattern        | Dynamic snack add-on composition (Popcorn + Extra Butter + Large Size + Combo Wrap + Gluten Free Packaging).         |
| **5**  | Composite Pattern        | 3-tier theater hierarchy (`Screen` → `Row` → `Seat`), contiguous seat search, and occupancy calculation.             |
| **6**  | Structural Integration   | Integrated booking flow combining decorated snacks and composite screen seat allocation.                             |
| **7**  | Strategy Pattern         | Dynamic pricing engine: Weekday concession, Weekend demand surge, and Festival promotional discount.                 |
| **8**  | Observer Pattern         | Real-time multi-channel event publishing (`EmailNotifier`, `SMSNotifier`, `PushNotifier`) with dynamic detachment.   |
| **9**  | Command Pattern          | Transactional booking execution pipeline via `BookingInvoker` (`Select` → `Reserve` → `Pay` → `Confirm`).            |
| **10** | Command Pattern          | Automatic LIFO rollback restoring seat availability when payment fails downstream.                                   |
| **11** | Command Integration      | `BookingService.bookWithCommands()` end-to-end transactional orchestration.                                          |
| **12** | State Pattern            | Seat lifecycle transitions (`AVAILABLE` → `HELD` → `BOOKED` → `RELEASED`) and invalid transition exception handling. |
| **13** | Chain of Responsibility  | Modular payment pipeline: Coupon validation → Wallet balance deduction → GST tax computation → Gateway charge.       |
| **14** | Template Method          | Regular vs Corporate booking workflows: Max seat limits vs Bulk discounts (5+ seats, 20% discount).                  |
| **15** | Workflow Rollback        | Complete booking workflow failure handling with automatic seat release and recovery re-booking.                      |
| **16** | Extension Scenario (OCP) | Dynamic seat recommendations via `SeatRecommendationStrategy` (`BestAvailable` vs `BudgetFriendly`).                 |

---
