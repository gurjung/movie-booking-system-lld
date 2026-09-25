import { TicketType } from "../enums";
import { Booking, Coupon, Seat, Show, User } from "../model";
import { ISnack } from "./ISnack";

export interface BookingBuilder {
  forShow(show: Show): BookingBuilder;
  forUser(user: User): BookingBuilder;
  addTicket(seat: Seat, ticketType: TicketType): BookingBuilder;
  addSnack(snack: ISnack): BookingBuilder;
  applyCoupon(coupon: Coupon): BookingBuilder;
  withLoyaltyPoints(points: number): BookingBuilder;
  withSpecialRequest(text: string): BookingBuilder;
  build(): Booking;
}
